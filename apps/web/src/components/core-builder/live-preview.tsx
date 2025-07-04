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
						<script src="/js/live-preview.js"></script>
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
