// Import to ensure blocks/templates are registered
import './register-blocks';
import './register-templates';

// Template definitions
export * from './definitions/categories';
export * from './definitions/define-template';
export type {
	ComponentType,
	Template,
	TemplateCategory
} from './definitions/types';
// Template registry
export * from './registry';

import type { TemplateCategory } from './definitions/types';

import { templateRegistry } from './registry';

/**
 * Get templates by category
 */
export const getTemplatesByCategory = (category: string) =>
	templateRegistry.getByCategory(category as TemplateCategory);

/**
 * Get featured templates
 */
export const getFeaturedTemplates = () => templateRegistry.getFeatured();

/**
 * Get all blocks
 */
export const getBlocks = () => templateRegistry.getBlocks();

/**
 * Get all templates (full page templates)
 */
export const getTemplates = () => templateRegistry.getTemplates();

/**
 * Search blocks
 */
export const searchBlocks = (query: string) =>
	templateRegistry.search({ search: query, componentType: 'block' });

/**
 * Search only templates (full page templates)
 */
export const searchOnlyTemplates = (query: string) =>
	templateRegistry.search({ search: query, componentType: 'template' });

/**
 * Get blocks by category
 */
export const getBlocksByCategory = (category: string) =>
	templateRegistry.search({
		category: category as TemplateCategory,
		componentType: 'block'
	});

/**
 * Get only templates by category (full page templates)
 */
export const getOnlyTemplatesByCategory = (category: string) =>
	templateRegistry.search({
		category: category as TemplateCategory,
		componentType: 'template'
	});

/**
 * Template registry instance for advanced usage
 */
export { templateRegistry } from './registry';
