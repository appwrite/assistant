FROM node:18-slim AS base

RUN apt-get update && apt-get install -y python3 make g++ git

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN corepack prepare pnpm@10.0.0 --activate

FROM base AS builder

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod

COPY . .

ARG _BUILD_GIT_URL
ARG _BUILD_GIT_BRANCH
ARG _BUILD_WEBSITE_URL
ARG _BUILD_WEBSITE_VERSION

ENV _BUILD_GIT_URL=${_BUILD_GIT_URL}
ENV _BUILD_GIT_BRANCH=${_BUILD_GIT_BRANCH}
ENV _BUILD_WEBSITE_URL=${_BUILD_WEBSITE_URL}
ENV _BUILD_WEBSITE_VERSION=${_BUILD_WEBSITE_VERSION}

RUN pnpm run fetch-sources

FROM node:18-slim AS prod

ENV NODE_ENV=production
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable
RUN corepack prepare pnpm@10.0.0 --activate

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/node_modules /usr/src/app/node_modules
COPY --from=builder /usr/src/app/sources /usr/src/app/sources
COPY --from=builder /usr/src/app/package.json /usr/src/app/
COPY --from=builder /usr/src/app/src /usr/src/app/src

ENV _APP_ASSISTANT_OPENAI_API_KEY=''

EXPOSE 3003
CMD [ "node", "src/main.js" ]
