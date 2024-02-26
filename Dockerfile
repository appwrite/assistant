FROM node:18

WORKDIR /usr/src/app

RUN npm install -g pnpm

COPY package.json ./
COPY pnpm-lock.yaml ./

RUN pnpm --prod install

ENV _BUILD_WEBSITE_URL=''
ENV _BUILD_WEBSITE_VERSION=''
ENV _BUILD_GIT_URL=''
ENV _BUILD_GIT_BRANCH=''

COPY . .

RUN pnpm run fetch-sources

ENV _APP_ASSISTANT_OPENAI_API_KEY=''

EXPOSE 3003
CMD [ "pnpm", "start" ]