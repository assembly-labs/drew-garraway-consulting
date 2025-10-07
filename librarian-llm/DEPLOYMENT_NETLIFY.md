# 🚀 Secure Netlify Deployment Guide

This guide will help you deploy the Librarian LLM app to Netlify with **secure API key management**.

## 🔐 Security Architecture

Your app now uses a **secure backend proxy** pattern:
- ✅ API key is **never exposed** to the browser
- ✅ API key is stored securely in Netlify's environment variables
- ✅ Frontend calls your Netlify Function at `/api/claude-chat`
- ✅ Netlify Function calls Claude API with secure key
- ✅ Response is sent back to frontend

---

## 📋 Prerequisites

1. **GitHub Account** with access to your repository
2. **Netlify Account** (free tier is perfect)
   - Sign up at [netlify.com](https://www.netlify.com/)
   - Connect your GitHub account
3. **Claude API Key** from [Anthropic Console](https://console.anthropic.com/)

---

## 🎯 Step-by-Step Deployment

### Step 1: Install Dependencies Locally

```bash
cd /Users/drewgarraway/Documents/GitHub/drew-garraway-consulting/librarian-llm
npm install
```

This installs the new `netlify-cli` package and other dependencies.

---

### Step 2: Test Locally with Netlify CLI

Before deploying, test that everything works locally:

```bash
# Make sure your .env file has claude_api_key set (not VITE_CLAUDE_API_KEY)
# It should look like:
# claude_api_key=your-api-key-here

# Start the Netlify dev server
npm run dev:netlify
```

This will:
- Start your React app at `http://localhost:8888`
- Start the Netlify Functions locally
- Simulate the production environment

**Test it:** Open `http://localhost:8888` and try searching for books. If it works, you're ready to deploy!

---

### Step 3: Push Changes to GitHub

```bash
cd /Users/drewgarraway/Documents/GitHub/drew-garraway-consulting

# Check what files changed
git status

# Stage all changes
git add librarian-llm/

# Commit with a descriptive message
git commit -m "Secure Netlify deployment: Move API key to backend proxy"

# Push to GitHub
git push origin main
```

---

### Step 4: Deploy to Netlify

#### Option A: Deploy via Netlify Web UI (Recommended for First Time)

1. **Go to [app.netlify.com](https://app.netlify.com/)**

2. **Click "Add new site" → "Import an existing project"**

3. **Connect to GitHub:**
   - Select your repository: `assembly-labs/drew-garraway-consulting`
   - Authorize Netlify to access your GitHub

4. **Configure Build Settings:**
   ```
   Base directory:    librarian-llm
   Build command:     npm run build
   Publish directory: librarian-llm/dist
   Functions directory: librarian-llm/netlify/functions
   ```

5. **Add Environment Variable:**
   - Before clicking "Deploy", click "Advanced build settings"
   - Click "New variable"
   - **Key:** `claude_api_key`
   - **Value:** `your-anthropic-api-key`
   - Click "Deploy site"

6. **Wait for Build:**
   - Netlify will build your app (takes 1-2 minutes)
   - Watch the build logs for any errors

7. **Get Your URL:**
   - Once deployed, you'll get a URL like: `https://your-site-name.netlify.app`
   - You can customize this in Site settings → Domain management

#### Option B: Deploy via Netlify CLI (Advanced)

```bash
# Install Netlify CLI globally (if not already installed)
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize and link the site
cd /Users/drewgarraway/Documents/GitHub/drew-garraway-consulting/librarian-llm
netlify init

# Follow the prompts:
# - Create & configure a new site
# - Choose your team
# - Site name: librarian-llm (or any name)

# Set the environment variable
netlify env:set claude_api_key "your-anthropic-api-key"

# Deploy to production
netlify deploy --prod
```

---

### Step 5: Configure Custom Domain (Optional)

If you want to use `drewgarraway.com/librarian-llm`:

1. **In Netlify Dashboard:**
   - Go to Site settings → Domain management
   - Add custom domain: `drewgarraway.com`
   - Follow Netlify's instructions to update DNS

2. **Update base path in vite.config.ts** (if needed):
   ```typescript
   export default defineConfig({
     base: '/librarian-llm/', // Already set
     // ...
   });
   ```

---

## 🧪 Testing Your Deployment

After deployment, test these:

### ✅ Security Check
1. Open your deployed site
2. Open browser DevTools → Network tab
3. Search for a book
4. Check the network request:
   - ✅ Request should go to `/api/claude-chat` (not anthropic.com)
   - ✅ Response should contain book recommendations

### ✅ Source Code Check
1. Open browser DevTools → Sources tab
2. Search all files for your API key (search for `sk-ant`)
3. ✅ **Should find NOTHING** - key is now secure on backend!

### ✅ Functional Test
- [ ] Search works for books
- [ ] Conversation history is maintained
- [ ] Error messages display properly
- [ ] Mobile layout works
- [ ] All book cards display correctly

---

## 🔄 Updating Your Deployment

When you make changes to the app:

```bash
# Make your code changes

# Commit and push
git add .
git commit -m "Description of changes"
git push origin main
```

Netlify will automatically rebuild and redeploy (if you enabled continuous deployment).

---

## 🔧 Environment Variables Management

### View Environment Variables
```bash
netlify env:list
```

### Update API Key
```bash
netlify env:set claude_api_key "new-key-here"
```

### In Netlify Web UI
1. Site settings → Environment variables
2. Edit or add variables
3. Redeploy for changes to take effect

---

## 🐛 Troubleshooting

### Issue: "Server configuration error" message

**Cause:** Environment variable not set in Netlify

**Fix:**
1. Go to Netlify Dashboard → Site settings → Environment variables
2. Add `claude_api_key` with your API key
3. Trigger a redeploy: Deploys → Trigger deploy → Deploy site

---

### Issue: Functions not found (404 error)

**Cause:** Netlify not detecting functions directory

**Fix:**
1. Check that `netlify.toml` is in the root of `librarian-llm/`
2. Verify `functions = "netlify/functions"` in netlify.toml
3. In Netlify UI: Site configuration → Functions → Verify directory is `netlify/functions`

---

### Issue: Build fails

**Common causes:**
- Missing dependencies → Run `npm install` locally first
- TypeScript errors → Run `npm run lint` to check
- Wrong build command → Should be `npm run build`

**Check build logs:**
- Netlify Dashboard → Deploys → Click on failed deploy → View logs

---

### Issue: API calls failing

**Debug steps:**
1. Check Netlify Function logs: Functions → View logs
2. Verify environment variable is set: Site settings → Environment variables
3. Test locally first: `npm run dev:netlify`

---

## 📊 Monitoring & Logs

### View Function Logs
```bash
netlify functions:log claude-chat
```

### In Netlify Dashboard
- Functions → Select function → View logs
- Monitor usage, errors, and performance

---

## 💰 Cost Information

### Netlify Free Tier Includes:
- ✅ 125,000 function requests/month
- ✅ 100 GB bandwidth/month
- ✅ Automatic HTTPS
- ✅ Continuous deployment from Git
- ✅ Custom domain support

**For a demo app, this is more than enough!**

### Claude API Costs:
- Depends on usage
- Set spending limits in Anthropic Console to control costs
- Each book search ≈ $0.01-0.03

---

## 🎓 Additional Resources

- [Netlify Functions Docs](https://docs.netlify.com/functions/overview/)
- [Netlify Environment Variables](https://docs.netlify.com/environment-variables/overview/)
- [Anthropic API Docs](https://docs.anthropic.com/)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)

---

## ✅ Success Checklist

After deployment, confirm:
- [ ] Site is live and accessible
- [ ] Book search works correctly
- [ ] API key is NOT visible in browser source code
- [ ] Network requests go to `/api/claude-chat`
- [ ] Error handling works properly
- [ ] Mobile responsive layout works
- [ ] Custom domain configured (if applicable)

---

## 🎉 You're Done!

Your app is now securely deployed with:
- ✅ API key protected on the backend
- ✅ Automatic deployments from GitHub
- ✅ HTTPS enabled
- ✅ Serverless functions for API calls
- ✅ Free hosting with generous limits

**Share your live URL and celebrate! 🎊**

---

**Need help?** Check the troubleshooting section or review the Netlify build logs for specific error messages.
