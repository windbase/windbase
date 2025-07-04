import { create } from 'zustand';
import type { ElementType } from '@/lib/elementTypes';

export interface BuilderElement {
	id: string;
	type: ElementType;
	tag: string;
	classes: string[];
	content?: string;
	children: BuilderElement[];
	parent?: string;
}

interface BuilderState {
	sidebarView: 'default' | 'layers';
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
		//  TODO: Implement
	},
	hoverElement: (id) => {
		//  TODO: Implement
	},
	addElement: (element) => {
		const newElement: BuilderElement = {
			...element,
			id: crypto.randomUUID(),
		};
		set((state) => ({
			elements: [...state.elements, newElement],
		}));
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
	moveElementToTop: (elementId) => {
		//  TODO: Implement
	},
	moveElementInParent: (elementId, position) => {
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
	setSidebarView: (view) => {
		set({
			sidebarView: view,
		});
	},
}));
