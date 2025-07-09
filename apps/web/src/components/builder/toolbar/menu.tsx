import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@windbase/ui';
import { ChevronDown } from 'lucide-react';

function ToolbarMenu() {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<div className="flex items-center gap-2">
					<img
						src="/windbase-circle.svg"
						alt="Windbase"
						width={100}
						height={100}
						className="h-8 w-8 rounded-md"
					/>
					<div className="px-2 py-1 bg-muted rounded-xl text-xs pointer-events-none">
						v{VERSION}
					</div>
					<ChevronDown size={16} />
				</div>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="start" className="w-56">
				<DropdownMenuLabel>Windbase</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem>New Project</DropdownMenuItem>
				<DropdownMenuItem>Open Project</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem>Export Project</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export default ToolbarMenu;
