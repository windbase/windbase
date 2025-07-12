import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { createFetchApi } from '../fetch-api';
import type { ApiBlock, ApiTemplateResponse } from '../types';

/**
 * Base API configuration
 */
const API_BASE_URL = 'https://windbase.github.io/templates/api';

/**
 * Fetch API
 */
const fetchApi = createFetchApi(API_BASE_URL);

/**
 * Query keys for TanStack Query
 */
const queryKeys = {
	templates: ['templates'] as const,
	blocks: ['blocks'] as const,
	template: (id: string) => ['template', id] as const,
	block: (id: string) => ['block', id] as const,
	templateHtml: (id: string) => ['template-html', id] as const,
	blockHtml: (id: string) => ['block-html', id] as const
};

/**
 * Hook for fetching all templates using TanStack Query
 */
export function useTemplates() {
	return useQuery({
		queryKey: queryKeys.templates,
		queryFn: () => fetchApi<ApiTemplateResponse[]>('/templates.json'),
		staleTime: 1000 * 60 * 10 // 10 minutes - templates don't change often
	});
}

/**
 * Hook for fetching all blocks using TanStack Query
 */
export function useBlocks() {
	return useQuery({
		queryKey: queryKeys.blocks,
		queryFn: () => fetchApi<ApiBlock[]>('/blocks.json'),
		staleTime: 1000 * 60 * 10 // 10 minutes - blocks don't change often
	});
}

/**
 * Hook for fetching template categories
 */
export function useTemplateCategories() {
	const { data: templates, isLoading, error } = useTemplates();

	const categories = useMemo(() => {
		if (!templates) return ['all'];
		return ['all', ...new Set(templates.map((template) => template.category))];
	}, [templates]);

	return { categories, isLoading, error };
}

/**
 * Hook for fetching block categories
 */
export function useBlockCategories() {
	const { data: blocks, isLoading, error } = useBlocks();

	const categories = useMemo(() => {
		if (!blocks) return ['all'];
		return ['all', ...new Set(blocks.map((block) => block.category))];
	}, [blocks]);

	return { categories, isLoading, error };
}

/**
 * Hook for fetching a specific template by ID
 */
export function useTemplateById(id: string) {
	return useQuery({
		queryKey: queryKeys.template(id),
		queryFn: () => fetchApi<ApiTemplateResponse>(`/templates/${id}.json`),
		enabled: !!id,
		staleTime: 1000 * 60 * 15 // 15 minutes - individual templates change less frequently
	});
}

/**
 * Hook for fetching a specific block by ID
 */
export function useBlockById(id: string) {
	return useQuery({
		queryKey: queryKeys.block(id),
		queryFn: () => fetchApi<ApiBlock>(`/blocks/${id}.json`),
		enabled: !!id,
		staleTime: 1000 * 60 * 15 // 15 minutes - individual blocks change less frequently
	});
}

/**
 * Hook for fetching HTML content of a template
 */
export function useTemplateHtml() {
	return useMutation({
		mutationFn: async (id: string) => {
			const response = await fetch(`${API_BASE_URL}/templates/${id}.html`);
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			return response.text();
		}
	});
}

/**
 * Hook for fetching HTML content of a block
 */
export function useBlockHtml() {
	return useMutation({
		mutationFn: async (id: string) => {
			const response = await fetch(`${API_BASE_URL}/blocks/${id}.html`);
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			return response.text();
		}
	});
}

/**
 * Hook for getting preview image URL
 */
export function useTemplatePreview(id: string, type: 'template' | 'block') {
	const baseUrl = type === 'template' ? 'templates' : 'blocks';
	return `${API_BASE_URL}/${baseUrl}/${id}-preview.png`;
}

/**
 * Hook for filtered templates with search and category
 */
export function useFilteredTemplates(
	category: string = 'all',
	searchTerm: string = ''
) {
	const { data: templates, isLoading, error } = useTemplates();

	const filteredTemplates = useMemo(() => {
		if (!templates) return [];

		return templates.filter((template) => {
			const matchesCategory =
				category === 'all' || template.category === category;
			const matchesSearch =
				!searchTerm ||
				template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				template.description
					?.toLowerCase()
					.includes(searchTerm.toLowerCase()) ||
				template.tags.some((tag) =>
					tag.toLowerCase().includes(searchTerm.toLowerCase())
				);

			return matchesCategory && matchesSearch;
		});
	}, [templates, category, searchTerm]);

	return {
		templates: filteredTemplates,
		isLoading,
		error,
		// Additional TanStack Query properties
		isError: !!error,
		isSuccess: !isLoading && !error
	};
}

/**
 * Hook for filtered blocks with search and category
 */
export function useFilteredBlocks(
	category: string = 'all',
	searchTerm: string = ''
) {
	const { data: blocks, isLoading, error } = useBlocks();

	const filteredBlocks = useMemo(() => {
		if (!blocks) return [];

		return blocks.filter((block) => {
			const matchesCategory = category === 'all' || block.category === category;
			const matchesSearch =
				!searchTerm ||
				block.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				block.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
				block.tags.some((tag) =>
					tag.toLowerCase().includes(searchTerm.toLowerCase())
				);

			return matchesCategory && matchesSearch;
		});
	}, [blocks, category, searchTerm]);

	return {
		blocks: filteredBlocks,
		isLoading,
		error,
		// Additional TanStack Query properties
		isError: !!error,
		isSuccess: !isLoading && !error
	};
}
