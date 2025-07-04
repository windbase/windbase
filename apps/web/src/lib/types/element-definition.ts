import type { ElementCategory } from '../elementTypes';

/**
 * Attribute input configuration for the element property panel
 */
export type AttributeInput = {
	attribute: string;
	type: 'text' | 'select';
	label?: string;
	options?: string[];
	value?: string;
};

/**
 * ElementDefinition - Template definitions for element picker
 * Contains default values and UI configuration for creating new elements
 */
export interface ElementDefinition {
	id: string;
	type: ElementCategory;
	tag: string;
	classes: string[];
	content?: string;
	isContentEditable?: boolean;
	inputAttributes?: AttributeInput[];
	children: never[]; // Always empty for definitions
}
