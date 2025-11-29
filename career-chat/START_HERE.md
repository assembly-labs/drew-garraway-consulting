# 🚀 START HERE - Deploy CareerChat Tonight

**Your API key is saved (I won't show it again)**
**Your domain is on Bluehost, main site on GitHub Pages**

---

## What We're Doing

1. Deploy Worker to Cloudflare (5 min)
2. Deploy Pages to Cloudflare (5 min)
3. Test it works (2 min)
4. Optionally connect to chat.drewgarraway.com (5 min)

**Total time: ~15 minutes**

---

## Step 1: Create Cloudflare Account

1. Go to: https://dash.cloudflare.com/sign-up
2. Sign up with your email
3. Verify email
4. You'll land on the dashboard

---

## Step 2: Deploy Worker (API Proxy)

### Create Worker
1. Click **Workers & Pages** (left sidebar)
2. Click **Create Application**
3. Click **Create Worker**
4. Name: `careerchat-api`
5. Click **Deploy**

### Add Code
1. Click **Quick Edit**
2. Delete all the default code
3. Open file: `/career-chat/worker/worker.js`
4. Copy ALL the code
5. Paste into Cloudflare editor
6. Click **Save and Deploy**

### Add API Key
1. Click **←** back arrow (top left)
2. Click **Settings** tab
3. Click **Variables and Secrets**
4. Click **Add variable**
5. Fill in:
   - Name: `ANTHROPIC_API_KEY`
   - Type: Select **Secret** from dropdown
   - Value: Your API key (I saved it securely)
6. Click **Deploy**

### Save Worker URL
1. Click **Triggers** tab
2. Copy the URL (looks like: `https://careerchat-api.SOMETHING.workers.dev`)
3. **Write this down!** You need it next.

---

## Step 3: Deploy Pages (Frontend)

### Create Pages Project
1. Click **Workers & Pages** (left sidebar)
2. Click **Create Application**
3. Click **Pages** tab
4. Click **Upload assets**
5. Name: `careerchat`
6. Click **Create project**

### Upload Files
1. Open Finder to:
   ```
   /Users/drewgarraway/Documents/GitHub/drew-garraway-consulting/career-chat/dist/
   ```
2. Select **ALL files and folders** inside `dist/`
3. Drag and drop into Cloudflare
4. Click **Deploy site**
5. Wait ~1 minute

### Add Worker URL
1. After deploy, click **Continue to project**
2. Click **Settings** tab
3. Click **Environment variables**
4. Click **Add variables**
5. Click **Production** tab
6. Fill in:
   - Name: `VITE_WORKER_URL`
   - Value: Your Worker URL from Step 2
7. Click **Save**

### Rebuild
1. Click **Deployments** tab
2. Click **···** on the latest deployment
3. Click **Retry deployment**
4. Wait for it to finish

### Save Pages URL
1. Copy the URL (looks like: `https://careerchat.pages.dev`)
2. **This is your CareerChat site!**

---

## Step 4: Test It!

1. Open your Pages URL in browser
2. Ask: "What companies has Drew worked for?"
   - Should get answer with companies listed
3. Ask: "What's your favorite color?"
   - Should get: "I only discuss Drew's career..."
4. Click **📋 Share** button
   - Should show "✓ Copied!"

**If all 3 work → You're done! 🎉**

---

## Optional: Use chat.drewgarraway.com

### In Cloudflare
1. Go to your CareerChat Pages project
2. Click **Custom domains**
3. Click **Set up a custom domain**
4. Enter: `chat.drewgarraway.com`
5. Click **Continue**
6. You'll see CNAME info to add

### In Bluehost
1. Log into Bluehost
2. Go to **Domains** → **DNS Zone Editor**
3. Find `drewgarraway.com`
4. Click **Add Record**
5. Fill in:
   - Type: CNAME
   - Host: chat
   - Points to: `careerchat.pages.dev` (NO https://)
6. Click **Add Record**

### Wait
1. Wait 5-10 minutes for DNS
2. Go to `https://chat.drewgarraway.com`
3. Should work!

---

## URLs You'll Have

- **Testing:** https://careerchat.pages.dev
- **Production (optional):** https://chat.drewgarraway.com
- **API:** https://careerchat-api.SOMETHING.workers.dev (hidden from users)

---

## Need Help?

See **DEPLOYMENT_BLUEHOST.md** for detailed troubleshooting.

---

**Ready? Open https://dash.cloudflare.com/sign-up and let's go! 🚀**
