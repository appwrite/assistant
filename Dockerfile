FROM node:18

WORKDIR /usr/src/app

COPY package.json ./
COPY pnpm-lock.yaml ./

RUN npm install -g pnpm

RUN pnpm --prod install

COPY . .

ENV OPENAI_API_KEY='' \
    ASSISTANT_SECRET=''

EXPOSE 3003
CMD [ "node", "main.js" ]