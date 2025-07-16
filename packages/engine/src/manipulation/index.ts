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
		setTimeout(() => get().saveToHistoryImmediate(), 0);
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
		setTimeout(() => get().saveToHistoryImmediate(), 0);
	},

	// Delete multiple elements
	deleteElements: (ids: string[]) => {
		const currentPage = get().getCurrentPage();
		if (!currentPage) return;

		let updatedElements = currentPage.elements;

		// Delete each element
		for (const id of ids) {
			updatedElements = removeElementById(updatedElements, id);
		}

		get().updatePage(currentPage.id, { elements: updatedElements });

		// Clear selection if any selected elements were deleted
		const currentSelected = get().selectedElements || [];
		const remainingSelected = currentSelected.filter(
			el => !ids.includes(el.id)
		);

		if (remainingSelected.length !== currentSelected.length) {
			get().selectElements(remainingSelected.map(el => el.id));
		}

		// Save to history after deleting
		setTimeout(() => get().saveToHistoryImmediate(), 0);
	},

	// Move element to new parent
	moveElement: (elementId: string, newParentId: string, position: number) => {
		const currentPage = get().getCurrentPage();
		if (!currentPage) return;

		const elementToMove = findElementById(currentPage.elements, elementId);
		if (!elementToMove) return;

		// Remove from current position
		const elementsWithoutMoved = removeElementById(
			currentPage.elements,
			elementId
		);

		// Handle root level moves separately
		if (newParentId === 'root') {
			// Update parent reference for root level
			const updatedElement = { ...elementToMove, parent: undefined };

			// Insert at the specified position in root elements
			const updatedElements = [...elementsWithoutMoved];
			updatedElements.splice(position, 0, updatedElement);

			get().updatePage(currentPage.id, { elements: updatedElements });
		} else {
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
		}

		// Save to history after moving
		setTimeout(() => get().saveToHistoryImmediate(), 0);
	},

	// Move element to top level
	moveElementToTop: (elementId: string) => {
		const currentPage = get().getCurrentPage();
		if (!currentPage) return;

		const elementToMove = findElementById(currentPage.elements, elementId);
		if (!elementToMove) return;

		// Remove from current position
		const elementsWithoutMoved = removeElementById(
			currentPage.elements,
			elementId
		);

		// Update parent reference and add to top
		const updatedElement = { ...elementToMove, parent: undefined };
		const updatedElements = [...elementsWithoutMoved, updatedElement];

		get().updatePage(currentPage.id, { elements: updatedElements });

		// Save to history after moving
		setTimeout(() => get().saveToHistoryImmediate(), 0);
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
		setTimeout(() => get().saveToHistoryImmediate(), 0);
	},

	// Update classes
	updateClasses: (id: string, classes: string[]) => {
		get().updateElement(id, { classes });
	},

	// Set responsive mode
	setResponsiveMode: (mode: 'desktop' | 'mobile') => {
		set({ responsiveMode: mode });
	},

	// Move multiple elements to new parent
	moveElements: (elementIds: string[], newParentId: string, position: number) => {
		const currentPage = get().getCurrentPage();
		if (!currentPage) return;

		// Get all elements to move
		const allElements = get().getCurrentPageElements();
		const elementsToMove = elementIds.map(id =>
			findElementById(allElements, id)
		).filter(Boolean) as EditorElement[];

		if (elementsToMove.length === 0) return;

		// Remove all elements from their current positions
		let updatedElements = currentPage.elements;
		for (const elementId of elementIds) {
			updatedElements = removeElementById(updatedElements, elementId);
		}

		// Add elements to new parent
		const addElementsToParent = (elements: EditorElement[]): EditorElement[] => {
			return elements.map((el) => {
				if (el.id === newParentId) {
					// Insert all elements at the specified position
					const newChildren = [...el.children];
					elementsToMove.forEach((elementToMove, index) => {
						const updatedElement = { ...elementToMove, parent: newParentId };
						newChildren.splice(position + index, 0, updatedElement);
					});
					return { ...el, children: newChildren };
				}
				if (el.children.length > 0) {
					return { ...el, children: addElementsToParent(el.children) };
				}
				return el;
			});
		};

		if (newParentId === 'root') {
			// Add to root level
			const newElements = [...updatedElements];
			elementsToMove.forEach((elementToMove, index) => {
				const updatedElement = { ...elementToMove, parent: undefined };
				newElements.splice(position + index, 0, updatedElement);
			});
			updatedElements = newElements;
		} else {
			// Add to specific parent
			updatedElements = addElementsToParent(updatedElements);
		}

		get().updatePage(currentPage.id, { elements: updatedElements });

		// Save to history after moving
		setTimeout(() => get().saveToHistoryImmediate(), 0);
	},

	// Duplicate element
	duplicateElement: (element: EditorElement) => {
		const newElement: EditorElement = {
			...element,
			id: crypto.randomUUID()
		};
		get().addElement(newElement);
		return newElement.id;
	}
});
