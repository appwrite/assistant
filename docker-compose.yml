version: '3.8'

services:
  assistant:
    build: .
    ports:
      - 3003:3003
    volumes:
      - ./docs:/app/docs
    environment:
      - _APP_ASSISTANT_OPENAI_API_KEY
