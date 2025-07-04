'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { elements } from '@/lib/elements';
import { elementTypes } from '@/lib/elementTypes';
import { useBuilder } from '@/store/builder';

type ElementPickerProps = {
	onClose: () => void;
};

function ElementPicker({ onClose }: ElementPickerProps) {
	const { addElement, selectedElement, setSidebarView } = useBuilder();

	return (
		<Tabs defaultValue="layout">
			<div className="relative rounded-sm overflow-x-scroll bg-muted">
				<TabsList className="h-8">
					{elementTypes.map((type) => (
						<TabsTrigger key={type} value={type} className="capitalize text-xs">
							{type}
						</TabsTrigger>
					))}
				</TabsList>
			</div>
			{elementTypes.map((type, index) => (
				<TabsContent
					key={type}
					value={type}
					className={`${index === 0 ? 'mt-1.5' : 'mt-0'} grid grid-cols-2 gap-1.5`}
				>
					{elements[type].map((element) => (
						<button
							type="button"
							key={element.id}
							className="capitalize text-xs hover:bg-muted cursor-pointer text-muted-foreground h-10 flex items-center justify-center border rounded-sm"
							onClick={() => {
								if (selectedElement) {
									if (selectedElement.tag === 'div') {
										addElement(element, selectedElement.id);
									} else {
										addElement(element, selectedElement.parent);
									}
								} else {
									addElement(element);
								}
								setSidebarView('layers');
								onClose();
							}}
						>
							{element.id}
						</button>
					))}
				</TabsContent>
			))}
		</Tabs>
	);
}

export default ElementPicker;
