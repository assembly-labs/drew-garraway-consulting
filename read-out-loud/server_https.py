#!/usr/bin/env python3
"""
HTTPS Development Server for Text Reader PWA
Supports local and network testing on iOS devices with proper SSL certificates.
"""

import http.server
import socketserver
import ssl
import os
import sys
import subprocess
import socket

PORT = 8443  # Standard HTTPS development port
CERT_FILE = 'localhost.pem'
KEY_FILE = 'localhost-key.pem'

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Add CORS headers
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        # Add service worker headers
        self.send_header('Service-Worker-Allowed', '/')
        # Security headers for PWA
        self.send_header('X-Content-Type-Options', 'nosniff')
        # FORCE NO CACHE for development - ensures latest code always loads
        if self.path.endswith('.js') or self.path.endswith('.css') or self.path.endswith('.html'):
            self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
            self.send_header('Pragma', 'no-cache')
            self.send_header('Expires', '0')
        super().end_headers()

    def guess_type(self, path):
        mimetype = super().guess_type(path)
        # Ensure correct MIME types
        if path.endswith('.js'):
            return 'application/javascript'
        if path.endswith('.json'):
            return 'application/json'
        if path.endswith('.webmanifest'):
            return 'application/manifest+json'
        return mimetype

    def log_message(self, format, *args):
        # Simplified logging
        sys.stdout.write("%s - %s\n" % (self.address_string(), format % args))

def get_local_ip():
    """Get the local IP address for network testing"""
    try:
        # Create a socket to determine the local IP
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        local_ip = s.getsockname()[0]
        s.close()
        return local_ip
    except Exception:
        return "Unable to determine"

def generate_certificates():
    """Generate self-signed certificates using mkcert if available, fallback to openssl"""

    # Check if certificates already exist
    if os.path.exists(CERT_FILE) and os.path.exists(KEY_FILE):
        print("✓ SSL certificates found")
        return True

    print("📜 Generating SSL certificates...")

    # Try mkcert first (best for local development)
    try:
        # Check if mkcert is installed
        result = subprocess.run(['which', 'mkcert'], capture_output=True)
        if result.returncode == 0:
            print("  Using mkcert (recommended)...")
            subprocess.run(['mkcert', '-install'], check=True)
            subprocess.run(['mkcert', '-cert-file', CERT_FILE, '-key-file', KEY_FILE,
                          'localhost', '127.0.0.1', '::1', get_local_ip()], check=True)
            print("  ✓ Certificates generated with mkcert")
            return True
    except Exception as e:
        print(f"  mkcert failed: {e}")

    # Fallback to openssl
    try:
        print("  Using openssl (fallback)...")
        subprocess.run([
            'openssl', 'req', '-x509', '-newkey', 'rsa:4096',
            '-keyout', KEY_FILE, '-out', CERT_FILE,
            '-days', '365', '-nodes',
            '-subj', '/CN=localhost'
        ], check=True, capture_output=True)
        print("  ✓ Certificates generated with openssl")
        print("  ⚠️  You'll need to accept the security warning in your browser")
        return True
    except Exception as e:
        print(f"  ✗ Failed to generate certificates: {e}")
        return False

def main():
    os.chdir(os.path.dirname(os.path.abspath(__file__)))

    # Generate or verify certificates
    if not generate_certificates():
        print("\n❌ Could not generate SSL certificates")
        print("\nTo install mkcert (recommended):")
        print("  brew install mkcert")
        print("  mkcert -install")
        print("\nOr install OpenSSL:")
        print("  brew install openssl")
        sys.exit(1)

    # Create HTTPS server
    with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
        # Wrap with SSL
        context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
        context.load_cert_chain(CERT_FILE, KEY_FILE)
        httpd.socket = context.wrap_socket(httpd.socket, server_side=True)

        local_ip = get_local_ip()

        print("\n" + "="*60)
        print("🚀 Text Reader App - HTTPS Development Server")
        print("="*60)
        print(f"\n📱 LOCAL ACCESS:")
        print(f"   https://localhost:{PORT}")
        print(f"\n📱 iOS DEVICE ACCESS (on same WiFi):")
        print(f"   https://{local_ip}:{PORT}")
        print(f"\n⚠️  FIRST TIME SETUP:")
        print(f"   1. Open https://localhost:{PORT} on your laptop")
        print(f"   2. Accept the security warning (self-signed cert)")
        print(f"   3. On iOS: Open https://{local_ip}:{PORT}")
        print(f"   4. Tap 'Advanced' → 'Proceed' (or similar)")
        print(f"   5. Add to Home Screen for PWA installation")
        print(f"\n✨ FEATURES:")
        print(f"   ✓ HTTPS (required for iOS PWA)")
        print(f"   ✓ File import (PDF, DOCX, TXT)")
        print(f"   ✓ Text-to-Speech")
        print(f"   ✓ Offline support")
        print(f"   ✓ Network accessible")
        print(f"\n🔧 TESTING CHECKLIST:")
        print(f"   □ Import a PDF file")
        print(f"   □ Import a Word document")
        print(f"   □ Save text to library")
        print(f"   □ Test playback controls")
        print(f"   □ Install as PWA")
        print(f"\nPress Ctrl+C to stop the server")
        print("="*60 + "\n")

        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\n👋 Server stopped")
            sys.exit(0)

if __name__ == "__main__":
    main()
