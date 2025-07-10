import { useBuilder } from '@windbase/engine';
import EmptyElements from '@/components/shared/empty-elements';
import LivePreview from './preview';
import LivePreviewToolbar from './toolbar';

function LivePreviewArea() {
	const { getCurrentPageElements, responsiveMode } = useBuilder();

	const elements = getCurrentPageElements();

	return (
		<div
			className="flex flex-col rounded-xl border transition-all duration-300"
			style={{
				width: responsiveMode === 'mobile' ? '40%' : '100%',
				height: '95%',
				maxHeight: '95%',
				transform: 'scale(0.95)'
			}}
		>
			<LivePreviewToolbar />
			<div className="flex-1 overflow-auto rounded-b-xl">
				{elements.length > 0 ? <LivePreview /> : <EmptyElements />}
			</div>
		</div>
	);
}

export default LivePreviewArea;
