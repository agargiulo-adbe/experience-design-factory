# New Client in 30 Minutes

## Prerequisites
- Node.js ≥ 20, pnpm ≥ 9
- GitHub account with access to agargiulo-adbe org

## Steps

### 1. Create from template (2 min)
Use the GitHub template repository to create a new repo for the client.
```bash
gh repo create agargiulo-adbe/[client-name] --template agargiulo-adbe/experience-design-factory --private
git clone [new-repo-url] && cd [client-name]
```

### 2. Define design tokens (10 min)
Edit `generazioni.tokens.json` → rename to `[client].tokens.json`:
- Update colors to match client brand palette
- Update font families
- Keep the structure — primitive tokens only

### 3. Configure the site (5 min)
Edit `site.config.ts`:
- Change `client` name
- Define pages and block composition
- Set visibility flags

Edit `astro.config.mjs`:
- Update `site` URL
- Update `base` path (usually `'/[repo-name]'`)

### 4. Write content (10 min per page)
Create/edit content for each page's blocks. Use real copy, not placeholders.
Map Adobe products to client-specific journey phases in FrontBackStageSplit blocks.

### 5. Add assets (3 min)
- Logo in `src/assets/`
- Favicon in `public/`
- Brand images or Firefly-generated placeholders

### 6. Test and deploy (5 min)
```bash
pnpm install
pnpm dev        # verify locally
pnpm build      # test production build
git push        # triggers GitHub Actions → GitHub Pages
```

## Splitting a client into its own repo
When ready to share a client instance independently:
1. Create a new repo from the template
2. Copy the client's content, tokens, and config
3. Update `base` in `astro.config.mjs` to match the new repo name
4. Enable GitHub Pages in the new repo settings
5. The shared engine stays as a workspace dependency
