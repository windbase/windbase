import type { EditorElement } from '../types/editor-element';
import type { ElementDefinition } from '../types/element-definition';

/**
 * Transform ElementDefinition to EditorElement
 * Converts template definitions to actual editor elements for instantiation
 */
export function definitionToEditor(
	definition: ElementDefinition,
	parentId?: string
): Omit<EditorElement, 'id'> {
	return {
		type: definition.type,
		tag: definition.tag,
		classes: [...definition.classes], // Create new array to avoid mutations
		content: definition.content,
		attributes: {}, // Start with empty attributes, will be populated by inputAttributes
		parent: parentId,
		children: [] // New elements start with no children
	};
}

/**
 * Transform multiple ElementDefinitions to EditorElements
 */
export function definitionArrayToEditor(
	definitions: ElementDefinition[],
	parentId?: string
): Omit<EditorElement, 'id'>[] {
	return definitions.map((definition) =>
		definitionToEditor(definition, parentId)
	);
}
