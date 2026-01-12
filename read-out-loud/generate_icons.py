#!/usr/bin/env python3
"""
Generate PWA icons for Text Reader app
Creates 192x192 and 512x512 PNG files with a clean, modern design
"""

def generate_icons():
    """Generate icons using PIL (fallback to basic if PIL not available)"""
    try:
        from PIL import Image, ImageDraw, ImageFont
        return generate_with_pil()
    except ImportError:
        print("PIL not installed. Creating basic icons using built-in libraries...")
        return generate_basic_icons()

def generate_with_pil():
    """Generate high-quality icons with PIL"""
    from PIL import Image, ImageDraw, ImageFont
    import os

    # Define colors (dark theme)
    bg_color = (30, 30, 30)  # #1E1E1E
    text_color = (255, 255, 255)  # White
    accent_color = (0, 122, 255)  # iOS blue

    sizes = [192, 512]

    for size in sizes:
        # Create new image with dark background
        img = Image.new('RGB', (size, size), bg_color)
        draw = ImageDraw.Draw(img)

        # Draw rounded rectangle background
        margin = size // 10
        corner_radius = size // 8

        # Draw accent border
        draw.rounded_rectangle(
            [margin, margin, size - margin, size - margin],
            radius=corner_radius,
            outline=accent_color,
            width=size // 40
        )

        # Draw "T" letter in center (for "Text")
        font_size = size // 3
        try:
            # Try to use system font
            from PIL import ImageFont
            font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", font_size)
        except:
            # Fallback to default font
            font = ImageFont.load_default()

        # Draw the "T" character
        text = "T"
        bbox = draw.textbbox((0, 0), text, font=font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]

        x = (size - text_width) // 2
        y = (size - text_height) // 2 - size // 20

        draw.text((x, y), text, fill=text_color, font=font)

        # Draw sound wave lines
        wave_y = size * 0.65
        wave_height = size // 20
        wave_spacing = size // 15
        wave_count = 5

        for i in range(wave_count):
            x_start = (size // 2) - (wave_spacing * 2) + (i * wave_spacing)
            height_factor = 1.0 - (abs(i - wave_count // 2) * 0.3)
            line_height = wave_height * height_factor

            draw.rectangle(
                [x_start, wave_y - line_height,
                 x_start + size // 40, wave_y + line_height],
                fill=accent_color
            )

        # Save the icon
        filename = f"icons/icon-{size}.png"
        img.save(filename, "PNG", quality=100)
        print(f"✅ Created {filename}")

    return True

def generate_basic_icons():
    """Generate basic icons without PIL dependency"""
    import struct
    import zlib
    import os

    def create_png(size):
        """Create a simple PNG with basic shapes"""
        # Create a simple blue square with white "T" using pure Python
        # This is a minimal PNG implementation

        # PNG header
        header = b'\x89PNG\r\n\x1a\n'

        # IHDR chunk (image header)
        width = size
        height = size
        bit_depth = 8
        color_type = 2  # RGB
        ihdr_data = struct.pack('>IIBBBBB', width, height, bit_depth, color_type, 0, 0, 0)
        ihdr = create_chunk(b'IHDR', ihdr_data)

        # Create pixel data (simple blue gradient)
        pixels = []
        for y in range(height):
            row = [0]  # Filter type
            for x in range(width):
                # Create a simple gradient/pattern
                if (width//4 < x < 3*width//4) and (height//4 < y < 3*height//4):
                    # White "T" shape in center
                    if (y < height//2 and width//3 < x < 2*width//3) or \
                       (height//4 < y < height//3):
                        row.extend([255, 255, 255])  # White
                    else:
                        row.extend([0, 122, 255])  # Blue
                else:
                    row.extend([30, 30, 30])  # Dark background
            pixels.append(bytes(row))

        # Compress pixel data
        compressed = zlib.compress(b''.join(pixels), 9)
        idat = create_chunk(b'IDAT', compressed)

        # IEND chunk (end marker)
        iend = create_chunk(b'IEND', b'')

        # Combine all chunks
        png_data = header + ihdr + idat + iend

        # Save file
        filename = f"icons/icon-{size}.png"
        with open(filename, 'wb') as f:
            f.write(png_data)
        print(f"✅ Created {filename} (basic version)")

        return True

    def create_chunk(chunk_type, data):
        """Create a PNG chunk"""
        length = struct.pack('>I', len(data))
        crc = struct.pack('>I', zlib.crc32(chunk_type + data) & 0xffffffff)
        return length + chunk_type + data + crc

    # Generate both sizes
    create_png(192)
    create_png(512)
    return True

if __name__ == "__main__":
    import os

    # Ensure icons directory exists
    os.makedirs("icons", exist_ok=True)

    print("🎨 Generating PWA icons...")

    success = generate_icons()

    if success:
        print("\n✅ Icons generated successfully!")
        print("   - icons/icon-192.png")
        print("   - icons/icon-512.png")
    else:
        print("\n❌ Failed to generate icons")
        exit(1)