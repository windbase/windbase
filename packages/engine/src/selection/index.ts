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
	selectedElements: [],
	hoveredElement: null,
	sidebarView: 'pages',

	// Selection actions
	selectElement: (id: string | null) => {
		const elements = get().getCurrentPageElements();
		const selectedElement = id ? findElementById(elements, id) : null;
		set({
			selectedElement,
			selectedElements: selectedElement ? [selectedElement] : []
		});
	},

	selectElements: (ids: string[]) => {
		const elements = get().getCurrentPageElements();
		const selectedElements = ids.map(id => findElementById(elements, id)).filter(Boolean) as EditorElement[];
		set({
			selectedElements,
			selectedElement: selectedElements[0] || null
		});
	},

	selectElementsRange: (startId: string, endId: string) => {
		const elements = get().getCurrentPageElements();

		// Helper function to flatten elements in order
		const flattenElements = (elements: EditorElement[]): EditorElement[] => {
			const result: EditorElement[] = [];
			for (const element of elements) {
				result.push(element);
				if (element.children.length > 0) {
					result.push(...flattenElements(element.children));
				}
			}
			return result;
		};

		const flatElements = flattenElements(elements);
		const startIndex = flatElements.findIndex(el => el.id === startId);
		const endIndex = flatElements.findIndex(el => el.id === endId);

		if (startIndex !== -1 && endIndex !== -1) {
			const minIndex = Math.min(startIndex, endIndex);
			const maxIndex = Math.max(startIndex, endIndex);
			const selectedElements = flatElements.slice(minIndex, maxIndex + 1);

			set({
				selectedElements,
				selectedElement: selectedElements[0] || null
			});
		}
	},

	toggleElementSelection: (id: string) => {
		const elements = get().getCurrentPageElements();
		const element = findElementById(elements, id);
		if (!element) return;

		const currentSelected = get().selectedElements;
		const isSelected = currentSelected.some(el => el.id === id);

		if (isSelected) {
			// Remove from selection
			const newSelected = currentSelected.filter(el => el.id !== id);
			set({
				selectedElements: newSelected,
				selectedElement: newSelected[0] || null
			});
		} else {
			// Add to selection
			const newSelected = [...currentSelected, element];
			set({
				selectedElements: newSelected,
				selectedElement: newSelected[0] || null
			});
		}
	},

	clearSelection: () => {
		set({ selectedElement: null, selectedElements: [] });
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
