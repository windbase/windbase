// Helper function to get text content without nested element content
export const getDirectTextContent = (element: Element): string => {
	let textContent = '';
	for (const node of Array.from(element.childNodes)) {
		if (node.nodeType === Node.TEXT_NODE) {
			textContent += node.textContent || '';
		}
	}
	return textContent.trim();
};
