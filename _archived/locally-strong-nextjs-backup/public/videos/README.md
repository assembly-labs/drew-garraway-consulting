# Video Assets

## hero-placeholder.mp4

This video file needs to be added manually.

### Specifications

- **Duration:** 10-15 seconds (looping)
- **Resolution:** 1920x1080 (1080p) or 1280x720 (720p)
- **Format:** MP4 (H.264 codec)
- **File size:** Under 5MB (optimized for web)
- **Audio:** None (video is muted in the component)

### Content Suggestions

The hero video should showcase:
- Farmers market scenes
- Local vendors and producers
- Fresh produce and local goods
- Community interactions
- Seasonal variety (if possible)

### Optimization Tips

1. Use HandBrake or FFmpeg to compress:
   ```bash
   ffmpeg -i input.mp4 -vcodec h264 -acodec none -crf 28 -preset slow hero-placeholder.mp4
   ```

2. Consider creating multiple resolutions for responsive loading
3. Ensure the first frame is visually appealing (used as poster fallback)

### Fallback Behavior

If this video file is missing or fails to load:
- The `hero-poster.jpg` image will be displayed instead
- The play/pause button will be hidden
- All content remains accessible
