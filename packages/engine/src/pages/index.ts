import type { EditorElement } from '@windbase/core';
import type { StateCreator } from 'zustand';
import { generateId } from '../../../utils/src/generate-id';

export interface Page {
	id: string;
	name: string;
	elements: EditorElement[];
  htmlName?: string;
	createdAt: number;
	updatedAt: number;
}

export interface PagesSlice {
	pages: Map<string, Page> | undefined;
	currentPageId: string | null;
  getCurrentPageElements: () => EditorElement[];
	createPage: (name: string) => string;
	deletePage: (pageId: string) => void;
	updatePage: (
		pageId: string,
		updates: Partial<Omit<Page, 'id' | 'createdAt'>>
	) => void;
	setCurrentPage: (pageId: string | null) => void;
	getCurrentPage: () => Page | null;
	getPageById: (pageId: string) => Page | null;
	getAllPages: () => Page[];
	duplicatePage: (pageId: string, newName?: string) => string | null;
	initializePages: () => void;
	debugPages: () => void;
}

export const createPagesSlice: StateCreator<PagesSlice> = (set, get) => {
	// Create default index page
	const defaultPage: Page = {
		id: 'index',
		name: 'Home',
		elements: [],
		createdAt: Date.now(),
		updatedAt: Date.now()
	};

	// Helper function to ensure pages is always a Map with at least the default page
	const ensurePagesMap = (pages: Map<string, Page> | Record<string, Page> | undefined): Map<string, Page> => {
		let map: Map<string, Page>;
		
		if (pages instanceof Map) {
			map = pages;
		} else if (pages && typeof pages === 'object') {
			// Convert plain object to Map (happens when restored from persistence)
			map = new Map<string, Page>();
			for (const [key, value] of Object.entries(pages)) {
				map.set(key, value);
			}
		} else {
			// If pages is undefined or null, create a new Map
			map = new Map<string, Page>();
		}
		
		// Always ensure we have at least the default index page
		if (!map.has('index')) {
			map.set('index', defaultPage);
		}
		
		return map;
	};

	// Initialize with default pages
	const initialPages = ensurePagesMap(undefined);

	return {
		pages: initialPages,
		currentPageId: 'index',
    getCurrentPageElements: () => {
      const { pages, currentPageId } = get();
      const pagesMap = ensurePagesMap(pages);
      if (!currentPageId) return [];
      const currentPage = pagesMap.get(currentPageId);
      return currentPage?.elements || [];
    },
		createPage: (name: string) => {
			const pageId = generateId();
			const newPage: Page = {
				id: pageId,
				name,
				elements: [],
				createdAt: Date.now(),
				updatedAt: Date.now()
			};

			set((state) => {
				const pagesMap = ensurePagesMap(state.pages);
				const newPages = new Map(pagesMap);
				newPages.set(pageId, newPage);
				return { pages: newPages };
			});

			return pageId;
		},

		deletePage: (pageId: string) => {
			// Don't allow deleting the index page
			if (pageId === 'index') return;

			set((state) => {
				const pagesMap = ensurePagesMap(state.pages);
				const newPages = new Map(pagesMap);
				newPages.delete(pageId);

				// If we're deleting the current page, switch to index
				const newCurrentPageId =
					state.currentPageId === pageId ? 'index' : state.currentPageId;

				return {
					pages: newPages,
					currentPageId: newCurrentPageId
				};
			});
		},

		updatePage: (
			pageId: string,
			updates: Partial<Omit<Page, 'id' | 'createdAt'>>
		) => {
			set((state) => {
				const pagesMap = ensurePagesMap(state.pages);
				const page = pagesMap.get(pageId);
				if (!page) return state;

				const updatedPage: Page = {
					...page,
					...updates,
					updatedAt: Date.now()
				};

				const newPages = new Map(pagesMap);
				newPages.set(pageId, updatedPage);

				return { pages: newPages };
			});
		},

		setCurrentPage: (pageId: string | null) => {
			set({ currentPageId: pageId });
		},

					getCurrentPage: () => {
			const { pages, currentPageId } = get();
			const pagesMap = ensurePagesMap(pages);
			
			// If pages were empty or didn't have the proper structure, update the state
			if (pages !== pagesMap) {
				set({ pages: pagesMap });
			}
			
			// If no current page is set, default to index
			const activePageId = currentPageId || 'index';
			
			// If the current page ID doesn't exist, fall back to index
			const page = pagesMap.get(activePageId);
			if (!page && activePageId !== 'index') {
				// Update the current page to index if the stored one doesn't exist
				set({ currentPageId: 'index' });
				return pagesMap.get('index') || null;
			}
			
			// If currentPageId was null, update it to index
			if (!currentPageId) {
				set({ currentPageId: 'index' });
			}
			
			return page || null;
		},

		getPageById: (pageId: string) => {
			const { pages } = get();
			const pagesMap = ensurePagesMap(pages);
			return pagesMap.get(pageId) || null;
		},

		getAllPages: () => {
			const { pages } = get();
			const pagesMap = ensurePagesMap(pages);
			
			// If pages were empty or didn't have the proper structure, update the state
			if (pages !== pagesMap) {
				set({ pages: pagesMap });
			}
			
			return Array.from(pagesMap.values());
		},

		duplicatePage: (pageId: string, newName?: string) => {
			const { pages } = get();
			const pagesMap = ensurePagesMap(pages);
			const originalPage = pagesMap.get(pageId);

			if (!originalPage) return null;

			const newPageId = generateId();
			const duplicatedPage: Page = {
				id: newPageId,
				name: newName || `${originalPage.name} Copy`,
				elements: JSON.parse(JSON.stringify(originalPage.elements)), // Deep copy
				createdAt: Date.now(),
				updatedAt: Date.now()
			};

			set((state) => {
				const pagesMap = ensurePagesMap(state.pages);
				const newPages = new Map(pagesMap);
				newPages.set(newPageId, duplicatedPage);
				return { pages: newPages };
			});

			return newPageId;
		},

		initializePages: () => {
			set((state) => {
				const pagesMap = ensurePagesMap(state.pages);
				const currentPageId = state.currentPageId || 'index';
				
				// Ensure current page exists, otherwise default to index
				const finalCurrentPageId = pagesMap.has(currentPageId) ? currentPageId : 'index';
				
				return {
					pages: pagesMap,
					currentPageId: finalCurrentPageId
				};
			});
		},

		debugPages: () => {
			const { pages, currentPageId } = get();
			console.log('🐛 DEBUG - Pages state:', {
				pages,
				currentPageId,
				isMap: pages instanceof Map,
				isObject: pages && typeof pages === 'object' && !(pages instanceof Map),
				isUndefined: pages === undefined,
				keys: pages instanceof Map ? Array.from(pages.keys()) : Object.keys(pages || {}),
				values: pages instanceof Map ? Array.from(pages.values()) : Object.values(pages || {})
			});
		}
	};
};
