import type { ElementCategory } from '../element-system/element-types';

/**
 * Attribute input configuration for the element property panel
 */
export interface AttributeInput {
	attribute: string;
	type: 'text' | 'select' | 'number' | 'color' | 'checkbox';
	label: string;
	options?: string[];
	placeholder?: string;
	defaultValue?: string;
}

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
	children: ElementDefinition[];
	inputAttributes?: AttributeInput[];
	attributes?: Record<string, string>;
}
