declare global {
  namespace NodeJS {
    interface ProcessEnv {
      _APP_ASSISTANT_OPENAI_API_KEY?: string;
      _APP_ASSISTANT_BASE_URL?: string;
      _APP_ASSISTANT_MODEL_NAME?: string;
      _APP_ASSISTANT_EMBEDDING_MODEL?: string;
      _BUILD_WEBSITE_URL?: string;
      _BUILD_WEBSITE_VERSION?: string;
      _BUILD_GIT_URL?: string;
    }
  }
}

export {};
