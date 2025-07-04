export const elementCategories = [
	'layout',
	'form',
	'media',
	'text',
	'other',
] as const;

export type ElementCategory = (typeof elementCategories)[number];
