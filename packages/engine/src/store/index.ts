import { create } from 'zustand';
import { createHistorySlice } from '../history';
import { createManipulationSlice } from '../manipulation';
import { createSelectionSlice } from '../selection';
import { createTemplateSlice } from '../template';
import type { BuilderStore } from './types';

export const useBuilder = create<BuilderStore>()((...a) => ({
	...createHistorySlice(...a),
	...createSelectionSlice(...a),
	...createManipulationSlice(...a),
	...createTemplateSlice(...a),
}));

// Export types for external usage
export type {
	BuilderElement,
	BuilderStore,
	HistorySlice,
	ManipulationSlice,
	SelectionSlice,
	TemplateSlice,
} from './types';
