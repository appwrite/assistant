FROM node:18

WORKDIR /usr/src/app

COPY package.json ./
COPY pnpm-lock.yaml ./

RUN npm install -g pnpm

RUN pnpm --prod install

COPY . .

RUN git submodule update --init --recursive

ENV _APP_ASSISTANT_OPENAI_API_KEY=''

EXPOSE 3003
CMD [ "node", "main.js" ]