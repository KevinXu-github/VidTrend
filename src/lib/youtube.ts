import { google } from 'googleapis';
import { YoutubeTranscript } from 'youtube-transcript';

const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY,
});

export interface VideoMetadata {
  id: string;
  title: string;
  description: string;
  duration: string;
  viewCount: string;
  publishedAt: string;
  channelTitle: string;
  thumbnailUrl: string;
}

export interface TranscriptSegment {
  text: string;
  start: number;
  duration: number;
}

export class YouTubeService {
  static extractVideoId(url: string): string | null {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }

  static async getVideoMetadata(videoId: string): Promise<VideoMetadata | null> {
    try {
      const response = await youtube.videos.list({
        part: ['snippet', 'statistics', 'contentDetails'],
        id: [videoId],
      });

      const video = response.data.items?.[0];
      if (!video) return null;

      const snippet = video.snippet!;
      const statistics = video.statistics!;
      const contentDetails = video.contentDetails!;

      return {
        id: videoId,
        title: snippet.title || '',
        description: snippet.description || '',
        duration: this.formatDuration(contentDetails.duration || ''),
        viewCount: statistics.viewCount || '0',
        publishedAt: snippet.publishedAt || '',
        channelTitle: snippet.channelTitle || '',
        thumbnailUrl: snippet.thumbnails?.high?.url || '',
      };
    } catch (error) {
      console.error('Error fetching video metadata:', error);
      return null;
    }
  }

  static async getVideoTranscript(videoId: string): Promise<TranscriptSegment[]> {
    // Try Node.js library first
    try {
      const transcript = await YoutubeTranscript.fetchTranscript(videoId, {
        lang: 'en'
      });
      
      return transcript.map((segment) => ({
        text: segment.text,
        start: segment.offset,
        duration: segment.duration,
      }));
    } catch (nodeError) {
      console.error('Node.js transcript fetch failed:', nodeError);
      
      // Fallback to Python API
      try {
        console.log('Trying Python transcript API as fallback...');
        const response = await fetch('/api/transcript', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ videoId }),
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const result = await response.json();
        
        if (result.success && result.transcript) {
          // Convert Python API format to our format
          return result.transcript.map((segment: any) => ({
            text: segment.text,
            start: segment.start || 0,
            duration: segment.duration || 1,
          }));
        } else {
          console.error('Python API error:', result.error);
          return [];
        }
      } catch (pythonError) {
        console.error('Python transcript fetch also failed:', pythonError);
        return [];
      }
    }
  }

  static formatDuration(duration: string): string {
    // Convert ISO 8601 duration (PT4M13S) to human readable (4:13)
    const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
    const matches = duration.match(regex);
    
    if (!matches) return '0:00';
    
    const hours = parseInt(matches[1] || '0');
    const minutes = parseInt(matches[2] || '0');
    const seconds = parseInt(matches[3] || '0');
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  static calculateReadingTime(text: string): number {
    const wordsPerMinute = 200; // Average reading speed
    const wordCount = text.split(' ').length;
    return Math.ceil(wordCount / wordsPerMinute);
  }
}