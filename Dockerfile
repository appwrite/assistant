FROM node:18-alpine AS base

RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    build-base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS builder

COPY package.json pnpm-lock.yaml /app/
WORKDIR /app

RUN pnpm fetch --prod

COPY . /app

RUN pnpm install

ARG _BUILD_GIT_URL
ARG _BUILD_GIT_BRANCH
ARG _BUILD_WEBSITE_URL
ARG _BUILD_WEBSITE_VERSION

ENV _BUILD_GIT_URL=${_BUILD_GIT_URL}
ENV _BUILD_GIT_BRANCH=${_BUILD_GIT_BRANCH}
ENV _BUILD_WEBSITE_URL=${_BUILD_WEBSITE_URL}
ENV _BUILD_WEBSITE_VERSION=${_BUILD_WEBSITE_VERSION}

RUN pnpm run fetch-sources

FROM base

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/node_modules /usr/src/app/node_modules
COPY --from=builder /usr/src/app/index /usr/src/app/index
COPY --from=builder /usr/src/app/package.json /usr/src/app/

ENV _APP_ASSISTANT_OPENAI_API_KEY=''

EXPOSE 3003
CMD [ "pnpm", "start" ]