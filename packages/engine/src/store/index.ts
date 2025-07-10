import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createHistorySlice } from '../history';
import { createManipulationSlice } from '../manipulation';
import { createPagesSlice } from '../pages';
import { createSelectionSlice } from '../selection';
import { createTemplateSlice } from '../template';
import type { BuilderStore } from './types';

export const useBuilder = create<BuilderStore>()(
	persist(
		(...a) => ({
			...createHistorySlice(...a),
			...createSelectionSlice(...a),
			...createManipulationSlice(...a),
			...createTemplateSlice(...a),
			...createPagesSlice(...a)
		}),
		{
			name: 'builder-store',
      
			storage: {
				getItem: (name: string) => {
					if (typeof window === 'undefined') return null;
					const str = window.localStorage.getItem(name);
					if (!str) return null;
					
					const parsed = JSON.parse(str);
					// Convert plain object back to Map
					if (parsed.state?.pages && typeof parsed.state.pages === 'object' && !(parsed.state.pages instanceof Map)) {
						parsed.state.pages = new Map(Object.entries(parsed.state.pages));
					}
					return parsed;
				},
				// biome-ignore lint/suspicious/noExplicitAny: we don't know the type of the value
				setItem: (name: string, value: any) => {
					if (typeof window === 'undefined') return;
					
					// Convert Map to plain object for serialization
					const serializedState = {
						...value,
						state: {
							...value.state,
							pages: value.state.pages instanceof Map 
								? Object.fromEntries(value.state.pages) 
								: value.state.pages
						}
					};
					window.localStorage.setItem(name, JSON.stringify(serializedState));
				},
				removeItem: (name: string) => {
					if (typeof window === 'undefined') return;
					window.localStorage.removeItem(name);
				}
			}
		},
	)
);

// Export page types
export type { Page, PagesSlice } from '../pages';
// Export types for external usage
export type {
	BuilderElement,
	BuilderStore,
	HistorySlice,
	ManipulationSlice,
	SelectionSlice,
	TemplateSlice
} from './types';
