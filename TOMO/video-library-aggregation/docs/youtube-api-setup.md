# YouTube Data API v3 Setup Guide

## Steps to Get an API Key

### 1. Go to Google Cloud Console

https://console.cloud.google.com

Sign in with a Google account. Free tier is sufficient.

### 2. Create a Project

- Top-left dropdown next to "Google Cloud" logo
- Click "New Project"
- Name: `tomo-video-curation` (or similar)
- Click "Create"

### 3. Enable the YouTube Data API v3

- Left sidebar: "APIs & Services" > "Library"
- Search: "YouTube Data API v3"
- Click the result > click **Enable**

### 4. Create an API Key

- Left sidebar: "APIs & Services" > "Credentials"
- Click **"+ Create Credentials"** > "API Key"
- Copy the key immediately

### 5. Restrict the Key (Recommended)

- Click the key name in the credentials list
- Under "API restrictions": select "Restrict key" > check only "YouTube Data API v3"
- Under "Application restrictions": optionally limit by IP address
- Save

---

## Quota & Costs

YouTube Data API v3 has a **free daily quota of 10,000 units**.

| Operation | Units/Call | Free Calls/Day | Our Use Case |
|-----------|-----------|----------------|-------------|
| `search.list` | 100 | ~100 | Discover videos by technique name |
| `videos.list` | 1 | ~10,000 | Get metadata (views, duration, publish date) |
| `channels.list` | 1 | ~10,000 | Verify instructor channel IDs |

### Budget Per Run

A typical run processing 10-20 techniques:
- ~40-100 search queries (2-5 per technique) = 4,000-10,000 units
- ~200-500 video metadata lookups = 200-500 units
- **Total: 4,200-10,500 units per run** (may need to split across 2 days for larger batches)

### If You Need More Quota

- Default: 10,000 units/day
- Can request increase via Google Cloud Console (APIs & Services > YouTube Data API v3 > Quotas)
- For this project, default is likely sufficient (1 run per day)

---

## How We'll Use It

### Discovery (search.list)

```
GET https://www.googleapis.com/youtube/v3/search
  ?part=snippet
  &q=scissor+sweep+tutorial+BJJ
  &type=video
  &videoDuration=medium        # 4-20 min
  &relevanceLanguage=en
  &maxResults=10
  &key={API_KEY}
```

Returns: video IDs, titles, channel names, thumbnails, publish dates.

### Enrichment (videos.list)

```
GET https://www.googleapis.com/youtube/v3/videos
  ?part=snippet,contentDetails,statistics
  &id={VIDEO_ID_1},{VIDEO_ID_2},...
  &key={API_KEY}
```

Returns: view count, like count, duration (ISO 8601), description, tags, definition (HD/SD).

### Channel Verification (channels.list)

```
GET https://www.googleapis.com/youtube/v3/channels
  ?part=snippet,statistics
  &id={CHANNEL_ID}
  &key={API_KEY}
```

Returns: channel name, subscriber count, total views, description.

### Availability Check (videos.list)

```
GET https://www.googleapis.com/youtube/v3/videos
  ?part=status
  &id={VIDEO_ID}
  &key={API_KEY}
```

Returns: `privacyStatus` (public/private/unlisted), `embeddable`, `uploadStatus`.

---

## Where to Store the Key

**Do NOT commit the API key to the repository.**

Options:
- Environment variable: `YOUTUBE_API_KEY`
- `.env` file (must be in `.gitignore`)
- Pass directly when running the pipeline

For our iterative Claude-driven pipeline, you'll provide the key in the conversation when we start a run, or set it as an environment variable before running any scripts.

---

## Verification

Test that your key works:

```bash
curl "https://www.googleapis.com/youtube/v3/videos?part=snippet&id=dQw4w9WgXcQ&key=YOUR_API_KEY"
```

If you get a JSON response with video details, the key is working.
