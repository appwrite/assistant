import { createAnthropic } from '@ai-sdk/anthropic';
import { streamText, tool } from 'ai';
import { Langfuse } from 'langfuse';
import { z } from 'zod';

// ---------------------------------------------------------------------------
// Langfuse — disabled gracefully when keys are not set
// ---------------------------------------------------------------------------
const langfuse = new Langfuse({
    publicKey: process.env._APP_ASSISTANT_LANGFUSE_PUBLIC_KEY ?? '',
    secretKey: process.env._APP_ASSISTANT_LANGFUSE_SECRET_KEY ?? '',
    baseUrl: process.env._APP_ASSISTANT_LANGFUSE_HOST ?? 'https://cloud.langfuse.com',
    flushAt: 1,
    enabled: !!(
        process.env._APP_ASSISTANT_LANGFUSE_PUBLIC_KEY &&
        process.env._APP_ASSISTANT_LANGFUSE_SECRET_KEY
    ),
});

// ---------------------------------------------------------------------------
// Anthropic client
// ---------------------------------------------------------------------------
const anthropic = createAnthropic({
    apiKey: process.env._APP_ASSISTANT_ANTHROPIC_API_KEY,
});

// ---------------------------------------------------------------------------
// Client-side tools
// These are declared server-side so the LLM knows about them, but executed
// client-side (frontend calls sdk-for-console using the user's own session).
// No execute() = client-side tool in AI SDK.
// ---------------------------------------------------------------------------
const ALL_TOOLS = {
    getBillingPlan: tool({
        description:
            'Get the current billing plan, limits, and next invoice date for the organization.',
        parameters: z.object({
            orgId: z.string().describe('The organization ID'),
        }),
    }),
    getProjectUsage: tool({
        description: 'Get bandwidth, storage, and request counts for a project.',
        parameters: z.object({
            projectId: z.string().describe('The project ID'),
        }),
    }),
    listApiKeys: tool({
        description: 'List all API keys for a project.',
        parameters: z.object({
            projectId: z.string().describe('The project ID'),
        }),
    }),
    listUsers: tool({
        description: 'List users in a project.',
        parameters: z.object({
            projectId: z.string().describe('The project ID'),
        }),
    }),
    createApiKey: tool({
        description:
            'Create a new API key for a project. Requires explicit user approval before executing.',
        parameters: z.object({
            projectId: z.string().describe('The project ID'),
            name: z.string().describe('Name for the API key'),
            scopes: z.array(z.string()).describe('Permission scopes (e.g. ["users.read"])'),
            expire: z
                .string()
                .nullable()
                .optional()
                .describe('Expiry date in ISO 8601 format, or null for no expiry'),
        }),
    }),
};

/** Tools available per tier granted by the PHP gateway */
const TIER_TOOLS = {
    none: [],
    read: ['getBillingPlan', 'getProjectUsage', 'listApiKeys', 'listUsers'],
    readwrite: ['getBillingPlan', 'getProjectUsage', 'listApiKeys', 'listUsers', 'createApiKey'],
};

// ---------------------------------------------------------------------------
// System prompt
// ---------------------------------------------------------------------------
/**
 * @param {string} docsContext   Relevant doc chunks from RAG retrieval
 * @param {object} context       Console context injected from the frontend
 */
function buildSystemPrompt(docsContext, context) {
    const lines = [
        'You are an expert Appwrite assistant embedded in the Appwrite Console.',
        'You help developers with three types of requests:',
        '',
        '1. **Documentation questions** — answer using the provided Appwrite documentation.',
        '2. **Error diagnosis** — analyse the error and suggest a fix, referencing the docs.',
        '3. **Implementation guidance** — give step-by-step ideas with code examples.',
        '',
        'Rules:',
        '- Only answer Appwrite-related questions.',
        '- Show code examples using the Web or Node.js SDK unless otherwise specified.',
        '- When you need live data (usage, billing, API keys, users) use the available tools.',
        '- For write actions, always describe what you will do before calling the tool.',
        '- Be concise and developer-friendly.',
        '- If a question is unrelated to Appwrite, politely decline.',
    ];

    if (context && Object.keys(context).length > 0) {
        lines.push('', '## Current Console Context');
        if (context.page) lines.push(`- Page: ${context.page}`);
        if (context.projectId) lines.push(`- Project ID: ${context.projectId}`);
        if (context.orgId) lines.push(`- Organization ID: ${context.orgId}`);
        if (context.plan) lines.push(`- Billing plan: ${context.plan}`);
        if (context.error) lines.push(`- Error visible on screen: \`${context.error}\``);
    }

    if (docsContext) {
        lines.push(
            '',
            '## Relevant Documentation',
            'Use the excerpts below to answer. Cite the source URL when applicable.',
            '',
            docsContext,
        );
    }

    return lines.join('\n');
}

// ---------------------------------------------------------------------------
// SSE helpers
// ---------------------------------------------------------------------------
/** @param {import('express').Response} res */
function setSseHeaders(res) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();
}

/**
 * @param {import('express').Response} res
 * @param {object} payload
 */
