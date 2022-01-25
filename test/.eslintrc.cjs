const path = require('path');
const createAliases = require('@leonzalion/configs/eslint/alias');

module.exports = {
	extends: '../.eslintrc.cjs',
	ignorePatterns: ['fixtures'],
	parserOptions: { project: [path.resolve(__dirname, 'tsconfig.eslint.json')] },
	settings: createAliases({ '~': './src', '~test': './test' }),
};
