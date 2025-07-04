import type { ElementType } from '../elementTypes';

// Map HTML tags to ElementType categories
export const tagToElementType = (tagName: string): ElementType => {
	const tag = tagName.toLowerCase();

	// Layout elements
	if (
		[
			'div',
			'section',
			'article',
			'header',
			'footer',
			'main',
			'aside',
			'nav',
			'span',
			'p',
			'h1',
			'h2',
			'h3',
			'h4',
			'h5',
			'h6',
		].includes(tag)
	) {
		return 'layout';
	}

	// Form elements
	if (
		[
			'form',
			'input',
			'textarea',
			'select',
			'button',
			'label',
			'fieldset',
			'legend',
			'option',
			'optgroup',
		].includes(tag)
	) {
		return 'form';
	}

	// Media elements
	if (
		[
			'img',
			'video',
			'audio',
			'canvas',
			'svg',
			'picture',
			'source',
			'track',
		].includes(tag)
	) {
		return 'media';
	}

	// List elements
	if (['ul', 'ol', 'li', 'dl', 'dt', 'dd'].includes(tag)) {
		return 'list';
	}

	// Default to other
	return 'other';
};
