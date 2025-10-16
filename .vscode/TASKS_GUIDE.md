# VS Code Tasks Guide

## How to Use Tasks

VS Code tasks automate common deployment workflows. Access them via:

**Method 1: Command Palette**
1. Press `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows/Linux)
2. Type: `Tasks: Run Task`
3. Select the task you want to run

**Method 2: Terminal Menu**
1. Click **Terminal** in the menu bar
2. Select **Run Task...**
3. Choose your task

**Method 3: Keyboard Shortcut**
1. Press `Cmd+Shift+B` (Mac) or `Ctrl+Shift+B` (Windows/Linux)
2. This runs the default build task (Pre-Deploy Check)

---

## Available Tasks

### 🔍 Pre-Deploy Check (DEFAULT)
**What it does:**
- Checks for uncommitted changes
- Identifies which prototypes you're modifying
- Verifies no node_modules or .env files are included
- Tests builds for affected prototypes
- Optionally pushes to GitHub

**When to use:** Before every deployment

**Shortcut:** `Cmd+Shift+B` / `Ctrl+Shift+B`

---

### 📚 Deploy: Librarian LLM
**What it does:**
1. Navigates to `librarian-llm/`
2. Runs `npm run build`
3. Commits changes
4. Pushes to GitHub (triggers Netlify deployment)

**When to use:** When Librarian LLM is ready to deploy

---

### 🏃 Deploy: CantStopWontStop
**What it does:** Same as above, but for CantStopWontStop prototype

---

### 🎯 Deploy: NoFomo
**What it does:** Same as above, but for NoFomo prototype

---

### 📰 Deploy: Assembly Articles
**What it does:** Same as above, but for Assembly Articles prototype

---

### 💪 Deploy: Gym Prototype
**What it does:** Same as above, but for Gym Prototype

---

### 🧪 Test Build Tasks
**Available for:**
- Librarian LLM
- CantStopWontStop
- NoFomo

**What they do:** Run `npm run build` without committing/deploying

**When to use:** To verify builds work before actual deployment

---

### 🔄 Install All Dependencies
**What it does:**
- Loops through all prototypes
- Runs `npm install` in each one
- Installs all dependencies

**When to use:**
- After cloning repository
- After pulling changes that update package.json
- When dependencies are out of sync

---

### 🧹 Clean All Build Artifacts
**What it does:**
- Finds all `dist/`, `build/`, `.netlify/` folders
- Deletes them (excluding node_modules)

**When to use:**
- When builds are acting weird
- To free up disk space
- Before fresh builds

---

### 📊 Check Repository Status
**What it does:**
- Shows `git status`
- Lists changed files
- Shows recent 5 commits

**When to use:** Quick overview of repository state

---

## Best Practices

### Recommended Workflow

```
1. Make changes to prototype
2. Run: 🔍 Pre-Deploy Check
   → This tests everything automatically
3. Review output, fix any errors
4. If check passes, it will offer to push
5. Monitor deployment in Netlify
```

### Alternative Workflow (More Control)

```
1. Make changes to prototype
2. Run: 🧪 Test Build (for specific prototype)
3. If build succeeds, manually commit:
   git add <prototype-folder>
   git commit -m "Your message"
   git push origin main
```

### Emergency Workflow

```
If something broke in production:
1. Run: 📊 Check Repository Status
2. Identify the problem commit
3. Revert: git revert <commit-hash>
4. Run: 🔍 Pre-Deploy Check
5. Push the revert
```

---

## Troubleshooting

### Task Fails with "command not found"

**Problem:** npm or git not in PATH

**Solution:**
1. Restart VS Code
2. Ensure Node.js is installed: `node --version`
3. Ensure Git is installed: `git --version`

---

### Build Succeeds Locally But Fails in Netlify

**Problem:** Environment differences

**Common causes:**
- Missing environment variables in Netlify
- Different Node.js version
- Missing dependencies

**Solution:**
1. Check Netlify build logs
2. Verify environment variables are set
3. Check `netlify.toml` has correct Node version

---

### Task Runs But Nothing Happens

**Problem:** Terminal window not showing

**Solution:**
1. Look for new terminal tab at bottom of VS Code
2. Click on it to see output
3. Or check **Terminal** → **Show All Panels**

---

## Customizing Tasks

Edit `.vscode/tasks.json` to:
- Change commit messages
- Add new prototypes
- Modify build commands
- Add pre/post build hooks

**Example: Add a new prototype task:**

```json
{
  "label": "🚀 Deploy: My New App",
  "type": "shell",
  "command": "cd my-new-app && npm run build && cd .. && git add my-new-app && git commit -m '🚀 Update My New App' && git push origin main",
  "problemMatcher": [],
  "group": "build"
}
```

---

## Tips

- Use `🔍 Pre-Deploy Check` regularly - it catches most issues
- Test builds locally before deploying
- Keep terminal output open to monitor progress
- If a task hangs, press `Ctrl+C` to cancel

---

**Last Updated:** 2025-10-16
