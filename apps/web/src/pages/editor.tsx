import VisualBuilder from '@/components/builder/visual-builder';
import { useKeyboardShortcuts } from '@/lib/hooks/keyboard-shortcuts';

function EditorPage() {
	useKeyboardShortcuts();
	return <VisualBuilder />;
}

export default EditorPage;
