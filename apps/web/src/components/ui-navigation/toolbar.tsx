import {
	ChevronDown,
	Code,
	Eye,
	Monitor,
	// Pencil,
	Redo,
	// Save,
	Smartphone,
	Undo,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { useBuilder } from '@/store/builder';
import DarkModeButton from './dark-mode-button';
import ExportButton from './export-button';

function Toolbar() {
	const { responsiveMode, setResponsiveMode, undo, redo, canUndo, canRedo } =
		useBuilder();
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
					<div className="w-4" />
					{/* <span>Untitled project</span>
					<Pencil size={14} /> */}
				</div>
				<div className="mx-auto flex items-center col-span-2">
					<Tabs
						aria-label="Options"
						defaultValue={responsiveMode}
						onValueChange={(value) =>
							setResponsiveMode(value as 'desktop' | 'mobile')
						}
					>
						<TabsList>
							<TabsTrigger value="desktop">
								<Monitor size={20} />
							</TabsTrigger>
							<TabsTrigger value="mobile">
								<Smartphone size={20} />
							</TabsTrigger>
						</TabsList>
					</Tabs>
				</div>

				<div className="flex items-center gap-1.5 ml-auto col-span-3">
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
						<TooltipTrigger>
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
							<Button variant="outline" size="icon">
								<Eye />
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							<p>Preview</p>
						</TooltipContent>
					</Tooltip>

					{/* <Tooltip delayDuration={200}>
						<TooltipTrigger asChild>
							<Button>
								<Save /> Save
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							<p>Save changes</p>
						</TooltipContent>
					</Tooltip> */}

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
