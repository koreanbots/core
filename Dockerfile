FROM node:14.16-alpine

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Get Argument
ARG NEXT_PUBLIC_SENTRY_DSN
ARG SENTRY_AUTH_TOKEN
ARG SENTRY_ORG
ARG SENTRY_PROJECT
ARG SENTRY_RELEASE

ENV NEXT_PUBLIC_SENTRY_DSN $NEXT_PUBLIC_SENTRY_DSN 
ENV SENTRY_AUTH_TOKEN $SENTRY_AUTH_TOKEN 
ENV SENTRY_ORG $SENTRY_ORG 
ENV SENTRY_PROJECT $SENTRY_PROJECT 
ENV SENTRY_RELEASE $SENTRY_RELEASE
# Installing dependencies
COPY package*.json /usr/src/app/
COPY yarn.lock /usr/src/app/
RUN yarn install

# Copying source files
COPY . /usr/src/app

# env to file

RUN env

RUN env > .env.production.local

RUN printf "NEXT_PUBLIC_TESTER_KEY=9f9c4a7ae9afeb045fe818ed8b741c70b1d25ec236b189566a0db020c5596441\nNEXT_PUBLIC_COMMIT_HASH=$(git rev-parse HEAD)\nNEXT_PUBLIC_BRANCH=$(git branch | sed -n -e 's/^\* \(.*\)/\1/p')" > .env.local

# Building app
RUN yarn build


# Building app
RUN yarn build

# Running the app
RUN chmod +x /usr/src/app/startup.sh
CMD yarn start