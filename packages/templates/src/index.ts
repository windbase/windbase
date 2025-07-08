// Template categories
export * from './categories';
// Individual template components
export * from './components/cta/cta-01';
// Template definitions
export * from './definitions/define-template';
export type { TemplateCategory } from './definitions/types';
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
 * Search templates (legacy support)
 */
export const searchTemplates = (query: string) =>
	templateRegistry.search({ search: query });

/**
 * Get templates by category (legacy support)
 */
export const getTemplatesByCategory = (category: string) =>
	templateRegistry.getByCategory(category as TemplateCategory);

/**
 * Get featured templates (legacy support)
 */
export const getFeaturedTemplates = () => templateRegistry.getFeatured();

/**
 * Template registry instance for advanced usage
 */
export { templateRegistry } from './registry/template-registry';
