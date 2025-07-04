'use client';

import { TooltipProvider } from '@radix-ui/react-tooltip';
import { Code, Plus } from 'lucide-react';
import { useState } from 'react';
import ElementPicker from '@/components/element-management/element-picker';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';

function LivePreviewToolbar() {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<TooltipProvider>
			<div
				className="flex h-8 items-center px-3 border-b bg-neutral-50 dark:bg-neutral-900 rounded-t-xl"
				id="live-preview-toolbar"
			>
				<div className="flex items-center gap-1.5">
					<div className="h-3 w-3 rounded-full bg-red-500" />
					<div className="h-3 w-3 rounded-full bg-yellow-500" />
					<div className="h-3 w-3 rounded-full bg-green-500" />
				</div>
				<div className="ml-auto flex items-center gap-2.5">
					<Popover open={isOpen} onOpenChange={setIsOpen}>
						<PopoverTrigger asChild>
							<Plus className="hover:text-primary cursor-pointer" size={16} />
						</PopoverTrigger>
						<PopoverContent>
							<h1 className="text-sm font-medium mb-3">Add component</h1>
							<ElementPicker onClose={() => setIsOpen(false)} />
						</PopoverContent>
					</Popover>

					<Code className="hover:text-primary cursor-pointer" size={16} />
				</div>
			</div>
		</TooltipProvider>
	);
}

export default LivePreviewToolbar;
