import 'dotenv/config';
import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import { initializeDocumentRetriever } from './embeddings.js';
import { streamAssistantResponse, submitFeedback } from './chat.js';

const app = express();
const port = 3003;

app.use(cors({ origin: '*' }));
app.use(bodyParser.raw({ inflate: true, type: '*/*' }));

/** @type {import('langchain/schema/retriever').BaseRetriever | null} */
let retriever = null;

// ---------------------------------------------------------------------------
// POST /v1/models/assistant/prompt
//
// Request body (JSON):
// {
//   messages:  CoreMessage[]  Full conversation including the current user turn.
//              At minimum: [{ role: 'user', content: '<prompt>' }]
//   context:   object         Console page/project/org context (optional)
//   model:     string         Anthropic model ID (set by PHP gateway, optional)
//   toolTier:  string         'none' | 'read' | 'readwrite' (set by PHP gateway)
//   traceId:   string         Langfuse trace ID (optional, auto-generated if absent)
//   userId:    string         Appwrite user ID for tracing (optional)
// }
//
// Response: text/event-stream
// Events: { event:'text', text:'...' }
//         { event:'tool_call', toolCallId:'...', name:'...', args:{} }
//         { event:'done' }
//         { event:'error', message:'...' }
// ---------------------------------------------------------------------------
app.post('/v1/models/assistant/prompt', async (req, res) => {
    if (!retriever) {
        res.status(503).json({ error: 'Search index not yet initialized. Try again shortly.' });
        return;
    }

    let body;
    try {
        const decoder = new TextDecoder();
        body = JSON.parse(decoder.decode(req.body));
    } catch {
        res.status(400).json({ error: 'Invalid JSON body' });
        return;
    }

    const {
        messages,
        context = {},
        model = 'claude-haiku-4-5-20251001',
        toolTier = 'none',
        traceId = crypto.randomUUID(),
        userId = 'anonymous',
    } = body;

    if (!Array.isArray(messages) || messages.length === 0) {
        res.status(400).json({ error: '`messages` must be a non-empty array' });
        return;
    }

    await streamAssistantResponse({
        messages,
        context,
        model,
        toolTier,
        retriever,
        traceId,
        userId,
        res,
    });
});

// ---------------------------------------------------------------------------
// POST /v1/feedback/score
//
// Request body (JSON):
// { traceId: string, score: number }   score: 1 = positive, 0 = negative
// ---------------------------------------------------------------------------
app.post('/v1/feedback/score', async (req, res) => {
    let body;
    try {
        const decoder = new TextDecoder();
        body = JSON.parse(decoder.decode(req.body));
    } catch {
        res.status(400).json({ error: 'Invalid JSON body' });
        return;
    }

    const { traceId, score } = body;

    if (!traceId || typeof score !== 'number') {
        res.status(400).json({ error: '`traceId` and numeric `score` are required' });
        return;
    }

    await submitFeedback({ traceId, score });
    res.status(204).end();
});

// ---------------------------------------------------------------------------
// GET /v1/health
// ---------------------------------------------------------------------------
app.get('/v1/health', (_, res) => {
    res.json({ status: 'ok', indexReady: retriever !== null });
});

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------
app.listen(port, async () => {
    console.log(`[assistant] Server listening on port ${port}`);
    console.log('[assistant] Initializing RAG search index...');
    try {
        retriever = await initializeDocumentRetriever();
        console.log('[assistant] Search index ready');
    } catch (err) {
        console.error('[assistant] Failed to initialize search index:', err);
    }
});
