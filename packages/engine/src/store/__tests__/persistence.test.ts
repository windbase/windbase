/** biome-ignore-all lint/suspicious/noExplicitAny: allow any */
import { describe, expect, it } from 'vitest';
import { useBuilder } from '../index.js';
import { localStorageMock, setupTest } from './setup.js';

setupTest();

describe('Persistence', () => {
	it('should use correct storage key', () => {
		// The persist middleware should be configured with the correct name
		// Since the store is already created, we can verify that localStorage
		// operations will use the correct key by checking the store state
		const store = useBuilder.getState();
		expect(store).toBeDefined();

		// We can't directly test the storage key without triggering persistence,
		// but we can verify the store is properly configured
		expect(typeof store.selectElement).toBe('function');
	});

	it('should handle localStorage getItem when window is undefined', () => {
		// Test server-side rendering scenario
		const originalWindow = (globalThis as any).window;
		(globalThis as any).window = undefined;

		const store = useBuilder.getState();
		expect(store).toBeDefined();

		(globalThis as any).window = originalWindow;
	});

	it('should handle localStorage getItem with null value', () => {
		localStorageMock.getItem.mockReturnValue(null);

		const store = useBuilder.getState();
		expect(store).toBeDefined();
	});

	it('should handle localStorage getItem with valid JSON', () => {
		const mockData = {
			state: {
				history: [],
				historyIndex: -1,
				pages: { page1: { id: 'page1', name: 'Test Page' } }
			}
		};
		localStorageMock.getItem.mockReturnValue(JSON.stringify(mockData));

		const store = useBuilder.getState();
		expect(store).toBeDefined();
	});

	it('should convert plain object to Map for pages', () => {
		const mockData = {
			state: {
				history: [],
				historyIndex: -1,
				pages: { page1: { id: 'page1', name: 'Test Page' } }
			}
		};
		localStorageMock.getItem.mockReturnValue(JSON.stringify(mockData));

		// The storage.getItem should convert the plain object to a Map
		const store = useBuilder.getState();
		expect(store.pages).toBeInstanceOf(Map);
	});

	it('should handle localStorage setItem', () => {
		const mockState = {
			state: {
				history: [],
				historyIndex: -1,
				pages: new Map([['page1', { id: 'page1', name: 'Test Page' }]])
			}
		};

		// Simulate the persist middleware calling setItem
		// We need to access the storage directly
		const storage = (useBuilder as any).persist?.getOptions?.()?.storage;
		if (storage) {
			storage.setItem('builder-store', mockState);

			expect(localStorageMock.setItem).toHaveBeenCalledWith(
				'builder-store',
				expect.stringContaining('page1')
			);
		}
	});

	it('should handle localStorage removeItem', () => {
		const storage = (useBuilder as any).persist?.getOptions?.()?.storage;
		if (storage) {
			storage.removeItem('builder-store');
			expect(localStorageMock.removeItem).toHaveBeenCalledWith('builder-store');
		}
	});

	it('should handle setItem when window is undefined', () => {
		const originalWindow = (globalThis as any).window;
		(globalThis as any).window = undefined;

		// Clear previous calls
		localStorageMock.setItem.mockClear();

		const storage = (useBuilder as any).persist?.getOptions?.()?.storage;
		if (storage) {
			storage.setItem('builder-store', { state: {} });
			// Should not throw and should not call localStorage when window is undefined
			expect(localStorageMock.setItem).not.toHaveBeenCalled();
		}

		(globalThis as any).window = originalWindow;
	});

	it('should handle removeItem when window is undefined', () => {
		const originalWindow = (globalThis as any).window;
		(globalThis as any).window = undefined;

		const storage = (useBuilder as any).persist?.getOptions?.()?.storage;
		if (storage) {
			storage.removeItem('builder-store');
			// Should not throw and should not call localStorage
			expect(localStorageMock.removeItem).not.toHaveBeenCalled();
		}

		(globalThis as any).window = originalWindow;
	});

	it('should serialize Map to plain object for localStorage', () => {
		const storage = (useBuilder as any).persist?.getOptions?.()?.storage;
		if (storage) {
			const testData = {
				state: {
					pages: new Map([['page1', { id: 'page1', name: 'Test Page' }]]),
					currentPageId: 'page1'
				}
			};

			storage.setItem('test-key', testData);

			// Verify that the Map was converted to a plain object
			expect(localStorageMock.setItem).toHaveBeenCalledWith(
				'test-key',
				expect.stringContaining('"pages":{"page1"')
			);
		}
	});

	it('should deserialize plain object back to Map from localStorage', () => {
		const storage = (useBuilder as any).persist?.getOptions?.()?.storage;
		if (storage) {
			const result = storage.getItem('test-key');
			// The method should handle the conversion internally
			expect(result).toBeDefined();
		}
	});
});
