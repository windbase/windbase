import type { blockCategories, templateCategories } from './categories';

/**
 * Component type for distinguishing between templates and blocks
 */
export type ComponentType = 'template' | 'block';

/**
 * Template categories for organization
 */
export type BlockCategory = (typeof blockCategories)[number];
export type TemplateCategory = (typeof templateCategories)[number];

/**
 * Template metadata for display
 */
export interface TemplateMetadata {
	id: string;
	name: string;
	componentType: ComponentType;
	tags: string[];
	html: string;
	description?: string;
	preview?: string; // Preview image URL
	author?: string;
	version?: string;
	createdAt?: Date;
	updatedAt?: Date;
}

export interface Block extends TemplateMetadata {
	componentType: 'block';
	category: BlockCategory;
}

/**
 * Template structure with elements
 */
export interface Template extends TemplateMetadata {
	componentType: 'template';
	category: TemplateCategory;
}

/**
 * Template registry entry
 */
export interface TemplateRegistryEntry {
	template: Template | Block;
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
