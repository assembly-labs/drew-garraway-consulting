# CareerChat Deployment Guide - Cloudflare

Follow these steps to deploy CareerChat to Cloudflare Pages and Workers.

---

## Prerequisites

✅ **Production build created** - `/career-chat/dist/` folder ready
✅ **Cloudflare account** - Free tier works
✅ **Anthropic API key** - You'll create this during deployment

---

## STEP 1: Get Your Anthropic API Key

1. Go to: https://console.anthropic.com/
2. Sign up or log in
3. Navigate to **API Keys** section
4. Click **Create Key**
5. Copy the key (starts with `sk-ant-api03-...`)
6. **SAVE THIS KEY** - you'll need it in Step 3

---

## STEP 2: Deploy Cloudflare Worker (API Proxy)

### 2a. Log in to Cloudflare Dashboard
1. Go to: https://dash.cloudflare.com/
2. Click **Workers & Pages** in left sidebar

### 2b. Create New Worker
1. Click **Create Application**
2. Select **Create Worker**
3. Name it: `careerchat-api`
4. Click **Deploy** (we'll replace code next)

### 2c. Replace Worker Code
1. After deployment, click **Quick Edit**
2. **Delete all the default code**
3. Copy the code from: `/career-chat/worker/worker.js`
4. Paste it into the editor
5. Click **Save and Deploy**

### 2d. Add API Key Secret
1. Click **Settings** tab
2. Click **Variables and Secrets**
3. Under **Environment Variables**, click **Add variable**
   - Variable name: `ANTHROPIC_API_KEY`
   - Type: **Secret** (click dropdown)
   - Value: Paste your Anthropic API key from Step 1
4. Click **Save**

### 2e. Copy Worker URL
1. Click **Triggers** tab
2. Find **Routes** section
3. Copy the Worker URL (looks like: `https://careerchat-api.YOUR_SUBDOMAIN.workers.dev`)
4. **SAVE THIS URL** - you'll need it in Step 3

---

## STEP 3: Deploy Frontend to Cloudflare Pages

### 3a. Create Pages Project
1. In Cloudflare Dashboard, click **Workers & Pages**
2. Click **Create Application**
3. Select **Pages**
4. Click **Upload assets**
5. Name your project: `careerchat`

### 3b. Upload Build Files
1. Click **Create project**
2. Drag and drop the **entire `/career-chat/dist/` folder** contents
   - OR click **Select from computer** and choose all files in `/career-chat/dist/`
3. Click **Deploy site**
4. Wait for deployment to complete

### 3c. Add Environment Variable
1. After deployment, go to **Settings** > **Environment variables**
2. Click **Add variable**
   - **Production** tab
   - Variable name: `VITE_WORKER_URL`
   - Value: Paste your Worker URL from Step 2e
3. Click **Save**

### 3d. Trigger Rebuild
1. Go to **Deployments** tab
2. Click **Retry deployment** on the latest deployment
   - This rebuilds with the environment variable

### 3e. Get Your Site URL
1. Go to **Deployments** tab
2. Copy your site URL (looks like: `https://careerchat.pages.dev`)

---

## STEP 4: Test Your Deployment

1. Open your CareerChat site URL in a browser
2. **Test the UI:**
   - Check that gradient design loads correctly
   - Verify abbreviated resume shows below chat
3. **Test the chatbot:**
   - Ask a career question: "What companies has Drew worked for?"
   - Expected: Bot responds with answer citing source section
4. **Test keyword filter:**
   - Ask off-topic question: "What's your favorite food?"
   - Expected: "I only discuss Drew's career. Ask me about his experience, skills, or projects!"
5. **Test Share button:**
   - Click "📋 Share" button
   - Should copy URL to clipboard

---

## STEP 5: Custom Domain (Optional)

### 5a. Add to drewgarraway.com
1. In Cloudflare Pages project settings
2. Click **Custom domains**
3. Click **Set up a custom domain**
4. Enter: `chat.drewgarraway.com` (or your preferred subdomain)
5. Follow DNS setup instructions
6. Wait for SSL certificate (usually 5-10 minutes)

---

## Troubleshooting

### Bot not responding?
- Check Worker environment variable has correct Anthropic API key
- Check Pages environment variable has correct Worker URL
- View browser console (F12) for errors

### "Failed to fetch" error?
- Worker URL might be wrong in environment variables
- Check Worker is deployed and accessible
- Verify CORS headers in worker code

### Resume not displaying?
- Check `/career-chat/dist/` contains `src/data/resume.md` and `resume-abbreviated.md`
- Rebuild if needed: `npm run build`
- Redeploy to Pages

---

## File Locations Reference

- **Worker code:** `/career-chat/worker/worker.js`
- **Production build:** `/career-chat/dist/` (upload this folder's contents)
- **Full resume:** `/career-chat/src/data/resume.md`
- **Abbreviated resume:** `/career-chat/src/data/resume-abbreviated.md`

---

## Cost Estimate (Cloudflare Free Tier)

- **Pages:** 500 builds/month, unlimited requests (FREE)
- **Worker:** 100,000 requests/day (FREE)
- **Anthropic API:** Pay-per-token (separate billing)

---

## Next Steps After Deployment

1. Update main site (`index.html`) to link to CareerChat
2. Share the URL on LinkedIn, resume, etc.
3. Monitor Anthropic API usage in their console
4. Update resume content by editing markdown files and rebuilding

---

**Your CareerChat is now live! 🎉**

Site: `https://careerchat.pages.dev` (or your custom domain)
Worker: `https://careerchat-api.YOUR_SUBDOMAIN.workers.dev`
