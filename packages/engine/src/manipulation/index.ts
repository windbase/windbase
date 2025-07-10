import type { EditorElement } from '@windbase/core';
import type { StateCreator } from 'zustand';
import { findElementById, removeElementById } from '../store/helpers';
import type { BuilderStore, ManipulationSlice } from '../store/types';

export const createManipulationSlice: StateCreator<
	BuilderStore,
	[],
	[],
	ManipulationSlice
> = (set, get) => ({
	responsiveMode: 'desktop',

	// Get current page elements
	getCurrentPageElements: () => {
		const currentPage = get().getCurrentPage();
		return currentPage?.elements || [];
	},

	// Add element
	addElement: (element: Omit<EditorElement, 'id'>, parentId?: string) => {
		const newElement: EditorElement = {
			...element,
			id: crypto.randomUUID(),
			parent: parentId
		};

		const currentPage = get().getCurrentPage();
		if (!currentPage) return;

		if (parentId) {
			// Add to specific parent
			const addToParent = (elements: EditorElement[]): EditorElement[] => {
				return elements.map((el) => {
					if (el.id === parentId) {
						return {
							...el,
							children: [...el.children, newElement]
						};
					}
					if (el.children.length > 0) {
						return {
							...el,
							children: addToParent(el.children)
						};
					}
					return el;
				});
			};

			const updatedElements = addToParent(currentPage.elements);
			get().updatePage(currentPage.id, { elements: updatedElements });
		} else {
			// Add to root
			const updatedElements = [...currentPage.elements, newElement];
			get().updatePage(currentPage.id, { elements: updatedElements });
		}

		// Save to history after adding
		setTimeout(() => get().saveToHistory(), 0);
	},

	// Update element
	updateElement: (id: string, updates: Partial<EditorElement>) => {
		const currentPage = get().getCurrentPage();
		if (!currentPage) return;

		const updateInElements = (elements: EditorElement[]): EditorElement[] => {
			return elements.map((el) => {
				if (el.id === id) {
					return { ...el, ...updates };
				}
				if (el.children.length > 0) {
					return {
						...el,
						children: updateInElements(el.children)
					};
				}
				return el;
			});
		};

		const updatedElements = updateInElements(currentPage.elements);
		get().updatePage(currentPage.id, { elements: updatedElements });

		// If the selected element is being updated, refresh it
		set((state) => {
			if (state.selectedElement?.id === id) {
				return {
					selectedElement: findElementById(updatedElements, id)
				};
			}
			return state;
		});

		// Save to history after updating
		setTimeout(() => get().saveToHistory(), 0);
	},

	// Delete element
	deleteElement: (id: string) => {
		const currentPage = get().getCurrentPage();
		if (!currentPage) return;

		const updatedElements = removeElementById(currentPage.elements, id);
		get().updatePage(currentPage.id, { elements: updatedElements });

		set((state) => {
			if (state.selectedElement?.id === id) {
				const parentId = state.selectedElement?.parent;
				if (parentId) {
					return {
						selectedElement: findElementById(updatedElements, parentId)
					};
				}
				return {
					selectedElement: null
				};
			}
			return state;
		});

		// Save to history after deleting
		setTimeout(() => get().saveToHistory(), 0);
	},

	// Move element to new parent
	moveElement: (elementId: string, newParentId: string, position: number) => {
		const currentPage = get().getCurrentPage();
		if (!currentPage) return;

		const elementToMove = findElementById(currentPage.elements, elementId);
		if (!elementToMove) return;

		// Remove from current position
		const elementsWithoutMoved = removeElementById(currentPage.elements, elementId);

		// Update parent reference
		const updatedElement = { ...elementToMove, parent: newParentId };

		// Add to new position
		const addToNewParent = (elements: EditorElement[]): EditorElement[] => {
			return elements.map((el) => {
				if (el.id === newParentId) {
					const newChildren = [...el.children];
					newChildren.splice(position, 0, updatedElement);
					return { ...el, children: newChildren };
				}
				if (el.children.length > 0) {
					return { ...el, children: addToNewParent(el.children) };
				}
				return el;
			});
		};

		const updatedElements = addToNewParent(elementsWithoutMoved);
		get().updatePage(currentPage.id, { elements: updatedElements });

		// Save to history after moving
		setTimeout(() => get().saveToHistory(), 0);
	},

	// Move element to top level
	moveElementToTop: (elementId: string) => {
		const currentPage = get().getCurrentPage();
		if (!currentPage) return;

		const elementToMove = findElementById(currentPage.elements, elementId);
		if (!elementToMove) return;

		// Remove from current position
		const elementsWithoutMoved = removeElementById(currentPage.elements, elementId);

		// Update parent reference and add to top
		const updatedElement = { ...elementToMove, parent: undefined };
		const updatedElements = [...elementsWithoutMoved, updatedElement];
		
		get().updatePage(currentPage.id, { elements: updatedElements });

		// Save to history after moving
		setTimeout(() => get().saveToHistory(), 0);
	},

	// Move element within parent
	moveElementInParent: (elementId: string, position: number) => {
		const currentPage = get().getCurrentPage();
		if (!currentPage) return;

		const elementToMove = findElementById(currentPage.elements, elementId);
		if (!elementToMove) return;

		const parentId = elementToMove.parent;
		let updatedElements: EditorElement[];

		if (!parentId) {
			// Moving within root elements
			const elementsWithoutMoved = currentPage.elements.filter(
				(el) => el.id !== elementId
			);
			elementsWithoutMoved.splice(position, 0, elementToMove);
			updatedElements = elementsWithoutMoved;
		} else {
			// Moving within parent
			const updateParentChildren = (
				elements: EditorElement[]
			): EditorElement[] => {
				return elements.map((el) => {
					if (el.id === parentId) {
						const childrenWithoutMoved = el.children.filter(
							(child) => child.id !== elementId
						);
						childrenWithoutMoved.splice(position, 0, elementToMove);
						return { ...el, children: childrenWithoutMoved };
					}
					if (el.children.length > 0) {
						return { ...el, children: updateParentChildren(el.children) };
					}
					return el;
				});
			};

			updatedElements = updateParentChildren(currentPage.elements);
		}

		get().updatePage(currentPage.id, { elements: updatedElements });

		// Save to history after moving
		setTimeout(() => get().saveToHistory(), 0);
	},

	// Update classes
	updateClasses: (id: string, classes: string[]) => {
		get().updateElement(id, { classes });
	},

	// Set responsive mode
	setResponsiveMode: (mode: 'desktop' | 'mobile') => {
		set({ responsiveMode: mode });
	}
});
