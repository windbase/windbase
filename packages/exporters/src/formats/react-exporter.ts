import type { CoreElement } from '@windbase/core';

/**
 * Export CoreElements to React component string
 */
export function exportToReactComponent(
	elements: CoreElement[],
	componentName = 'GeneratedComponent'
): string {
	const componentBody = elements
		.map((element) => generateJsx(element))
		.join('\n\t\t');

	return `import React from 'react';

export function ${componentName}() {
	return (
		<div>
			${componentBody}
		</div>
	);
}

export default ${componentName};`;
}

/**
 * Generate JSX string from CoreElement
 */
function generateJsx(element: CoreElement, indent = 3): string {
	const tabs = '\t'.repeat(indent);
	const nextTabs = '\t'.repeat(indent + 1);

	// Build attributes
	const attributes = buildJsxAttributes(element);
	const className =
		element.classes.length > 0
			? ` className="${element.classes.join(' ')}"`
			: '';

	// Self-closing tags
	const selfClosingTags = ['img', 'input', 'br', 'hr', 'meta', 'link'];
	if (selfClosingTags.includes(element.tag.toLowerCase())) {
		return `${tabs}<${element.tag}${className}${attributes} />`;
	}

	// Tags with content or children
	const content = element.content || '';
	const childrenJsx = element.children
		.map((child) => generateJsx(child, indent + 1))
		.join('\n');

	if (!content && !childrenJsx) {
		return `${tabs}<${element.tag}${className}${attributes} />`;
	}

	if (content && !childrenJsx) {
		return `${tabs}<${element.tag}${className}${attributes}>${content}</${element.tag}>`;
	}

	return `${tabs}<${element.tag}${className}${attributes}>
${content ? `${nextTabs}${content}` : ''}${
	content && childrenJsx ? '\n' : ''
}${childrenJsx}
${tabs}</${element.tag}>`;
}

/**
 * Build JSX attributes string from element attributes
 */
function buildJsxAttributes(element: CoreElement): string {
	if (!element.attributes || Object.keys(element.attributes).length === 0) {
		return '';
	}

	return Object.entries(element.attributes)
		.map(([key, value]) => {
			// Convert HTML attributes to JSX format
			const jsxKey = key === 'for' ? 'htmlFor' : key;
			return ` ${jsxKey}="${value}"`;
		})
		.join('');
}
