import type {
	AttributeInput,
	CoreElement,
	EditorElement
} from '@windbase/core';

// History slice
export interface HistorySlice {
	history: EditorElement[][];
	historyIndex: number;
	canUndo: boolean;
	canRedo: boolean;
	saveToHistory: () => void;
	undo: () => void;
	redo: () => void;
}

// Selection slice
export interface SelectionSlice {
	selectedElement: EditorElement | null;
	hoveredElement: EditorElement | null;
	sidebarView: 'default' | 'layers';
	selectElement: (id: string | null) => void;
	hoverElement: (id: string | null) => void;
	setSidebarView: (view: 'default' | 'layers') => void;
	getParentIds: (elementId: string) => string[];
}

// Manipulation slice
export interface ManipulationSlice {
	elements: EditorElement[];
	responsiveMode: 'desktop' | 'mobile';
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
	setResponsiveMode: (mode: 'desktop' | 'mobile') => void;
}

// Template slice
export interface TemplateSlice {
	loadTemplate: (template: EditorElement[]) => void;
	loadFromCore: (coreElements: CoreElement[]) => void;
	exportToCore: () => CoreElement[];
	exportHtml: () => string;
}

// Complete store interface
export interface BuilderStore
	extends HistorySlice,
		SelectionSlice,
		ManipulationSlice,
		TemplateSlice {}

// Legacy types for backward compatibility - will be removed in Phase 4
export interface BuilderElement {
	id: string;
	type: string;
	tag: string;
	classes: string[];
	content?: string;
	isContentEditable?: boolean;
	inputAttributes?: AttributeInput[];
	children: BuilderElement[];
	parent?: string;
	attributes?: Record<string, string>;
}
