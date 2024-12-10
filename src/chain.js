import { RunnableSequence } from "@langchain/core/runnables";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatOpenAI } from "@langchain/openai";
import { getRetriever } from "./retriever.js"; // Your retriever that returns a BaseRetriever
import { formatDocumentsAsString } from "langchain/util/document"; // Ensure this import path is correct

export const getChain = async () => {
    const retriever = await getRetriever();

    return RunnableSequence.from([
        // First step: extract userPrompt and systemPrompt, run the retrieval, and format the context.
        async ({ userPrompt, systemPrompt }) => {
            const docs = await retriever.invoke(userPrompt);
            const context = await formatDocumentsAsString(docs);
            return { userPrompt, systemPrompt, context };
        },

        // Now that we have { userPrompt, systemPrompt, context }, we can create the prompt template.
        ChatPromptTemplate.fromMessages([
            ["system", "{systemPrompt}"],
            ["assistant", "Context: {context}"],
            ["human", "Question: {userPrompt}"]
        ]),

        // The model will receive the processed template as input
        new ChatOpenAI({
            model: process.env._APP_ASSISTANT_OPENAI_MODEL || 'gpt-4o',
            openAIApiKey: process.env._APP_ASSISTANT_OPENAI_API_KEY,
            temperature: Number(process.env._APP_ASSISTANT_TEMPERATURE || '0.1'),
            maxTokens: Number(process.env._APP_ASSISTANT_MAX_TOKENS || '1000'),
        }),

        // Finally, parse the output string
        new StringOutputParser(),
    ]);
};
