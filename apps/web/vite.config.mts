/// <reference types='vitest' />

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import pkgJson from '@windbase/core/package.json' with { type: 'json' };
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(() => ({
	root: __dirname,
	cacheDir: '../../node_modules/.vite/apps/web',
	server: {
		port: 3000,
		host: 'localhost'
	},
	preview: {
		port: 3000,
		host: 'localhost'
	},
	plugins: [react(), tailwindcss(), tsconfigPaths()],
	build: {
		outDir: './dist',
		emptyOutDir: true,
		reportCompressedSize: true,
		commonjsOptions: {
			transformMixedEsModules: true
		}
	},
	define: {
		VERSION: JSON.stringify(pkgJson.version)
	}
}));
