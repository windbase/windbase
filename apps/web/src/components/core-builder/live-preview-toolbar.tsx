import { TooltipProvider } from '@radix-ui/react-tooltip';
import { File } from 'lucide-react';
import ElementPicker from '../element-management/element-picker';

function LivePreviewToolbar() {
	return (
		<TooltipProvider>
			<div
				className="grid grid-cols-3 h-8 items-center px-3 border-b bg-neutral-50 dark:bg-muted/20 rounded-t-xl"
				id="live-preview-toolbar"
			>
				<div className="flex items-center gap-1.5">
					<div className="h-3 w-3 rounded-full bg-red-500" />
					<div className="h-3 w-3 rounded-full bg-yellow-500" />
					<div className="h-3 w-3 rounded-full bg-green-500" />
				</div>
				<div className="text-center text-sm text-muted-foreground">
					index.html
				</div>
				<div className="ml-auto flex items-center gap-2.5">
					<ElementPicker />
					<File className="hover:text-primary cursor-pointer" size={16} />
				</div>
			</div>
		</TooltipProvider>
	);
}

export default LivePreviewToolbar;
