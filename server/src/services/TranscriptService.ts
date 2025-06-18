import { YoutubeTranscript } from 'youtube-transcript';

export class TranscriptService {
    static async fetchTranscript(url: string): Promise<string> {
        try {
            // Extract video ID from YouTube URL
            const videoId = this.extractVideoId(url);
            if (!videoId) {
                throw new Error('Invalid YouTube URL');
            }

            // Fetch transcript
            const transcriptArray = await YoutubeTranscript.fetchTranscript(videoId);

            // Combine transcript text
            const fullTranscript = transcriptArray
                .map(item => item.text)
                .join(' ')
                .replace(/\s+/g, ' ')
                .trim();

            if (!fullTranscript) {
                throw new Error('No transcript available for this video');
            }

            return fullTranscript;

        } catch (error) {
            console.error('Transcript fetch error:', error);
            throw new Error(
                error instanceof Error
                    ? error.message
                    : 'Failed to fetch transcript'
            );
        }
    }

    private static extractVideoId(url: string): string | null {
        try {
            const urlObj = new URL(url);

            // Handle different YouTube URL formats
            if (urlObj.hostname.includes('youtube.com')) {
                return urlObj.searchParams.get('v');
            } else if (urlObj.hostname.includes('youtu.be')) {
                return urlObj.pathname.slice(1);
            }

            return null;
        } catch {
            return null;
        }
    }
} 