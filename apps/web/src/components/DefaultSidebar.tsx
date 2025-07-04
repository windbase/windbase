import { Download, Search } from 'lucide-react';
import { Button } from './ui/button';

function DefaultSidebar() {
	return (
		<div>
			<div className="p-2 flex items-center gap-1">
				<Button className="w-full">
					<Download /> Import
				</Button>
				<Button variant="outline">
					<Search />
				</Button>
			</div>
		</div>
	);
}

export default DefaultSidebar;
