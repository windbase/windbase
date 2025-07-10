export * from './components';
export * from './definitions/categories';
// Template definitions
export * from './definitions/define-template';
export type {
	ComponentType,
	Template,
	TemplateCategory
} from './definitions/types';
// Template registry
export * from './registry/template-registry';

// Legacy support - export all templates as an array (for backward compatibility)
import { templateRegistry } from './registry/template-registry';
import './categories'; // Import to ensure templates are registered
import type { TemplateCategory } from './definitions/types';

/**
 * Get all templates (legacy support)
 */
export const templates = templateRegistry.getAll();

/**
 * Get template by ID (legacy support)
 */
export const getTemplate = (id: string) => templateRegistry.getById(id);

/**
 * Search templates (legacy support - searches all components)
 */
export const searchTemplates = (query: string) =>
	templateRegistry.search({ search: query });

/**
 * Get templates by category (legacy support - gets all components in category)
 */
export const getTemplatesByCategory = (category: string) =>
	templateRegistry.getByCategory(category as TemplateCategory);

/**
 * Get featured templates (legacy support)
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
export { templateRegistry } from './registry/template-registry';
