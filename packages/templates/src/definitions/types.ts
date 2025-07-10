import type { categories } from './categories';

/**
 * Component type for distinguishing between templates and blocks
 */
export type ComponentType = 'template' | 'block';

/**
 * Template categories for organization
 */
export type TemplateCategory = (typeof categories)[number];

/**
 * Template metadata for display
 */
export interface TemplateMetadata {
	id: string;
	name: string;
	category: TemplateCategory;
	tags: string[];
	description?: string;
	preview?: string; // Preview image URL
	author?: string;
	version?: string;
	createdAt?: Date;
	updatedAt?: Date;
}

/**
 * Template structure with elements
 */
export interface Template extends TemplateMetadata {
	componentType: ComponentType;
	html: string;
}

/**
 * Template registry entry
 */
export interface TemplateRegistryEntry {
	template: Template;
	featured?: boolean;
	popular?: boolean;
	deprecated?: boolean;
}

/**
 * Template filter options
 */
export interface TemplateFilter {
	category?: TemplateCategory;
	componentType?: ComponentType;
	tags?: string[];
	author?: string;
	featured?: boolean;
	popular?: boolean;
	search?: string;
}
