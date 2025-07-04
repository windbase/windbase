import type { BuilderElement } from '@/store/builder';
import { findInputAttributes } from './find-input-attributes';
import { generateId } from './generate-id';
import { getClassNameAsString } from './get-class-name-as-string';
import { getDirectTextContent } from './get-direct-text-content';
import { mapHtmlAttributesToInputAttributes } from './map-html-attributes-to-input-attributes';
import { shouldBeContentEditable } from './should-be-content-editable';
import { tagToElementType } from './tag-to-element-type';

// Convert DOM element to BuilderElement
export const domElementToBuilderElement = (
	element: Element,
	parentId?: string
): BuilderElement => {
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
	for (const attr of element.attributes) {
		if (attr.name !== 'class') {
			attributes[attr.name] = attr.value;
		}
	}

	// Get direct text content (not including nested elements)
	const directContent = getDirectTextContent(element);

	// Convert child elements
	const children: BuilderElement[] = [];
	for (const child of element.children) {
		children.push(domElementToBuilderElement(child, id));
	}

	// Get input attributes definition from elements.ts
	const inputAttributesDef = findInputAttributes(elementType, tagName);
	const inputAttributes = inputAttributesDef
		? mapHtmlAttributesToInputAttributes(element, inputAttributesDef)
		: undefined;

	// Create builder element
	const builderElement: BuilderElement = {
		id,
		type: elementType,
		tag: tagName,
		classes,
		children,
		parent: parentId,
		attributes: Object.keys(attributes).length > 0 ? attributes : undefined,
		inputAttributes,
	};

	// Add content if there's direct text content
	if (directContent) {
		builderElement.content = directContent;
	}

	// Set content editable for appropriate elements
	if (shouldBeContentEditable(elementType, tagName)) {
		builderElement.isContentEditable = true;
	}

	return builderElement;
};
