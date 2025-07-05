'use client';

import {
	Box,
	Image,
	LayoutGrid,
	type LucideIcon,
	Pen,
	Plus,
	Text,
} from 'lucide-react';
import { useState } from 'react';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { elements } from '@/lib/elements';
import { type ElementCategory, elementCategories } from '@/lib/elementTypes';
import { definitionToEditor } from '@/lib/transformers';
import { useBuilder } from '@/store/builder';

const iconMap: Record<ElementCategory, LucideIcon> = {
	layout: LayoutGrid,
	form: Pen,
	media: Image,
	text: Text,
	other: Box,
};

function ElementPicker() {
	const [isOpen, setIsOpen] = useState(false);
	const [selectedType, setSelectedType] = useState<ElementCategory>('layout');
	const { addElement, selectedElement, setSidebarView } = useBuilder();

	return (
		<Popover open={isOpen} onOpenChange={setIsOpen}>
			<PopoverTrigger asChild>
				<Plus className="hover:text-primary cursor-pointer" size={16} />
			</PopoverTrigger>
			<PopoverContent className="p-0 w-[320px] h-[400px] flex">
				<div className="w-[110px] h-full flex flex-col justify-evenly border-r">
					{elementCategories.map((type, index) => {
						const Icon = iconMap[type];
						return (
							<button
								key={type}
								type="button"
								className={`w-full h-full text-sm text-muted-foreground flex items-center justify-start pl-4 space-x-2 ${
									index > 0 ? 'border-t' : ''
								} ${selectedType === type ? 'bg-muted/50' : 'bg-muted/10'} capitalize`}
								onClick={() => setSelectedType(type)}
							>
								{Icon && <Icon className="w-4 h-4" />}
								<span>{type}</span>
							</button>
						);
					})}
				</div>
				<div className="flex-1 overflow-auto">
					<div className="grid grid-cols-2 gap-1.5 overflow-y-auto w-full">
						{elements[selectedType].map((element) => (
							<button
								key={element.id}
								type="button"
								className="h-[100px] w-full text-sm flex items-center justify-center hover:bg-muted/50 cursor-pointer"
								onClick={() => {
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
									setIsOpen(false);
								}}
							>
								{element.id}
							</button>
						))}
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
}

export default ElementPicker;
