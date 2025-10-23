#!/usr/bin/env python3
"""
Verify that everything is ready for testing
"""

import os
import json
import sys

def check_file(path, description):
    """Check if a file exists"""
    if os.path.exists(path):
        size = os.path.getsize(path)
        print(f"  ✅ {description}: {path} ({size} bytes)")
        return True
    else:
        print(f"  ❌ {description}: {path} (MISSING)")
        return False

def verify_setup():
    """Verify all files and configurations are in place"""
    print("\n" + "="*60)
    print("🔍 VERIFYING TEXT READER SETUP")
    print("="*60 + "\n")

    all_good = True

    # Check core HTML/CSS/JS files
    print("📁 Core Files:")
    all_good &= check_file("index.html", "Main HTML")
    all_good &= check_file("manifest.json", "PWA Manifest")
    all_good &= check_file("css/styles.css", "Stylesheet")
    all_good &= check_file("js/app.js", "Main App")
    all_good &= check_file("js/speech.js", "Speech Engine")
    all_good &= check_file("js/fileImport.js", "File Import")
    all_good &= check_file("js/storage.js", "Storage Manager")
    all_good &= check_file("js/ui.js", "UI Controller")

    # Check icons
    print("\n🎨 Icons:")
    all_good &= check_file("icons/icon-192.png", "192x192 Icon")
    all_good &= check_file("icons/icon-512.png", "512x512 Icon")

    # Check server files
    print("\n🖥️  Server Files:")
    all_good &= check_file("server.py", "HTTP Server")
    all_good &= check_file("server_https.py", "HTTPS Server")
    all_good &= check_file("test_now.sh", "Test Script")

    # Check documentation
    print("\n📚 Documentation:")
    all_good &= check_file("README.md", "Main README")
    all_good &= check_file("QUICKSTART.md", "Quick Start Guide")
    all_good &= check_file("TESTING.md", "Testing Guide")
    all_good &= check_file("DEPLOYMENT.md", "Deployment Guide")

    # Verify manifest.json content
    print("\n🔧 Configuration Check:")
    try:
        with open("manifest.json", "r") as f:
            manifest = json.load(f)

        # Check required fields
        required = ["name", "short_name", "icons", "start_url", "display"]
        for field in required:
            if field in manifest:
                print(f"  ✅ Manifest has '{field}'")
            else:
                print(f"  ❌ Manifest missing '{field}'")
                all_good = False

        # Check icon paths
        for icon in manifest.get("icons", []):
            icon_path = icon["src"].lstrip("/")
            if os.path.exists(icon_path):
                print(f"  ✅ Icon exists: {icon_path}")
            else:
                print(f"  ❌ Icon missing: {icon_path}")
                all_good = False

    except Exception as e:
        print(f"  ❌ Failed to verify manifest: {e}")
        all_good = False

    # Check Python version
    print("\n🐍 Python Version:")
    python_version = sys.version_info
    if python_version.major >= 3:
        print(f"  ✅ Python {python_version.major}.{python_version.minor}.{python_version.micro}")
    else:
        print(f"  ❌ Python 3 required (found {python_version.major}.{python_version.minor})")
        all_good = False

    # Final summary
    print("\n" + "="*60)
    if all_good:
        print("✅ ALL CHECKS PASSED - Ready for testing!")
        print("\n🚀 Next step: Run ./test_now.sh")
    else:
        print("❌ SOME CHECKS FAILED - Please fix issues above")
        print("\n📋 To fix:")
        print("  1. Run: python3 generate_better_icons.py")
        print("  2. Check missing files")
        print("  3. Run this script again")

    print("="*60 + "\n")

    return all_good

if __name__ == "__main__":
    success = verify_setup()
    sys.exit(0 if success else 1)