# Install the “Experience Brief” skill

One skill, three assistants. The brain is the body of [`SKILL.md`](./SKILL.md) — everything
below just tells each assistant to use it. It runs entirely in the Adobian's own account; no
extra licence, no special access.

> **Tip:** the source of truth is `SKILL.md`. When you “paste the instructions” below, paste
> everything **after** the YAML front-matter (i.e. from `# Experience Brief — the Factory intake`
> to the end).

---

## Claude

**Claude Code (recommended)**
1. Copy this folder to your skills directory:
   `cp -r skills/experience-brief ~/.claude/skills/` (or your project’s `.claude/skills/`).
2. Start Claude Code in the repo and invoke it: `/experience-brief`.

**Claude.ai**
1. New **Project** → **Set custom instructions**.
2. Paste the `SKILL.md` body. Name the project “Experience Brief”. Start a chat.

---

## ChatGPT

**Custom GPT (recommended)**
1. **Explore GPTs → Create** (or *My GPTs → Create a GPT*).
2. Open **Configure**, set the name/description, and paste the `SKILL.md` body into
   **Instructions**. Enable **Web Search** so it can research the brand.
3. Save (Only me / Adobe workspace). Open it whenever you start a new brief.

**Or a Project / plain chat:** paste the `SKILL.md` body as the first message, then answer its
questions.

---

## Microsoft Copilot

**Microsoft 365 Copilot — agent (recommended)**
1. In Copilot, open **Create agent** (or build one in **Copilot Studio**).
2. Paste the `SKILL.md` body as the agent’s **instructions**; enable web knowledge.
3. Save and pin it. Sign in with your `@adobe.com` account.

**GitHub Copilot Chat:** save the `SKILL.md` body as a prompt file
(`.github/prompts/experience-brief.prompt.md`) and run it from Copilot Chat, or paste it as the
first message.

---

## What you get
A guided interview that researches the target company/brand and drafts the experience you want,
producing a hyper-detailed **brief**. Send it to **Antonio Gargiulo — Senior Product Sales
Specialist, Adobe Italia** (Teams / agargiulo@adobe.com), who scaffolds the experience and gives
you Admin Console access to grow it.
