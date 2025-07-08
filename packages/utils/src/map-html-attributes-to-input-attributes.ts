import type { AttributeInput } from '@windbase/core';

// Helper function to map HTML attributes to input attributes with values
export const mapHtmlAttributesToInputAttributes = (
	element: Element,
	inputAttributes: AttributeInput[]
) => {
	if (!inputAttributes) return undefined;

	return inputAttributes.map((attr) => {
		const htmlValue = element.getAttribute(attr.attribute);
		return {
			...attr,
			value: htmlValue || undefined // Add the actual value from HTML
		};
	});
};
