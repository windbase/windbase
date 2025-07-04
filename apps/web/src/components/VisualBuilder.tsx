'use client';

import { useEffect, useRef } from 'react';
import { useBuilder } from '@/store/builder';
import DefaultSidebar from './DefaultSidebar';
import ElementLayers from './ElementLayers';
import ElementProperties from './ElementProperties';
import LivePreviewArea from './LivePreviewArea';
import Toolbar from './Toolbar';

function VisualBuilder() {
	const canvasRef = useRef<HTMLDivElement>(null);
	const { sidebarView, selectedElement, selectElement, setSidebarView } =
		useBuilder();

	useEffect(() => {
		if (canvasRef.current) {
			canvasRef.current.addEventListener('click', () => {
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
			<div className="flex-1 flex">
				<div className="w-56 h-full border-r">
					{sidebarView === 'default' ? <DefaultSidebar /> : <ElementLayers />}
				</div>
				<div
					ref={canvasRef}
					className="flex-1 bg-neutral-50 dark:bg-neutral-900 flex justify-center items-center"
				>
					<LivePreviewArea />
				</div>
				<div className="w-60 h-full border-l">
					{selectedElement && <ElementProperties />}
				</div>
			</div>
		</div>
	);
}

export default VisualBuilder;
