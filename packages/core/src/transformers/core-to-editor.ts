import { tagToElementType } from '../element-system/element-tags';
import type { ElementCategory } from '../element-system/element-types';
import type { CoreElement, EditorElement } from '../types';

/**
 * Transform CoreElement to EditorElement
 * Adds editor-specific metadata required for the visual builder
 */
export function coreToEditor(
	coreElement: CoreElement,
	parentId?: string
): EditorElement {
	const type: ElementCategory = tagToElementType(coreElement.tag);

	return {
		...coreElement,
		type,
		parent: parentId,
		children: coreElement.children.map((child) =>
			coreToEditor(child, coreElement.id)
		)
	};
}

/**
 * Transform multiple CoreElements to EditorElements
 */
export function coreArrayToEditor(
	coreElements: CoreElement[]
): EditorElement[] {
	return coreElements.map((element) => coreToEditor(element));
}
