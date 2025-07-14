import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@windbase/ui';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import TailwindCSSConfig from './tailwindcss-config';

function ToolbarMenu() {
	const [viewTailwindCSSConfig, setViewTailwindCSSConfig] = useState(false);
	return (
		<>
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
					<DropdownMenuItem onClick={() => setViewTailwindCSSConfig(true)}>
						TailwindCSS Config
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						className="text-destructive"
						onClick={() => {
							// Confirm the action
							if (!confirm('Are you sure you want to delete this project?'))
								return;

							// Delete the project
							window.localStorage.removeItem('builder-store');
							window.location.reload();
						}}
					>
						Delete Project
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
			<TailwindCSSConfig
				open={viewTailwindCSSConfig}
				setOpen={setViewTailwindCSSConfig}
			/>
		</>
	);
}

export default ToolbarMenu;
