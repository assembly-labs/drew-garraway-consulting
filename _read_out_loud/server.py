#!/usr/bin/env python3
"""
Simple HTTP server for testing the Text Reader PWA locally.
Serves files with proper MIME types and CORS headers.
"""

import http.server
import socketserver
import os

PORT = 8000

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Add CORS headers
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        # Add service worker headers
        self.send_header('Service-Worker-Allowed', '/')
        # Cache control
        if self.path.endswith('.js') or self.path.endswith('.css'):
            self.send_header('Cache-Control', 'no-cache')
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

os.chdir(os.path.dirname(os.path.abspath(__file__)))

with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
    print(f"🚀 Text Reader App Server")
    print(f"📱 Open in browser: http://localhost:{PORT}")
    print(f"📱 For mobile testing: http://[your-ip]:{PORT}")
    print(f"   (Find your IP with: ipconfig getifaddr en0)")
    print(f"\n✨ Features:")
    print(f"   - Text-to-Speech with high-quality voices")
    print(f"   - File import (PDF, DOCX, TXT)")
    print(f"   - Offline support (PWA)")
    print(f"   - Text library")
    print(f"   - Speed control")
    print(f"\nPress Ctrl+C to stop the server")
    httpd.serve_forever()