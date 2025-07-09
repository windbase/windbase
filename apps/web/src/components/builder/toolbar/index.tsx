import { useBuilder } from '@windbase/engine';
import {
	Button,
	Separator,
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger
} from '@windbase/ui';
import { ChevronDown, Code, Eye, Grid, Redo, Undo } from 'lucide-react';
import ElementPicker from '../../elements/picker';
import DarkModeButton from './dark-mode-button';
import ExportButton from './export-button';

function Toolbar() {
	const { undo, redo, canUndo, canRedo, exportHtml } = useBuilder();

	return (
		<TooltipProvider>
			<div className="h-14 min-h-14 border-b grid grid-cols-8 justify-between items-center px-3 gap-4">
				<div className="flex items-center gap-2 col-span-3">
					<img
						src="/windbase-circle.svg"
						alt="Windbase"
						width={100}
						height={100}
						className="h-8 w-8 rounded-md"
					/>
					<ChevronDown size={16} />
				</div>
				<div className="mx-auto flex items-center col-span-2 gap-2"></div>

				<div className="flex items-center gap-1.5 ml-auto col-span-3">
					<ElementPicker />

					<Tooltip delayDuration={200}>
						<TooltipTrigger asChild>
							<Button variant={'outline'} size={'icon'}>
								<Grid />
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							<p>Templates</p>
						</TooltipContent>
					</Tooltip>
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

					<Tooltip delayDuration={200}>
						<TooltipTrigger asChild>
							<ExportButton />
						</TooltipTrigger>
						<TooltipContent>
							<p>Export</p>
						</TooltipContent>
					</Tooltip>

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
