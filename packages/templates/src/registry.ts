import type {
	Block,
	BlockCategory,
	ComponentType,
	Template,
	TemplateCategory,
	TemplateFilter,
	TemplateRegistryEntry
} from './definitions/types';

/**
 * Template Registry for managing templates
 */
export class TemplateRegistry {
	private templates: Map<string, TemplateRegistryEntry> = new Map();

	/**
	 * Register a template
	 */
	register(
		template: Template | Block,
		options: {
			featured?: boolean;
			popular?: boolean;
			deprecated?: boolean;
		} = {}
	): void {
		this.templates.set(template.id, {
			template,
			...options
		});
	}

	/**
	 * Get template by ID
	 */
	getById(id: string): Template | Block | null {
		const entry = this.templates.get(id);
		return entry?.template || null;
	}

	/**
	 * Get all templates
	 */
	getAll(): (Template | Block)[] {
		return Array.from(this.templates.values())
			.filter((entry) => !entry.deprecated)
			.map((entry) => entry.template);
	}

	/**
	 * Get all blocks
	 */
	getBlocks(): Block[] {
		return this.getAll().filter(
			(template) => template.componentType === 'block'
		) as Block[];
	}

	/**
	 * Get all templates (full page templates)
	 */
	getTemplates(): Template[] {
		return this.getAll().filter(
			(template) => template.componentType === 'template'
		);
	}

	/**
	 * Get templates by category
	 */
	getByCategory(category: TemplateCategory | BlockCategory): (Template | Block)[] {
		return this.getAll().filter((template) => template.category === category);
	}

	/**
	 * Get featured templates
	 */
	getFeatured(): (Template | Block)[] {
		return Array.from(this.templates.values())
			.filter((entry) => entry.featured && !entry.deprecated)
			.map((entry) => entry.template);
	}

	/**
	 * Get popular templates
	 */
	getPopular(): (Template | Block)[] {
		return Array.from(this.templates.values())
			.filter((entry) => entry.popular && !entry.deprecated)
			.map((entry) => entry.template);
	}

	/**
	 * Search templates with filters
	 */
	search(filter: TemplateFilter): (Template | Block)[] {
		let results = this.getAll();

		// Filter by component type
		if (filter.componentType) {
			results = results.filter(
				(template) => template.componentType === filter.componentType
			);
		}

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
					template.description?.toLowerCase().includes(searchTerm) ||
					template.tags.some((tag) => tag.toLowerCase().includes(searchTerm))
			);
		}

		return results;
	}

	/**
	 * Get available categories
	 */
	getCategories(): (TemplateCategory | BlockCategory)[] {
		const categories = new Set<TemplateCategory | BlockCategory>();
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
		byComponentType: Record<ComponentType, number>;
		featured: number;
		popular: number;
		deprecated: number;
	} {
		const all = Array.from(this.templates.values());
		const active = all.filter((entry) => !entry.deprecated);

		const byCategory = {} as Record<TemplateCategory | BlockCategory, number>;
		const byComponentType = {} as Record<ComponentType, number>;

		active.forEach((entry) => {
			const category = entry.template.category;
			const componentType = entry.template.componentType;
			byCategory[category] = (byCategory[category] || 0) + 1;
			byComponentType[componentType] =
				(byComponentType[componentType] || 0) + 1;
		});

		return {
			total: active.length,
			byCategory,
			byComponentType,
			featured: all.filter((entry) => entry.featured && !entry.deprecated)
				.length,
			popular: all.filter((entry) => entry.popular && !entry.deprecated).length,
			deprecated: all.filter((entry) => entry.deprecated).length
		};
	}
}

// Export singleton registry
export const templateRegistry = new TemplateRegistry();
