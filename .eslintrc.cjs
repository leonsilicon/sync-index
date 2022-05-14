const createESLintConfig = require('lionconfig');

module.exports = createESLintConfig(__dirname, {
	rules: {
		'unicorn/no-process-exit': 'off';
	}
});

