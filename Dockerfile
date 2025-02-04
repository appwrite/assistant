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
RUN corepack prepare pnpm@10.0.0 --activate

FROM base AS builder

COPY package.json pnpm-lock.yaml /usr/src/app/
WORKDIR /usr/src/app

RUN pnpm fetch --prod

COPY . /usr/src/app

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
COPY --from=builder /usr/src/app/sources /usr/src/app/sources
COPY --from=builder /usr/src/app/package.json /usr/src/app/
COPY --from=builder /usr/src/app/src /usr/src/app/src

ENV _APP_ASSISTANT_OPENAI_API_KEY=''

EXPOSE 3003
CMD [ "node", "src/main.js" ]
