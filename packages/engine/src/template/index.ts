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
> = (_, get) => ({
	// Template methods
	loadTemplate: (template: EditorElement[], pageId?: string) => {
		const targetPageId = pageId || get().currentPageId;
		if (!targetPageId) return;

		get().updatePage(targetPageId, { elements: template });
		get().saveToHistory();
	},

	// Core transformation methods
	loadFromCore: (coreElements: CoreElement[], pageId?: string) => {
		const editorElements = coreElements.map((coreElement) =>
			coreToEditor(coreElement)
		);

		const targetPageId = pageId || get().currentPageId;
		if (!targetPageId) return;

		get().updatePage(targetPageId, { elements: editorElements });
		get().saveToHistory();
	},

	exportToCore: (pageId?: string) => {
		const targetPageId = pageId || get().currentPageId;
		if (!targetPageId) return [];

		const page = get().getPageById(targetPageId);
		if (!page) return [];

		return page.elements.map(editorToCore);
	},

	exportHtml: (pageId?: string) => {
		const coreElements = get().exportToCore(pageId);
		return exportToFullHtml(coreElements);
	}
});
