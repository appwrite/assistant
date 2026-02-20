FROM node:18-alpine AS base

RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    build-base \
    git

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN corepack prepare pnpm@10.13.1 --activate

FROM base AS builder

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod

COPY . .

ARG _BUILD_GIT_URL
ARG _BUILD_GIT_BRANCH
ARG _BUILD_WEBSITE_URL
ARG _BUILD_WEBSITE_VERSION
ARG SKIP_FETCH_SOURCES=false

ENV _BUILD_GIT_URL=${_BUILD_GIT_URL}
ENV _BUILD_GIT_BRANCH=${_BUILD_GIT_BRANCH}
ENV _BUILD_WEBSITE_URL=${_BUILD_WEBSITE_URL}
ENV _BUILD_WEBSITE_VERSION=${_BUILD_WEBSITE_VERSION}

RUN if [ "$SKIP_FETCH_SOURCES" = "true" ]; then mkdir -p sources; else pnpm run fetch-sources; fi

FROM node:18-alpine AS prod

ENV NODE_ENV=production
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable
RUN corepack prepare pnpm@10.13.1 --activate

WORKDIR /usr/src/app

ARG SKIP_FETCH_SOURCES=false

COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/sources ./sources
COPY --from=builder /usr/src/app/package.json ./
COPY --from=builder /usr/src/app/src ./src

ENV _APP_ASSISTANT_OPENAI_API_KEY=''

EXPOSE 3003
CMD [ "node", "src/main.js" ]
