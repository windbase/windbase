'use client';

import { useBuilder } from '@windbase/engine';
import { useEffect, useRef, useState } from 'react';

function LivePreview() {
	const iframeRef = useRef<HTMLIFrameElement>(null);
	const [isIframeLoaded, setIsIframeLoaded] = useState(false);
	const isEditingInIframe = useRef(false);
	const {
		getCurrentPageElements,
		selectedElement,
		hoverElement,
		selectElement,
		hoveredElement,
		updateElement,
		tailwindCSSConfig
	} = useBuilder();

	const elements = getCurrentPageElements();

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
						<script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
						<style type="text/tailwindcss">
							${tailwindCSSConfig}
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
						<script src="/js/live-preview.js"></script>
					</body>
					</html>
				`;

				doc.open();
				doc.writeln(htmlContent);
				doc.close();
			}
		}
	}, [isIframeLoaded, tailwindCSSConfig]);

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
					content: event.data.content
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
					data: { elements }
				},
				'*'
			);
		}
	}, [isIframeLoaded, elements]);

	// Send tailwind config to iframe
	useEffect(() => {
		if (isIframeLoaded && iframeRef.current) {
			const iframe = iframeRef.current;
			iframe.contentWindow?.postMessage(
				{ type: 'tailwind-config', data: { config: tailwindCSSConfig } },
				'*'
			);
		}
	}, [isIframeLoaded, tailwindCSSConfig]);

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
						data: { elementId: selectedElement.id, content: currentContent }
					},
					'*'
				);
			}

			if (currentAttributes !== prevAttributes && currentAttributes) {
				const iframe = iframeRef.current;
				iframe.contentWindow?.postMessage(
					{
						type: 'update-attributes',
						data: {
							elementId: selectedElement.id,
							attributes: currentAttributes
						}
					},
					'*'
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
					data: { elementId: selectedElement?.id || null }
				},
				'*'
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
					data: { elementId: hoveredElement?.id || null }
				},
				'*'
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
