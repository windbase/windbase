export const elementTypes = [
	'layout',
	'form',
	'media',
	'list',
	'other',
] as const;

export type ElementType = (typeof elementTypes)[number];
