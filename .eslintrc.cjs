const path = require('path');
const { defineConfig } = require('eslint-define-config');

module.exports = {
	extends: require.resolve('@leonzalion/configs/eslint.cjs'),
	parserOptions: { project: path.resolve(__dirname, 'tsconfig.eslint.json') },
	rules: {
		'unicorn/no-process-exit': 'off',
	},
};
