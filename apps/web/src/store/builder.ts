import { create } from 'zustand';
import type { ElementCategory } from '@/lib/elementTypes';
import { exportToFullHtml } from '@/lib/exporters';
import { coreToEditor, editorToCore } from '@/lib/transformers';
import type { CoreElement, EditorElement } from '@/lib/types';

// Legacy type for backward compatibility - will be removed in Phase 4
export interface BuilderElement {
	id: string;
	type: ElementCategory;
	tag: string;
	classes: string[];
	content?: string;
	isContentEditable?: boolean;
	inputAttributes?: AttributeInput[];
	children: BuilderElement[];
	parent?: string;
	attributes?: Record<string, string>;
}

// Legacy AttributeInput type - moved to types/element-definition.ts
type AttributeInput = {
	attribute: string;
	type: 'text' | 'select';
	label?: string;
	options?: string[];
	value?: string;
};

interface BuilderState {
	sidebarView: 'default' | 'layers';
	elements: EditorElement[];
	selectedElement: EditorElement | null;
	hoveredElement: EditorElement | null;
	history: EditorElement[][];
	historyIndex: number;
	responsiveMode: 'desktop' | 'mobile';
}

interface BuilderActions {
	selectElement: (id: string | null) => void;
	hoverElement: (id: string | null) => void;
	addElement: (element: Omit<EditorElement, 'id'>, parentId?: string) => void;
	updateElement: (id: string, updates: Partial<EditorElement>) => void;
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
	loadTemplate: (template: EditorElement[]) => void;
	exportHtml: () => string;
	setSidebarView: (view: 'default' | 'layers') => void;
	getParentIds: (elementId: string) => string[];
	setResponsiveMode: (mode: 'desktop' | 'mobile') => void;
	// New transformation methods
	loadFromCore: (coreElements: CoreElement[]) => void;
	exportToCore: () => CoreElement[];
	// Helper method to save state to history
	saveToHistory: () => void;
}

// Helper function to find element by ID recursively
const findElementById = (
	elements: EditorElement[],
	id: string
): EditorElement | null => {
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
	elements: EditorElement[],
	id: string
): EditorElement[] => {
	return elements
		.filter((element) => element.id !== id)
		.map((element) => ({
			...element,
			children: removeElementById(element.children, id),
		}));
};

// Helper function to update element parent references
const updateParentReferences = (
	elements: EditorElement[],
	parentId?: string
): EditorElement[] => {
	return elements.map((element) => ({
		...element,
		parent: parentId,
		children: updateParentReferences(element.children, element.id),
	}));
};

// Helper function to find all parent IDs of an element
const findAllParentIds = (
	elements: EditorElement[],
	targetId: string,
	currentParents: string[] = []
): string[] => {
	for (const element of elements) {
		// If this element has the target as a direct child
		if (element.children.some((child) => child.id === targetId)) {
			return [...currentParents, element.id];
		}

		// If this element has children, search recursively
		if (element.children.length > 0) {
			const found = findAllParentIds(element.children, targetId, [
				...currentParents,
				element.id,
			]);
			if (found.length > 0) {
				return found;
			}
		}
	}
	return [];
};

export const useBuilder = create<BuilderState & BuilderActions>((set, get) => ({
	sidebarView: 'default',
	elements: [],
	selectedElement: null,
	hoveredElement: null,
	history: [[]], // Initialize with empty state
	historyIndex: 0,
	canUndo: false,
	canRedo: false,
	responsiveMode: 'desktop',

	// Helper method to save current state to history (called after actions)
	saveToHistory: () => {
		const state = get();
		const currentElements = JSON.parse(JSON.stringify(state.elements));

		// Don't save if the current state is the same as the last saved state
		if (
			state.history.length > 0 &&
			JSON.stringify(state.history[state.history.length - 1]) ===
				JSON.stringify(currentElements)
		) {
			return;
		}

		// Remove any future history if we're not at the end
		const newHistory = state.history.slice(0, state.historyIndex + 1);
		newHistory.push(currentElements);

		// Limit history to 50 entries
		if (newHistory.length > 50) {
			newHistory.shift();
		}

		set({
			history: newHistory,
			historyIndex: newHistory.length - 1,
			canUndo: newHistory.length > 1,
			canRedo: false,
		});
	},

	// Actions
	selectElement: (id) => {
		set({ selectedElement: id ? findElementById(get().elements, id) : null });
	},
	hoverElement: (id) => {
		set({ hoveredElement: id ? findElementById(get().elements, id) : null });
	},
	addElement: (element, parentId) => {
		const newElement: EditorElement = {
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

		// Save current state to history after making changes
		get().saveToHistory();
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

		// Save current state to history after making changes
		get().saveToHistory();
	},
	deleteElement: (id) => {
		set((state) => ({
			elements: removeElementById(state.elements, id),
			selectedElement:
				state.selectedElement?.id === id ? null : state.selectedElement,
		}));

		// Save current state to history after making changes
		get().saveToHistory();
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

		// Save current state to history after making changes
		get().saveToHistory();
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

		// Save current state to history after making changes
		get().saveToHistory();
	},
	undo: () => {
		const state = get();
		if (state.historyIndex > 0) {
			const prevElements = state.history[state.historyIndex - 1];
			const newHistoryIndex = state.historyIndex - 1;

			set({
				elements: JSON.parse(JSON.stringify(prevElements)),
				historyIndex: newHistoryIndex,
				canUndo: newHistoryIndex > 0,
				canRedo: true,
			});
		}
	},
	redo: () => {
		const state = get();
		if (state.historyIndex < state.history.length - 1) {
			const nextElements = state.history[state.historyIndex + 1];
			const newHistoryIndex = state.historyIndex + 1;

			set({
				elements: JSON.parse(JSON.stringify(nextElements)),
				historyIndex: newHistoryIndex,
				canUndo: true,
				canRedo: newHistoryIndex < state.history.length - 1,
			});
		}
	},
	loadTemplate: (template) => {
		set({
			elements: updateParentReferences(template),
		});

		// Save current state to history after loading template
		get().saveToHistory();
	},
	exportHtml: () => {
		const coreElements = get().exportToCore();
		return exportToFullHtml(coreElements);
	},
	setSidebarView: (view) => {
		set({
			sidebarView: view,
		});
	},
	getParentIds: (elementId) => {
		const elements = get().elements;
		return findAllParentIds(elements, elementId);
	},
	setResponsiveMode: (mode) => {
		set({
			responsiveMode: mode,
		});
	},
	loadFromCore: (coreElements) => {
		const editorElements = coreElements.map((element) => coreToEditor(element));
		set({
			elements: editorElements,
		});
	},
	exportToCore: () => {
		const elements = get().elements;
		return elements.map((element) => editorToCore(element));
	},
}));
