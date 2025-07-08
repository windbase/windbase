import type { EditorElement } from '@windbase/core';

// Helper function to find element by ID recursively
export const findElementById = (
	elements: EditorElement[],
	id: string
): EditorElement | null => {
	for (const element of elements) {
		if (element.id === id) {
			return element;
		}
		if (element.children.length > 0) {
			const found = findElementById(element.children, id);
			if (found) return found;
		}
	}
	return null;
};

// Helper function to remove element by ID recursively
export const removeElementById = (
	elements: EditorElement[],
	id: string
): EditorElement[] => {
	return elements
		.filter((element) => element.id !== id)
		.map((element) => ({
			...element,
			children: removeElementById(element.children, id),
		}));
};

// Helper function to update element parent references
export const updateParentReferences = (
	elements: EditorElement[],
	parentId?: string
): EditorElement[] => {
	return elements.map((element) => ({
		...element,
		parent: parentId,
		children: updateParentReferences(element.children, element.id),
	}));
};

// Helper function to find all parent IDs of an element
export const findAllParentIds = (
	elements: EditorElement[],
	targetId: string,
	currentParents: string[] = []
): string[] => {
	for (const element of elements) {
		// If this element has the target as a direct child
		if (element.children.some((child) => child.id === targetId)) {
			return [...currentParents, element.id];
		}

		// If this element has children, search recursively
		if (element.children.length > 0) {
			const found = findAllParentIds(element.children, targetId, [
				...currentParents,
				element.id,
			]);
			if (found.length > 0) {
				return found;
			}
		}
	}
	return [];
};
