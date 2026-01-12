#!/usr/bin/env python3
"""
Generate better quality PWA icons for Text Reader app
Creates proper PNG files with text and design elements
"""

import struct
import zlib
import math

def create_png(width, height, pixels):
    """Create a PNG file from pixel data"""

    def create_chunk(chunk_type, data):
        """Create a PNG chunk"""
        length = struct.pack('>I', len(data))
        crc = struct.pack('>I', zlib.crc32(chunk_type + data) & 0xffffffff)
        return length + chunk_type + data + crc

    # PNG header
    header = b'\x89PNG\r\n\x1a\n'

    # IHDR chunk
    ihdr_data = struct.pack('>IIBBBBB', width, height, 8, 2, 0, 0, 0)
    ihdr = create_chunk(b'IHDR', ihdr_data)

    # IDAT chunk (compressed pixel data)
    raw_data = []
    for row in pixels:
        raw_data.append(b'\x00')  # Filter type
        for r, g, b in row:
            raw_data.append(struct.pack('BBB', r, g, b))

    compressed = zlib.compress(b''.join(raw_data), 9)
    idat = create_chunk(b'IDAT', compressed)

    # IEND chunk
    iend = create_chunk(b'IEND', b'')

    return header + ihdr + idat + iend

def draw_circle(pixels, cx, cy, radius, color, width, height):
    """Draw a filled circle"""
    for y in range(max(0, cy - radius), min(height, cy + radius + 1)):
        for x in range(max(0, cx - radius), min(width, cx + radius + 1)):
            if (x - cx) ** 2 + (y - cy) ** 2 <= radius ** 2:
                pixels[y][x] = color

def draw_rect(pixels, x1, y1, x2, y2, color, width, height):
    """Draw a filled rectangle"""
    for y in range(max(0, y1), min(height, y2)):
        for x in range(max(0, x1), min(width, x2)):
            pixels[y][x] = color

def draw_rounded_rect(pixels, x1, y1, x2, y2, radius, color, width, height):
    """Draw a rounded rectangle"""
    # Draw main rectangle
    draw_rect(pixels, x1 + radius, y1, x2 - radius, y2, color, width, height)
    draw_rect(pixels, x1, y1 + radius, x2, y2 - radius, color, width, height)

    # Draw corners
    draw_circle(pixels, x1 + radius, y1 + radius, radius, color, width, height)
    draw_circle(pixels, x2 - radius - 1, y1 + radius, radius, color, width, height)
    draw_circle(pixels, x1 + radius, y2 - radius - 1, radius, color, width, height)
    draw_circle(pixels, x2 - radius - 1, y2 - radius - 1, radius, color, width, height)

def draw_letter_t(pixels, cx, cy, size, color, width, height):
    """Draw a stylized 'T' letter"""
    # Vertical stem
    stem_width = size // 8
    stem_height = int(size * 0.7)
    draw_rect(pixels,
              cx - stem_width // 2,
              cy - stem_height // 2,
              cx + stem_width // 2,
              cy + stem_height // 2,
              color, width, height)

    # Horizontal top
    top_width = size // 2
    top_height = size // 8
    draw_rect(pixels,
              cx - top_width // 2,
              cy - stem_height // 2,
              cx + top_width // 2,
              cy - stem_height // 2 + top_height,
              color, width, height)

def draw_sound_waves(pixels, cx, cy, size, color, width, height):
    """Draw sound wave visualization"""
    wave_count = 5
    max_height = size // 6
    bar_width = size // 25
    spacing = size // 10

    for i in range(wave_count):
        # Calculate position and height
        x = cx - (spacing * 2) + (i * spacing)
        height_factor = 1.0 - (abs(i - wave_count // 2) * 0.25)
        bar_height = int(max_height * height_factor)

        # Draw bar
        draw_rect(pixels,
                  x - bar_width // 2,
                  cy - bar_height // 2,
                  x + bar_width // 2,
                  cy + bar_height // 2,
                  color, width, height)

def generate_icon(size):
    """Generate a single icon of the specified size"""
    width = height = size

    # Initialize pixel array with background color
    bg_color = (30, 30, 30)  # Dark background
    pixels = [[bg_color for _ in range(width)] for _ in range(height)]

    # Colors
    accent_color = (0, 122, 255)  # iOS blue
    text_color = (255, 255, 255)  # White

    # Draw background with gradient effect
    for y in range(height):
        for x in range(width):
            # Subtle gradient from top-left to bottom-right
            gradient_factor = ((x + y) / (width + height)) * 0.2
            r = int(30 * (1 + gradient_factor))
            g = int(30 * (1 + gradient_factor))
            b = int(30 * (1 + gradient_factor))
            pixels[y][x] = (min(255, r), min(255, g), min(255, b))

    # Draw rounded rectangle frame
    margin = size // 10
    corner_radius = size // 12

    # Outer accent frame
    for y in range(margin, height - margin):
        for x in range(margin, width - margin):
            # Check if we're on the border
            dist_to_edge = min(x - margin, y - margin,
                               width - margin - 1 - x,
                               height - margin - 1 - y)
            if dist_to_edge < 3:
                # Check for rounded corners
                corner_x = min(x - margin, width - margin - 1 - x)
                corner_y = min(y - margin, height - margin - 1 - y)
                if corner_x < corner_radius and corner_y < corner_radius:
                    if (corner_radius - corner_x) ** 2 + (corner_radius - corner_y) ** 2 <= corner_radius ** 2:
                        pixels[y][x] = accent_color
                else:
                    pixels[y][x] = accent_color

    # Draw letter T
    draw_letter_t(pixels, width // 2, height // 2 - size // 10,
                  size // 2, text_color, width, height)

    # Draw sound waves at bottom
    draw_sound_waves(pixels, width // 2, int(height * 0.75),
                     size, accent_color, width, height)

    # Convert to PNG
    png_data = create_png(width, height, pixels)

    # Save file
    filename = f"icons/icon-{size}.png"
    with open(filename, 'wb') as f:
        f.write(png_data)

    print(f"✅ Created high-quality {filename}")
    return True

def main():
    """Generate all required icon sizes"""
    import os

    # Ensure icons directory exists
    os.makedirs("icons", exist_ok=True)

    print("🎨 Generating high-quality PWA icons...")
    print("")

    # Generate both sizes
    sizes = [192, 512]
    for size in sizes:
        generate_icon(size)

    print("")
    print("✨ Icons generated successfully!")
    print("   Professional design with:")
    print("   - Dark theme background")
    print("   - 'T' letter logo")
    print("   - Sound wave visualization")
    print("   - iOS-style accent colors")

if __name__ == "__main__":
    main()