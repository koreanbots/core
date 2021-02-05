FROM node:14.15-alpine

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Get Argument
ARG SOURCE_COMMIT
ENV SOURCE_COMMIT $SOURCE_COMMIT

ARG SOURCE_BRANCH
ENV SOURCE_BRANCH $SOURCE_BRANCH

# Installing dependencies
COPY package*.json /usr/src/app/
COPY yarn.lock /usr/src/app/
RUN yarn install

# Copying source files
COPY . /usr/src/app

# env to file

RUN env

RUN env > .env.production.local

RUN printf "NEXT_PUBLIC_COMMIT_HASH=$(git rev-parse HEAD)\nNEXT_PUBLIC_BRANCH=$(git branch | sed -n -e 's/^\* \(.*\)/\1/p')" > .env.local

# Building app
RUN yarn build

# Running the app
CMD "yarn" "start"