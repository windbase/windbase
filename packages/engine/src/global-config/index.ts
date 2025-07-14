import type { StateCreator } from 'zustand';
import type { BuilderStore, GlobalConfigSlice } from '../store/types';

export const createGlobalConfigSlice: StateCreator<
	BuilderStore,
	[],
	[],
	GlobalConfigSlice
> = (set) => ({
	tailwindCSSConfig: '',
	setTailwindCSSConfig: (config: string) => set({ tailwindCSSConfig: config })
});
 