# Deploy to amisecure.github.io

The app needs a **backend API** (scan + CVE) because GitHub Pages only hosts static files. Use this flow:

## 1. Deploy the API to Vercel (one-time)

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Import your repo (roshannp/secureasy)
3. Deploy (use default settings)
4. Copy the deployment URL, e.g. `https://secureasy-xxx.vercel.app`

## 2. Create the GitHub Pages repo

1. Create a new repo: **amisecure/amisecure.github.io** (or your org/user)
2. It can be empty — the workflow will push the built site

## 3. Add secrets to your source repo

In **roshannp/secureasy** → Settings → Secrets and variables → Actions:

| Secret     | Value |
|------------|-------|
| `API_BASE` | Your Vercel URL (e.g. `https://secureasy-xxx.vercel.app`) |
| `DEPLOY_KEY` | See below |

### Create DEPLOY_KEY

```bash
# Generate a key pair
ssh-keygen -t ed25519 -C "github-actions" -f deploy_key -N ""

# Public key → add as Deploy key in amisecure/amisecure.github.io
# Settings → Deploy keys → Add (paste deploy_key.pub)

# Private key → add as DEPLOY_KEY secret in roshannp/secureasy
# (paste full contents of deploy_key)
```

## 4. Push to trigger deploy

Push to `main` — the workflow builds the static site and deploys to amisecure.github.io. The site will be live at **https://amisecure.github.io** within a few minutes.
