import { describe, expect, it } from 'vitest';
import { useBuilder } from '../index.js';
import { setupTest } from './setup.js';

setupTest();

describe('Store Creation', () => {
	it('should create a store with all slices', () => {
		const store = useBuilder.getState();

		// Check that all slice properties exist
		expect(store).toHaveProperty('history');
		expect(store).toHaveProperty('historyIndex');
		expect(store).toHaveProperty('canUndo');
		expect(store).toHaveProperty('canRedo');
		expect(store).toHaveProperty('saveToHistory');
		expect(store).toHaveProperty('saveToHistoryImmediate');
		expect(store).toHaveProperty('undo');
		expect(store).toHaveProperty('redo');

		expect(store).toHaveProperty('selectedElement');
		expect(store).toHaveProperty('hoveredElement');
		expect(store).toHaveProperty('sidebarView');
		expect(store).toHaveProperty('selectElement');
		expect(store).toHaveProperty('hoverElement');
		expect(store).toHaveProperty('setSidebarView');
		expect(store).toHaveProperty('getParentIds');

		expect(store).toHaveProperty('responsiveMode');
		expect(store).toHaveProperty('getCurrentPageElements');
		expect(store).toHaveProperty('addElement');
		expect(store).toHaveProperty('updateElement');
		expect(store).toHaveProperty('deleteElement');
		expect(store).toHaveProperty('moveElement');
		expect(store).toHaveProperty('moveElementToTop');
		expect(store).toHaveProperty('moveElementInParent');
		expect(store).toHaveProperty('updateClasses');
		expect(store).toHaveProperty('setResponsiveMode');

		expect(store).toHaveProperty('loadTemplate');
		expect(store).toHaveProperty('loadFromCore');
		expect(store).toHaveProperty('exportToCore');
		expect(store).toHaveProperty('exportHtml');

		expect(store).toHaveProperty('pages');
		expect(store).toHaveProperty('currentPageId');
		expect(store).toHaveProperty('createPage');
		expect(store).toHaveProperty('deletePage');
		expect(store).toHaveProperty('updatePage');
		expect(store).toHaveProperty('setCurrentPage');
		expect(store).toHaveProperty('getCurrentPage');
		expect(store).toHaveProperty('getPageById');
		expect(store).toHaveProperty('getAllPages');
		expect(store).toHaveProperty('duplicatePage');
		expect(store).toHaveProperty('initializePages');
		expect(store).toHaveProperty('debugPages');
	});

	it('should have correct initial state', () => {
		const store = useBuilder.getState();

		expect(store.history).toEqual([]);
		expect(store.historyIndex).toBe(-1);
		expect(store.canUndo).toBe(false);
		expect(store.canRedo).toBe(false);

		expect(store.selectedElement).toBeNull();
		expect(store.hoveredElement).toBeNull();
		expect(store.sidebarView).toBe('pages');

		expect(store.responsiveMode).toBe('desktop');

		expect(store.pages).toBeInstanceOf(Map);
		expect(store.currentPageId).toBeNull();
	});

	it('should have all functions properly defined', () => {
		const store = useBuilder.getState();

		// History slice functions
		expect(typeof store.saveToHistory).toBe('function');
		expect(typeof store.saveToHistoryImmediate).toBe('function');
		expect(typeof store.undo).toBe('function');
		expect(typeof store.redo).toBe('function');

		// Selection slice functions
		expect(typeof store.selectElement).toBe('function');
		expect(typeof store.hoverElement).toBe('function');
		expect(typeof store.setSidebarView).toBe('function');
		expect(typeof store.getParentIds).toBe('function');

		// Manipulation slice functions
		expect(typeof store.getCurrentPageElements).toBe('function');
		expect(typeof store.addElement).toBe('function');
		expect(typeof store.updateElement).toBe('function');
		expect(typeof store.deleteElement).toBe('function');
		expect(typeof store.moveElement).toBe('function');
		expect(typeof store.moveElementToTop).toBe('function');
		expect(typeof store.moveElementInParent).toBe('function');
		expect(typeof store.updateClasses).toBe('function');
		expect(typeof store.setResponsiveMode).toBe('function');

		// Template slice functions
		expect(typeof store.loadTemplate).toBe('function');
		expect(typeof store.loadFromCore).toBe('function');
		expect(typeof store.exportToCore).toBe('function');
		expect(typeof store.exportHtml).toBe('function');

		// Pages slice functions
		expect(typeof store.createPage).toBe('function');
		expect(typeof store.deletePage).toBe('function');
		expect(typeof store.updatePage).toBe('function');
		expect(typeof store.setCurrentPage).toBe('function');
		expect(typeof store.getCurrentPage).toBe('function');
		expect(typeof store.getPageById).toBe('function');
		expect(typeof store.getAllPages).toBe('function');
		expect(typeof store.duplicatePage).toBe('function');
		expect(typeof store.initializePages).toBe('function');
		expect(typeof store.debugPages).toBe('function');
	});
});
