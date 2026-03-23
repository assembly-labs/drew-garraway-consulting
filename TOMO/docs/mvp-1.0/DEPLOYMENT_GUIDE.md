# TOMO — TestFlight Deployment Guide

How to build and ship a new version to TestFlight. One-command process after initial setup (completed 2026-03-22).

---

## Quick Deploy (One Command)

From the `tomo/` directory:

```bash
bash build.sh
```

This builds a production IPA locally and submits it to TestFlight. Takes ~20-30 minutes. The build number auto-increments each run.

---

## What the Script Does

1. Sets `SENTRY_DISABLE_AUTO_UPLOAD=true` (no Sentry auth token configured)
2. Runs `eas build --platform ios --profile production --local --non-interactive`
3. Submits the IPA to App Store Connect via `eas submit`
4. Testers get the new build automatically in TestFlight

---

## Credentials & Where They Live

### In the Codebase (gitignored)

| File | Contents |
|------|----------|
| `credentials.local` | Supabase keys, AssemblyAI, Anthropic, Sentry DSN |
| `AuthKey_GRYS9UPY9B.p8` | App Store Connect API key (for `eas submit`) |
| `eas.json` | Apple Team ID, ASC App ID, API key references |

### On Expo Servers (remote)

| Credential | Purpose |
|------------|---------|
| Apple Distribution Certificate | Signs the IPA for App Store/TestFlight |
| Apple Provisioning Profile | Authorizes the app to run on devices |

These were generated during first build and stored on Expo's servers. They auto-renew and are managed by `eas credentials`.

### In Apple Developer Portal

| Item | Value |
|------|-------|
| Team ID | `58GX3PYW3S` |
| Bundle ID | `com.drewgarraway.tomo` |
| App Store Connect Apple ID | `6760957435` |
| App Store Connect API Key ID | `GRYS9UPY9B` |
| App Store Connect Issuer ID | `85055ec0-683d-4ce5-9ff5-c78e4f9febd9` |

### Apple Review Test Account (Supabase Auth)

| Field | Value |
|-------|-------|
| Email | `apple@assemblylabs.co` |
| Password | `test1234` |

---

## Version Bumping

- **Build number** (`expo.ios.buildNumber`): Auto-incremented by EAS on each build
- **App version** (`version` in `app.config.ts`): Bump manually when shipping a new feature release

To bump app version:
1. Edit `version` in `app.config.ts` (e.g., `'1.0.0'` → `'1.1.0'`)
2. Run `bash build.sh`

---

## Adding Testers

### Internal Testers (instant access, no Apple review)
1. Add user to App Store Connect team: [appstoreconnect.apple.com/access/users](https://appstoreconnect.apple.com/access/users)
2. Add to internal testing group in TestFlight tab

### External Testers (requires Apple beta review, 24-48h)
1. Add email as individual tester or to external group in TestFlight tab
2. First build sent to external testers requires beta review
3. Subsequent builds to the same group skip review (unless major changes)

### Current Testers
- `garrawaydrew@gmail.com` (Drew — internal + external)
- `drew@assemblylabs.co` (App Store Connect owner — internal)

---

## Troubleshooting

### "Sentry auth token required"
Already handled — `SENTRY_DISABLE_AUTO_UPLOAD=true` is set in `build.sh`.

### "Fastlane not found"
```bash
brew install fastlane
```

### "Distribution Certificate not validated"
Expected warning in non-interactive mode. Credentials are still valid — the build proceeds.

### "Provisioning Profile expired"
Run interactively in Terminal to regenerate:
```bash
cd tomo && eas build --platform ios --profile production --local
```
Say **Y** to regenerate when prompted.

### Build succeeds but submit fails
Submit manually:
```bash
eas submit --platform ios --path ./build-XXXXX.ipa --non-interactive
```

### Need to update Apple credentials
```bash
cd tomo && eas credentials --platform ios
```
This requires Terminal (interactive). Apple login + 2FA required.

---

## Architecture

```
Developer Machine                    Apple Servers
┌─────────────────┐                 ┌──────────────────┐
│  eas build       │                │  App Store Connect │
│  --local         │──── IPA ────▶  │  (TestFlight)      │
│                  │  eas submit    │                    │
│  Xcode signing   │                │  Beta Review       │
│  Fastlane        │                │  (external only)   │
└─────────────────┘                 └──────────────────┘
        │                                    │
        │                                    ▼
   Expo Servers                        TestFlight App
   (certs, profiles)                   (on tester phones)
```

---

## Pre-Public-Launch Checklist

Before moving from TestFlight to App Store:

- [ ] Re-enable email confirmation in Supabase (LAUNCH-001)
- [ ] Implement Apple Sign-In (P1-002)
- [ ] Custom app icon + splash screen (P3-001)
- [ ] Terms of Service screen (P3-004)
- [ ] App Store screenshots + description
- [ ] Privacy policy URL
- [ ] Configure Sentry auth token for source map uploads
