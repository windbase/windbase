'use client';

import { useBuilder } from '@windbase/engine';
import { useEffect, useRef, useState } from 'react';
import ElementProperties from '@/components/elements/properties';
import { useKeyboardShortcuts } from '@/components/shared/keyboard-shortcuts';
import LivePreviewArea from './live-preview/area';
import Sidebar from './sidebar';
import Toolbar from './toolbar';

function VisualBuilder() {
	const canvasRef = useRef<HTMLDivElement>(null);
	const builderRef = useRef<HTMLDivElement>(null);
	const [isBuilderFocused, setIsBuilderFocused] = useState(false);
	const { selectedElement, selectElement } = useBuilder();

	// Enable keyboard shortcuts when builder is focused
	useKeyboardShortcuts(isBuilderFocused);

	useEffect(() => {
		if (canvasRef.current) {
			canvasRef.current.addEventListener('click', (event) => {
				const toolbar = (event.target as HTMLElement)?.closest(
					'#live-preview-toolbar'
				);
				if (toolbar) {
					return;
				}
				selectElement(null);
			});
		}

		return () => {
			if (canvasRef.current) {
				canvasRef.current.removeEventListener('click', () => {});
			}
		};
	}, [selectElement]);

	// Handle focus state for the builder (without actual DOM focus)
	useEffect(() => {
		const handleMouseEnter = () => setIsBuilderFocused(true);
		const handleMouseLeave = () => setIsBuilderFocused(false);
		const handleClick = () => setIsBuilderFocused(true);

		const builderElement = builderRef.current;
		if (builderElement) {
			builderElement.addEventListener('mouseenter', handleMouseEnter);
			builderElement.addEventListener('mouseleave', handleMouseLeave);
			builderElement.addEventListener('click', handleClick);

			// Set initial focus state (no DOM focus needed)
			setIsBuilderFocused(true);
		}

		return () => {
			if (builderElement) {
				builderElement.removeEventListener('mouseenter', handleMouseEnter);
				builderElement.removeEventListener('mouseleave', handleMouseLeave);
				builderElement.removeEventListener('click', handleClick);
			}
		};
	}, []);

	return (
		<div ref={builderRef} className="h-screen overflow-hidden flex flex-col">
			<Toolbar />
			<div className="flex-1 flex overflow-hidden">
				<div className="w-56 min-w-56 h-full border-r overflow-auto">
					<Sidebar />
				</div>
				<div
					ref={canvasRef}
					className="flex-1 bg-neutral-50 dark:bg-muted/20 flex justify-center items-center"
				>
					<LivePreviewArea />
				</div>
				<div className="w-60 min-w-60 h-full border-l overflow-auto">
					{selectedElement && <ElementProperties />}
				</div>
			</div>
		</div>
	);
}

export default VisualBuilder;
