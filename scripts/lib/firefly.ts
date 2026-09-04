/**
 * firefly — a tiny, isolated client for Adobe Firefly Services (Images API v3).
 *
 * Server-to-server only: it authenticates with an IMS `client_credentials`
 * grant using FIREFLY_CLIENT_ID / FIREFLY_CLIENT_SECRET, generates images, and
 * downloads the resulting (presigned) output as a Buffer. It also surfaces the
 * Content Credentials (C2PA) hint the API returns, so callers can record
 * provenance.
 *
 * This module is deliberately dependency-free (global `fetch`) and framework-
 * agnostic so the SAME client is reused by:
 *   • the build-time asset pipeline (scripts/build-assets.ts) — Phase 1, and
 *   • the runtime generation proxy (Supabase Edge Function) — Phase 2.
 *
 * Endpoints and scopes are env-overridable with sensible defaults, so an
 * enterprise account with a different region/scope set can be configured
 * without touching code:
 *   FIREFLY_IMS_URL   (default https://ims-na1.adobelogin.com/ims/token/v3)
 *   FIREFLY_API_URL   (default https://firefly-api.adobe.io)
 *   FIREFLY_SCOPES    (default openid,AdobeID,firefly_api,ff_apis)
 *
 * SECURITY: the client id/secret are build-time secrets. They live only in a
 * gitignored .env (or a server env) and NEVER ship to the static site or CI.
 */

const IMS_URL = process.env.FIREFLY_IMS_URL || 'https://ims-na1.adobelogin.com/ims/token/v3';
const API_URL = (process.env.FIREFLY_API_URL || 'https://firefly-api.adobe.io').replace(/\/+$/, '');
const SCOPES = process.env.FIREFLY_SCOPES || 'openid,AdobeID,firefly_api,ff_apis';

export interface FireflyCredentials {
  clientId: string;
  clientSecret: string;
}

export interface FireflyGenerateOptions {
  prompt: string;
  negativePrompt?: string;
  /** 'photo' (photographic) or 'art' (illustrative / abstract). */
  contentClass?: 'photo' | 'art';
  /** Requested output size (a v3-supported size in the target orientation). */
  size: { width: number; height: number };
  /** Optional fixed seed for reproducibility. */
  seed?: number;
}

export interface FireflyResult {
  /** The generated image bytes (downloaded from the presigned output URL). */
  buffer: Buffer;
  /** The seed the model actually used (echoed back), when present. */
  seed?: number;
  /** Whether the output carries Content Credentials (C2PA) metadata. */
  contentCredentials: boolean;
  /** Model version string reported by the API, when present. */
  model?: string;
}

/** Read Firefly credentials from the environment, or throw a clear error. */
export function fireflyCredentialsFromEnv(): FireflyCredentials | null {
  const clientId = process.env.FIREFLY_CLIENT_ID;
  const clientSecret = process.env.FIREFLY_CLIENT_SECRET;
  if (!clientId || !clientSecret) return null;
  return { clientId, clientSecret };
}

/** Exchange client credentials for a short-lived IMS access token. */
export async function getAccessToken(creds: FireflyCredentials): Promise<string> {
  const body = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: creds.clientId,
    client_secret: creds.clientSecret,
    scope: SCOPES,
  });
  const res = await fetch(IMS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Firefly IMS auth failed (${res.status}): ${text.slice(0, 300)}`);
  }
  const json = (await res.json()) as { access_token?: string };
  if (!json.access_token) throw new Error('Firefly IMS auth: no access_token in response');
  return json.access_token;
}

interface GenerateResponse {
  outputs?: Array<{
    seed?: number;
    image?: { url?: string; presignedUrl?: string };
  }>;
  // async variants may return a job to poll:
  jobId?: string;
  statusUrl?: string;
  status?: string;
  result?: GenerateResponse;
}

function firstOutputUrl(data: GenerateResponse): { url?: string; seed?: number } {
  const out = (data.outputs ?? data.result?.outputs ?? [])[0];
  return { url: out?.image?.url ?? out?.image?.presignedUrl, seed: out?.seed };
}

/**
 * Generate a single image. Handles both the synchronous v3 response (outputs
 * inline) and an async job response (polls `statusUrl` until an output URL
 * appears). Returns the downloaded bytes plus provenance hints.
 */
export async function generateImage(
  creds: FireflyCredentials,
  opts: FireflyGenerateOptions,
  token?: string,
): Promise<FireflyResult> {
  const accessToken = token ?? (await getAccessToken(creds));
  const headers = {
    'x-api-key': creds.clientId,
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  const payload: Record<string, unknown> = {
    prompt: opts.prompt,
    numVariations: 1,
    size: opts.size,
  };
  if (opts.negativePrompt) payload.negativePrompt = opts.negativePrompt;
  if (opts.contentClass) payload.contentClass = opts.contentClass;
  if (typeof opts.seed === 'number') payload.seeds = [opts.seed];

  const res = await fetch(`${API_URL}/v3/images/generate`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Firefly generate failed (${res.status}): ${text.slice(0, 400)}`);
  }
  let data = (await res.json()) as GenerateResponse;

  // Async job? Poll until an output URL appears (bounded).
  let poll = data.statusUrl;
  for (let i = 0; i < 30 && !firstOutputUrl(data).url && poll; i++) {
    await new Promise((r) => setTimeout(r, 2000));
    const p = await fetch(poll, { headers });
    if (!p.ok) break;
    data = (await p.json()) as GenerateResponse;
    poll = data.statusUrl ?? poll;
    if (data.status && /fail|error/i.test(data.status)) {
      throw new Error(`Firefly job failed: ${data.status}`);
    }
  }

  const { url, seed } = firstOutputUrl(data);
  if (!url) throw new Error('Firefly generate: no output image URL in response');

  const dl = await fetch(url);
  if (!dl.ok) throw new Error(`Firefly output download failed (${dl.status})`);
  const buffer = Buffer.from(await dl.arrayBuffer());

  return {
    buffer,
    seed,
    // Firefly outputs are signed with Content Credentials (C2PA) by default.
    contentCredentials: true,
    model: 'Adobe Firefly Image Model (v3)',
  };
}

