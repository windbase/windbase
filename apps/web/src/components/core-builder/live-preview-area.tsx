import { useBuilder } from '@/store/builder';
import LivePreview from './live-preview';
import LivePreviewToolbar from './live-preview-toolbar';

function LivePreviewArea() {
	const { responsiveMode } = useBuilder();

	return (
		<div
			className="flex flex-col rounded-xl border transition-all duration-300"
			style={{
				width: responsiveMode === 'mobile' ? '40%' : '100%',
				height: '95%',
				maxHeight: '95%',
				transform: 'scale(0.95)',
			}}
		>
			<LivePreviewToolbar />
			<div className="flex-1 overflow-auto rounded-b-xl">
				<LivePreview />
			</div>
		</div>
	);
}

export default LivePreviewArea;
