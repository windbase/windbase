import { useBuilder } from '@windbase/engine';
import {
	Button,
	Separator,
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger
} from '@windbase/ui';
import { Code, Eye, Redo, Undo } from 'lucide-react';
import ElementPicker from '../../elements/picker';
import DarkModeButton from './dark-mode-button';
import ExportButton from './export-button';
import ToolbarMenu from './menu';

function Toolbar() {
	const { undo, redo, canUndo, canRedo, exportHtml } = useBuilder();

	return (
		<TooltipProvider>
			<div className="h-14 min-h-14 border-b grid grid-cols-8 justify-between items-center px-3 gap-4">
				<div className="col-span-3 flex justify-start">
					<ToolbarMenu />
				</div>
				<div className="mx-auto flex items-center col-span-2 gap-2"></div>

				<div className="flex items-center gap-1.5 ml-auto col-span-3">
					<ElementPicker />

					<Separator orientation="vertical" className="h-4 mx-2" />

					<Tooltip delayDuration={200}>
						<TooltipTrigger asChild>
							<Button
								disabled={!canUndo}
								variant="outline"
								size="icon"
								onClick={undo}
							>
								<Undo />
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							<p>Undo</p>
						</TooltipContent>
					</Tooltip>

					<Tooltip delayDuration={200}>
						<TooltipTrigger asChild>
							<Button
								disabled={!canRedo}
								variant="outline"
								size="icon"
								onClick={redo}
							>
								<Redo />
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							<p>Redo</p>
						</TooltipContent>
					</Tooltip>

					<Separator orientation="vertical" className="h-4 mx-2" />

					<ExportButton />

					<Tooltip delayDuration={200}>
						<TooltipTrigger asChild>
							<Button variant="outline" size="icon">
								<Code />
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							<p>View code</p>
						</TooltipContent>
					</Tooltip>

					<Tooltip delayDuration={200}>
						<TooltipTrigger asChild>
							<Button
								variant="outline"
								size="icon"
								onClick={() => {
									const htmlContent = exportHtml();
									const previewWindow = window.open('', '_blank');
									if (previewWindow) {
										previewWindow.document.writeln(htmlContent);
										previewWindow.document.close();
									}
								}}
							>
								<Eye />
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							<p>Preview</p>
						</TooltipContent>
					</Tooltip>

					<Tooltip delayDuration={200}>
						<TooltipTrigger asChild>
							<DarkModeButton />
						</TooltipTrigger>
						<TooltipContent>
							<p>Dark Mode</p>
						</TooltipContent>
					</Tooltip>
				</div>
			</div>
		</TooltipProvider>
	);
}

export default Toolbar;
