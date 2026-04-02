# TOMO Session 16 — TestFlight Deployment

**Date:** 2026-03-16
**Project root:** `/Users/drewgarraway/Documents/GitHub/drew-garraway-consulting/TOMO/tomo/`

> **Tell Claude:** "Read `docs/mvp-1.0/SESSION_16_PROMPT.md` then start working through the next steps."

---

## Goal for This Session

Get TOMO running on TestFlight so the app works standalone on the iPhone — no Mac, no Xcode, no Metro, no 7-day provisioning expiry.

**Prerequisite:** Apple Developer account ($99/year) must be active before starting. Confirm at https://developer.apple.com/account/ — you should see your Team ID on the Membership page.

---

## Current State

- **Expo SDK 55**, bundle ID `com.drewgarraway.tomo`, iOS target 16.0
- **Signing cert valid:** Apple Development: garrawaydrew@gmail.com (55DFXTV4Y7)
- **No `eas.json` exists** — EAS has never been configured
- **No EAS project ID** — `app.config.ts` has the `extra.eas` block commented out
- **EAS Update config commented out** in `app.config.ts` (updates + runtimeVersion)
- **Apple Sign-In not configured** — email auth works, Apple Sign-In is a nice-to-have
- **Voice pipeline working end-to-end** on device
- **All P1/P2 bugs resolved**, TypeScript clean

---

## Steps (Do in Order)

### Step 1 — Drew: Apple Developer Portal Setup (~15 min)

These require manual action in a browser. Claude can't do them.

