/**
 * CoreElement - Clean, minimal structure for database storage and HTML export
 * Contains only essential element data without editor-specific metadata
 */
export interface CoreElement {
	id: string;
	tag: string;
	classes: string[];
	content?: string;
	attributes?: Record<string, string>;
	children: CoreElement[];
}
