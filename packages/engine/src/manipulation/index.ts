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
	elements: [],
	responsiveMode: 'desktop',

	// Add element
	addElement: (element: Omit<EditorElement, 'id'>, parentId?: string) => {
		const newElement: EditorElement = {
			...element,
			id: crypto.randomUUID(),
			parent: parentId,
		};

		set((state) => {
			if (parentId) {
				// Add to specific parent
				const addToParent = (elements: EditorElement[]): EditorElement[] => {
					return elements.map((el) => {
						if (el.id === parentId) {
							return {
								...el,
								children: [...el.children, newElement],
							};
						}
						if (el.children.length > 0) {
							return {
								...el,
								children: addToParent(el.children),
							};
						}
						return el;
					});
				};

				return {
					elements: addToParent(state.elements),
				};
			} else {
				// Add to root
				return {
					elements: [...state.elements, newElement],
				};
			}
		});

		// Save to history after adding
		setTimeout(() => get().saveToHistory(), 0);
	},

	// Update element
	updateElement: (id: string, updates: Partial<EditorElement>) => {
		set((state) => {
			const updateInElements = (elements: EditorElement[]): EditorElement[] => {
				return elements.map((el) => {
					if (el.id === id) {
						return { ...el, ...updates };
					}
					if (el.children.length > 0) {
						return {
							...el,
							children: updateInElements(el.children),
						};
					}
					return el;
				});
			};

			return {
				elements: updateInElements(state.elements),
			};
		});

		// Save to history after updating
		setTimeout(() => get().saveToHistory(), 0);
	},

	// Delete element
	deleteElement: (id: string) => {
		set((state) => ({
			elements: removeElementById(state.elements, id),
			selectedElement:
				state.selectedElement?.id === id ? null : state.selectedElement,
		}));

		// Save to history after deleting
		setTimeout(() => get().saveToHistory(), 0);
	},

	// Move element to new parent
	moveElement: (elementId: string, newParentId: string, position: number) => {
		set((state) => {
			const elementToMove = findElementById(state.elements, elementId);
			if (!elementToMove) return state;

			// Remove from current position
			const elementsWithoutMoved = removeElementById(state.elements, elementId);

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

			return {
				elements: addToNewParent(elementsWithoutMoved),
			};
		});

		// Save to history after moving
		setTimeout(() => get().saveToHistory(), 0);
	},

	// Move element to top level
	moveElementToTop: (elementId: string) => {
		set((state) => {
			const elementToMove = findElementById(state.elements, elementId);
			if (!elementToMove) return state;

			// Remove from current position
			const elementsWithoutMoved = removeElementById(state.elements, elementId);

			// Update parent reference and add to top
			const updatedElement = { ...elementToMove, parent: undefined };

			return {
				elements: [...elementsWithoutMoved, updatedElement],
			};
		});

		// Save to history after moving
		setTimeout(() => get().saveToHistory(), 0);
	},

	// Move element within parent
	moveElementInParent: (elementId: string, position: number) => {
		set((state) => {
			const elementToMove = findElementById(state.elements, elementId);
			if (!elementToMove) return state;

			const parentId = elementToMove.parent;
			if (!parentId) {
				// Moving within root elements
				const elementsWithoutMoved = state.elements.filter(
					(el) => el.id !== elementId
				);
				elementsWithoutMoved.splice(position, 0, elementToMove);
				return { elements: elementsWithoutMoved };
			}

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

			return {
				elements: updateParentChildren(state.elements),
			};
		});

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
	},
});
