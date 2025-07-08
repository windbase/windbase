import type { CoreElement } from '../types/core-element';
import type { EditorElement } from '../types/editor-element';

/**
 * Transform EditorElement to CoreElement
 * Strips editor-specific metadata for clean storage/export
 */
export function editorToCore(editorElement: EditorElement): CoreElement {
	return {
		id: editorElement.id,
		tag: editorElement.tag,
		classes: editorElement.classes,
		content: editorElement.content,
		attributes: editorElement.attributes,
		children: editorElement.children.map((child) => editorToCore(child)),
	};
}

/**
 * Transform multiple EditorElements to CoreElements
 */
export function editorArrayToCore(
	editorElements: EditorElement[]
): CoreElement[] {
	return editorElements.map((element) => editorToCore(element));
}
