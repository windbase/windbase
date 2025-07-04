import LivePreview from './LivePreview';
import LivePreviewToolbar from './LivePreviewToolbar';

function LivePreviewArea() {
	return (
		<div className="flex flex-col h-[95%] w-[88%] bg-background rounded-xl border">
			<LivePreviewToolbar />
			<div className="flex-1 overflow-auto rounded-b-xl">
				<LivePreview />
			</div>
		</div>
	);
}

export default LivePreviewArea;
