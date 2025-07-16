import type { StateCreator } from 'zustand';
import type { BuilderStore, GlobalConfigSlice } from '../store/types';

export const createGlobalConfigSlice: StateCreator<
	BuilderStore,
	[],
	[],
	GlobalConfigSlice
> = (set) => ({
	tailwindCSSConfig: `@import "tailwindcss";

/* Optional: Dark mode variant using class strategy */
@custom-variant dark (&:is(.dark *));

:root {
  --primary: oklch(0.6962 0.1628 241.41);
  --primary-foreground: oklch(0.985 0 0);
}

.dark {
  --primary: oklch(0.985 0 0);
  --primary-foreground: oklch(0.205 0 0);
}

@theme inline {
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
}`,
	setTailwindCSSConfig: (config: string) => set({ tailwindCSSConfig: config })
});
