FROM node:18

WORKDIR /usr/src/app

RUN npm install -g pnpm

COPY package.json ./
COPY pnpm-lock.yaml ./

RUN pnpm --prod install

COPY . .

RUN pnpm run fetch-sources

EXPOSE 3003
CMD [ "pnpm", "start" ]