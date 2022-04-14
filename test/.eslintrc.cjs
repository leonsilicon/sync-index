const path = require('path');

module.exports = {
	extends: '../.eslintrc.cjs',
	ignorePatterns: ['fixtures', 'temp'],
	parserOptions: { project: path.resolve(__dirname, 'tsconfig.eslint.json') },
};