function writeEvent(res, payload) {
    res.write(`data: ${JSON.stringify(payload)}\n\n`);
}

// ---------------------------------------------------------------------------
// Main streaming function
// ---------------------------------------------------------------------------
/**
 * Stream an assistant turn.
 *
 * @param {object}                       params
 * @param {import('ai').CoreMessage[]}   params.messages   Full conversation (includes current user message)
 * @param {object}                       params.context    Console context from frontend
 * @param {string}                       params.model      Anthropic model ID
 * @param {'none'|'read'|'readwrite'}   params.toolTier   Access level granted by PHP gateway
 * @param {object}                       params.retriever  LangChain retriever (HNSWLib)
 * @param {string}                       params.traceId    Langfuse trace ID
 * @param {string}                       params.userId     Appwrite user ID (for tracing)
 * @param {import('express').Response}   params.res        Express response stream
 */
export async function streamAssistantResponse({
    messages,
    context,
    model,
    toolTier,
    retriever,
    traceId,
    userId,
    res,
}) {
    setSseHeaders(res);

    // Extract last user message text for RAG retrieval
    const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user');
    const queryText =
        typeof lastUserMessage?.content === 'string'
            ? lastUserMessage.content
            : (lastUserMessage?.content?.find?.((p) => p.type === 'text')?.text ?? '');

    let docsContext = '';
    let sources = [];

    try {
        if (queryText && retriever) {
            const span = langfuse.trace({ id: traceId }).span({
                name: 'rag-retrieval',
                input: queryText,
            });

            const relevantDocs = await retriever.getRelevantDocuments(queryText);

            docsContext = relevantDocs.map((d) => d.pageContent).join('\n\n---\n\n');
            sources = [...new Set(relevantDocs.map((d) => d.metadata?.url).filter(Boolean))];

            span.end({ output: { docsCount: relevantDocs.length, sources } });
        }
    } catch (ragErr) {
        // RAG failure is non-fatal — continue without docs context
        console.error('[assistant] RAG retrieval failed:', ragErr.message);
    }

    // Select tools based on gateway-granted tier
    const allowedToolNames = TIER_TOOLS[toolTier] ?? [];
    const activeTools =
        allowedToolNames.length > 0
            ? Object.fromEntries(
                  Object.entries(ALL_TOOLS).filter(([name]) => allowedToolNames.includes(name)),
              )
            : undefined;

    // Langfuse generation span
    const trace = langfuse.trace({
        id: traceId,
        name: 'console-assistant',
        userId,
        metadata: { ...context, model, toolTier, sourcesCount: sources.length },
    });

    const generation = trace.generation({
        name: 'llm-call',
        model,
        input: messages,
        metadata: { sources, toolTier },
    });

    try {
        const result = streamText({
            model: anthropic(model),
            system: buildSystemPrompt(docsContext, context),
            messages,
            tools: activeTools,
            // maxSteps: 1 — client handles tool execution; one LLM step per HTTP request
            maxSteps: 1,
            experimental_telemetry: { isEnabled: true, functionId: 'console-assistant' },
        });

        let fullText = '';
        let toolCallEmitted = false;

        for await (const chunk of result.fullStream) {
            switch (chunk.type) {
                case 'text-delta':
                    fullText += chunk.textDelta;
                    writeEvent(res, { event: 'text', text: chunk.textDelta });
                    break;

                case 'tool-call':
                    toolCallEmitted = true;
                    writeEvent(res, {
                        event: 'tool_call',
                        toolCallId: chunk.toolCallId,
                        name: chunk.toolName,
                        args: chunk.args,
                    });
                    break;

                case 'error':
                    console.error('[assistant] stream error event:', chunk.error);
                    writeEvent(res, {
                        event: 'error',
                        message: chunk.error?.message ?? 'Stream error',
                    });
                    break;

                default:
                    break;
            }
        }

        // Append source URLs after text (only when no tool call was emitted)
        if (!toolCallEmitted && sources.length > 0) {
            const sourceText = '\n\nSources:\n' + sources.map((s) => `- ${s}`).join('\n');
            writeEvent(res, { event: 'text', text: sourceText });
            fullText += sourceText;
        }

        writeEvent(res, { event: 'done' });

        // Finalise Langfuse spans
        generation.end({ output: toolCallEmitted ? '[tool_call]' : fullText });
    } catch (err) {
        console.error('[assistant] streamText error:', err);
        writeEvent(res, { event: 'error', message: err.message ?? 'Unexpected error' });
        generation.end({ output: `[error] ${err.message}`, level: 'ERROR' });
    } finally {
        res.end();
        await langfuse.flushAsync().catch(() => {});
    }
}

/**
 * Submit a user feedback score for a previous trace.
 *
 * @param {object} params
 * @param {string} params.traceId  Langfuse trace ID from the assistant response.
 * @param {number} params.score    1 = positive, 0 = negative.
 */
export async function submitFeedback({ traceId, score }) {
    try {
        langfuse.score({
            traceId,
            name: 'user-feedback',
            value: score,
        });
        await langfuse.flushAsync().catch(() => {});
    } catch (err) {
        console.error('[assistant] submitFeedback error:', err);
    }
}
