import { useBuilder } from '@windbase/engine';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@windbase/ui';
import ElementLayers from '../elements/layers';
import Pages from './pages';

function Sidebar() {
	const { sidebarView, setSidebarView } = useBuilder();

	return (
		<div>
			<Tabs
				value={sidebarView}
				onValueChange={(value) => {
					setSidebarView(value as 'pages' | 'layers');
				}}
			>
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
					<ElementLayers />
				</TabsContent>
			</Tabs>
		</div>
	);
}

export default Sidebar;
