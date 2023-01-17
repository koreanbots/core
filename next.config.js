/* eslint-disable @typescript-eslint/no-var-requires */
const { withSentryConfig } = require('@sentry/nextjs')
const withPWA = require('next-pwa')
const VERSION = require('./package.json').version

const NextConfig = {
	webpack: (config, { isServer }) => {
		if (!isServer) {
			config.resolve.fallback.fs = false
		}
		return config
	},
	pwa: {
		disable: process.env.NODE_ENV !== 'production',
		register: false
	},
	env: {
		NEXT_PUBLIC_RELEASE_VERSION: VERSION,
		SENTRY_SKIP_AUTO_RELEASE: true
	},
	future: {},
	experimental: { 
		scrollRestoration: true
	},
	SwcMinify: true
}
module.exports = withSentryConfig(withPWA(NextConfig))