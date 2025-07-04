'use client';

import { useEffect, useRef, useState } from 'react';
import { useBuilder } from '@/store/builder';

function LivePreview() {
	const iframeRef = useRef<HTMLIFrameElement>(null);
	const [isIframeLoaded, setIsIframeLoaded] = useState(false);
	const isEditingInIframe = useRef(false);
	const {
		elements,
		selectedElement,
		hoverElement,
		selectElement,
		hoveredElement,
		updateElement,
	} = useBuilder();

	// Initialize iframe with basic HTML structure once
	useEffect(() => {
		if (iframeRef.current && !isIframeLoaded) {
			const doc = iframeRef.current.contentDocument;

			if (doc) {
				const htmlContent = `
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
							.empty-state {
								display: flex;
								align-items: center;
								justify-content: center;
								height: 100vh;
								font-family: system-ui, -apple-system, sans-serif;
								color: #666;
							}
							.empty-state-content {
								text-align: center;
							}
							.empty-state h2 {
								margin: 0 0 8px 0;
								font-size: 24px;
								font-weight: 600;
							}
							.empty-state p {
								margin: 0;
								font-size: 16px;
							}
						</style>
					</head>
					<body>
						<div id="preview-container"></div>
						<div id="empty-state" class="empty-state">
							<div class="empty-state-content">
								<h2>No elements</h2>
								<p>Start building your design by adding elements</p>
							</div>
						</div>
						<script>
							let currentElements = [];
							let selectedElementId = null;
							let hoveredElementId = null;

							// Handle element selection
							document.addEventListener('click', function(e) {
								const elementId = e.target.closest('[data-element-id]')?.getAttribute('data-element-id');
								if (elementId) {
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

							document.addEventListener('input', function(e) {
								const elementId = e.target.closest('[data-element-id]')?.getAttribute('data-element-id');
								if (elementId) {
									window.parent.postMessage({
										type: 'element-content-changed',
										elementId: elementId,
										content: e.target.textContent || ''
									}, '*');
								}
							});

							// Listen for messages from parent
							window.addEventListener('message', function(event) {
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
									return elements.map(element => {
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
								const element = currentElements.find(el => el.id === elementId) || 
									currentElements.find(el => findElementInChildren(el, elementId));
								
								// Update only the specific DOM element without re-rendering everything
								const domElement = document.querySelector('[data-element-id="' + elementId + '"]');
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
													range.setStart(textNode, Math.min(cursorPosition, textNode.textContent.length));
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
									for (let child of parent.children) {
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
									return '<' + element.tag + ' class="' + classNames + '" style="' + style + '" data-element-id="' + element.id + '" />';
								}

								// Handle elements with children
								const childrenHTML = (element.children || []).map(renderElement).join('');
								const content = element.content || '';

								// Only add contenteditable if the element has no children
								// Elements with children should not be directly editable to avoid destroying child elements
								const contenteditable = (element.children && element.children.length > 0) 
									? 'false' 
									: (element.isContentEditable || false);

								return '<' + element.tag + ' class="' + classNames + '" style="' + style + '" data-element-id="' + element.id + '" contenteditable="' + contenteditable + '">' + content + childrenHTML + '</' + element.tag + '>';
							}

							function selectElement(elementId) {
								// Remove previous selection outline
								if (selectedElementId) {
									const prevElement = document.querySelector('[data-element-id="' + selectedElementId + '"]');
									if (prevElement) {
										prevElement.style.outline = '';
									}
								}
								
								selectedElementId = elementId;
								
								// Add selection outline
								if (elementId) {
									const element = document.querySelector('[data-element-id="' + elementId + '"]');
									if (element) {
										element.style.outline = '2px solid #3b82f6';
										element.style.outlineOffset = '2px';
									}
								}
							}

							function hoverElement(elementId) {
								// Remove previous hover outline
								if (hoveredElementId) {
									const prevElement = document.querySelector('[data-element-id="' + hoveredElementId + '"]');
									if (prevElement && hoveredElementId !== selectedElementId) {
										prevElement.style.outline = '';
									}
								}
								
								hoveredElementId = elementId;
								
								// Add hover outline (but don't override selection)
								if (elementId && elementId !== selectedElementId) {
									const element = document.querySelector('[data-element-id="' + elementId + '"]');
									if (element) {
										element.style.outline = '2px solid #10b981';
										element.style.outlineOffset = '2px';
									}
								}
							}

              function updateElementAttributes(elementId, attributes) {
                const element = document.querySelector('[data-element-id="' + elementId + '"]');
                if (element) {
                  Object.entries(attributes).forEach(([key, value]) => {
                    element.setAttribute(key, value);
                  });
                }
              }

							// Signal that iframe is ready
							window.parent.postMessage({ type: 'iframe-ready' }, '*');
						</script>
					</body>
					</html>
				`;

				doc.open();
				doc.write(htmlContent);
				doc.close();
			}
		}
	}, [isIframeLoaded]);

	// Handle iframe ready and send initial elements
	useEffect(() => {
		const handleMessage = (event: MessageEvent) => {
			if (event.data.type === 'iframe-ready') {
				setIsIframeLoaded(true);
			} else if (event.data.type === 'element-selected') {
				if (event.data.elementId !== selectedElement?.id) {
					selectElement(event.data.elementId);
				}
			} else if (event.data.type === 'element-hovered') {
				hoverElement(event.data.elementId);
			} else if (event.data.type === 'element-unhovered') {
				hoverElement(null);
			} else if (event.data.type === 'element-content-changed') {
				isEditingInIframe.current = true;
				updateElement(event.data.elementId, {
					content: event.data.content,
				});
				// Reset flag after a short delay to allow for re-sync from external sources
				setTimeout(() => {
					isEditingInIframe.current = false;
				}, 100);
			}
		};

		window.addEventListener('message', handleMessage);
		return () => window.removeEventListener('message', handleMessage);
	}, [selectedElement, hoverElement, selectElement, updateElement]);

	// Send elements to iframe when ready or when elements change
	useEffect(() => {
		if (isIframeLoaded && iframeRef.current && !isEditingInIframe.current) {
			const iframe = iframeRef.current;
			iframe.contentWindow?.postMessage(
				{
					type: 'sync-elements',
					data: { elements },
				},
				'*',
			);
		}
	}, [isIframeLoaded, elements]);

	// Handle content updates from properties panel
	const prevSelectedElementContent = useRef<string | undefined>(undefined);
	const prevSelectedElementId = useRef<string | undefined>(undefined);
	const prevSelectedElementAttributes = useRef<
		Record<string, string> | undefined
	>(undefined);

	useEffect(() => {
		if (
			isIframeLoaded &&
			iframeRef.current &&
			selectedElement &&
			!isEditingInIframe.current
		) {
			const currentContent = selectedElement.content;
			const prevContent = prevSelectedElementContent.current;
			const currentId = selectedElement.id;
			const prevId = prevSelectedElementId.current;

			const currentAttributes = selectedElement.attributes;
			const prevAttributes = prevSelectedElementAttributes.current;

			// Only send content update if:
			// 1. Content actually changed
			// 2. It's the same element (not switching between elements)
			// 3. Previous content was defined (not initial selection)
			// 4. Element has no children (to avoid destroying child elements)
			if (
				currentContent !== prevContent &&
				prevContent !== undefined &&
				currentId === prevId &&
				(!selectedElement.children || selectedElement.children.length === 0)
			) {
				const iframe = iframeRef.current;
				iframe.contentWindow?.postMessage(
					{
						type: 'update-content',
						data: { elementId: selectedElement.id, content: currentContent },
					},
					'*',
				);
			}

			if (currentAttributes !== prevAttributes && currentAttributes) {
				const iframe = iframeRef.current;
				iframe.contentWindow?.postMessage(
					{
						type: 'update-attributes',
						data: {
							elementId: selectedElement.id,
							attributes: currentAttributes,
						},
					},
					'*',
				);
			}

			prevSelectedElementContent.current = currentContent;
			prevSelectedElementId.current = currentId;
			prevSelectedElementAttributes.current = currentAttributes;
		}
	}, [isIframeLoaded, selectedElement]);

	// Handle selection state changes
	useEffect(() => {
		if (isIframeLoaded && iframeRef.current) {
			const iframe = iframeRef.current;
			iframe.contentWindow?.postMessage(
				{
					type: 'select-element',
					data: { elementId: selectedElement?.id || null },
				},
				'*',
			);
		}
	}, [isIframeLoaded, selectedElement]);

	// Handle hover state changes
	useEffect(() => {
		if (isIframeLoaded && iframeRef.current) {
			const iframe = iframeRef.current;
			iframe.contentWindow?.postMessage(
				{
					type: 'hover-element',
					data: { elementId: hoveredElement?.id || null },
				},
				'*',
			);
		}
	}, [isIframeLoaded, hoveredElement]);

	return (
		<iframe
			ref={iframeRef}
			className="h-full w-full border-0"
			title="Live Preview"
			sandbox="allow-scripts allow-same-origin"
		/>
	);
}

export default LivePreview;
