// Helper function to check if we're in a browser environment
export const isBrowser = () =>
	typeof window !== 'undefined' && typeof document !== 'undefined';
