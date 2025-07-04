import {
	ChevronDown,
	Code,
	Download,
	Eye,
	Monitor,
	Pencil,
	Redo,
	Save,
	Smartphone,
	Undo,
} from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DarkModeButton from './DarkModeButton';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from './ui/tooltip';

function Toolbar() {
	return (
		<TooltipProvider>
			<div className="h-14 border-b grid grid-cols-8 justify-between items-center px-6 gap-4">
				<div className="flex items-center gap-2 col-span-3">
					<Image
						src="/windbase-circle.svg"
						alt="Windbase"
						width={100}
						height={100}
						className="h-8 w-8 rounded-md"
					/>
					<ChevronDown size={16} />
					<div className="w-4" />
					<span>Untitled project</span>
					<Pencil size={14} />
				</div>
				<div className="mx-auto flex items-center col-span-2">
					<Tabs aria-label="Options" defaultValue="pc">
						<TabsList>
							<TabsTrigger value="pc">
								<Monitor size={20} />
							</TabsTrigger>
							<TabsTrigger value="phone">
								<Smartphone size={20} />
							</TabsTrigger>
						</TabsList>
					</Tabs>
				</div>

				<div className="flex items-center gap-1.5 ml-auto col-span-3">
					<Tooltip delayDuration={200}>
						<TooltipTrigger asChild>
							<Button disabled variant="outline" size="icon">
								<Undo />
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							<p>Undo</p>
						</TooltipContent>
					</Tooltip>

					<Tooltip delayDuration={200}>
						<TooltipTrigger asChild>
							<Button disabled variant="outline" size="icon">
								<Redo />
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							<p>Redo</p>
						</TooltipContent>
					</Tooltip>

					<Tooltip delayDuration={200}>
						<TooltipTrigger asChild>
							<Button variant="outline" size="icon">
								<Download />
							</Button>
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

					<Tooltip delayDuration={200}>
						<TooltipTrigger asChild>
							<Button>
								<Save /> Save
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							<p>Save changes</p>
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
