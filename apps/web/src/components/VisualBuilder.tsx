import DefaultSidebar from './DefaultSidebar';
// import ElementLayers from './ElementLayers';
import LivePreviewArea from './LivePreviewArea';
import Toolbar from './Toolbar';

function VisualBuilder() {
	return (
		<div className="h-screen overflow-hidden flex flex-col">
			<Toolbar />
			<div className="flex-1 flex">
				<div className="w-56 h-full border-r">
					<DefaultSidebar />
				</div>
				<div className="flex-1 bg-neutral-50 dark:bg-neutral-900 flex justify-center items-center">
					<LivePreviewArea />
				</div>
				<div className="w-56 h-full border-l"></div>
			</div>
		</div>
	);
}

export default VisualBuilder;
