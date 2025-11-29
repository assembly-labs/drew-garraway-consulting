# CareerChat Deployment - Bluehost + Cloudflare Setup

Since drewgarraway.com is currently on Bluehost, we'll deploy CareerChat to Cloudflare Pages and connect via DNS.

---

## Architecture
- **Main site:** drewgarraway.com (stays on GitHub Pages via Bluehost)
- **CareerChat frontend:** Cloudflare Pages
- **CareerChat API:** Cloudflare Worker
- **DNS:** CNAME from Bluehost pointing to Cloudflare Pages

---

## STEP 1: Deploy Cloudflare Worker (API Proxy)

### 1a. Create Cloudflare Account
1. Go to: https://dash.cloudflare.com/sign-up
2. Sign up with your email
3. Verify email

### 1b. Create Worker
1. Click **Workers & Pages** in left sidebar
2. Click **Create Application**
3. Select **Create Worker**
4. Name: `careerchat-api`
5. Click **Deploy**

### 1c. Add Worker Code
1. Click **Quick Edit** button
2. **DELETE** all the default code
3. Copy the entire code from: `/career-chat/worker/worker.js`
4. Paste into editor
5. Click **Save and Deploy**

### 1d. Add API Key as Secret
1. Click the **←** back arrow (top left)
2. Click **Settings** tab
3. Click **Variables and Secrets**
4. Under **Environment Variables**, click **Add variable**
5. Configure:
   - **Variable name:** `ANTHROPIC_API_KEY`
   - **Type:** Click dropdown, select **Secret** (encrypted)
   - **Value:** Paste your Anthropic API key
6. Click **Deploy** to save

### 1e. Get Worker URL
1. Click **Triggers** tab at top
2. Under **Routes** section, you'll see your Worker URL
3. It looks like: `https://careerchat-api.YOUR_SUBDOMAIN.workers.dev`
4. **COPY THIS URL** - write it down!

---

## STEP 2: Deploy Frontend to Cloudflare Pages

### 2a. Create Pages Project
1. In Cloudflare Dashboard, click **Workers & Pages** (left sidebar)
2. Click **Create Application**
3. Select **Pages** tab
4. Click **Upload assets**

### 2b. Name Your Project
1. Project name: `careerchat`
2. Click **Create project**

### 2c. Upload Build Files
1. You'll see an upload area
2. Open Finder to: `/Users/drewgarraway/Documents/GitHub/drew-garraway-consulting/career-chat/dist/`
3. **Select ALL files and folders inside `dist/`**
   - index.html
   - assets/ folder
   - src/ folder (contains resume data)
4. Drag and drop into Cloudflare upload area
5. Click **Deploy site**
6. Wait ~1 minute for deployment

### 2d. Add Environment Variable
1. After deployment completes, click **Continue to project**
2. Click **Settings** tab at top
3. Click **Environment variables** in left sidebar
4. Click **Add variables**
5. Select **Production** tab
6. Configure:
   - **Variable name:** `VITE_WORKER_URL`
   - **Value:** Paste your Worker URL from Step 1e
7. Click **Save**

### 2e. Redeploy with Environment Variable
1. Click **Deployments** tab at top
2. Find the latest deployment (top of list)
3. Click **···** (three dots) on the right
4. Click **Retry deployment**
5. Wait for rebuild to complete

### 2f. Get Your Cloudflare Pages URL
1. After deployment succeeds, you'll see your URL
2. It looks like: `https://careerchat.pages.dev`
3. **COPY THIS URL** - write it down!

---

## STEP 3: Test on Cloudflare URL

### 3a. Open Your Site
1. Open browser to your Cloudflare Pages URL
2. You should see CareerChat with gradient design

### 3b. Test Chat Functionality
**Test 1 - Career Question:**
- Type: "What companies has Drew worked for?"
- Expected: Bot responds with answer + source citation
- Example: "In his experience section, Drew worked for Apple, Google, Samsung..."

**Test 2 - Off-Topic Filter:**
- Type: "What's your favorite food?"
- Expected: "I only discuss Drew's career. Ask me about his experience, skills, or projects!"

**Test 3 - Share Button:**
- Click **📋 Share** button
- Expected: "✓ Copied!" appears
- Paste somewhere to verify URL copied

### 3c. Check Resume Display
- Scroll down below chat
- You should see abbreviated resume with Drew's career highlights
- Check that gradient styling matches main site

---

## STEP 4: Connect to drewgarraway.com (Optional)

If you want `chat.drewgarraway.com` instead of `careerchat.pages.dev`:

### 4a. Add Custom Domain in Cloudflare
1. In your CareerChat project on Cloudflare
2. Click **Custom domains** (in settings)
3. Click **Set up a custom domain**
4. Enter: `chat.drewgarraway.com`
5. Click **Continue**
6. Cloudflare will show you CNAME records to add

### 4b. Add DNS in Bluehost
1. Log into Bluehost control panel
2. Go to **Domains** → **DNS Zone Editor**
3. Find `drewgarraway.com`
4. Click **Add Record**
5. Configure:
   - **Type:** CNAME
   - **Host:** chat
   - **Points to:** Your Cloudflare Pages URL (without https://)
   - **TTL:** 14400 (or default)
6. Click **Add Record**

### 4c. Verify in Cloudflare
1. Back in Cloudflare, wait 5-10 minutes
2. Refresh the custom domains page
3. You should see SSL certificate activating
4. Once active, `https://chat.drewgarraway.com` will work

---

## STEP 5: Add Link to Main Site

### 5a. Update index.html
Edit `/Users/drewgarraway/Documents/GitHub/drew-garraway-consulting/index.html`

Add a link in the services section or CTA:

```html
<div class="service-card">
    <h3 class="service-title">Ask Me Anything</h3>
    <p class="service-description">
        Chat with my AI career assistant. Ask about my experience,
        skills, or projects across 15+ years in product management.
    </p>
    <a href="https://chat.drewgarraway.com" class="cta-button">
        Chat Now →
    </a>
</div>
```

### 5b. Commit and Push
```bash
git add index.html
git commit -m "Add CareerChat link"
git push origin main
```

---

## Troubleshooting

### "Worker URL is not set"
- Check environment variable in Pages settings
- Make sure you redeployed after adding the variable
- Verify Worker URL is correct format

### Chat not responding
- Open browser console (F12) → Console tab
- Look for errors
- Verify Worker has ANTHROPIC_API_KEY secret
- Check Worker is deployed and accessible

### Resume not showing
- Check that `dist/` upload included `src/data/` folder
- Verify both resume files are present:
  - resume.md (full)
  - resume-abbreviated.md (display)

### Custom domain not working
- DNS can take up to 48 hours (usually 5-10 minutes)
- Check CNAME is pointing to Cloudflare Pages URL
- Verify SSL certificate is active in Cloudflare

---

## Summary

✅ **Worker URL:** https://careerchat-api.YOUR_SUBDOMAIN.workers.dev
✅ **Pages URL:** https://careerchat.pages.dev
✅ **Custom domain:** https://chat.drewgarraway.com (optional)

---

## Next Steps

1. Monitor Anthropic API usage: https://console.anthropic.com/
2. Update resume content anytime:
   - Edit `/career-chat/src/data/resume.md`
   - Run `npm run build`
   - Re-upload `dist/` to Cloudflare Pages
3. Add analytics in Cloudflare (free)
4. Share your CareerChat URL on LinkedIn, resume, etc.

---

**You're all set! 🎉**
