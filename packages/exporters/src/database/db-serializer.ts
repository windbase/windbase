import type { CoreElement } from '@windbase/core';

/**
 * Database serialization utilities for CoreElement
 * Ensures clean, minimal data storage without editor metadata
 */

/**
 * Serialize CoreElement for database storage
 * Returns a clean object suitable for JSON serialization
 */
export function serializeForDb(element: CoreElement): CoreElement {
	return {
		id: element.id,
		tag: element.tag,
		classes: [...element.classes], // Create new array
		content: element.content || undefined,
		attributes: element.attributes ? { ...element.attributes } : undefined,
		children: element.children.map((child) => serializeForDb(child))
	};
}

/**
 * Serialize multiple CoreElements for database storage
 */
export function serializeArrayForDb(elements: CoreElement[]): CoreElement[] {
	return elements.map((element) => serializeForDb(element));
}

/**
 * Deserialize from database storage
 * Currently a pass-through, but allows for future transformations
 */
export function deserializeFromDb(data: CoreElement): CoreElement {
	return {
		id: data.id,
		tag: data.tag,
		classes: data.classes || [],
		content: data.content,
		attributes: data.attributes,
		children: data.children?.map((child) => deserializeFromDb(child)) || []
	};
}

/**
 * Deserialize multiple CoreElements from database storage
 */
export function deserializeArrayFromDb(data: CoreElement[]): CoreElement[] {
	return data.map((element) => deserializeFromDb(element));
}

/**
 * Validate CoreElement structure before database storage
 */
export function validateCoreElement(element: CoreElement): boolean {
	// Check required fields
	if (!element.id || !element.tag) {
		return false;
	}

	// Check classes array
	if (!Array.isArray(element.classes)) {
		return false;
	}

	// Check children array
	if (!Array.isArray(element.children)) {
		return false;
	}

	// Recursively validate children
	return element.children.every((child) => validateCoreElement(child));
}

/**
 * Clean CoreElement data by removing undefined/null values
 */
export function cleanCoreElement(element: CoreElement): CoreElement {
	const cleaned: CoreElement = {
		id: element.id,
		tag: element.tag,
		classes: element.classes.filter((cls) => cls?.trim()),
		children: element.children.map((child) => cleanCoreElement(child))
	};

	// Only include content if it exists and is not empty
	if (element.content?.trim()) {
		cleaned.content = element.content.trim();
	}

	// Only include attributes if they exist and have values
	if (element.attributes && Object.keys(element.attributes).length > 0) {
		cleaned.attributes = Object.fromEntries(
			Object.entries(element.attributes).filter(
				([_, value]) => value != null && value !== ''
			)
		);
	}

	return cleaned;
}
