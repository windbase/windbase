import type { ElementCategory } from './element-types';

// Map HTML tags to ElementType categories
export const tagToElementType = (tagName: string): ElementCategory => {
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
		return 'other';
	}

	// Text elements (including headings, paragraphs, spans, etc.)
	if (
		[
			'p',
			'h1',
			'h2',
			'h3',
			'h4',
			'h5',
			'h6',
			'span',
			'a',
			'strong',
			'em',
			'i',
		].includes(tag)
	) {
		return 'text';
	}

	// Default to other
	return 'other';
};
