import { elements } from '../elements';
import type { ElementType } from '../elementTypes';

// Helper function to check if element should be content editable from elements.ts
export const shouldBeContentEditable = (
	type: ElementType,
	tag: string
): boolean => {
	const elementCategory = elements[type];
	if (!elementCategory) return false;

	// Find the element definition that matches the tag
	const elementDef = elementCategory.find((el) => el.tag === tag);
	return elementDef?.isContentEditable === true;
};
