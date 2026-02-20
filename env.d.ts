declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // LLM — Anthropic (primary)
      _APP_ASSISTANT_ANTHROPIC_API_KEY?: string;

      // LLM — OpenAI (used only for embeddings/RAG)
      _APP_ASSISTANT_OPENAI_API_KEY?: string;

      // Observability — Langfuse
      _APP_ASSISTANT_LANGFUSE_PUBLIC_KEY?: string;
      _APP_ASSISTANT_LANGFUSE_SECRET_KEY?: string;
      _APP_ASSISTANT_LANGFUSE_HOST?: string;

      // Doc sources
      _BUILD_WEBSITE_URL?: string;
      _BUILD_WEBSITE_VERSION?: string;
      _BUILD_GIT_URL?: string;
      _BUILD_GIT_BRANCH?: string;
    }
  }
}

export {};
