module.exports = {
	future: {
		removeDeprecatedGapUtilities: true,
		purgeLayersByDefault: true,
	},
	purge: {
		content: [
			'./**/*.{ts,tsx}',
		],
		options: {
			whitelist: ['text-green-400', 'text-yellow-300', 'text-red-500', 'text-gray-500', 'text-purple-500'],
		}
	},
	darkMode: 'class', // or 'media' or 'class'
	theme: {
		extend: {
			colors: {
				'koreanbots-blue': '#3366FF',
				'koreanbots-black': '#2C2F33',
				'little-white': '#fbfbfb',
				'little-white-hover': '#f1f1f1',
				'koreanbots-green': '#21BA45',
				'koreanbots-red': '#DB2828',
				'discord-blurple': '#7289DA',
				'discord-dark': '#2C2F33',
				'discord-dark-hover': '#383f48',
				'discord-black': '#23272A',
				'discord-pink': '#FF73FA',
				'very-black': '#1b1e23'
			}
		},
	},
	variants: {
		extend: {},
	},
	plugins: [],
}
