#!/usr/bin/env python3
import sys

def generate_qr_ascii(url):
    """Generate ASCII QR code for URL"""
    # Simple ASCII representation (not a real QR code, but visually similar)
    print("\n" + "█" * 25)
    print("█" + " " * 23 + "█")
    print("█  Scan QR or visit:   █")
    print("█" + " " * 23 + "█")
    print("█" * 25)
    print(f"\n📱 {url}\n")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        generate_qr_ascii(sys.argv[1])
