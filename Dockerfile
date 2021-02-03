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

# public env

RUN printf "NEXT_PUBLIC_TESTER_KEY=9f9c4a7ae9afeb045fe818ed8b741c70b1d25ec236b189566a0db020c5596441\nNEXT_PUBLIC_COMMIT_HASH=$(git rev-parse HEAD)\nNEXT_PUBLIC_BRANCH=$(git branch | sed -n -e 's/^\* \(.*\)/\1/p')" > .env.local

# Building app
RUN yarn build

# Running the app
CMD "yarn" "start"