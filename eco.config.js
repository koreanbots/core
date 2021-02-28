module.exports = {
	apps: [
		{
			name: 'koreanbots',
			script: 'npm start',
			env: {
				NODE_ENV: 'development',
			},
			env_production: {
				NODE_ENV: 'production',
			},
		},
	],
}
