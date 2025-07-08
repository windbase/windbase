import type { CoreElement } from '@windbase/core';
import { sanitizeHtml } from '@windbase/utils';

/**
 * Generate clean HTML from CoreElement
 * Used for exporting builder content without editor metadata
 */
export function exportToHtml(element: CoreElement): string {
	const attributes = buildAttributesString(element);
	const className =
		element.classes.length > 0 ? ` class="${element.classes.join(' ')}"` : '';

	// Self-closing tags
	const selfClosingTags = ['img', 'input', 'br', 'hr', 'meta', 'link'];
	if (selfClosingTags.includes(element.tag.toLowerCase())) {
		return `<${element.tag}${className}${attributes} />`;
	}

	// Tags with content
	const content = element.content ? sanitizeHtml(element.content) : '';
	const childrenHtml = element.children
		.map((child) => exportToHtml(child))
		.join('');

	return `<${element.tag}${className}${attributes}>${content}${childrenHtml}</${element.tag}>`;
}

/**
 * Export multiple CoreElements to HTML
 */
export function exportArrayToHtml(elements: CoreElement[]): string {
	return elements.map((element) => exportToHtml(element)).join('');
}

/**
 * Build attributes string from element attributes
 */
function buildAttributesString(element: CoreElement): string {
	if (!element.attributes || Object.keys(element.attributes).length === 0) {
		return '';
	}

	return Object.entries(element.attributes)
		.map(([key, value]) => ` ${key}="${value}"`)
		.join('');
}

/**
 * Export elements with a full HTML document structure
 */
export function exportToFullHtml(
	elements: CoreElement[],
	title = 'Windbase Page'
): string {
	const bodyContent = exportArrayToHtml(elements);

	return `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>${title}</title>
	<script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
	${bodyContent}
</body>
</html>`;
}
