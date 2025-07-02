const { heroui } = require('@heroui/react');

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./{src,pages,components,app}/**/*.{ts,tsx,js,jsx,html}',
		'!./{src,pages,components,app}/**/*.{stories,spec}.{ts,tsx,js,jsx,html}',
		'../../node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}',
	],
	theme: {
		extend: {},
	},
	darkMode: 'class',
	plugins: [
		heroui({
			themes: {
				light: {
					colors: {
						primary: '#FF6060',
						'primary-foreground': '#FFFFFF',
					},
				},
			},
		}),
	],
};
