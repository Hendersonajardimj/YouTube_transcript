import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../index';
import { TranscriptService } from '../services/TranscriptService';
import { LLMService } from '../services/LLMService';

const router = Router();

// Validation schemas
const ProcessRequestSchema = z.object({
    url: z.string().url('Invalid URL format'),
});

// POST /api/process - Process a YouTube URL
router.post('/process', async (req: Request, res: Response) => {
    try {
        const { url } = ProcessRequestSchema.parse(req.body);

        // Check if we already have this transcript
        const existing = await prisma.transcript.findUnique({
            where: { url }
        });

        if (existing) {
            return res.json({
                status: existing.status,
                id: existing.id,
                transcript: existing.transcript,
                summary: existing.summary,
                createdAt: existing.createdAt
            });
        }

        // Create initial record
        const record = await prisma.transcript.create({
            data: {
                id: uuidv4(),
                url,
                transcript: '',
                status: 'processing'
            }
        });

        // Start processing in background (for now, we'll do it synchronously for MVP)
        try {
            const transcript = await TranscriptService.fetchTranscript(url);
            const summary = await LLMService.summarize(transcript);

            const updated = await prisma.transcript.update({
                where: { id: record.id },
                data: {
                    transcript,
                    summary,
                    status: 'completed'
                }
            });

            res.json({
                status: 'completed',
                id: updated.id,
                transcript: updated.transcript,
                summary: updated.summary,
                createdAt: updated.createdAt
            });

        } catch (error) {
            await prisma.transcript.update({
                where: { id: record.id },
                data: { status: 'failed' }
            });

            console.error('Processing error:', error);
            res.status(500).json({
                error: 'Failed to process transcript',
                message: error instanceof Error ? error.message : 'Unknown error'
            });
        }

    } catch (error) {
        console.error('Request error:', error);
        res.status(400).json({
            error: 'Invalid request',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

// GET /api/status/:id - Check processing status
router.get('/status/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const record = await prisma.transcript.findUnique({
            where: { id }
        });

        if (!record) {
            return res.status(404).json({ error: 'Record not found' });
        }

        res.json({
            status: record.status,
            id: record.id,
            transcript: record.transcript,
            summary: record.summary,
            createdAt: record.createdAt
        });

    } catch (error) {
        console.error('Status check error:', error);
        res.status(500).json({
            error: 'Failed to check status',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

// GET /api/list - List recent transcripts
router.get('/list', async (req: Request, res: Response) => {
    try {
        const records = await prisma.transcript.findMany({
            orderBy: { createdAt: 'desc' },
            take: 50,
            select: {
                id: true,
                url: true,
                status: true,
                createdAt: true,
                summary: true
            }
        });

        res.json({ transcripts: records });

    } catch (error) {
        console.error('List error:', error);
        res.status(500).json({
            error: 'Failed to fetch transcripts',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

export { router as apiRouter }; 