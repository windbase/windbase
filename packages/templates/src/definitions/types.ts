import type { CoreElement } from '@windbase/core';

/**
 * Template categories for organization
 */
export type TemplateCategory =
	| 'cta' // Call-to-action sections
	| 'hero' // Hero sections
	| 'features' // Feature sections
	| 'testimonials' // Testimonial sections
	| 'pricing' // Pricing sections
	| 'footer' // Footer sections
	| 'header' // Header/navigation sections
	| 'content' // Content sections
	| 'forms' // Form sections
	| 'gallery' // Gallery/media sections
	| 'team' // Team sections
	| 'blog' // Blog/article sections
	| 'other'; // Other/misc sections

/**
 * Template metadata for display
 */
export interface TemplateMetadata {
	id: string;
	name: string;
	description: string;
	category: TemplateCategory;
	tags: string[];
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
	elements: CoreElement[]; // The actual template structure
	html?: string; // Optional HTML representation
}

/**
 * Template with legacy HTML support (for migration)
 */
export interface LegacyTemplate extends TemplateMetadata {
	html: string; // Legacy HTML string
	elements?: CoreElement[]; // Optional elements for new format
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
	tags?: string[];
	author?: string;
	featured?: boolean;
	popular?: boolean;
	search?: string;
}
