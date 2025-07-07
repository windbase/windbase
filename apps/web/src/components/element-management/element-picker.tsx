import {
	Box,
	Image,
	LayoutGrid,
	type LucideIcon,
	Pen,
	Plus,
	Text,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/ui/command';
import { elements } from '@/lib/elements';
import type { ElementCategory } from '@/lib/elementTypes';
import { definitionToEditor } from '@/lib/transformers';
import { useBuilder } from '@/store/builder';
import { Button } from '../ui/button';

const iconMap: Record<ElementCategory, LucideIcon> = {
	layout: LayoutGrid,
	form: Pen,
	media: Image,
	text: Text,
	other: Box,
};

function ElementPicker() {
	const [open, setOpen] = useState(false);
	const { selectedElement, addElement, setSidebarView } = useBuilder();

	const categories = useMemo(() => {
		return elements.reduce(
			(acc, element) => {
				acc[element.type] = [...(acc[element.type] || []), element];
				return acc;
			},
			{} as Record<ElementCategory, typeof elements>,
		);
	}, []);

	return (
		<>
			<Button variant={'outline'} size={'icon'} onClick={() => setOpen(true)}>
				<Plus />
			</Button>
			<CommandDialog open={open} onOpenChange={setOpen}>
				<CommandInput placeholder="Search for an element..." />
				<CommandList>
					<CommandEmpty>No results found.</CommandEmpty>

					{Object.entries(categories).map(([category, elements]) => {
						const Icon = iconMap[category as ElementCategory];
						return (
							<CommandGroup
								key={category}
								heading={category}
								className="capitalize"
							>
								{elements.map((element) => (
									<CommandItem
										key={element.id}
										onSelect={() => {
											setOpen(false);
											const editorElement = definitionToEditor(element);
											if (selectedElement) {
												if (selectedElement.tag === 'div') {
													addElement(editorElement, selectedElement.id);
												} else {
													addElement(editorElement, selectedElement.parent);
												}
											} else {
												addElement(editorElement);
											}
											setSidebarView('layers');
										}}
									>
										<Icon className="w-4 h-4 mr-2" />
										<span>{element.id}</span>
									</CommandItem>
								))}
							</CommandGroup>
						);
					})}
				</CommandList>
			</CommandDialog>
		</>
	);
}

export default ElementPicker;
