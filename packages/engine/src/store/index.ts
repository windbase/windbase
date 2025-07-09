import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createHistorySlice } from '../history';
import { createManipulationSlice } from '../manipulation';
import { createSelectionSlice } from '../selection';
import { createTemplateSlice } from '../template';
import type { BuilderStore } from './types';

export const useBuilder = create<BuilderStore>()(
	persist(
		(...a) => ({
			...createHistorySlice(...a),
			...createSelectionSlice(...a),
			...createManipulationSlice(...a),
			...createTemplateSlice(...a)
		}),
		{
			name: 'builder-store'
		}
	)
);

// Export types for external usage
export type {
	BuilderElement,
	BuilderStore,
	HistorySlice,
	ManipulationSlice,
	SelectionSlice,
	TemplateSlice
} from './types';
