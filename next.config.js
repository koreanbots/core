/* eslint-disable @typescript-eslint/no-var-requires */
// const { withSentryConfig } = require('@sentry/nextjs')

const VERSION = require('./package.json').version

module.exports = {
	env: {
		NEXT_PUBLIC_RELEASE_VERSION: VERSION
	},
	future: {
		webpack5: true,
	},
	experimental: { 
		scrollRestoration: true
	}
}