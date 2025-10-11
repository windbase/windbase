'use client';

import { useBuilder } from '@windbase/engine';
import { useEffect } from 'react';

export function useKeyboardShortcuts(isActive: boolean) {
	const { undo, redo, canUndo, canRedo, selectedElement, duplicateElement } = useBuilder();

	useEffect(() => {
		if (!isActive) return;

		const handleKeyDown = (event: KeyboardEvent) => {
			// Check if we're in an input field or textarea
			const target = event.target as HTMLElement;
			const isEditableElement =
				target.tagName === 'INPUT' ||
				target.tagName === 'TEXTAREA' ||
				target.contentEditable === 'true';

			// Skip if user is typing in an editable element
			if (isEditableElement) return;

			// Handle undo (Ctrl+Z or Cmd+Z)
			if (
				event.key === 'z' &&
				(event.ctrlKey || event.metaKey) &&
				!event.shiftKey
			) {
				if (canUndo) {
					event.preventDefault();
					undo();
				}
			}

			// Handle redo (Ctrl+Y or Cmd+Shift+Z)
			if (
				(event.key === 'y' && (event.ctrlKey || event.metaKey)) ||
				(event.key === 'z' &&
					(event.ctrlKey || event.metaKey) &&
					event.shiftKey)
			) {
				if (canRedo) {
					event.preventDefault();
					redo();
				}
			}

			// Command + D for duplicate
			if (event.metaKey && event.key === 'd') {
				if (selectedElement) {
					duplicateElement(selectedElement);
					event.preventDefault();
				}
			}
		};

		document.addEventListener('keydown', handleKeyDown);

		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};
	}, [isActive, undo, redo, canUndo, canRedo, selectedElement, duplicateElement]);
}