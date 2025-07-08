import type { CoreElement } from '@windbase/core';
import type {
	LegacyTemplate,
	Template,
	TemplateCategory,
	TemplateFilter,
	TemplateRegistryEntry,
} from '../definitions/types';

// Union type for templates
type AnyTemplate = Template | LegacyTemplate;

/**
 * Template Registry for managing templates
 */
export class TemplateRegistry {
	private templates: Map<string, TemplateRegistryEntry> = new Map();

	/**
	 * Register a template (Template or LegacyTemplate)
	 */
	register(
		template: AnyTemplate,
		options: {
			featured?: boolean;
			popular?: boolean;
			deprecated?: boolean;
		} = {}
	): void {
		// Convert LegacyTemplate to Template if needed
		const normalizedTemplate: Template = this.normalizeTemplate(template);

		this.templates.set(normalizedTemplate.id, {
			template: normalizedTemplate,
			...options,
		});
	}

	/**
	 * Normalize template to ensure it has all required fields
	 */
	private normalizeTemplate(template: AnyTemplate): Template {
		if ('elements' in template && template.elements) {
			// Already a proper Template
			return template as Template;
		}

		// Convert LegacyTemplate to Template
		const legacyTemplate = template as LegacyTemplate;
		return {
			...legacyTemplate,
			elements:
				legacyTemplate.elements ||
				this.htmlToBasicElements(legacyTemplate.html),
		};
	}

	/**
	 * Convert HTML to basic elements structure
	 */
	private htmlToBasicElements(html: string): CoreElement[] {
		return [
			{
				id: crypto.randomUUID(),
				tag: 'div',
				classes: ['template-container'],
				content: '',
				attributes: {
					'data-template-html': 'true',
					'data-html': html,
				},
				children: [],
			},
		];
	}

	/**
	 * Get template by ID
	 */
	getById(id: string): Template | null {
		const entry = this.templates.get(id);
		return entry?.template || null;
	}

	/**
	 * Get all templates
	 */
	getAll(): Template[] {
		return Array.from(this.templates.values())
			.filter((entry) => !entry.deprecated)
			.map((entry) => entry.template);
	}

	/**
	 * Get templates by category
	 */
	getByCategory(category: TemplateCategory): Template[] {
		return this.getAll().filter((template) => template.category === category);
	}

	/**
	 * Get featured templates
	 */
	getFeatured(): Template[] {
		return Array.from(this.templates.values())
			.filter((entry) => entry.featured && !entry.deprecated)
			.map((entry) => entry.template);
	}

	/**
	 * Get popular templates
	 */
	getPopular(): Template[] {
		return Array.from(this.templates.values())
			.filter((entry) => entry.popular && !entry.deprecated)
			.map((entry) => entry.template);
	}

	/**
	 * Search templates with filters
	 */
	search(filter: TemplateFilter): Template[] {
		let results = this.getAll();

		// Filter by category
		if (filter.category) {
			results = results.filter(
				(template) => template.category === filter.category
			);
		}

		// Filter by tags
		if (filter.tags && filter.tags.length > 0) {
			results = results.filter((template) =>
				filter.tags?.some((tag) => template.tags.includes(tag))
			);
		}

		// Filter by author
		if (filter.author) {
			results = results.filter((template) => template.author === filter.author);
		}

		// Filter by featured
		if (filter.featured) {
			const featuredIds = this.getFeatured().map((t) => t.id);
			results = results.filter((template) => featuredIds.includes(template.id));
		}

		// Filter by popular
		if (filter.popular) {
			const popularIds = this.getPopular().map((t) => t.id);
			results = results.filter((template) => popularIds.includes(template.id));
		}

		// Text search
		if (filter.search) {
			const searchTerm = filter.search.toLowerCase();
			results = results.filter(
				(template) =>
					template.name.toLowerCase().includes(searchTerm) ||
					template.description.toLowerCase().includes(searchTerm) ||
					template.tags.some((tag) => tag.toLowerCase().includes(searchTerm))
			);
		}

		return results;
	}

	/**
	 * Get available categories
	 */
	getCategories(): TemplateCategory[] {
		const categories = new Set<TemplateCategory>();
		this.getAll().forEach((template) => categories.add(template.category));
		return Array.from(categories);
	}

	/**
	 * Get all available tags
	 */
	getTags(): string[] {
		const tags = new Set<string>();
		this.getAll().forEach((template) =>
			template.tags.forEach((tag) => tags.add(tag))
		);
		return Array.from(tags);
	}

	/**
	 * Remove template
	 */
	remove(id: string): boolean {
		return this.templates.delete(id);
	}

	/**
	 * Mark template as deprecated
	 */
	deprecate(id: string): void {
		const entry = this.templates.get(id);
		if (entry) {
			entry.deprecated = true;
		}
	}

	/**
	 * Update template entry options
	 */
	updateEntry(
		id: string,
		options: {
			featured?: boolean;
			popular?: boolean;
			deprecated?: boolean;
		}
	): void {
		const entry = this.templates.get(id);
		if (entry) {
			Object.assign(entry, options);
		}
	}

	/**
	 * Get registry statistics
	 */
	getStats(): {
		total: number;
		byCategory: Record<TemplateCategory, number>;
		featured: number;
		popular: number;
		deprecated: number;
	} {
		const all = Array.from(this.templates.values());
		const active = all.filter((entry) => !entry.deprecated);

		const byCategory = {} as Record<TemplateCategory, number>;
		active.forEach((entry) => {
			const category = entry.template.category;
			byCategory[category] = (byCategory[category] || 0) + 1;
		});

		return {
			total: active.length,
			byCategory,
			featured: all.filter((entry) => entry.featured && !entry.deprecated)
				.length,
			popular: all.filter((entry) => entry.popular && !entry.deprecated).length,
			deprecated: all.filter((entry) => entry.deprecated).length,
		};
	}
}

// Export singleton registry
export const templateRegistry = new TemplateRegistry();
