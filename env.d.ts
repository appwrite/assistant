declare global {
  namespace NodeJS {
    interface ProcessEnv {
      _APP_ASSISTANT_OPENAI_API_KEY?: string;
      _BUILD_WEBSITE_URL?: string;
      _BUILD_WEBSITE_VERSION?: string;
      _BUILD_GIT_URL?: string;
    }
  }
}

export {};
