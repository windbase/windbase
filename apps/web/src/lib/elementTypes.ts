export const elementTypes = [
	'layout',
	'form',
	'media',
	'text',
	'other',
] as const;

export type ElementType = (typeof elementTypes)[number];
