'use client';

import { useEffect, useRef } from 'react';
import ElementLayers from '@/components/element-management/element-layers';
import ElementProperties from '@/components/element-management/element-properties';
import DefaultSidebar from '@/components/ui-navigation/default-sidebar';
import Toolbar from '@/components/ui-navigation/toolbar';
import { useBuilder } from '@/store/builder';
import LivePreviewArea from './live-preview-area';

function VisualBuilder() {
	const canvasRef = useRef<HTMLDivElement>(null);
	const { sidebarView, selectedElement, selectElement, setSidebarView } =
		useBuilder();

	useEffect(() => {
		if (canvasRef.current) {
			canvasRef.current.addEventListener('click', (event) => {
				const toolbar = (event.target as HTMLElement)?.closest(
					'#live-preview-toolbar',
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

	useEffect(() => {
		if (selectedElement) {
			setSidebarView('layers');
		} else {
			setSidebarView('default');
		}
	}, [selectedElement, setSidebarView]);

	return (
		<div className="h-screen overflow-hidden flex flex-col">
			<Toolbar />
			<div className="flex-1 flex overflow-hidden">
				<div className="w-56 min-w-56 h-full border-r overflow-auto">
					{sidebarView === 'default' ? <DefaultSidebar /> : <ElementLayers />}
				</div>
				<div
					ref={canvasRef}
					className="flex-1 bg-neutral-50 dark:bg-neutral-900 flex justify-center items-center px-4"
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
