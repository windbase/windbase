import { Tabs, TabsContent, TabsList, TabsTrigger } from '@windbase/ui';
import Layers from '../elements/layers';
import Pages from './pages';

function Sidebar() {
	return (
		<div>
			<Tabs defaultValue="pages">
				<TabsList className="relative justify-start h-auto w-full gap-0.5 bg-transparent p-0 before:absolute before:inset-x-0 before:bottom-0 before:h-px before:bg-border">
					<TabsTrigger
						value="pages"
						className="overflow-hidden w-full rounded-none border-none bg-muted py-2 data-[state=active]:z-10 data-[state=active]:shadow-none"
					>
						Pages
					</TabsTrigger>
					<TabsTrigger
						value="layers"
						className="overflow-hidden w-full rounded-none border-none bg-muted py-2 data-[state=active]:z-10 data-[state=active]:shadow-none"
					>
						Layers
					</TabsTrigger>
				</TabsList>
				<TabsContent value="pages">
					<Pages />
				</TabsContent>
				<TabsContent value="layers">
					<Layers />
				</TabsContent>
			</Tabs>
		</div>
	);
}

export default Sidebar;
