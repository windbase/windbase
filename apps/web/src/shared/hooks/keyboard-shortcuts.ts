import { useBuilder } from '@windbase/engine';
import { useEffect } from 'react';

export function useKeyboardShortcuts() {
	const { selectedElement, duplicateElement } = useBuilder();

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			// Command + D for duplicate
			if (event.metaKey && event.key === 'd') {
				if (selectedElement) {
					duplicateElement(selectedElement);
					event.preventDefault();
				}
			}
		};
		window.addEventListener('keydown', handleKeyDown);
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, [selectedElement, duplicateElement]);
}