#!/bin/bash

# Download free stock media for Locally Strong website
# All videos are from Pexels.com - free for commercial use, no attribution required
#
# IMPORTANT: Run this script to download media files after cloning.
# Media files are not committed to git due to size.

echo "=========================================="
echo "Downloading free stock media for Locally Strong"
echo "=========================================="
echo ""

IMAGES_DIR="$(dirname "$0")/../images"
mkdir -p "$IMAGES_DIR"
cd "$IMAGES_DIR"

# Hero video - Vegetables in market (works reliably)
# Source: https://www.pexels.com/video/vegetables-in-the-market-2889410/
# Credit: Sabel Blanco on Pexels
if [ ! -f "hero-video.mp4" ]; then
  echo "[1/4] Downloading hero video (vegetables at market)..."
  curl -L -o hero-video.mp4 "https://videos.pexels.com/video-files/2889410/2889410-hd_1920_1080_30fps.mp4"
else
  echo "[1/4] Hero video already exists, skipping..."
fi

# Hero poster image - fallback for video
# Source: https://www.pexels.com/photo/people-at-a-farmers-market-4099471/
if [ ! -f "hero-poster.jpg" ]; then
  echo "[2/4] Downloading hero poster image..."
  curl -L -o hero-poster.jpg "https://images.pexels.com/photos/4099471/pexels-photo-4099471.jpeg?auto=compress&cs=tinysrgb&w=1920"
else
  echo "[2/4] Hero poster already exists, skipping..."
fi

# Community image
# Source: https://www.pexels.com/photo/group-of-people-standing-beside-body-of-water-1231230/
if [ ! -f "community.jpg" ]; then
  echo "[3/4] Downloading community image..."
  curl -L -o community.jpg "https://images.pexels.com/photos/1231230/pexels-photo-1231230.jpeg?auto=compress&cs=tinysrgb&w=1200"
else
  echo "[3/4] Community image already exists, skipping..."
fi

# Fresh produce image
# Source: https://www.pexels.com/photo/variety-of-vegetables-1656663/
if [ ! -f "produce.jpg" ]; then
  echo "[4/4] Downloading produce image..."
  curl -L -o produce.jpg "https://images.pexels.com/photos/1656663/pexels-photo-1656663.jpeg?auto=compress&cs=tinysrgb&w=1200"
else
  echo "[4/4] Produce image already exists, skipping..."
fi

# Additional images for cards and sections
# Market overview
if [ ! -f "market-overview.jpg" ]; then
  echo "[5/10] Downloading market overview image..."
  curl -L -o market-overview.jpg "https://images.pexels.com/photos/2894867/pexels-photo-2894867.jpeg?auto=compress&cs=tinysrgb&w=1200"
else
  echo "[5/10] Market overview image already exists, skipping..."
fi

# Fresh veggies
if [ ! -f "fresh-veggies.jpg" ]; then
  echo "[6/10] Downloading fresh veggies image..."
  curl -L -o fresh-veggies.jpg "https://images.pexels.com/photos/1656666/pexels-photo-1656666.jpeg?auto=compress&cs=tinysrgb&w=1200"
else
  echo "[6/10] Fresh veggies image already exists, skipping..."
fi

# Local farmer
if [ ! -f "local-farmer.jpg" ]; then
  echo "[7/10] Downloading local farmer image..."
  curl -L -o local-farmer.jpg "https://images.pexels.com/photos/2933243/pexels-photo-2933243.jpeg?auto=compress&cs=tinysrgb&w=1200"
else
  echo "[7/10] Local farmer image already exists, skipping..."
fi

# Community gathering
if [ ! -f "community-gathering.jpg" ]; then
  echo "[8/10] Downloading community gathering image..."
  curl -L -o community-gathering.jpg "https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg?auto=compress&cs=tinysrgb&w=1200"
else
  echo "[8/10] Community gathering image already exists, skipping..."
fi

# Workshop
if [ ! -f "workshop.jpg" ]; then
  echo "[9/10] Downloading workshop image..."
  curl -L -o workshop.jpg "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1200"
else
  echo "[9/10] Workshop image already exists, skipping..."
fi

# Local business
if [ ! -f "local-business.jpg" ]; then
  echo "[10/10] Downloading local business image..."
  curl -L -o local-business.jpg "https://images.pexels.com/photos/3814446/pexels-photo-3814446.jpeg?auto=compress&cs=tinysrgb&w=1200"
else
  echo "[10/10] Local business image already exists, skipping..."
fi

echo ""
echo "=========================================="
echo "Download complete!"
echo "=========================================="
echo ""
echo "Media credits (all free from Pexels.com, no attribution required):"
echo "- Hero video: Sabel Blanco - https://www.pexels.com/video/2889410/"
echo "- Photos: Various Pexels contributors"
echo ""
echo "Files saved to: $(pwd)"
ls -lh
