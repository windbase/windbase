import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { createFetchApi } from '../fetch-api';
import type {
	ApiBlock,
	ApiBlocksResponse,
	ApiConfig,
	ApiTemplateResponse,
	ApiTemplatesResponse
} from '../types';

/**
 * GitHub Pages API configuration
 * Replace 'windbase' with the actual GitHub username
 */
const API_CONFIG: ApiConfig = {
	username: 'windbase',
	baseUrl: 'https://windbase.github.io/components'
};

/**
 * Fetch API
 */
const fetchApi = createFetchApi(API_CONFIG.baseUrl);

/**
 * Query keys for TanStack Query
 */
const queryKeys = {
	templates: ['templates'] as const,
	blocks: ['blocks'] as const,
	templatesPage: (page: number) => ['templates', 'page', page] as const,
	blocksPage: (page: number) => ['blocks', 'page', page] as const,
	template: (id: string) => ['template', id] as const,
	block: (id: string) => ['block', id] as const,
	templateHtml: (id: string) => ['template-html', id] as const,
	blockHtml: (id: string) => ['block-html', id] as const
};

/**
 * Hook for fetching a specific page of templates
 */
export function useTemplatesPage(page: number) {
	return useQuery({
		queryKey: queryKeys.templatesPage(page),
		queryFn: () => fetchApi<ApiTemplatesResponse>(`/templates-${page}.json`),
		staleTime: 1000 * 60 * 10, // 10 minutes
		enabled: page > 0
	});
}

/**
 * Hook for fetching a specific page of blocks
 */
export function useBlocksPage(page: number) {
	return useQuery({
		queryKey: queryKeys.blocksPage(page),
		queryFn: () => fetchApi<ApiBlocksResponse>(`/blocks-${page}.json`),
		staleTime: 1000 * 60 * 10, // 10 minutes
		enabled: page > 0
	});
}

/**
 * Hook for fetching all templates using infinite query
 */
export function useTemplates() {
	const infiniteQuery = useInfiniteQuery({
		queryKey: queryKeys.templates,
		queryFn: ({ pageParam = 1 }) =>
			fetchApi<ApiTemplatesResponse>(`/templates-${pageParam}.json`),
		getNextPageParam: (lastPage) =>
			lastPage.hasNextPage ? lastPage.page + 1 : undefined,
		staleTime: 1000 * 60 * 10, // 10 minutes
		initialPageParam: 1
	});

	const combinedData = useMemo(() => {
		const allTemplates: ApiTemplateResponse[] = [];

		if (infiniteQuery.data) {
			for (const page of infiniteQuery.data.pages) {
				allTemplates.push(...page.items);
			}
		}

		return {
			data: allTemplates,
			isLoading: infiniteQuery.isLoading,
			error: infiniteQuery.error
		};
	}, [infiniteQuery.data, infiniteQuery.isLoading, infiniteQuery.error]);

	// Automatically fetch all pages
	useMemo(() => {
		if (infiniteQuery.hasNextPage && !infiniteQuery.isFetchingNextPage) {
			infiniteQuery.fetchNextPage();
		}
	}, [
		infiniteQuery.hasNextPage,
		infiniteQuery.isFetchingNextPage,
		infiniteQuery.fetchNextPage
	]);

	return combinedData;
}

/**
 * Hook for fetching all blocks using infinite query
 */
export function useBlocks() {
	const infiniteQuery = useInfiniteQuery({
		queryKey: queryKeys.blocks,
		queryFn: ({ pageParam = 1 }) =>
			fetchApi<ApiBlocksResponse>(`/blocks-${pageParam}.json`),
		getNextPageParam: (lastPage) =>
			lastPage.hasNextPage ? lastPage.page + 1 : undefined,
		staleTime: 1000 * 60 * 10, // 10 minutes
		initialPageParam: 1
	});

	const combinedData = useMemo(() => {
		const allBlocks: ApiBlock[] = [];

		if (infiniteQuery.data) {
			for (const page of infiniteQuery.data.pages) {
				allBlocks.push(...page.items);
			}
		}

		return {
			data: allBlocks,
			isLoading: infiniteQuery.isLoading,
			error: infiniteQuery.error
		};
	}, [infiniteQuery.data, infiniteQuery.isLoading, infiniteQuery.error]);

	// Automatically fetch all pages
	useMemo(() => {
		if (infiniteQuery.hasNextPage && !infiniteQuery.isFetchingNextPage) {
			infiniteQuery.fetchNextPage();
		}
	}, [
		infiniteQuery.hasNextPage,
		infiniteQuery.isFetchingNextPage,
		infiniteQuery.fetchNextPage
	]);

	return combinedData;
}

/**
 * Hook for fetching template categories
 */
export function useTemplateCategories() {
	const { data: templates, isLoading, error } = useTemplates();

	const categories = useMemo(() => {
		if (!templates) return ['all'];
		const allCategories = templates.flatMap((template) => template.categories);
		return ['all', ...new Set(allCategories)];
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
		const allCategories = blocks.flatMap((block) => block.categories);
		return ['all', ...new Set(allCategories)];
	}, [blocks]);

	return { categories, isLoading, error };
}

/**
 * Hook for fetching a specific template by ID
 */
export function useTemplateById(id: string) {
	const { data: templates } = useTemplates();

	return useMemo(() => {
		if (!templates) return null;
		return templates.find((template) => template.id === id);
	}, [templates, id]);
}

/**
 * Hook for fetching a specific block by ID
 */
export function useBlockById(id: string) {
	const { data: blocks } = useBlocks();

	return useMemo(() => {
		if (!blocks) return null;
		return blocks.find((block) => block.id === id);
	}, [blocks, id]);
}

/**
 * Hook for fetching HTML content of a template
 */
export function useTemplateHtml() {
	return useMutation({
		mutationFn: async (id: string) => {
			const response = await fetch(
				`${API_CONFIG.baseUrl}/templates/${id}.html`
			);
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
			const response = await fetch(`${API_CONFIG.baseUrl}/blocks/${id}.html`);
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
export function useComponentPreview(id: string, type: 'template' | 'block') {
	const baseUrl = type === 'template' ? 'templates' : 'blocks';
	return `${API_CONFIG.baseUrl}/${baseUrl}/${id}-preview.png`;
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
				category === 'all' || template.categories.includes(category);
			const matchesSearch =
				!searchTerm ||
				template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				template.author.toLowerCase().includes(searchTerm.toLowerCase());

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
			const matchesCategory = category === 'all' || block.categories.includes(category);
			const matchesSearch =
				!searchTerm ||
				block.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				block.author.toLowerCase().includes(searchTerm.toLowerCase());

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