1. Go to https://developer.apple.com/account/
2. Note your **Team ID** (10-character string on the Membership page) — tell Claude
3. Go to **Certificates, Identifiers & Profiles** > **Identifiers**
4. Create a new **App ID** (if one doesn't already exist for `com.drewgarraway.tomo`):
   - Platform: iOS
   - Description: TOMO
   - Bundle ID: Explicit — `com.drewgarraway.tomo`
   - Capabilities: leave defaults (no need to enable Sign In with Apple yet)
5. Register it

### Step 2 — Drew: Create App Store Connect Listing (~10 min)

1. Go to https://appstoreconnect.apple.com/
2. My Apps > "+" > New App
   - Platform: iOS
   - Name: **TOMO**
   - Primary Language: English (U.S.)
   - Bundle ID: `com.drewgarraway.tomo` (should appear in dropdown after Step 1)
   - SKU: `tomo`
3. Save — that's it. No screenshots, descriptions, or metadata needed for TestFlight.

### Step 3 — Claude: EAS Init + Configuration (~10 min)

Once Drew confirms Steps 1-2 are done:

```bash
cd /Users/drewgarraway/Documents/GitHub/drew-garraway-consulting/TOMO/tomo

# Link project to Expo account (creates project on expo.dev)
npx eas init

# This outputs a project ID — update app.config.ts with it
```

Then create `eas.json`:

```json
{
  "cli": {
    "version": ">= 18.0.0",
    "appVersionSource": "remote"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "simulator": false
      }
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {
      "autoIncrement": true
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "garrawaydrew@gmail.com",
        "ascAppId": "FILL_FROM_APP_STORE_CONNECT",
        "appleTeamId": "FILL_FROM_STEP_1"
      }
    }
  }
}
```

Then update `app.config.ts`:
- Uncomment the `eas.projectId` in `extra`
- Uncomment the `updates` block and `runtimeVersion`

### Step 4 — Claude: Connect Apple Credentials to EAS (~5 min)

```bash
# This walks through Apple Developer account linking
# Will ask for Apple ID and may prompt for app-specific password
npx eas credentials --platform ios
```

Choose:
- Distribution: App Store (for TestFlight/production)
- Let EAS manage signing (auto-generates distribution cert + provisioning profile)

**Important:** This replaces the Personal Team free signing with a proper Distribution certificate. The 7-day expiry problem goes away.

### Step 5 — Claude: Production Build (~20 min)

```bash
# Build in the cloud — no local Xcode needed
npx eas build --platform ios --profile production
```

This:
- Compiles native code + bundles JS into a standalone `.ipa`
- Signs with the Distribution certificate from Step 4
- Takes ~15-20 minutes on EAS servers
- Returns a build URL when done

**The resulting app does NOT need Metro.** The JS bundle is embedded in the binary.

### Step 6 — Claude: Submit to TestFlight (~5 min)

```bash
# Upload the build to App Store Connect
npx eas submit --platform ios --latest
```

This uploads to App Store Connect. Apple then reviews the build for TestFlight — typically **24-48 hours**, sometimes as fast as a few hours.

### Step 7 — Drew: Add Testers (~5 min)

Once the build passes TestFlight review (you'll get an email):

1. Go to App Store Connect > TOMO > TestFlight
2. Click "+" next to Internal Testing or create an External Testing group
3. Add tester email addresses
4. Each tester:
   - Gets an email invite
   - Downloads **TestFlight** from the App Store (free Apple app)
   - Opens the invite link, installs TOMO
   - App works standalone — no Mac needed, valid for 90 days

---

## After TestFlight Is Live: OTA Updates

Once EAS Update is configured (Step 3), future **JavaScript-only changes** (UI tweaks, bug fixes, new screens) can be pushed directly to TestFlight users without rebuilding:

```bash
npx eas update --branch production --message "Fix transcript styling"
```

Users get the update next time they open the app. Only changes requiring new native modules (new permissions, new native libraries) need a full rebuild + resubmit.

---

## What Can Be Deferred

These are NOT needed for the first TestFlight build:

| Item | Why It Can Wait |
|------|----------------|
| Apple Sign-In (P1-002) | Email auth works. Add after first TestFlight round. |
| Privacy Policy URL | Only required for public App Store, not TestFlight |
| App Icon (P3-001) | Expo default is fine for testing |
| Terms of Service (P3-004) | Not enforced for TestFlight |
| Accessibility labels (P3-005) | Polish pass after core testing |

---

## What Could Go Wrong

| Issue | Fix |
|-------|-----|
| `eas build` fails on first attempt | Read error output carefully. Most common: missing credentials, wrong bundle ID, native dep mismatch. Budget 1-2 retry builds. |
| Apple rejects TestFlight build | Rare for TestFlight. Usually a metadata issue (missing encryption declaration). `usesNonExemptEncryption: false` is already set in `app.config.ts`. |
| App crashes on TestFlight but not dev build | Dev builds use Metro for JS; production bundles it. Check Sentry for crash reports. Most common cause: missing env vars or hardcoded localhost URLs. |
| Testers can't install | They need TestFlight app installed first. Send them the App Store link for TestFlight along with the invite. |

---

## Key Files

- `tomo/app.config.ts` — Expo config (needs EAS project ID + updates config)
- `tomo/eas.json` — **does not exist yet**, create in Step 3
- `tomo/credentials.local` — API keys reference (gitignored)
- `docs/mvp-1.0/SHIP_PLAN.md` — Phase 4 section covers TestFlight (written before project started)
- `docs/mvp-1.0/tracking/ISSUES.md` — open issues
- `docs/mvp-1.0/tracking/CHANGELOG.md` — session history

---

## Open Issues Relevant to This Work

- `BLOCK-002` — Apple Developer account (THE blocker — must be resolved before starting)
- `P1-002` — Apple Sign-In (deferred, not needed for first TestFlight)
- `LAUNCH-001` — Re-enable email confirmation (before wider distribution, not first build)

---

## Session End Requirements

Before ending the session:
1. Update `docs/mvp-1.0/tracking/CHANGELOG.md` with a dated Session 16 entry
2. Update `docs/mvp-1.0/tracking/ISSUES.md` — close BLOCK-002, add any new issues
3. Run `npx tsc --noEmit` — must be clean
4. Update this file -> `SESSION_17_PROMPT.md` with current state and next steps
