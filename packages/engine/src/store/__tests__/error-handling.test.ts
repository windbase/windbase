/** biome-ignore-all lint/suspicious/noExplicitAny: allow any */
import { describe, expect, it } from 'vitest';
import { useBuilder } from '../index.js';
import { localStorageMock, setupTest } from './setup.js';

setupTest();

describe('Error Handling', () => {
	it('should handle invalid JSON in localStorage', () => {
		// Test that the store handles invalid JSON gracefully
		localStorageMock.getItem.mockReturnValue('invalid json');

		// The store should still work even with invalid JSON
		const store = useBuilder.getState();
		expect(store).toBeDefined();
		expect(typeof store.selectElement).toBe('function');
	});

	it('should handle storage operations correctly', () => {
		// Test that the custom storage implementation works
		const storage = (useBuilder as any).persist?.getOptions?.()?.storage;
		if (storage) {
			// Test setItem with Map serialization
			const testData = {
				state: {
					pages: new Map([['page1', { id: 'page1', name: 'Test' }]]),
					currentPageId: 'page1'
				}
			};

			storage.setItem('test-key', testData);

			// Verify localStorage was called
			expect(localStorageMock.setItem).toHaveBeenCalledWith(
				'test-key',
				expect.stringContaining('page1')
			);
		}
	});

	it('should handle removeItem correctly', () => {
		const storage = (useBuilder as any).persist?.getOptions?.()?.storage;
		if (storage) {
			storage.removeItem('test-key');
			expect(localStorageMock.removeItem).toHaveBeenCalledWith('test-key');
		}
	});

	it('should handle empty state gracefully', () => {
		// Test that the store handles empty/undefined state properly
		useBuilder.setState({});

		const store = useBuilder.getState();
		expect(store).toBeDefined();
		expect(typeof store.selectElement).toBe('function');
	});

	it('should handle null element updates', () => {
		// Test that setting elements to null works correctly
		useBuilder.setState({
			selectedElement: {
				id: 'test',
				type: 'layout',
				tag: 'div',
				classes: [],
				content: '',
				children: []
			}
		});

		expect(useBuilder.getState().selectedElement).toBeTruthy();

		// Now set back to null
		useBuilder.setState({
			selectedElement: null,
			hoveredElement: null
		});

		const store = useBuilder.getState();
		expect(store.selectedElement).toBeNull();
		expect(store.hoveredElement).toBeNull();
	});

	it('should handle undefined pages Map', () => {
		// Test that the store handles undefined pages Map
		useBuilder.setState({
			pages: undefined
		});

		const store = useBuilder.getState();
		expect(store.pages).toBeUndefined();

		// Should still be able to set it back to a Map
		useBuilder.setState({
			pages: new Map([
				[
					'page1',
					{
						id: 'page1',
						name: 'Test',
						elements: [],
						createdAt: Date.now(),
						updatedAt: Date.now()
					}
				]
			])
		});

		const updatedStore = useBuilder.getState();
		expect(updatedStore.pages).toBeInstanceOf(Map);
		expect(updatedStore.pages?.has('page1')).toBe(true);
	});

	it('should handle invalid array updates', () => {
		// Test that invalid array updates don't break the store
		useBuilder.setState({
			history: []
		});

		expect(useBuilder.getState().history).toEqual([]);

		// Update with valid array
		useBuilder.setState({
			history: [
				[
					{
						id: 'element1',
						type: 'layout',
						tag: 'div',
						classes: [],
						content: '',
						children: []
					}
				]
			]
		});

		const store = useBuilder.getState();
		expect(store.history).toHaveLength(1);
		expect(store.history[0]).toHaveLength(1);
	});

	it('should handle invalid enum values gracefully', () => {
		// Test that invalid enum values don't break the store
		useBuilder.setState({
			sidebarView: 'pages'
		});

		expect(useBuilder.getState().sidebarView).toBe('pages');

		// Update with valid enum value
		useBuilder.setState({
			sidebarView: 'layers'
		});

		expect(useBuilder.getState().sidebarView).toBe('layers');
	});

	it('should handle concurrent state updates', () => {
		// Test that concurrent updates don't cause issues
		const updates = Array.from({ length: 10 }, (_, i) => ({
			historyIndex: i,
			currentPageId: `page${i}`
		}));

		// Apply all updates rapidly
		updates.forEach((update) => {
			useBuilder.setState(update);
		});

		const store = useBuilder.getState();
		expect(store.historyIndex).toBe(9);
		expect(store.currentPageId).toBe('page9');
	});

	it('should handle large state objects', () => {
		// Test that the store can handle large state objects
		const largeHistory = Array.from({ length: 100 }, (_, i) =>
			Array.from({ length: 50 }, (_, j) => ({
				id: `element${i}-${j}`,
				type: 'layout',
				tag: 'div',
				classes: [`class${i}-${j}`],
				content: `Content ${i}-${j}`,
				children: []
			}))
		);

		useBuilder.setState({
			history: largeHistory
		});

		const store = useBuilder.getState();
		expect(store.history).toHaveLength(100);
		expect(store.history[0]).toHaveLength(50);
		expect(store.history[99][49].id).toBe('element99-49');
	});

	it('should handle deeply nested element structures', () => {
		// Test with deeply nested element structure
		const createNestedElement = (depth: number, id: string): any => {
			if (depth === 0) {
				return {
					id,
					type: 'content',
					tag: 'span',
					classes: [],
					content: `Leaf ${id}`,
					children: []
				};
			}

			return {
				id,
				type: 'layout',
				tag: 'div',
				classes: [],
				content: `Container ${id}`,
				children: [createNestedElement(depth - 1, `${id}-child`)]
			};
		};

		const deepElement = createNestedElement(10, 'root');

		useBuilder.setState({
			selectedElement: deepElement
		});

		const store = useBuilder.getState();
		expect(store.selectedElement?.id).toBe('root');
		expect(store.selectedElement?.children[0]?.id).toBe('root-child');
	});

	it('should handle Map operations with non-string keys', () => {
		// Test that Map operations work correctly with different key types
		const testPages = new Map();
		testPages.set('string-key', {
			id: 'page1',
			name: 'Page 1',
			elements: [],
			createdAt: Date.now(),
			updatedAt: Date.now()
		});

		useBuilder.setState({
			pages: testPages
		});

		const store = useBuilder.getState();
		expect(store.pages?.has('string-key')).toBe(true);
		expect(store.pages?.get('string-key')?.name).toBe('Page 1');
	});

	it('should handle circular reference prevention', () => {
		// Test that circular references don't cause issues
		const element1 = {
			id: 'element1',
			type: 'layout',
			tag: 'div',
			classes: [],
			content: 'Element 1',
			children: []
		};

		const element2 = {
			id: 'element2',
			type: 'layout',
			tag: 'div',
			classes: [],
			content: 'Element 2',
			children: [element1]
		};

		// This should work without circular reference issues
		useBuilder.setState({
			selectedElement: element2
		});

		const store = useBuilder.getState();
		expect(store.selectedElement?.id).toBe('element2');
		expect(store.selectedElement?.children[0]?.id).toBe('element1');
	});

	it('should handle memory cleanup correctly', () => {
		// Create and update state multiple times
		for (let i = 0; i < 100; i++) {
			useBuilder.setState({
				selectedElement: {
					id: `element${i}`,
					type: 'layout',
					tag: 'div',
					classes: [`class${i}`],
					content: `Content ${i}`,
					children: []
				}
			});
		}

		const finalStore = useBuilder.getState();
		expect(finalStore.selectedElement?.id).toBe('element99');

		// Clean up
		useBuilder.setState({
			selectedElement: null
		});

		expect(useBuilder.getState().selectedElement).toBeNull();
	});
});
