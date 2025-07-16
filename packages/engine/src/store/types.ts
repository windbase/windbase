import type {
	AttributeInput,
	CoreElement,
	EditorElement
} from '@windbase/core';
import type { PagesSlice } from '../pages';

// History slice
export interface HistorySlice {
	history: EditorElement[][];
	historyIndex: number;
	canUndo: boolean;
	canRedo: boolean;
	saveToHistory: () => void;
	saveToHistoryImmediate: () => void;
	undo: () => void;
	redo: () => void;
}

// Global config slice
export interface GlobalConfigSlice {
	tailwindCSSConfig: string;
	setTailwindCSSConfig: (config: string) => void;
}

// Selection slice
export interface SelectionSlice {
	selectedElement: EditorElement | null;
	hoveredElement: EditorElement | null;
	sidebarView: 'pages' | 'layers';
	selectElement: (id: string | null) => void;
	hoverElement: (id: string | null) => void;
	setSidebarView: (view: 'pages' | 'layers') => void;
	getParentIds: (elementId: string) => string[];
}

// Manipulation slice
export interface ManipulationSlice {
	responsiveMode: 'desktop' | 'mobile';
	getCurrentPageElements: () => EditorElement[];
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
	duplicateElement: (element: EditorElement) => string | null;
}

// Template slice
export interface TemplateSlice {
	loadTemplate: (template: EditorElement[], pageId?: string) => void;
	loadFromCore: (coreElements: CoreElement[], pageId?: string) => void;
	exportToCore: (pageId?: string) => CoreElement[];
	exportHtml: (pageId?: string) => string;
}

// Complete store interface
export interface BuilderStore
	extends HistorySlice,
	SelectionSlice,
	ManipulationSlice,
	TemplateSlice,
	PagesSlice,
	GlobalConfigSlice { }

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
