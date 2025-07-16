/// <reference types='vitest' />

import * as path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(() => ({
	root: __dirname,
	cacheDir: '../../node_modules/.vite/packages/ui',
	plugins: [
		react(),
		dts({
			entryRoot: 'src',
			tsconfigPath: path.join(__dirname, 'tsconfig.lib.json')
		}),
		tsconfigPaths()
	],
	// Uncomment this if you are using workers.
	// worker: {
	//  plugins: [ nxViteTsPaths() ],
	// },
	// Configuration for building your library.
	// See: https://vitejs.dev/guide/build.html#library-mode
	build: {
		outDir: './dist',
		emptyOutDir: true,
		reportCompressedSize: true,
		commonjsOptions: {
			transformMixedEsModules: true
		},
		lib: {
			// Could also be a dictionary or array of multiple entry points.
			entry: 'src/index.ts',
			name: '@windbase/ui',
			fileName: 'index',
			// Change this to the formats you want to support.
			// Don't forget to update your package.json as well.
			formats: ['es' as const]
		},
		rollupOptions: {
			// External packages that should not be bundled into your library.
			external: ['react', 'react-dom', 'react/jsx-runtime']
		}
	}
}));
