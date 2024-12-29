/* eslint-disable @typescript-eslint/no-var-requires */
const { withSentryConfig } = require('@sentry/nextjs')
const withPWA = require('next-pwa')({
	disable: process.env.NODE_ENV !== 'production',
	register: false,
})
const VERSION = require('./package.json').version

/**
 * @type {import('next').NextConfig}
 */
const NextConfig = {
	webpack: (config, { isServer }) => {
		if (!isServer) {
			config.resolve.fallback.fs = false
		}
		return config
	},
	env: {
		NEXT_PUBLIC_RELEASE_VERSION: VERSION,
		SENTRY_SKIP_AUTO_RELEASE: 'true',
	},
	experimental: {
		instrumentationHook: true,
		serverComponentsExternalPackages: ['dd-trace'],
		scrollRestoration: true,
	},
	swcMinify: true,
	redirects: async () => {
		return [
			{
				source: '/developers',
				destination: '/developers/applications',
				permanent: true,
			},
			{
				source: '/developers/docs',
				destination: '/developers/docs/시작하기',
				permanent: true,
			},
		]
	},
	sentry: process.env.CI
		? {
				disableServerWebpackPlugin: true,
				disableClientWebpackPlugin: true,
				hideSourceMaps: true,
		  }
		: {
				hideSourceMaps: true,
		  },
}
module.exports = withSentryConfig(withPWA(NextConfig))
