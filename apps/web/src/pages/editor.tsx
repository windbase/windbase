import { VisualBuilder } from '@/features/visual-builder';
import { useKeyboardShortcuts } from '@/shared/hooks/keyboard-shortcuts';

function EditorPage() {
	useKeyboardShortcuts();
	return <VisualBuilder />;
}

export default EditorPage;
