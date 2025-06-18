import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export class LLMService {
    static async summarize(transcript: string): Promise<string> {
        try {
            if (!process.env.OPENAI_API_KEY) {
                throw new Error('OpenAI API key not configured');
            }

            // Chunk transcript if too long (GPT-4 has ~8k token context)
            const maxChunkSize = 6000; // Conservative token estimate
            const chunks = this.chunkText(transcript, maxChunkSize);

            if (chunks.length === 1) {
                return this.summarizeChunk(chunks[0]);
            } else {
                // Summarize each chunk then combine
                const chunkSummaries = await Promise.all(
                    chunks.map(chunk => this.summarizeChunk(chunk))
                );

                // Combine chunk summaries into final summary
                return this.combineSummaries(chunkSummaries);
            }

        } catch (error) {
            console.error('LLM summarization error:', error);
            throw new Error(
                error instanceof Error
                    ? error.message
                    : 'Failed to generate summary'
            );
        }
    }

    private static chunkText(text: string, maxSize: number): string[] {
        if (text.length <= maxSize) {
            return [text];
        }

        const chunks: string[] = [];
        let currentChunk = '';
        const sentences = text.split(/[.!?]+\s+/);

        for (const sentence of sentences) {
            if ((currentChunk + sentence).length > maxSize && currentChunk) {
                chunks.push(currentChunk.trim());
                currentChunk = sentence;
            } else {
                currentChunk += (currentChunk ? '. ' : '') + sentence;
            }
        }

        if (currentChunk) {
            chunks.push(currentChunk.trim());
        }

        return chunks;
    }

    private static async summarizeChunk(chunk: string): Promise<string> {
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: 'You are a helpful assistant that creates concise, informative summaries of video transcripts. Focus on key points, main arguments, and actionable insights.'
                },
                {
                    role: 'user',
                    content: `Please provide a clear, structured summary of this video transcript:\n\n${chunk}`
                }
            ],
            max_tokens: 500,
            temperature: 0.3,
        });

        return response.choices[0]?.message?.content || 'Summary could not be generated';
    }

    private static async combineSummaries(summaries: string[]): Promise<string> {
        const combinedText = summaries.join('\n\n');

        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: 'You are a helpful assistant that combines multiple summary segments into a single, coherent summary. Maintain the key points while removing redundancy.'
                },
                {
                    role: 'user',
                    content: `Please combine these summary segments into one comprehensive summary:\n\n${combinedText}`
                }
            ],
            max_tokens: 800,
            temperature: 0.3,
        });

        return response.choices[0]?.message?.content || 'Combined summary could not be generated';
    }
} 