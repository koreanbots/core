FROM node:14.16-alpine

# install packages
RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh python3 py3-pip build-base

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Get Argument
ARG NEXT_PUBLIC_SENTRY_DSN
ARG SENTRY_DSN
ARG SENTRY_AUTH_TOKEN

ENV NEXT_PUBLIC_SENTRY_DSN $NEXT_PUBLIC_SENTRY_DSN
ENV SENTRY_DSN $SENTRY_DSN
ENV SENTRY_AUTH_TOKEN $SENTRY_AUTH_TOKEN 
ENV SENTRY_ORG koreanbots
ENV SENTRY_PROJECT api
# Installing dependencies
COPY package*.json /usr/src/app/
COPY yarn.lock /usr/src/app/
RUN yarn install

# Copying source files
COPY . /usr/src/app


RUN printf "NEXT_PUBLIC_TESTER_KEY=9f9c4a7ae9afeb045fe818ed8b741c70b1d25ec236b189566a0db020c5596441\nNEXT_PUBLIC_COMMIT_HASH=$(git rev-parse HEAD)\nNEXT_PUBLIC_BRANCH=$(git branch | sed -n -e 's/^\* \(.*\)/\1/p')" > .env.local

# Building app
RUN yarn build

# Running the app
CMD yarn start