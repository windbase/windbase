import { useBuilder } from '@windbase/engine';
import {
	getTemplates,
	type Template,
	templateCategories
} from '@windbase/templates';
import {
	Button,
	CommandDialog,
	CommandEmpty,
	CommandInput,
	CommandItem,
	CommandList,
	Tooltip,
	TooltipContent,
	TooltipTrigger
} from '@windbase/ui';
import { htmlToBuilderElements } from '@windbase/utils';
import { Layers2, Plus } from 'lucide-react';
import { useMemo, useState } from 'react';

function TemplatePicker() {
	const [open, setOpen] = useState(false);
	const { addElement, setSidebarView, selectElement } = useBuilder();
	const [selectedCategory, setSelectedCategory] = useState('all');

	const filteredTemplates = useMemo(() => {
		if (selectedCategory === 'all') return getTemplates();
		return getTemplates().filter(
			(template) => template.category === selectedCategory
		);
	}, [selectedCategory]);

	const handleTemplateSelect = (template: Template) => {
		setOpen(false);

		// Convert the template HTML to proper element structure with children
		const templateChildren = htmlToBuilderElements(template.html || '');

		if (templateChildren.length > 0) {
			// Clear existing content and insert the template
			// Templates are full page layouts, so they replace everything
			const [firstChild] = templateChildren;
			addElement(firstChild);
			selectElement(firstChild.id);
			setSidebarView('layers');
		}
	};

	return (
		<>
			<Tooltip delayDuration={200}>
				<TooltipTrigger asChild>
					<Button
						variant={'outline'}
						size={'icon'}
						onClick={() => setOpen(true)}
					>
						<Layers2 />
					</Button>
				</TooltipTrigger>
				<TooltipContent>
					<p>Use template</p>
				</TooltipContent>
			</Tooltip>

			<CommandDialog open={open} onOpenChange={setOpen} className="w-[500px]">
				<CommandInput placeholder="Search for a template..." />
				<div className="flex flex-wrap gap-2 p-3">
					{templateCategories.map((category) => (
						<button
							key={category}
							type="button"
							className={`p-2 bg-muted rounded-md cursor-pointer ${
								selectedCategory === category
									? 'opacity-100 text-white'
									: 'opacity-60'
							}`}
							onClick={() => {
								setSelectedCategory(category);
							}}
						>
							<h3 className="text-xs text-muted-foreground capitalize">
								{category.replace(/-/g, ' ')}
							</h3>
						</button>
					))}
				</div>
				<CommandList>
					<CommandEmpty className="text-sm text-muted-foreground text-center py-20">
						No templates found.
					</CommandEmpty>

					{filteredTemplates.map((template) => (
						<CommandItem
							key={template.id}
							className="data-[selected=true]:bg-transparent"
						>
							<div className="relative">
								<img
									src={
										template.preview ||
										'https://placehold.co/500x300/2563eb/ffffff?text=Template'
									}
									alt={template.name}
									className="w-[500px] h-[180px] object-cover rounded-md"
								/>

								<div className="absolute top-2 right-2"></div>

								<div className="absolute flex items-center bottom-0 left-0 right-0 p-2 text-white from-black/50 to-black/0 bg-gradient-to-t">
									<div className="flex-1">
										<h4 className="text-sm font-medium">{template.name}</h4>
										<p className="text-xs text-white/70 mt-1 max-w-[300px]">
											{template.description}
										</p>
									</div>
									<div className="ml-auto">
										<Button
											size="icon"
											variant={'outline'}
											onClick={() => handleTemplateSelect(template)}
										>
											<Plus />
										</Button>
									</div>
								</div>
							</div>
						</CommandItem>
					))}
				</CommandList>
			</CommandDialog>
		</>
	);
}

export default TemplatePicker;
