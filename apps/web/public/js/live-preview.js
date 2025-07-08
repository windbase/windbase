let currentElements = [];
let selectedElementId = null;
let hoveredElementId = null;

// Define which HTML tags should be contenteditable
const CONTENTEDITABLE_TAGS = [
	'h1',
	'h2',
	'h3',
	'h4',
	'h5',
	'h6', // Headings
	'p',
	'span',
	'div', // Text containers
	'a',
	'strong',
	'em',
	'i',
	'b',
	'u', // Inline text elements
	'label',
	'button', // Form elements with text
	'blockquote',
	'pre',
	'code', // Special text elements
	'li',
	'dt',
	'dd' // List elements
];

// Handle element selection
document.addEventListener('click', (e) => {
	const elementId = e.target
		.closest('[data-element-id]')
		?.getAttribute('data-element-id');
	if (elementId) {
		window.parent.postMessage(
			{
				type: 'element-selected',
				elementId: elementId
			},
			'*'
		);
	}
});

// Handle element hover
document.addEventListener('mouseover', (e) => {
	const elementId = e.target
		.closest('[data-element-id]')
		?.getAttribute('data-element-id');
	if (elementId) {
		window.parent.postMessage(
			{
				type: 'element-hovered',
				elementId: elementId
			},
			'*'
		);
	}
});

document.addEventListener('mouseout', () => {
	window.parent.postMessage(
		{
			type: 'element-unhovered'
		},
		'*'
	);
});

document.addEventListener('input', (e) => {
	const elementId = e.target
		.closest('[data-element-id]')
		?.getAttribute('data-element-id');
	if (elementId) {
		window.parent.postMessage(
			{
				type: 'element-content-changed',
				elementId: elementId,
				content: e.target.textContent || ''
			},
			'*'
		);
	}
});

// Listen for messages from parent
window.addEventListener('message', (event) => {
	if (event.origin !== window.location.origin) return;

	const { type, data } = event.data;

	switch (type) {
		case 'sync-elements':
			syncElements(data.elements);
			break;
		case 'update-content':
			updateElementContent(data.elementId, data.content);
			break;
		case 'select-element':
			selectElement(data.elementId);
			break;
		case 'hover-element':
			hoverElement(data.elementId);
			break;
		case 'update-attributes':
			updateElementAttributes(data.elementId, data.attributes);
			break;
	}
});

function syncElements(newElements) {
	currentElements = newElements || [];
	const container = document.getElementById('preview-container');
	const emptyState = document.getElementById('empty-state');

	if (currentElements.length === 0) {
		container.innerHTML = '';
		emptyState.style.display = 'flex';
		return;
	}

	emptyState.style.display = 'none';
	container.innerHTML = renderElements(currentElements);
}

function updateElementContent(elementId, content) {
	// Update the element in our local state
	function updateInArray(elements) {
		return elements.map((element) => {
			if (element.id === elementId) {
				return { ...element, content };
			}
			if (element.children && element.children.length > 0) {
				return { ...element, children: updateInArray(element.children) };
			}
			return element;
		});
	}

	currentElements = updateInArray(currentElements);

	// Find the element in our local state to check if it has children
	const element =
		currentElements.find((el) => el.id === elementId) ||
		currentElements.find((el) => findElementInChildren(el, elementId));

	// Update only the specific DOM element without re-rendering everything
	const domElement = document.querySelector(
		'[data-element-id="' + elementId + '"]'
	);
	if (domElement && element) {
		// Only update textContent if the element has no children
		// If it has children, textContent would destroy them
		if (!element.children || element.children.length === 0) {
			const currentTextContent = domElement.textContent || '';
			if (currentTextContent !== content) {
				// Save cursor position if this element is focused
				const isActiveElement = document.activeElement === domElement;
				let cursorPosition = 0;

				if (isActiveElement) {
					const selection = window.getSelection();
					if (selection.rangeCount > 0) {
						const range = selection.getRangeAt(0);
						cursorPosition = range.startOffset;
					}
				}

				domElement.textContent = content;

				// Restore cursor position if this element was focused
				if (isActiveElement) {
					const selection = window.getSelection();
					const range = document.createRange();
					const textNode = domElement.firstChild;
					if (textNode) {
						range.setStart(
							textNode,
							Math.min(cursorPosition, textNode.textContent.length)
						);
						range.collapse(true);
						selection.removeAllRanges();
						selection.addRange(range);
					}
				}
			}
		}
		// If element has children, don't update textContent as it would destroy children
		// In this case, we need to do a partial re-render or handle it differently
	}
}

function findElementInChildren(parent, targetId) {
	if (parent.children) {
		for (const child of parent.children) {
			if (child.id === targetId) {
				return child;
			}
			const found = findElementInChildren(child, targetId);
			if (found) return found;
		}
	}
	return null;
}

function renderElements(elementsArray) {
	return elementsArray.map(renderElement).join('');
}

