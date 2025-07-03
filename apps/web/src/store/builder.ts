import { create } from 'zustand';

export interface BuilderElement {
	id: string;
	type: string;
	tag: string;
	classes: string[];
	content?: string;
	children: BuilderElement[];
	parent?: string;
}

interface BuilderState {
	elements: BuilderElement[];
	selectedElement: string | null;
	hoveredElement: string | null;
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
	updateClasses: (id: string, classes: string[]) => void;
	undo: () => void;
	redo: () => void;
	canUndo: boolean;
	canRedo: boolean;
	loadTemplate: (template: BuilderElement[]) => void;
	exportHtml: () => string;
}

export const useBuilder = create<BuilderState & BuilderActions>((set, get) => ({
	elements: [],
	selectedElement: null,
	hoveredElement: null,
	history: [],
	historyIndex: 0,
	canUndo: false,
	canRedo: false,

	// Actions
	selectElement: (id) => {
		//  TODO: Implement
	},
	hoverElement: (id) => {
		//  TODO: Implement
	},
	addElement: (element, parentId) => {
		//  TODO: Implement
	},
	updateElement: (id, updates) => {
		//  TODO: Implement
	},
	deleteElement: (id) => {
		//  TODO: Implement
	},
	moveElement: (elementId, newParentId, position) => {
		//  TODO: Implement
	},
	updateClasses: (id, classes) => {
		//  TODO: Implement
	},
	undo: () => {
		//  TODO: Implement
	},
	redo: () => {
		//  TODO: Implement
	},
	loadTemplate: (template) => {
		//  TODO: Implement
	},
	exportHtml: () => {
		return '';
	},
}));
