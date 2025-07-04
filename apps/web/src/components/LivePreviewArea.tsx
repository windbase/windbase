'use client';

import { useEffect, useRef } from 'react';
import LivePreview from './LivePreview';
import LivePreviewToolbar from './LivePreviewToolbar';

function LivePreviewArea() {
	const canvasRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (canvasRef.current) {
			canvasRef.current.addEventListener('click', () => {
				console.log('clicked');
			});
		}

		return () => {
			if (canvasRef.current) {
				canvasRef.current.removeEventListener('click', () => {});
			}
		};
	}, []);

	return (
		<div
			ref={canvasRef}
			className="flex flex-col h-[95%] w-[88%] bg-background rounded-xl border"
		>
			<LivePreviewToolbar />
			<div className="flex-1 overflow-auto rounded-b-xl">
				<LivePreview />
			</div>
		</div>
	);
}

export default LivePreviewArea;
