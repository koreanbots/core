/* eslint-disable @typescript-eslint/no-var-requires */
const {
	NEXT_PUBLIC_SENTRY_DSN: SENTRY_DSN,
	SENTRY_ORG,
	SENTRY_PROJECT,
	SENTRY_AUTH_TOKEN,
	SENTRY_RELEASE,
	SOURCE_COMMIT,
	SOURCE_BRANCH,
	NODE_ENV
} = process.env

const VERSION = require('./package.json').version
const basePath = ''

module.exports = {
	env: {
		NEXT_PUBLIC_RELEASE_VERSION: VERSION
	},
	future: {
		webpack5: true,
	},
	experimental: { 
		scrollRestoration: true
	},
	basePath,
	externalResolver: true
}