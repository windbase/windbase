import { useBuilder } from '@/store/builder';
import LivePreview from './live-preview';
import LivePreviewToolbar from './live-preview-toolbar';

function LivePreviewArea() {
	const { responsiveMode } = useBuilder();

	return (
		<div
			className={`flex flex-col ${
				responsiveMode === 'desktop' ? 'w-[88%]' : 'w-[393px]'
			} h-[95%] bg-background rounded-xl border transition-all duration-300`}
		>
			<LivePreviewToolbar />
			<div className="flex-1 overflow-auto rounded-b-xl">
				<LivePreview />
			</div>
		</div>
	);
}

export default LivePreviewArea;
