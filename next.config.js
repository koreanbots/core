/* eslint-disable @typescript-eslint/no-var-requires */
const { withSentryConfig } = require('@sentry/nextjs')
const withPWA = require('next-pwa')
const VERSION = require('./package.json').version

const NextConfig = {
	pwa: {
		register: false
	},
	env: {
		NEXT_PUBLIC_RELEASE_VERSION: VERSION,
		SENTRY_SKIP_AUTO_RELEASE: true
	},
	future: {
		webpack5: true,
	},
	experimental: { 
		scrollRestoration: true
	}
}
module.exports = withSentryConfig(withPWA(NextConfig))