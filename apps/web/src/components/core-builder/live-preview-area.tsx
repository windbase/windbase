import { useBuilder } from '@/store/builder';
import LivePreview from './live-preview';
import LivePreviewToolbar from './live-preview-toolbar';

function LivePreviewArea() {
	const { responsiveMode } = useBuilder();

	// Calculate aspect ratios for different modes
	const desktopAspectRatio = 2880 / 1800; // 1.6 (8:5)
	const mobileAspectRatio = 1179 / 2556; // ~0.461

	const aspectRatio =
		responsiveMode === 'mobile' ? mobileAspectRatio : desktopAspectRatio;
	const maxWidth = responsiveMode === 'mobile' ? '1179px' : '2880px';

	return (
		<div
			className="flex flex-col bg-background rounded-xl border transition-all duration-300"
			style={{
				height: '95%',
				width: `min(95vh * ${aspectRatio}, calc(100% - 0rem))`,
				maxWidth: maxWidth,
				aspectRatio: `${aspectRatio}`,
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
