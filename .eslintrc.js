module.exports = {
	root: true,
	env: {
		node: true,
		es6: true,
		browser: true,
		es2021: true
	},
	ignorePatterns: ['node_modules/*', '.next/*', '.out/*', '!.prettierrc.js'],
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:react/recommended',
		'plugin:react-hooks/recommended',
		'plugin:jsx-a11y/recommended'
	],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaFeatures: {
			jsx: true
		},
		ecmaVersion: 12,
		sourceType: 'module'
	},
	plugins: [
		'react',
		'@typescript-eslint'
	],
	rules: {
		'react/prop-types': 'off',
		'react/react-in-jsx-scope': 'off',
		'jsx-a11y/anchor-is-valid': 'off',
		'@typescript-eslint/explicit-function-return-type': 'off',
		'@typescript-eslint/explicit-module-boundary-types': 'off',
		'@typescript-eslint/no-unused-vars': ['warn'],
		indent: [
			'error',
			'tab'
		],
		quotes: [
			'error',
			'single'
		],
		semi: [
			'error',
			'never'
		]
	}
}
