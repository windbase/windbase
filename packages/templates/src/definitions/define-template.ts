import type { Block, Template, TemplateCategory } from './types';

/**
 * Template definition utility
 */
export function defineTemplate(template: Template): Template {
	return {
		...template,
		componentType: template.componentType || 'block',
		createdAt: template.createdAt || new Date(),
		updatedAt: template.updatedAt || new Date(),
		version: template.version || '1.0.0'
	};
}

/**
 * Block definition utility
 */
export function defineBlock(block: Block): Block {
	return {
		...block,
		componentType: block.componentType || 'block',
		createdAt: block.createdAt || new Date(),
		updatedAt: block.updatedAt || new Date(),
		version: block.version || '1.0.0'
	}
}

/**
 * Helper to create template metadata
 */
export function createTemplateMetadata(
	id: string,
	name: string,
	description: string,
	category: TemplateCategory,
	options: {
		tags?: string[];
		preview?: string;
		author?: string;
		version?: string;
	} = {}
) {
	return {
		id,
		name,
		description,
		category,
		tags: options.tags || [],
		preview: options.preview,
		author: options.author,
		version: options.version || '1.0.0',
		createdAt: new Date(),
		updatedAt: new Date()
	};
}