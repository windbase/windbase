import type { EditorElement } from '@windbase/core';
import type { StateCreator } from 'zustand';
import { findElementById } from '../store/helpers';
import type { BuilderStore, SelectionSlice } from '../store/types';

export const createSelectionSlice: StateCreator<
	BuilderStore,
	[],
	[],
	SelectionSlice
> = (set, get) => ({
	selectedElement: null,
	hoveredElement: null,
	sidebarView: 'layers',

	// Selection actions
	selectElement: (id: string | null) => {
		const elements = get().getCurrentPageElements();
		set({ selectedElement: id ? findElementById(elements, id) : null });
	},

	hoverElement: (id: string | null) => {
		const elements = get().getCurrentPageElements();
		set({ hoveredElement: id ? findElementById(elements, id) : null });
	},

	setSidebarView: (view: 'pages' | 'layers') => {
		set({ sidebarView: view });
	},

	getParentIds: (elementId: string) => {
		const elements = get().getCurrentPageElements();
		const findParents = (
			elements: EditorElement[],
			targetId: string,
			currentParents: string[] = []
		): string[] => {
			for (const element of elements) {
				if (element.children.some((child) => child.id === targetId)) {
					return [...currentParents, element.id];
				}

				if (element.children.length > 0) {
					const found = findParents(element.children, targetId, [
						...currentParents,
						element.id
					]);
					if (found.length > 0) {
						return found;
					}
				}
			}
			return [];
		};

		return findParents(elements, elementId);
	}
});
