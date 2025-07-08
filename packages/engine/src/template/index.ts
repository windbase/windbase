import type { CoreElement, EditorElement } from '@windbase/core';
import { coreToEditor, editorToCore } from '@windbase/core';
import { exportToFullHtml } from '@windbase/exporters';
import type { StateCreator } from 'zustand';
import type { BuilderStore, TemplateSlice } from '../store/types';

export const createTemplateSlice: StateCreator<
	BuilderStore,
	[],
	[],
	TemplateSlice
> = (set, get) => ({
	// Template methods
	loadTemplate: (template: EditorElement[]) => {
		set({ elements: template });
		get().saveToHistory();
	},

	// Core transformation methods
	loadFromCore: (coreElements: CoreElement[]) => {
		const editorElements = coreElements.map((coreElement) =>
			coreToEditor(coreElement)
		);
		set({ elements: editorElements });
		get().saveToHistory();
	},

	exportToCore: () => {
		return get().elements.map(editorToCore);
	},

	exportHtml: () => {
		const coreElements = get().exportToCore();
		return exportToFullHtml(coreElements);
	}
});
