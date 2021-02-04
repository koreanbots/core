/* eslint-disable @typescript-eslint/no-var-requires */
const SentryWebpackPlugin = require('@sentry/webpack-plugin')
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
	webpack: (config, options) => {
		if(!options.isServer) {
			config.resolve.alias['@sentry/node'] = '@sentry/browser'
		}
		config.plugins.push(
			new options.webpack.DefinePlugin({
				'process.env.NEXT_IS_SERVER': JSON.stringify(
					options.isServer.toString()
				),
			})
		)
		console.log(process.env)
		if (
			SENTRY_DSN &&
      SENTRY_ORG &&
      SENTRY_PROJECT &&
			SENTRY_AUTH_TOKEN &&
			SENTRY_RELEASE &&
			VERSION &&
      NODE_ENV === 'production'
		) {
			console.log('Upload Release')
			config.plugins.push(
				new SentryWebpackPlugin({
					include: '.next',
					ignore: ['node_modules'],
					stripPrefix: ['webpack://_N_E/'],
					urlPrefix: `~${basePath}/_next`,
					release: `${SENTRY_RELEASE === 'stable' ? VERSION : SOURCE_COMMIT || VERSION}-${SOURCE_BRANCH || SENTRY_RELEASE}`,
				})
			)
		}
		else console.log('Upload Release Ignored')
		return config
	},
	experimental: { scrollRestoration: true },

	basePath
}