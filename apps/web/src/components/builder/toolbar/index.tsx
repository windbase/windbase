import { useBuilder } from '@windbase/engine';
import {
	Button,
	Separator,
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger
} from '@windbase/ui';
import { Eye, Palette, Redo, Undo } from 'lucide-react';
import { useState } from 'react';
import ElementPicker from '../../elements/picker';
import BlockPicker from '../block-picker';
import TemplatePicker from '../template-picker';
import DarkModeButton from './dark-mode-button';
import ExportButton from './export-button';
import ToolbarMenu from './menu';
import NewReleaseIndicator from './release-indicator';
import TailwindCSSConfig from './tailwindcss-config';
import ViewCodeButton from './view-code';

function Toolbar() {
	const [viewTailwindCSSConfig, setViewTailwindCSSConfig] = useState(false);
	const { undo, redo, canUndo, canRedo, exportHtml } = useBuilder();

	return (
		<TooltipProvider>
			<div className="h-14 min-h-14 border-b grid grid-cols-8 justify-between items-center px-3 gap-4">
				<div className="col-span-3 flex items-center gap-3 justify-start">
					<ToolbarMenu />
					<NewReleaseIndicator />
				</div>
				<div className="mx-auto flex items-center col-span-2 gap-2"></div>

				<div className="flex items-center gap-1.5 ml-auto col-span-3">
					<ElementPicker />
					<BlockPicker />
					<TemplatePicker />
					<Tooltip delayDuration={200}>
						<TooltipTrigger asChild>
							<Button
								variant="outline"
								size="icon"
								onClick={() => setViewTailwindCSSConfig(true)}
							>
								<Palette />
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							<p>Theme Config</p>
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

					<Separator orientation="vertical" className="h-4 mx-2" />

					<ExportButton />

					<ViewCodeButton />

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

			<TailwindCSSConfig
				open={viewTailwindCSSConfig}
				setOpen={setViewTailwindCSSConfig}
			/>
		</TooltipProvider>
	);
}

export default Toolbar;
