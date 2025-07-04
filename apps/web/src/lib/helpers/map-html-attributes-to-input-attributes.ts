import type { BuilderElement } from '@/store/builder';

// Helper function to map HTML attributes to input attributes with values
export const mapHtmlAttributesToInputAttributes = (
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
