/** biome-ignore-all lint/suspicious/noExplicitAny: we don't know the type of the element */

// Helper function to safely get className as string
export const getClassNameAsString = (element: Element): string => {
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
