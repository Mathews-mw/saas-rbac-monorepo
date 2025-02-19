/** @type {import('eslint').Linter.Config} */
module.exports = {
	extends: ['@rocketseat/eslint-config/node'],
	rules: {
		'prettier/prettier': [
			'error',
			{
				singleQuote: true,
				printWidth: 120,
				tabWidth: 2,
				useTabs: true,
				semi: true,
				trailingComma: 'es5',
				bracketSpacing: true,
				bracketLine: true,
				endOfLine: 'auto',
				arrowFunctionParens: 'always',
			},
		],
		camelcase: 'off',
		'no-undef': 'off',
		'prefer-const': 'off',
		'no-unused-vars': 0,
		'dot-notation': 'off',
		endOfLine: 0,
		'@typescript-eslint/no-unused-vars': 'warn',
		'@typescript-eslint/no-namespace': 'off',
	},
};
