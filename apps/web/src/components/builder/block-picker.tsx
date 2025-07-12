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
import { Blocks, Plus } from 'lucide-react';
import { useState } from 'react';
import {
	useBlockCategories,
	useBlockHtml,
	useFilteredBlocks
} from '@/lib/hooks/use-templates-query';
import type { ApiBlock } from '@/lib/types';

function BlockPicker() {
	const [open, setOpen] = useState(false);
	const { addElement, setSidebarView, selectElement } = useBuilder();
	const [selectedCategory, setSelectedCategory] = useState('all');
	const [searchTerm, setSearchTerm] = useState('');
	const { mutateAsync: getBlockHtml } = useBlockHtml();

	const {
		categories,
		isLoading: categoriesLoading,
		error: categoriesError
	} = useBlockCategories();
	const {
		blocks: filteredBlocks,
		isLoading: blocksLoading,
		error: blocksError
	} = useFilteredBlocks(selectedCategory, searchTerm);

	const handleBlockSelect = async (block: ApiBlock) => {
		const html = await getBlockHtml(block.id);
		setOpen(false);

		const blockChildren = htmlToBuilderElements(html);

		if (blockChildren.length > 0) {
			// Always insert the block at the root level
			const [firstChild] = blockChildren;
			addElement(firstChild);
			selectElement(firstChild.id);
			setSidebarView('layers');
		}
	};

	const isLoading = categoriesLoading || blocksLoading;
	const error = categoriesError || blocksError;

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
						<Blocks />
					</Button>
				</TooltipTrigger>
				<TooltipContent>
					<p>Add block</p>
				</TooltipContent>
			</Tooltip>

			<CommandDialog open={open} onOpenChange={setOpen} className="w-[500px]">
				<CommandInput
					placeholder="Search for a block..."
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
							Error loading blocks: {error.message}
						</div>
					)}

					{isLoading && (
						<div className="text-sm text-muted-foreground text-center py-20">
							Loading blocks...
						</div>
					)}

					{!isLoading && !error && filteredBlocks.length === 0 && (
						<CommandEmpty className="text-sm text-muted-foreground text-center py-20">
							No blocks found.
						</CommandEmpty>
					)}

					{!isLoading &&
						!error &&
						filteredBlocks.map((block) => (
							<CommandItem
								key={block.id}
								className="data-[selected=true]:bg-transparent"
							>
								<div className="relative">
									<img
										src={
											block.preview ||
											`https://windbase.github.io/templates/api/blocks/${block.id}-preview.png` ||
											'https://placehold.co/150'
										}
										alt={block.name}
										className="w-[500px] h-[180px] object-cover rounded-md"
									/>

									<div className="absolute top-2 right-2"></div>

									<div className="absolute flex items-center bottom-0 left-0 right-0 p-2 text-white from-black/50 to-black/0 bg-gradient-to-t">
										<h4 className="text-sm font-medium">{block.name}</h4>
										<div className="ml-auto">
											<Button
												size="icon"
												variant={'outline'}
												onClick={() => handleBlockSelect(block)}
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

export default BlockPicker;
