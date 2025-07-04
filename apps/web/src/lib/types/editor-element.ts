import type { ElementType } from '../elementTypes';
import type { CoreElement } from './core-element';

/**
 * EditorElement - Extended structure for editor functionality
 * Contains core element data plus editor-specific state and metadata
 */
export interface EditorElement extends Omit<CoreElement, 'children'> {
	type: ElementType;
	isContentEditable?: boolean;
	parent?: string;
	children: EditorElement[];
}
