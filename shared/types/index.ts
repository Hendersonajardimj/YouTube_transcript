// Shared types for YouTube Transcript App
export interface Transcript {
    id: string;
    url: string;
    transcript: string;
    summary: string | null;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    createdAt: string;
    updatedAt: string;
}

export interface ProcessRequest {
    url: string;
}

export interface ProcessResponse {
    status: string;
    id: string;
    transcript: string;
    summary: string | null;
    createdAt: string;
}

export interface StatusResponse {
    status: string;
    id: string;
    transcript: string;
    summary: string | null;
    createdAt: string;
}

export interface ListResponse {
    transcripts: Pick<Transcript, 'id' | 'url' | 'status' | 'createdAt' | 'summary'>[];
}

export interface ErrorResponse {
    error: string;
    message: string;
}

// API endpoint types
export type ApiEndpoints = {
    '/api/process': {
        POST: {
            body: ProcessRequest;
            response: ProcessResponse | ErrorResponse;
        };
    };
    '/api/status/:id': {
        GET: {
            response: StatusResponse | ErrorResponse;
        };
    };
    '/api/list': {
        GET: {
            response: ListResponse | ErrorResponse;
        };
    };
    '/health': {
        GET: {
            response: { status: string; timestamp: string };
        };
    };
}; 