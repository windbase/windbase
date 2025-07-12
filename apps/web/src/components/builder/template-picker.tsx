import { useBuilder } from '@windbase/engine';
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
import { Layers2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import {
	useFilteredTemplates,
	useTemplateCategories,
	useTemplateHtml
} from '@/lib/hooks/use-templates-query';
import type { ApiTemplateResponse } from '@/lib/types';

function TemplatePicker() {
	const [open, setOpen] = useState(false);
	const { addElement, setSidebarView, selectElement } = useBuilder();
	const [selectedCategory, setSelectedCategory] = useState('all');
	const [searchTerm, setSearchTerm] = useState('');
	const { mutateAsync: getTemplateHtml } = useTemplateHtml();

	const {
		categories,
		isLoading: categoriesLoading,
		error: categoriesError
	} = useTemplateCategories();
	const {
		templates: filteredTemplates,
		isLoading: templatesLoading,
		error: templatesError
	} = useFilteredTemplates(selectedCategory, searchTerm);

	const handleTemplateSelect = async (template: ApiTemplateResponse) => {
		try {
			const html = await getTemplateHtml(template.id);

			setOpen(false);

			// Convert the template HTML to proper element structure with children
			const templateChildren = htmlToBuilderElements(html);

			if (templateChildren.length > 0) {
				const [firstChild] = templateChildren;
				addElement(firstChild);
				selectElement(firstChild.id);
				setSidebarView('layers');
			}
		} catch (error) {
			toast.error('Error loading template');
			console.error(error);
		}
	};

	const isLoading = categoriesLoading || templatesLoading;
	const error = categoriesError || templatesError;

	return (
		<>
			<Tooltip delayDuration={200}>
				<TooltipTrigger asChild>
					<Button
						variant={'outline'}
						size={'icon'}
						onClick={() => setOpen(true)}
						disabled={isLoading}
					>
						<Layers2 />
					</Button>
				</TooltipTrigger>
				<TooltipContent>
					<p>Use template</p>
				</TooltipContent>
			</Tooltip>

			<CommandDialog open={open} onOpenChange={setOpen} className="w-[500px]">
				<CommandInput
					placeholder="Search for a template..."
					value={searchTerm}
					onValueChange={setSearchTerm}
				/>
				<div className="flex flex-wrap gap-2 p-3">
					{categories.map((category) => (
						<button
							key={category}
							type="button"
							className={`p-2 bg-muted rounded-md cursor-pointer transition-opacity ${
								selectedCategory === category
									? 'opacity-100 text-white'
									: 'opacity-60 hover:opacity-80'
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
					{error && (
						<div className="text-sm text-red-500 text-center py-4">
							Error loading templates: {error.message}
						</div>
					)}

					{isLoading && (
						<div className="text-sm text-muted-foreground text-center py-20">
							Loading templates...
						</div>
					)}

					{!isLoading && !error && filteredTemplates.length === 0 && (
						<CommandEmpty className="text-sm text-muted-foreground text-center py-20">
							No templates found.
						</CommandEmpty>
					)}

					{!isLoading &&
						!error &&
						filteredTemplates.map((template) => (
							<CommandItem
								key={template.id}
								className="data-[selected=true]:bg-transparent"
							>
								<div className="relative">
									<img
										src={
											template.preview ||
											`https://windbase.github.io/templates/api/templates/${template.id}-preview.png` ||
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
												variant={'outline'}
												onClick={() => handleTemplateSelect(template)}
											>
												Use
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
