import { TooltipProvider } from '@radix-ui/react-tooltip';
import { Code, Plus } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

function LivePreviewToolbar() {
	return (
		<TooltipProvider>
			<div className="flex h-8 items-center px-3 border-b bg-neutral-50 dark:bg-neutral-900 rounded-t-xl">
				<div className="flex items-center gap-1.5">
					<div className="h-3 w-3 rounded-full bg-red-500" />
					<div className="h-3 w-3 rounded-full bg-yellow-500" />
					<div className="h-3 w-3 rounded-full bg-green-500" />
				</div>
				<div className="ml-auto flex items-center gap-2.5">
					<Tooltip delayDuration={200}>
						<TooltipTrigger asChild>
							<Plus className="hover:text-primary cursor-pointer" size={16} />
						</TooltipTrigger>
						<TooltipContent>
							<p>Add component</p>
						</TooltipContent>
					</Tooltip>
					<Tooltip delayDuration={200}>
						<TooltipTrigger asChild>
							<Code className="hover:text-primary cursor-pointer" size={16} />
						</TooltipTrigger>
						<TooltipContent>
							<p>View code</p>
						</TooltipContent>
					</Tooltip>
				</div>
			</div>
		</TooltipProvider>
	);
}

export default LivePreviewToolbar;
