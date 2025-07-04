import { create } from 'zustand';
import type { ElementType } from '@/lib/elementTypes';

export interface BuilderElement {
	id: string;
	type: ElementType;
	tag: string;
	classes: string[];
	content?: string;
	isContentEditable?: boolean;
	children: BuilderElement[];
	parent?: string;
}

interface BuilderState {
	sidebarView: 'default' | 'layers';
	elements: BuilderElement[];
	selectedElement: BuilderElement | null;
	hoveredElement: BuilderElement | null;
	history: BuilderElement[][];
	historyIndex: number;
}

interface BuilderActions {
	selectElement: (id: string | null) => void;
	hoverElement: (id: string | null) => void;
	addElement: (element: Omit<BuilderElement, 'id'>, parentId?: string) => void;
	updateElement: (id: string, updates: Partial<BuilderElement>) => void;
	deleteElement: (id: string) => void;
	moveElement: (
		elementId: string,
		newParentId: string,
		position: number
	) => void;
	moveElementToTop: (elementId: string) => void;
	moveElementInParent: (elementId: string, position: number) => void;
	updateClasses: (id: string, classes: string[]) => void;
	undo: () => void;
	redo: () => void;
	canUndo: boolean;
	canRedo: boolean;
	loadTemplate: (template: BuilderElement[]) => void;
	exportHtml: () => string;
	setSidebarView: (view: 'default' | 'layers') => void;
}

// Helper function to find element by ID recursively
const findElementById = (
	elements: BuilderElement[],
	id: string
): BuilderElement | null => {
	for (const element of elements) {
		if (element.id === id) {
			return element;
		}
		if (element.children.length > 0) {
			const found = findElementById(element.children, id);
			if (found) return found;
		}
	}
	return null;
};

// Helper function to remove element by ID recursively
const removeElementById = (
	elements: BuilderElement[],
	id: string
): BuilderElement[] => {
	return elements
		.filter((element) => element.id !== id)
		.map((element) => ({
			...element,
			children: removeElementById(element.children, id),
		}));
};

// Helper function to update element parent references
const updateParentReferences = (
	elements: BuilderElement[],
	parentId?: string
): BuilderElement[] => {
	return elements.map((element) => ({
		...element,
		parent: parentId,
		children: updateParentReferences(element.children, element.id),
	}));
};

export const useBuilder = create<BuilderState & BuilderActions>((set, get) => ({
	sidebarView: 'default',
	elements: [],
	selectedElement: null,
	hoveredElement: null,
	history: [],
	historyIndex: 0,
	canUndo: false,
	canRedo: false,

	// Actions
	selectElement: (id) => {
		set({ selectedElement: id ? findElementById(get().elements, id) : null });
	},
	hoverElement: (id) => {
		set({ hoveredElement: id ? findElementById(get().elements, id) : null });
	},
	addElement: (element, parentId) => {
		const newElement: BuilderElement = {
			...element,
			id: crypto.randomUUID(),
			parent: parentId,
		};

		set((state) => {
			if (parentId) {
				// Add to specific parent
				const addToParent = (elements: BuilderElement[]): BuilderElement[] => {
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
				// Add to root level
				return {
					elements: [...state.elements, newElement],
				};
			}
		});
	},
	updateElement: (id, updates) => {
		set((state) => {
			const updateInElements = (
				elements: BuilderElement[]
			): BuilderElement[] => {
				return elements.map((element) => {
					if (element.id === id) {
						return { ...element, ...updates };
					}
					if (element.children.length > 0) {
						return {
							...element,
							children: updateInElements(element.children),
						};
					}
					return element;
				});
			};

			const updatedElements = updateInElements(state.elements);

			// Update selectedElement reference if it's the same element
			const updatedSelectedElement =
				state.selectedElement?.id === id
					? findElementById(updatedElements, id)
					: state.selectedElement;

			// Update hoveredElement reference if it's the same element
			const updatedHoveredElement =
				state.hoveredElement?.id === id
					? findElementById(updatedElements, id)
					: state.hoveredElement;

			return {
				elements: updatedElements,
				selectedElement: updatedSelectedElement,
				hoveredElement: updatedHoveredElement,
			};
		});
	},
	deleteElement: (id) => {
		set((state) => ({
			elements: removeElementById(state.elements, id),
			selectedElement:
				state.selectedElement?.id === id ? null : state.selectedElement,
		}));
	},
	moveElement: (elementId, newParentId, position) => {
		set((state) => {
			// Find the element to move
			const elementToMove = findElementById(state.elements, elementId);
			if (!elementToMove) return state;

			// Remove element from current position
			let newElements = removeElementById(state.elements, elementId);

			// Add element to new position
			const movedElement = { ...elementToMove, parent: newParentId };

			if (newParentId === 'root') {
				// Add to root level
				newElements.splice(position, 0, movedElement);
			} else {
				// Add to specific parent
				const addToParent = (elements: BuilderElement[]): BuilderElement[] => {
					return elements.map((el) => {
						if (el.id === newParentId) {
							const newChildren = [...el.children];
							newChildren.splice(position, 0, movedElement);
							return {
								...el,
								children: newChildren,
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
				newElements = addToParent(newElements);
			}

			// Update parent references
			newElements = updateParentReferences(newElements);

			return {
				elements: newElements,
			};
		});
	},
	moveElementToTop: (elementId) => {
		const state = get();
		const element = findElementById(state.elements, elementId);
		if (element?.parent) {
			state.moveElement(elementId, element.parent, 0);
		}
	},
	moveElementInParent: (elementId, position) => {
		const state = get();
		const element = findElementById(state.elements, elementId);
		if (element) {
			state.moveElement(elementId, element.parent || 'root', position);
		}
	},
	updateClasses: (id, classes) => {
		set((state) => {
			const updateInElements = (
				elements: BuilderElement[]
			): BuilderElement[] => {
				return elements.map((element) => {
					if (element.id === id) {
						return { ...element, classes };
					}
					if (element.children.length > 0) {
						return {
							...element,
							children: updateInElements(element.children),
						};
					}
					return element;
				});
			};

			const updatedElements = updateInElements(state.elements);

			// Update selectedElement reference if it's the same element
			const updatedSelectedElement =
				state.selectedElement?.id === id
					? findElementById(updatedElements, id)
					: state.selectedElement;

			// Update hoveredElement reference if it's the same element
			const updatedHoveredElement =
				state.hoveredElement?.id === id
					? findElementById(updatedElements, id)
					: state.hoveredElement;

			return {
				elements: updatedElements,
				selectedElement: updatedSelectedElement,
				hoveredElement: updatedHoveredElement,
			};
		});
	},
	undo: () => {
		// TODO: Implement
	},
	redo: () => {
		// TODO: Implement
	},
	loadTemplate: (template) => {
		set({
			elements: updateParentReferences(template),
		});
	},
	exportHtml: () => {
		return '';
	},
	setSidebarView: (view) => {
		set({
			sidebarView: view,
		});
	},
}));
