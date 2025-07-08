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
	sidebarView: 'default',

	// Selection actions
	selectElement: (id: string | null) => {
		set({ selectedElement: id ? findElementById(get().elements, id) : null });
	},

	hoverElement: (id: string | null) => {
		set({ hoveredElement: id ? findElementById(get().elements, id) : null });
	},

	setSidebarView: (view: 'default' | 'layers') => {
		set({ sidebarView: view });
	},

	getParentIds: (elementId: string) => {
		const elements = get().elements;
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
