# Quick Deployment Checklist

## Before You Start
- [ ] Cloudflare account created
- [ ] Anthropic API key ready

## Deployment Order

### 1. Deploy Worker (API Proxy)
```
Cloudflare Dashboard → Workers & Pages → Create Application → Create Worker
Name: careerchat-api
Code: Copy from /career-chat/worker/worker.js
Secret: ANTHROPIC_API_KEY = your_api_key
Result: Copy Worker URL
```

### 2. Deploy Pages (Frontend)
```
Cloudflare Dashboard → Workers & Pages → Create Application → Pages → Upload assets
Name: careerchat
Upload: All files from /career-chat/dist/
Environment Variable: VITE_WORKER_URL = your_worker_url
Result: Copy Site URL
```

### 3. Test
```
Open Site URL
Test career question: "What companies has Drew worked for?"
Test off-topic: "What's your favorite food?"
Should see redirect message
```

## URLs You'll Need

**Anthropic Console:** https://console.anthropic.com/
**Cloudflare Dashboard:** https://dash.cloudflare.com/

## Files to Upload

Upload entire contents of: `/career-chat/dist/`

## Secrets to Configure

**Worker:**
- ANTHROPIC_API_KEY = sk-ant-api03-...

**Pages:**
- VITE_WORKER_URL = https://careerchat-api.YOUR_SUBDOMAIN.workers.dev

---

That's it! See DEPLOYMENT_GUIDE.md for detailed walkthrough.
