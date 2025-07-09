import type { ElementCategory } from '@windbase/core';
import { definitionToEditor, elements } from '@windbase/core';
import { useBuilder } from '@windbase/engine';
import {
	Button,
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	Tooltip,
	TooltipContent,
	TooltipTrigger
} from '@windbase/ui';
import {
	Box,
	Image,
	LayoutGrid,
	type LucideIcon,
	Pen,
	Plus,
	Text
} from 'lucide-react';
import { useMemo, useState } from 'react';

const iconMap: Record<ElementCategory, LucideIcon> = {
	layout: LayoutGrid,
	form: Pen,
	media: Image,
	text: Text,
	other: Box
};

function ElementPicker() {
	const [open, setOpen] = useState(false);
	const { selectedElement, addElement, setSidebarView } = useBuilder();

	const categories = useMemo(() => {
		return elements.reduce(
			(acc, element) => {
				acc[element.type as ElementCategory] = [
					...(acc[element.type as ElementCategory] || []),
					element
				];
				return acc;
			},
			{} as Record<ElementCategory, typeof elements>
		);
	}, []);

	return (
		<>
			<Tooltip delayDuration={200}>
				<TooltipTrigger asChild>
					<Button
						variant={'outline'}
						size={'icon'}
						onClick={() => setOpen(true)}
					>
						<Plus />
					</Button>
				</TooltipTrigger>
				<TooltipContent>
					<p>Add element</p>
				</TooltipContent>
			</Tooltip>

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
