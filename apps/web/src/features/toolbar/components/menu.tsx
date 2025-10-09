import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@windbase/ui';
import { ChevronDown, Globe } from 'lucide-react';
import { useEffect, useRef } from 'react';

let rotation = 0;

function ToolbarMenu() {
	const imageRef = useRef<HTMLImageElement>(null);

	useEffect(() => {
		let interval: NodeJS.Timeout;
		if (imageRef.current) {
			const image = imageRef.current;
			image.addEventListener('mouseenter', () => {
				interval = setInterval(() => {
					image.style.transform = `rotate(${rotation}deg)`;
					rotation += 10;
				}, 100);
			});

			image.addEventListener('mouseleave', () => {
				clearInterval(interval);
			});
		}
	}, []);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<div className="flex items-center gap-2">
					<img
						ref={imageRef}
						src="/windbase-circle.svg"
						alt="Windbase"
						width={100}
						height={100}
						draggable={false}
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
				<DropdownMenuSeparator />
				<DropdownMenuLabel>Links</DropdownMenuLabel>
				<DropdownMenuItem onClick={() => window.open('https://github.com/windbase/windbase', '_blank')}><span className="icon-[simple-icons--github]"></span> GitHub</DropdownMenuItem>
				<DropdownMenuItem onClick={() => window.open('https://discord.gg/wHMpedAzhT', '_blank')}><span className="icon-[simple-icons--discord]"></span> Discord</DropdownMenuItem>
				<DropdownMenuItem onClick={() => window.open('https://windbase.dev', '_blank')}><Globe /> Website</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export default ToolbarMenu;
