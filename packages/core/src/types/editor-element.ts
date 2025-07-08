import type { ElementCategory } from '../elementTypes';

/**
 * Editor element - runtime representation of elements in the visual builder
 * Extended from CoreElement with editor-specific metadata
 */
export interface EditorElement {
	id: string;
	type: ElementCategory;
	tag: string;
	classes: string[];
	content?: string;
	attributes?: Record<string, string>;
	parent?: string;
	children: EditorElement[];
}
