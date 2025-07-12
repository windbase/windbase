import { type EditorElement, tagToElementType } from '@windbase/core';
import { generateId } from './generate-id';
import { getClassNameAsString } from './get-class-name-as-string';
import { getDirectTextContent } from './get-direct-text-content';

// Convert DOM element to EditorElement
export const domElementToBuilderElement = (
	element: Element,
	parentId?: string
): EditorElement => {
	const tagName = element.tagName.toLowerCase();
	const id = generateId();
	const elementType = tagToElementType(tagName);

	// Extract classes safely
	const classNameStr = getClassNameAsString(element);
	const classes = classNameStr
		? classNameStr.split(' ').filter((cls) => cls.trim() !== '')
		: [];

	// Extract attributes (excluding class since we handle it separately)
	const attributes: Record<string, string> = {};
	for (const attr of Array.from(element.attributes)) {
		if (attr.name !== 'class') {
			attributes[attr.name] = attr.value;
		}
	}

	// Get direct text content (not including nested elements)
	const directContent = getDirectTextContent(element);

	// Convert child elements
	const children: EditorElement[] = [];
	for (const child of Array.from(element.children)) {
		children.push(domElementToBuilderElement(child, id));
	}

	// Create editor element
	const editorElement: EditorElement = {
		id,
		type: elementType,
		tag: tagName,
		classes,
		children,
		parent: parentId,
		attributes: Object.keys(attributes).length > 0 ? attributes : undefined
	};

	// Add content if there's direct text content
	if (directContent) {
		editorElement.content = directContent;
	}

	return editorElement;
};
