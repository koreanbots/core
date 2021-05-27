module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	moduleDirectories: ['node_modules', '.'],
	moduleNameMapper: {
		'@types': '<rootDir>/types',
		'^@utils/(.*)$': '<rootDir>/utils/$1',
		'^@components/(.*)$': '<rootDir>/components/$1'
	},
}
