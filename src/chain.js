import { RunnableSequence } from "@langchain/core/runnables";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import { getRetriever } from "./retriever.js";
import { formatDocumentsAsString } from "langchain/util/document";


export const getChain = async () => {
    const retriever = await getRetriever();

    return RunnableSequence.from([
        async ({ messages, systemPrompt }) => {
            // Extract the last user message
            const lastUserMessage = messages.reverse().find(m => m.role === 'user');
            if (!lastUserMessage) {
                throw new Error("No user message found in messages array.");
            }

            // Run retrieval on the last user message
            const docs = await retriever.invoke(lastUserMessage.content);
            const context = await formatDocumentsAsString(docs);

            return { messages, systemPrompt, context };
        },
        ChatPromptTemplate.fromMessages([
            { role: 'system', content: '{systemPrompt}' },
            new MessagesPlaceholder('messages'),
            { role: 'assistant', content: 'Context: {context}' },
        ]),
        // Run the ChatPromptTemplate through the model
        new ChatOpenAI({
            model: process.env._APP_ASSISTANT_OPENAI_MODEL || 'gpt-4',
            openAIApiKey: process.env._APP_ASSISTANT_OPENAI_API_KEY,
            temperature: Number(process.env._APP_ASSISTANT_TEMPERATURE || '0.1'),
            maxTokens: Number(process.env._APP_ASSISTANT_MAX_TOKENS || '1000'),
            streaming: true
        }),
    ]);
};