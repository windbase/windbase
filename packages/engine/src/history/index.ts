import type { StateCreator } from 'zustand';
import type { BuilderStore, HistorySlice } from '../store/types';

export const createHistorySlice: StateCreator<
	BuilderStore,
	[],
	[],
	HistorySlice
> = (set, get) => ({
	history: [[]], // Initialize with empty state
	historyIndex: 0,
	canUndo: false,
	canRedo: false,

	// Helper method to save current state to history (called after actions)
	saveToHistory: () => {
		const state = get();
		const currentElements = JSON.parse(JSON.stringify(state.getCurrentPageElements()));

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
			canRedo: false
		});
	},

	// Undo action
	undo: () => {
		const state = get();
		if (state.historyIndex > 0) {
			const newIndex = state.historyIndex - 1;
			const elementsToRestore = state.history[newIndex];

			// Restore elements to current page
			const currentPage = state.getCurrentPage();
			if (currentPage) {
				state.updatePage(currentPage.id, { elements: elementsToRestore });
			}

			set({
				historyIndex: newIndex,
				canUndo: newIndex > 0,
				canRedo: true,
				selectedElement: null // Clear selection after undo
			});
		}
	},

	// Redo action
	redo: () => {
		const state = get();
		if (state.historyIndex < state.history.length - 1) {
			const newIndex = state.historyIndex + 1;
			const elementsToRestore = state.history[newIndex];

			// Restore elements to current page
			const currentPage = state.getCurrentPage();
			if (currentPage) {
				state.updatePage(currentPage.id, { elements: elementsToRestore });
			}

			set({
				historyIndex: newIndex,
				canUndo: true,
				canRedo: newIndex < state.history.length - 1,
				selectedElement: null // Clear selection after redo
			});
		}
	}
});
