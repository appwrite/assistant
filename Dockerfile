# Stage 1: Build
FROM node:18-slim AS build

RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    python3-pip \
    build-essential \
    git \
    && rm -rf /var/lib/apt/lists/*

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /usr/src/app

COPY package.json ./
COPY pnpm-lock.yaml ./

RUN pnpm --prod install

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

# Stage 2: Runtime
FROM node:18-slim AS runtime

WORKDIR /usr/src/app

COPY --from=build /usr/src/app .

RUN rm -rf /usr/src/app/node_modules/.cache

ENV _APP_ASSISTANT_OPENAI_API_KEY=''

EXPOSE 3003
CMD [ "pnpm", "start" ]