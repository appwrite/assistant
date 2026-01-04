FROM oven/bun:alpine AS base

RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    build-base \
    git

FROM base AS builder

WORKDIR /usr/src/app

COPY package.json bun.lock* ./

RUN bun install --frozen-lockfile --production

COPY src ./src
COPY scripts ./scripts

ARG _BUILD_GIT_BRANCH=main
ARG _BUILD_WEBSITE_VERSION=cloud
ARG _BUILD_WEBSITE_URL=https://appwrite.io
ARG _BUILD_GIT_URL=https://github.com/appwrite/website.git

ENV _BUILD_GIT_URL=${_BUILD_GIT_URL}
ENV _BUILD_GIT_BRANCH=${_BUILD_GIT_BRANCH}
ENV _BUILD_WEBSITE_URL=${_BUILD_WEBSITE_URL}
ENV _BUILD_WEBSITE_VERSION=${_BUILD_WEBSITE_VERSION}

RUN bun run fetch-sources

ARG _APP_ASSISTANT_OPENAI_API_KEY
ENV _APP_ASSISTANT_OPENAI_API_KEY=${_APP_ASSISTANT_OPENAI_API_KEY}

RUN bun build src/main.js \
    --outdir ./dist \
    --target bun \
    --minify \
    --sourcemap=none \
    --external hnswlib-node

FROM oven/bun:alpine AS prod

ENV NODE_ENV=production

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/sources ./sources
COPY --from=builder /usr/src/app/package.json ./package.json
COPY --from=builder /usr/src/app/node_modules ./node_modules

ENV _APP_ASSISTANT_OPENAI_API_KEY=''
ENV _APP_ASSISTANT_OPENAI_MODEL='gpt-4o'

EXPOSE 3003
CMD [ "bun", "dist/main.js" ]
