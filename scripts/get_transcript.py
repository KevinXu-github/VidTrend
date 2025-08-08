#!/usr/bin/env python3

import sys
import json
import re
from youtube_transcript_api import YouTubeTranscriptApi

def extract_video_id(url):
    """Extract video ID from YouTube URL"""
    patterns = [
        r'(?:youtube\.com/watch\?v=|youtu\.be/|youtube\.com/embed/)([^&\n?#]+)',
        r'youtube\.com/watch\?.*v=([^&\n?#]+)'
    ]
    
    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)
    return None

def get_transcript(video_id):
    """Get transcript for a YouTube video"""
    try:
        # Create API instance
        api = YouTubeTranscriptApi()
        
        # Try to get transcript with different language preferences
        language_codes = ['en', 'en-US', 'en-GB', 'en-CA']
        
        try:
            # Use the fetch method directly
            transcript = api.fetch(video_id, languages=language_codes)
            return {
                'success': True,
                'transcript': transcript,
                'language': 'found',
                'full_text': ' '.join([entry['text'] for entry in transcript])
            }
        except Exception as fetch_error:
            # Try to list available transcripts and pick the first one
            try:
                transcript_list = api.list(video_id)
                # Get the first available transcript
                for transcript_obj in transcript_list:
                    try:
                        transcript_data = transcript_obj.fetch()
                        return {
                            'success': True,
                            'transcript': transcript_data,
                            'language': transcript_obj.language_code,
                            'full_text': ' '.join([entry['text'] for entry in transcript_data])
                        }
                    except Exception:
                        continue
                
                # If we get here, no transcripts could be fetched
                return {
                    'success': False,
                    'error': f'No accessible transcripts found for video ID: {video_id}',
                    'transcript': [],
                    'full_text': ''
                }
                
            except Exception as list_error:
                return {
                    'success': False,
                    'error': f'No transcript available for video ID: {video_id}. Error: {str(list_error)}',
                    'transcript': [],
                    'full_text': ''
                }
            
    except Exception as e:
        return {
            'success': False,
            'error': f'Unexpected error: {str(e)}',
            'transcript': [],
            'full_text': ''
        }

def main():
    if len(sys.argv) != 2:
        print(json.dumps({
            'success': False,
            'error': 'Usage: python get_transcript.py <video_id_or_url>'
        }))
        sys.exit(1)
    
    input_arg = sys.argv[1]
    
    # Check if input is a URL or video ID
    if 'youtube.com' in input_arg or 'youtu.be' in input_arg:
        video_id = extract_video_id(input_arg)
        if not video_id:
            print(json.dumps({
                'success': False,
                'error': 'Could not extract video ID from URL'
            }))
            sys.exit(1)
    else:
        video_id = input_arg
    
    result = get_transcript(video_id)
    print(json.dumps(result, ensure_ascii=False))

if __name__ == "__main__":
    main()