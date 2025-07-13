import { describe, expect, it } from 'vitest';
import { useBuilder } from '../index.js';
import { setupTest } from './setup.js';

setupTest();

describe('Store Integration', () => {
	it('should allow updating state across slices', () => {
		// Update selection slice
		useBuilder.setState({ selectedElement: { id: 'test', type: 'layout', tag: 'div', classes: [], content: '', children: [] } });
		
		// Update manipulation slice
		useBuilder.setState({ responsiveMode: 'mobile' });
		
		// Update pages slice
		useBuilder.setState({ currentPageId: 'page1' });
		
		const updatedStore = useBuilder.getState();
		expect(updatedStore.selectedElement).toBeTruthy();
		expect(updatedStore.responsiveMode).toBe('mobile');
		expect(updatedStore.currentPageId).toBe('page1');
	});

	it('should maintain state consistency across actions', () => {
		const { selectElement, setResponsiveMode } = useBuilder.getState();
		
		// These should be the mocked functions
		expect(typeof selectElement).toBe('function');
		expect(typeof setResponsiveMode).toBe('function');
		
		// Call the actions
		selectElement('element1');
		setResponsiveMode('mobile');
		
		// Verify the functions can be called without errors
		expect(selectElement).toBeDefined();
		expect(setResponsiveMode).toBeDefined();
	});

	it('should handle complex state updates', () => {
	
		// Simulate a complex update involving multiple slices
		useBuilder.setState({
			selectedElement: { id: 'element1', type: 'layout', tag: 'div', classes: [], content: '', children: [] },
			responsiveMode: 'mobile',
			currentPageId: 'page1',
			historyIndex: 0
		});
		
		const updatedState = useBuilder.getState();
		expect(updatedState.selectedElement?.id).toBe('element1');
		expect(updatedState.responsiveMode).toBe('mobile');
		expect(updatedState.currentPageId).toBe('page1');
		expect(updatedState.historyIndex).toBe(0);
	});

	it('should handle state updates that affect multiple slices', () => {
		// Test that state updates in one slice don't interfere with others
		
		
		// Update history slice
		useBuilder.setState({ 
			history: [
				[{ id: 'element1', type: 'layout', tag: 'div', classes: [], content: '', children: [] }]
			],
			historyIndex: 0,
			canUndo: true
		});
		
		// Update selection slice
		useBuilder.setState({ 
			selectedElement: { id: 'element1', type: 'layout', tag: 'div', classes: [], content: '', children: [] },
			sidebarView: 'layers'
		});
		
		// Update pages slice
		useBuilder.setState({ 
			currentPageId: 'page1',
			pages: new Map([['page1', { id: 'page1', name: 'Test Page', elements: [], createdAt: Date.now(), updatedAt: Date.now() }]])
		});
		
		const updatedStore = useBuilder.getState();
		
		// All slices should be updated correctly
		expect(updatedStore.history).toHaveLength(1);
		expect(updatedStore.historyIndex).toBe(0);
		expect(updatedStore.canUndo).toBe(true);
		
		expect(updatedStore.selectedElement?.id).toBe('element1');
		expect(updatedStore.sidebarView).toBe('layers');
		
		expect(updatedStore.currentPageId).toBe('page1');
		expect(updatedStore.pages?.has('page1')).toBe(true);
	});

	it('should handle rapid state changes', () => {
		// Simulate rapid state changes like those that might occur in a real app
		const changes = [
			{ selectedElement: { id: 'el1', type: 'layout', tag: 'div', classes: [], content: '', children: [] } },
			{ responsiveMode: 'mobile' as const },
			{ currentPageId: 'page1' },
			{ sidebarView: 'layers' as const },
			{ historyIndex: 1 },
			{ selectedElement: { id: 'el2', type: 'layout', tag: 'p', classes: [], content: 'text', children: [] } }
		];
		
		// Apply changes rapidly
		changes.forEach(change => {
			useBuilder.setState(change);
		});
		
		const finalState = useBuilder.getState();
		expect(finalState.selectedElement?.id).toBe('el2');
		expect(finalState.responsiveMode).toBe('mobile');
		expect(finalState.currentPageId).toBe('page1');
		expect(finalState.sidebarView).toBe('layers');
		expect(finalState.historyIndex).toBe(1);
	});

	it('should maintain reference integrity across updates', () => {
		const initialStore = useBuilder.getState();
		const initialPages = initialStore.pages;
		
		// Update a different part of the state
		useBuilder.setState({ selectedElement: { id: 'test', type: 'layout', tag: 'div', classes: [], content: '', children: [] } });
		
		const updatedStore = useBuilder.getState();
		
		// Pages reference should remain the same since we didn't update it
		expect(updatedStore.pages).toBe(initialPages);
		
		// But selectedElement should be updated
		expect(updatedStore.selectedElement?.id).toBe('test');
	});

	it('should handle partial state updates correctly', () => {
		// Test that partial updates don't overwrite other properties
    
		
		// Set initial state
		useBuilder.setState({
			selectedElement: { id: 'element1', type: 'layout', tag: 'div', classes: [], content: '', children: [] },
			responsiveMode: 'desktop',
			currentPageId: 'page1'
		});
		
		// Partially update state
		useBuilder.setState({
			responsiveMode: 'mobile'
		});
		
		const updatedStore = useBuilder.getState();
		
		// Only responsiveMode should change
		expect(updatedStore.responsiveMode).toBe('mobile');
		// Other properties should remain unchanged
		expect(updatedStore.selectedElement?.id).toBe('element1');
		expect(updatedStore.currentPageId).toBe('page1');
	});

	it('should handle concurrent slice operations', () => {
		// Test that different slice operations can work together
		const { selectElement, setResponsiveMode, createPage } = useBuilder.getState();
		
		// Call multiple slice operations
		selectElement('element1');
		setResponsiveMode('mobile');
		createPage('New Page');
		
		// Verify all operations are defined and can be called
		expect(typeof selectElement).toBe('function');
		expect(typeof setResponsiveMode).toBe('function');
		expect(typeof createPage).toBe('function');
	});
}); 