const path = require('path');
const createAliases = require('@leonzalion/configs/eslint/alias.cjs');

module.exports = {
	extends: '../.eslintrc.cjs',
	ignorePatterns: ['fixtures', 'temp'],
	parserOptions: { project: [path.resolve(__dirname, 'tsconfig.eslint.json')] },
	settings: createAliases({ '~': './src', '~test': './test' }),
};
