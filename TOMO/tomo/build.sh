#!/bin/bash
# TOMO — Build & Submit to TestFlight
# Usage: bash build.sh
# Takes ~20-30 minutes. Build number auto-increments.

set -e
cd /Users/drewgarraway/Documents/GitHub/drew-garraway-consulting/TOMO/tomo

echo "=== TOMO: Building production IPA ==="
SENTRY_DISABLE_AUTO_UPLOAD=true EAS_BUILD_NO_EXPO_GO_WARNING=true \
  eas build --platform ios --profile production --local --non-interactive \
  2>&1 | tee /tmp/tomo-build.log

# Extract IPA path from build output
IPA_PATH=$(grep "build artifacts in" /tmp/tomo-build.log | sed 's/.*build artifacts in //')

if [ -z "$IPA_PATH" ]; then
  echo "ERROR: Build failed — no IPA produced. Check /tmp/tomo-build.log"
  exit 1
fi

echo ""
echo "=== TOMO: Submitting to TestFlight ==="
echo "IPA: $IPA_PATH"
eas submit --platform ios --path "$IPA_PATH" --non-interactive

echo ""
echo "=== DONE: Build submitted to TestFlight ==="
echo "Check status: https://appstoreconnect.apple.com/apps/6760957435/testflight/ios"
