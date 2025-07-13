import { beforeEach, vi } from 'vitest';
import { useBuilder } from '../index.js';

// Mock localStorage
export const localStorageMock = {
	getItem: vi.fn(),
	setItem: vi.fn(),
	removeItem: vi.fn(),
	clear: vi.fn()
};

Object.defineProperty(globalThis, 'window', {
	value: {
		localStorage: localStorageMock
	},
	writable: true
});

Object.defineProperty(globalThis, 'localStorage', {
	value: localStorageMock,
	writable: true
});

// Mock the individual slices
vi.mock('../history', () => ({
	createHistorySlice: () => ({
		history: [],
		historyIndex: -1,
		canUndo: false,
		canRedo: false,
		saveToHistory: vi.fn(),
		undo: vi.fn(),
		redo: vi.fn()
	})
}));

vi.mock('../selection', () => ({
	createSelectionSlice: () => ({
		selectedElement: null,
		hoveredElement: null,
		sidebarView: 'pages' as const,
		selectElement: vi.fn(),
		hoverElement: vi.fn(),
		setSidebarView: vi.fn(),
		getParentIds: vi.fn(() => [])
	})
}));

vi.mock('../manipulation', () => ({
	createManipulationSlice: () => ({
		responsiveMode: 'desktop' as const,
		getCurrentPageElements: vi.fn(() => []),
		addElement: vi.fn(),
		updateElement: vi.fn(),
		deleteElement: vi.fn(),
		moveElement: vi.fn(),
		moveElementToTop: vi.fn(),
		moveElementInParent: vi.fn(),
		updateClasses: vi.fn(),
		setResponsiveMode: vi.fn()
	})
}));

vi.mock('../template', () => ({
	createTemplateSlice: () => ({
		loadTemplate: vi.fn(),
		loadFromCore: vi.fn(),
		exportToCore: vi.fn(() => []),
		exportHtml: vi.fn(() => '')
	})
}));

vi.mock('../pages', () => ({
	createPagesSlice: () => ({
		pages: new Map(),
		currentPageId: null,
		getCurrentPageElements: vi.fn(() => []),
		createPage: vi.fn(),
		deletePage: vi.fn(),
		updatePage: vi.fn(),
		setCurrentPage: vi.fn(),
		getCurrentPage: vi.fn(() => null),
		getPageById: vi.fn(() => null),
		getAllPages: vi.fn(() => []),
		duplicatePage: vi.fn(),
		initializePages: vi.fn(),
		debugPages: vi.fn()
	})
}));

// Common setup function for all tests
export const setupTest = () => {
	beforeEach(() => {
		vi.clearAllMocks();
		localStorageMock.getItem.mockReturnValue(null);
		// Clear the store state
		useBuilder.setState({
			history: [],
			historyIndex: -1,
			canUndo: false,
			canRedo: false,
			selectedElement: null,
			hoveredElement: null,
			sidebarView: 'pages',
			responsiveMode: 'desktop',
			pages: new Map(),
			currentPageId: null
		});
	});
}; 