function renderElement(element) {
	const classNames = (element.classes || []).join(' ');
	const isSelected = selectedElementId === element.id;
	const isHovered = hoveredElementId === element.id;

	// Start with any existing inline styles from attributes
	let style = '';
	if (element.attributes?.style) {
		style = element.attributes.style;
		// Ensure it ends with semicolon for concatenation
		if (style && !style.endsWith(';')) {
			style += ';';
		}
	}

	// Add selection/hover outline styles
	if (isSelected) {
		style += ' outline: 2px solid #3b82f6; outline-offset: 2px;';
	} else if (isHovered) {
		style += ' outline: 2px solid #10b981; outline-offset: 2px;';
	}

	// Handle self-closing tags
	if (
		element.tag === 'img' ||
		element.tag === 'input' ||
		element.tag === 'br' ||
		element.tag === 'hr'
	) {
		// Build attributes string (excluding style since we handle it separately)
		let attributesString = '';
		if (element.attributes) {
			for (const [key, value] of Object.entries(element.attributes)) {
				if (key !== 'style') {
					// Skip style, we handle it separately
					attributesString += ` ${key}="${value}"`;
				}
			}
		}

		return (
			'<' +
			element.tag +
			' class="' +
			classNames +
			'" style="' +
			style +
			'" data-element-id="' +
			element.id +
			'"' +
			attributesString +
			' />'
		);
	}

	// Handle elements with children
	const childrenHTML = (element.children || []).map(renderElement).join('');
	const content = element.content || '';

	// Only add contenteditable if the element has no children
	// Elements with children should not be directly editable to avoid destroying child elements
	const shouldBeContentEditable = CONTENTEDITABLE_TAGS.includes(element.tag);
	const contenteditable =
		element.children && element.children.length > 0
			? 'false'
			: shouldBeContentEditable
				? 'true'
				: 'false';

	// Build attributes string for regular elements (excluding style)
	let attributesString = '';
	if (element.attributes) {
		for (const [key, value] of Object.entries(element.attributes)) {
			if (key !== 'style') {
				// Skip style, we handle it separately
				attributesString += ` ${key}="${value}"`;
			}
		}
	}

	// Special handling for SVG elements
	if (element.tag === 'svg') {
		// For SVG, we need to ensure proper namespace and attributes
		const svgAttributes = element.attributes || {};

		// Add default SVG attributes if not present
		if (!svgAttributes.xmlns) {
			attributesString += ' xmlns="http://www.w3.org/2000/svg"';
		}

		// Ensure SVG has proper display properties
		if (!classNames.includes('block') && !classNames.includes('inline')) {
			// Add inline-block display if no display class is present
			style += ' display: inline-block;';
		}
	}

	return (
		'<' +
		element.tag +
		' class="' +
		classNames +
		'" style="' +
		style +
		'" data-element-id="' +
		element.id +
		'" contenteditable="' +
		contenteditable +
		'"' +
		attributesString +
		'>' +
		content +
		childrenHTML +
		'</' +
		element.tag +
		'>'
	);
}

function selectElement(elementId) {
	// Remove previous selection outline
	if (selectedElementId) {
		const prevElement = document.querySelector(
			'[data-element-id="' + selectedElementId + '"]'
		);
		if (prevElement) {
			prevElement.style.outline = '';
		}
	}

	selectedElementId = elementId;

	// Add selection outline
	if (elementId) {
		const element = document.querySelector(
			'[data-element-id="' + elementId + '"]'
		);
		if (element) {
			element.style.outline = '2px solid #3b82f6';
			element.style.outlineOffset = '2px';
		}
	}
}

function hoverElement(elementId) {
	// Remove previous hover outline
	if (hoveredElementId) {
		const prevElement = document.querySelector(
			'[data-element-id="' + hoveredElementId + '"]'
		);
		if (prevElement && hoveredElementId !== selectedElementId) {
			prevElement.style.outline = '';
		}
	}

	hoveredElementId = elementId;

	// Add hover outline (but don't override selection)
	if (elementId && elementId !== selectedElementId) {
		const element = document.querySelector(
			'[data-element-id="' + elementId + '"]'
		);
		if (element) {
			element.style.outline = '2px solid #10b981';
			element.style.outlineOffset = '2px';
		}
	}
}

function updateElementAttributes(elementId, attributes) {
	const element = document.querySelector(
		'[data-element-id="' + elementId + '"]'
	);
	if (element) {
		// Clear existing attributes first (except for built-in ones)
		const preservedAttributes = [
			'data-element-id',
			'contenteditable',
			'style',
			'class'
		];
		const currentAttributes = [...element.attributes];

		currentAttributes.forEach((attr) => {
			if (!preservedAttributes.includes(attr.name)) {
				element.removeAttribute(attr.name);
			}
		});

		// Add new attributes
		Object.entries(attributes).forEach(([key, value]) => {
			element.setAttribute(key, value);
		});

		// Special handling for SVG elements
		if (element.tagName.toLowerCase() === 'svg') {
			// Ensure SVG has proper namespace
			if (!element.hasAttribute('xmlns')) {
				element.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
			}
		}
	}
}

// Signal that iframe is ready
window.parent.postMessage({ type: 'iframe-ready' }, '*');
