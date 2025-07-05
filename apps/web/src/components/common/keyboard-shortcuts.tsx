import { useEffect } from 'react';
import { useBuilder } from '@/store/builder';

interface KeyboardShortcutsProps {
	isActive: boolean;
}

export function useKeyboardShortcuts(isActive: boolean) {
	const { undo, redo, canUndo, canRedo } = useBuilder();

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
		};

		document.addEventListener('keydown', handleKeyDown);

		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};
	}, [isActive, undo, redo, canUndo, canRedo]);
}

export default function KeyboardShortcuts({
	isActive,
}: KeyboardShortcutsProps) {
	useKeyboardShortcuts(isActive);
	return null;
}
