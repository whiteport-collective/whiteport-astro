# Deploy whiteport-astro to Hostup

Deploy the Astro site to `astro.whiteport.com` on Hostup shared hosting.

## Prerequisites

- SSH access to `astrowhi@mu.hostup.se` (shell must be enabled — ticket #126273)
- SSH key `~/.ssh/id_ed25519` authorized on the server
- Site builds clean: `SITE_URL=https://astro.whiteport.com npm run build`

## Workflow

1. **Build the site**
   ```bash
   cd c:/dev/WDS/whiteport-astro
   SITE_URL=https://astro.whiteport.com npm run build
   ```
   Expect ~135+ pages, clean build with no errors.

2. **Deploy via SFTP script**
   ```bash
   node deploy-astro.cjs
   ```
   This uploads all site files + media to `/home/astrowhi/public_html/` via SFTP.

3. **Verify deployment**
   - Run link checker: `node check-links.cjs https://astro.whiteport.com`
   - Visual spot-check key pages in browser

## Hosting Details

| Item | Value |
|------|-------|
| **URL** | `https://astro.whiteport.com` |
| **Server** | `mu.hostup.se` (LiteSpeed/cPanel) |
| **cPanel user** | `astrowhi` |
| **Server IP** | `185.113.11.48` |
| **Reseller account** | `websespr` (SSH works) |
| **DNS** | Cloudflare proxy → `185.113.11.48` |
| **SSL** | Cloudflare edge (proxy mode) |
| **WHM** | `https://mu.hostup.se:2087` (websespr login) |
| **Hostup panel** | `cloud.hostup.se` |

## SSH Access

```bash
# Reseller (works):
ssh websespr@mu.hostup.se

# Astro account (pending shell enable):
ssh astrowhi@mu.hostup.se
```

Key: `ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIJykMqCKUo4xGUiYISG5JOotkC4+UYR+81b6bi8gln3Z marten@angner.se`

## Alternative Deploy (if SSH blocked)

Use WHM cPanel API via Puppeteer to write files through the File Manager:
```bash
node deploy-cpanel.cjs
```
This is slower (file-by-file via HTTP) but doesn't require SSH shell access.

## Support

If SSH is blocked or there are hosting issues:
1. Log in to `cloud.hostup.se` (credentials in Bitwarden)
2. Support → Skapa ärende → Webbhotell & hosting → WH-17615
3. Or use `hostup-nav.cjs` to automate ticket creation via Puppeteer

## Redirects

`.htaccess` file with 90 RewriteRules (converted from `public/_redirects`). Deployed automatically with the site.

---
*Project command for whiteport-astro*
