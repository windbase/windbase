import type { CoreElement } from '@windbase/core';
import type { ComponentType, Template, TemplateCategory } from './types';

/**
 * Enhanced template definition utility
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

/**
 * Helper to convert HTML string to basic CoreElement structure
 * This is a simplified converter for legacy templates
 */
export function htmlToBasicElements(html: string): CoreElement[] {
	// todo: implement a proper HTML parser
	return [
		{
			id: crypto.randomUUID(),
			tag: 'div',
			classes: ['template-container'],
			content: '',
			attributes: {
				'data-template-html': 'true'
			},
			children: []
		}
	];
}

/**
 * Template builder helper for creating structured templates
 */
export class TemplateBuilder {
	private template: Partial<Template>;

	constructor(id: string, name: string) {
		this.template = {
			id,
			name,
			tags: [],
			html: ''
		};
	}

	description(desc: string): this {
		this.template.description = desc;
		return this;
	}

	category(cat: TemplateCategory): this {
		this.template.category = cat;
		return this;
	}

	componentType(type: ComponentType): this {
		this.template.componentType = type;
		return this;
	}

	tags(...tags: string[]): this {
		this.template.tags = [...(this.template.tags || []), ...tags];
		return this;
	}

	preview(url: string): this {
		this.template.preview = url;
		return this;
	}

	author(name: string): this {
		this.template.author = name;
		return this;
	}

	html(htmlString: string): this {
		this.template.html = htmlString;
		return this;
	}

	build(): Template {
		if (!this.template.description || !this.template.category || !this.template.html) {
			throw new Error('Template must have description, category, and html');
		}

		// Set default componentType if not provided
		if (!this.template.componentType) {
			this.template.componentType = 'block';
		}

		return defineTemplate(this.template as Template);
	}
}
