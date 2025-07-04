/** biome-ignore-all lint/suspicious/noExplicitAny: we don't know the type of the element.className */
'use client';

import type { BuilderElement } from '@/store/builder';
import { elements } from './elements';
import type { ElementType } from './elementTypes';

// Map HTML tags to ElementType categories
const tagToElementType = (tagName: string): ElementType => {
	const tag = tagName.toLowerCase();

	// Layout elements
	if (
		[
			'div',
			'section',
			'article',
			'header',
			'footer',
			'main',
			'aside',
			'nav',
			'span',
			'p',
			'h1',
			'h2',
			'h3',
			'h4',
			'h5',
			'h6',
		].includes(tag)
	) {
		return 'layout';
	}

	// Form elements
	if (
		[
			'form',
			'input',
			'textarea',
			'select',
			'button',
			'label',
			'fieldset',
			'legend',
			'option',
			'optgroup',
		].includes(tag)
	) {
		return 'form';
	}

	// Media elements
	if (
		[
			'img',
			'video',
			'audio',
			'canvas',
			'svg',
			'picture',
			'source',
			'track',
		].includes(tag)
	) {
		return 'media';
	}

	// List elements
	if (['ul', 'ol', 'li', 'dl', 'dt', 'dd'].includes(tag)) {
		return 'list';
	}

	// Default to other
	return 'other';
};

// Helper function to safely get className as string
const getClassNameAsString = (element: Element): string => {
	if (typeof element.className === 'string') {
		return element.className;
	}

	// Handle SVGAnimatedString (for SVG elements)
	if (
		element.className &&
		typeof element.className === 'object' &&
		'baseVal' in element.className
	) {
		return (element.className as any).baseVal || '';
	}

	// Fallback to getAttribute
	return element.getAttribute('class') || '';
};

// Helper function to get text content without nested element content
const getDirectTextContent = (element: Element): string => {
	let textContent = '';
	for (const node of element.childNodes) {
		if (node.nodeType === Node.TEXT_NODE) {
			textContent += node.textContent || '';
		}
	}
	return textContent.trim();
};

// Helper function to check if element should be content editable from elements.ts
const shouldBeContentEditable = (type: ElementType, tag: string): boolean => {
	const elementCategory = elements[type];
	if (!elementCategory) return false;

	// Find the element definition that matches the tag
	const elementDef = elementCategory.find((el) => el.tag === tag);
	return elementDef?.isContentEditable === true;
};

// Helper function to generate UUID safely
const generateId = (): string => {
	if (typeof crypto !== 'undefined' && crypto.randomUUID) {
		return crypto.randomUUID();
	}

	// Fallback UUID generation for environments without crypto.randomUUID
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
		const r = (Math.random() * 16) | 0;
		const v = c === 'x' ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});
};

// Helper function to find input attributes for a specific element type and tag
const findInputAttributes = (type: ElementType, tag: string) => {
	const elementCategory = elements[type];
	if (!elementCategory) return undefined;

	// Find the element definition that matches the tag
	const elementDef = elementCategory.find((el) => el.tag === tag);
	return elementDef?.inputAttributes;
};

// Helper function to map HTML attributes to input attributes with values
const mapHtmlAttributesToInputAttributes = (
	element: Element,
	inputAttributes: BuilderElement['inputAttributes']
) => {
	if (!inputAttributes) return undefined;

	return inputAttributes.map((attr) => {
		const htmlValue = element.getAttribute(attr.attribute);
		return {
			...attr,
			value: htmlValue || undefined, // Add the actual value from HTML
		};
	});
};

// Convert DOM element to BuilderElement
const domElementToBuilderElement = (
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

// Helper function to check if we're in a browser environment
const isBrowser = () =>
	typeof window !== 'undefined' && typeof document !== 'undefined';

// Main transformer function
export const htmlToBuilderElements = (htmlString: string): BuilderElement[] => {
	if (!isBrowser()) {
		console.warn(
			'htmlToBuilderElements can only be used in browser environment'
		);
		return [];
	}

	// Create a temporary container to parse HTML
	const parser = new DOMParser();
	const doc = parser.parseFromString(htmlString, 'text/html');

	// Extract elements from body (ignore head, script, style, etc.)
	const bodyElements = doc.body.children;

	// Convert each root element
	const builderElements: BuilderElement[] = [];
	for (const element of bodyElements) {
		builderElements.push(domElementToBuilderElement(element));
	}

	return builderElements;
};

// Alternative function that can handle document fragments
export const htmlFragmentToBuilderElements = (
	htmlString: string
): BuilderElement[] => {
	if (!isBrowser()) {
		console.warn(
			'htmlFragmentToBuilderElements can only be used in browser environment'
		);
		return [];
	}

	// Create a temporary div to parse HTML fragment
	const tempDiv = document.createElement('div');
	tempDiv.innerHTML = htmlString;

	// Convert each root element
	const builderElements: BuilderElement[] = [];
	for (const element of tempDiv.children) {
		builderElements.push(domElementToBuilderElement(element));
	}

	return builderElements;
};

// Helper function to transform a single HTML element
export const singleHtmlElementToBuilderElement = (
	htmlString: string
): BuilderElement | null => {
	if (!isBrowser()) {
		console.warn(
			'singleHtmlElementToBuilderElement can only be used in browser environment'
		);
		return null;
	}

	const elements = htmlFragmentToBuilderElements(htmlString);
	return elements.length > 0 ? elements[0] : null;
};

// Utility function to clean up HTML before parsing (remove scripts, styles, etc.)
export const sanitizeHtml = (htmlString: string): string => {
	// Remove script tags
	htmlString = htmlString.replace(
		/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
		''
	);

	// Remove style tags
	htmlString = htmlString.replace(
		/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi,
		''
	);

	// Remove link tags (stylesheets)
	htmlString = htmlString.replace(/<link\b[^>]*>/gi, '');

	// Remove meta tags
	htmlString = htmlString.replace(/<meta\b[^>]*>/gi, '');

	// Remove title tags
	htmlString = htmlString.replace(
		/<title\b[^<]*(?:(?!<\/title>)<[^<]*)*<\/title>/gi,
		''
	);

	return htmlString;
};

// Complete transformer with sanitization
export const safeHtmlToBuilderElements = (
	htmlString: string
): BuilderElement[] => {
	if (!isBrowser()) {
		console.warn(
			'safeHtmlToBuilderElements can only be used in browser environment'
		);
		return [];
	}

	const sanitizedHtml = sanitizeHtml(htmlString);
	return htmlToBuilderElements(sanitizedHtml);
};
