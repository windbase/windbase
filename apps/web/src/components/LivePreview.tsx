'use client';

import { useEffect, useRef, useState } from 'react';
import type { BuilderElement } from '@/store/builder';
import { useBuilder } from '@/store/builder';

function LivePreview() {
	const iframeRef = useRef<HTMLIFrameElement>(null);
	const [, setIframeData] = useState<Document | null>(null);
	const {
		elements,
		selectedElement,
		hoverElement,
		selectElement,
		hoveredElement,
	} = useBuilder();

	// Update iframe content when elements change
	useEffect(() => {
		// Function to generate HTML from elements
		const generateHTML = (elements: BuilderElement[]): string => {
			if (elements.length === 0) {
				return `
					<div style="display: flex; align-items: center; justify-content: center; height: 100vh; font-family: system-ui, -apple-system, sans-serif; color: #666;">
						<div style="text-align: center;">
							<h2 style="margin: 0 0 8px 0; font-size: 24px; font-weight: 600;">No elements</h2>
							<p style="margin: 0; font-size: 16px;">Start building your design by adding elements</p>
						</div>
					</div>
				`;
			}

			const renderElement = (element: BuilderElement): string => {
				const classNames = element.classes.join(' ');
				const isSelected = selectedElement === element.id;
				const isHovered = hoveredElement === element.id;

				let style = '';
				if (isSelected) {
					style = 'outline: 2px solid #3b82f6; outline-offset: 2px;';
				} else if (isHovered) {
					style = 'outline: 2px solid #10b981; outline-offset: 2px;';
				}

				// Handle self-closing tags
				if (
					element.tag === 'img' ||
					element.tag === 'input' ||
					element.tag === 'br' ||
					element.tag === 'hr'
				) {
					return `<${element.tag} class="${classNames}" style="${style}" data-element-id="${element.id}" />`;
				}

				// Handle elements with children
				const childrenHTML = element.children.map(renderElement).join('');
				const content = element.content || '';

				return `<${element.tag} class="${classNames}" style="${style}" data-element-id="${element.id}">${content}${childrenHTML}</${element.tag}>`;
			};

			return elements.map(renderElement).join('');
		};

		// Generate complete HTML document
		const generateCompleteHTML = (): string => {
			const bodyHTML = generateHTML(elements);
			return `
				<!DOCTYPE html>
				<html lang="en">
				<head>
					<meta charset="UTF-8">
					<meta name="viewport" content="width=device-width, initial-scale=1.0">
					<title>Live Preview</title>
					<script src="https://cdn.tailwindcss.com"></script>
					<style>
						body {
							margin: 0;
							padding: 0;
							font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
						}
						[data-element-id] {
							position: relative;
						}
						.container {
							max-width: 1200px;
							margin: 0 auto;
							padding: 0 16px;
						}
					</style>
				</head>
				<body>
					${bodyHTML}
					<script>
						// Handle element selection
						document.addEventListener('click', function(e) {
							const elementId = e.target.closest('[data-element-id]')?.getAttribute('data-element-id');
							if (elementId) {
								// Send message to parent window
								window.parent.postMessage({
									type: 'element-selected',
									elementId: elementId
								}, '*');
							}
						});

						// Handle element hover
						document.addEventListener('mouseover', function(e) {
							const elementId = e.target.closest('[data-element-id]')?.getAttribute('data-element-id');
							if (elementId) {
								window.parent.postMessage({
									type: 'element-hovered',
									elementId: elementId
								}, '*');
							}
						});

						document.addEventListener('mouseout', function(e) {
							window.parent.postMessage({
								type: 'element-unhovered'
							}, '*');
						});
					</script>
				</body>
				</html>
			`;
		};

		if (iframeRef.current) {
			const doc = iframeRef.current.contentDocument;

			if (elements.length === 0) {
				iframeRef.current.src = '/empty';
				return;
			} else {
				iframeRef.current.src = '';
				iframeRef.current.setAttribute('sandbox', 'allow-scripts');
			}

			if (doc) {
				setIframeData(doc);
				const htmlContent = generateCompleteHTML();
				doc.open();
				doc.write(htmlContent);
				doc.close();
			}
		}
	}, [elements, selectedElement, hoveredElement]);

	// Handle messages from iframe
	useEffect(() => {
		const handleMessage = (event: MessageEvent) => {
			if (event.data.type === 'element-selected') {
				// Don't update if it's the same element to prevent loops
				if (event.data.elementId !== selectedElement) {
					selectElement(event.data.elementId);
				}
			} else if (event.data.type === 'element-hovered') {
				hoverElement(event.data.elementId);
			} else if (event.data.type === 'element-unhovered') {
				hoverElement(null);
			}
		};

		window.addEventListener('message', handleMessage);
		return () => window.removeEventListener('message', handleMessage);
	}, [selectedElement, hoverElement, selectElement]);

	return (
		<iframe
			ref={iframeRef}
			className="h-full w-full border-0"
			title="Live Preview"
		/>
	);
}

export default LivePreview;
