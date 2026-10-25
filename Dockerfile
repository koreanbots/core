FROM node:20.11-alpine

RUN apk add --no-cache python3 py3-pip build-base

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production=true && yarn cache clean

COPY next.config.js ./
COPY public ./public
COPY .next ./.next

CMD ["yarn", "start"]