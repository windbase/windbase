import { type ElementCategory, elements } from '@windbase/core';

// Helper function to find input attributes for a specific element type and tag
export const findInputAttributes = (type: ElementCategory, tag: string) => {
	const elementCategory = elements.filter((el) => el.type === type);
	if (!elementCategory.length) return undefined;

	// Find the element definition that matches the tag
	const elementDef = elementCategory.find((el) => el.tag === tag);
	return elementDef?.inputAttributes;
};