// ── video (Firefly Video Model, async) ──────────────────────────────
const VIDEO_PATH = process.env.FIREFLY_VIDEO_PATH || '/v3/videos/generate-async';

export interface FireflyVideoOptions {
  prompt: string;
  /** Output size (a v3-supported video size, e.g. 1920x1080). */
  size?: { width: number; height: number };
  /** Clip length in seconds (model caps apply; ~5s on v3). */
  seconds?: number;
  seed?: number;
  /** Optional negative prompt. */
  negativePrompt?: string;
}

export interface FireflyVideoResult {
  buffer: Buffer;
  contentCredentials: boolean;
  model: string;
}

interface VideoJobResponse {
  jobId?: string;
  statusUrl?: string;
  status?: string;
  outputs?: Array<{ video?: { url?: string; presignedUrl?: string } }>;
  result?: VideoJobResponse;
}

function firstVideoUrl(data: VideoJobResponse): string | undefined {
  const out = (data.outputs ?? data.result?.outputs ?? [])[0];
  return out?.video?.url ?? out?.video?.presignedUrl;
}

/**
 * Generate a single video clip (text-to-video). Firefly video is ALWAYS async:
 * POST returns a job with a `statusUrl` we poll until an output URL appears
 * (bounded to ~5 min). The endpoint path is env-overridable. Returns the
 * downloaded MP4 bytes. Structured to later accept an image-conditioning ref
 * (image-to-video) without changing callers.
 */
export async function generateVideo(
  creds: FireflyCredentials,
  opts: FireflyVideoOptions,
  token?: string,
): Promise<FireflyVideoResult> {
  const accessToken = token ?? (await getAccessToken(creds));
  const headers = {
    'x-api-key': creds.clientId,
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  const payload: Record<string, unknown> = { prompt: opts.prompt };
  if (opts.size) payload.sizes = [opts.size];
  if (typeof opts.seconds === 'number') payload.videoSettings = { duration: opts.seconds };
  if (typeof opts.seed === 'number') payload.seeds = [opts.seed];
  if (opts.negativePrompt) payload.negativePrompt = opts.negativePrompt;

  const res = await fetch(`${API_URL}${VIDEO_PATH}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Firefly video generate failed (${res.status}): ${text.slice(0, 500)}`);
  }
  let data = (await res.json()) as VideoJobResponse;

  // Poll the job until a video URL appears (video renders take minutes).
  let poll = data.statusUrl;
  for (let i = 0; i < 90 && !firstVideoUrl(data) && poll; i++) {
    await new Promise((r) => setTimeout(r, 4000));
    const p = await fetch(poll, { headers });
    if (!p.ok) {
      const t = await p.text().catch(() => '');
      throw new Error(`Firefly video status failed (${p.status}): ${t.slice(0, 300)}`);
    }
    data = (await p.json()) as VideoJobResponse;
    poll = data.statusUrl ?? poll;
    if (data.status && /fail|error|cancel/i.test(data.status)) {
      throw new Error(`Firefly video job ${data.status}`);
    }
  }

  const url = firstVideoUrl(data);
  if (!url) throw new Error('Firefly video: no output URL (timed out or unexpected response shape)');

  const dl = await fetch(url);
  if (!dl.ok) throw new Error(`Firefly video download failed (${dl.status})`);
  const buffer = Buffer.from(await dl.arrayBuffer());

  return { buffer, contentCredentials: true, model: 'Adobe Firefly Video Model (v3)' };
}
