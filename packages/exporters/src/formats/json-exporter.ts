import type { CoreElement } from '@windbase/core';

/**
 * Export CoreElements to formatted JSON
 */
export function exportToJson(elements: CoreElement[], indent = 2): string {
	return JSON.stringify(elements, null, indent);
}

/**
 * Export CoreElements to minified JSON
 */
export function exportToMinifiedJson(elements: CoreElement[]): string {
	return JSON.stringify(elements);
}

/**
 * Export single CoreElement to JSON
 */
export function exportElementToJson(element: CoreElement, indent = 2): string {
	return JSON.stringify(element, null, indent);
}
