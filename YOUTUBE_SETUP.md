# YouTube API Setup Guide

## Prerequisites

To use the YouTube video analysis functionality, you need to set up a YouTube Data API v3 key.

## Step-by-Step Setup

### 1. Create a Google Cloud Project
1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Note your project ID for reference

### 2. Enable YouTube Data API v3
1. In the Google Cloud Console, navigate to "APIs & Services" > "Library"
2. Search for "YouTube Data API v3"
3. Click on it and press "Enable"

### 3. Create API Credentials
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API Key"
3. Copy the generated API key
4. **Important**: Restrict the API key to YouTube Data API v3 for security

### 4. Configure Your Environment
1. Open `.env.local` in your project root
2. Replace `your_youtube_api_key_here` with your actual API key:
   ```
   YOUTUBE_API_KEY=YOUR_ACTUAL_API_KEY_HERE
   ```

### 5. API Quotas and Limits
- YouTube Data API v3 has a daily quota limit (default: 10,000 units/day)
- Each video metadata request costs ~1-5 units
- Monitor your usage in the Google Cloud Console

## Features Enabled

With the YouTube API configured, VidTrend can:
- ✅ Extract video metadata (title, duration, view count, etc.)
- ✅ Fetch video transcripts (when available)
- ✅ Perform NLP analysis on video content
- ✅ Generate market insights and trend analysis

## Testing

Try analyzing a YouTube video with captions enabled to test the functionality. The system will provide detailed error messages if the API key is not configured properly.

## Troubleshooting

**"YouTube API is not configured" error:**
- Check that your API key is correctly set in `.env.local`
- Ensure the YouTube Data API v3 is enabled in your Google Cloud project
- Verify the API key has the correct permissions

**"Could not fetch transcript" error:**
- The video may not have captions/subtitles available
- Try with a video that has auto-generated or manual captions
- Some private or restricted videos cannot be accessed

**Rate limit errors:**
- You've exceeded the daily API quota
- Wait for quota reset (resets daily) or request quota increase from Google