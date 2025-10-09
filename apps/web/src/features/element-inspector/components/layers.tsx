import type { EditorElement } from '@windbase/core';
import { useBuilder } from '@windbase/engine';
import {
	ChevronDown,
	ChevronRight,
	Eye,
	Layers,
	RowsIcon,
	Trash,
	TypeIcon
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import {
	ControlledTreeEnvironment,
	type DraggingPosition,
	Tree,
	type TreeItem,
	type TreeItemIndex
} from 'react-complex-tree';

function ElementLayers() {
	const {
		getCurrentPageElements,
		selectedElements,
		selectElement,
		selectElementsRange,
		toggleElementSelection,
		moveElement,
		moveElements,
		hoverElement,
		getParentIds,
		deleteElement,
		deleteElements
	} = useBuilder();
	const [focusedItem, setFocusedItem] = useState<TreeItemIndex>();
	const [expandedItems, setExpandedItems] = useState<TreeItemIndex[]>(['root']);

	const elements = getCurrentPageElements();

	// Note: We handle selection directly in click/key handlers
	// The tree component's visual selection state is managed by our custom styling

	// Expand parent layers when elements are selected
	useEffect(() => {
		if (selectedElements.length > 0) {
			const allParentIds = ['root'];

			// Collect parent IDs for all selected elements
			for (const element of selectedElements) {
				const parentIds = getParentIds(element.id);
				allParentIds.push(...parentIds);
			}

			// Add parent IDs to expanded items
			setExpandedItems((prev) => {
				const newExpandedItems = [...new Set([...prev, ...allParentIds])];
				return newExpandedItems;
			});
		}
	}, [selectedElements, getParentIds]);

	// Create data provider for react-complex-tree
	const dataProvider = useMemo(() => {
		const items: Record<TreeItemIndex, TreeItem<string>> = {
			root: {
				index: 'root',
				isFolder: true,
				children: elements.map((element) => element.id),
				data: 'root'
			}
		};

		// Add all elements to the tree
		const processElement = (element: EditorElement) => {
			const isFolder = element.type === 'layout' || element.children.length > 0;

			items[element.id] = {
				index: element.id,
				canMove: true,
				isFolder,
				children:
					element.children?.map((child: EditorElement) => child.id) || [],
				data: element.tag,
				canRename: true
			};

			// Process children recursively
			element.children?.forEach(processElement);
		};

		elements.forEach(processElement);

		return items;
	}, [elements]);

	// Handle drag and drop
	const handleDrop = (items: TreeItem<string>[], target: DraggingPosition) => {
		const itemIds = items.map(item => item.index.toString()).filter(id => id !== 'root');
		if (itemIds.length === 0) return;

		let newParentId = 'root';
		let position = 0;

		if (target.targetType === 'between-items') {
			newParentId = target.parentItem.toString();
			position = target.childIndex;
		} else if (target.targetType === 'item') {
			newParentId = target.targetItem.toString();
			position = 0;
		}

		// Don't allow dropping on self or children
		if (itemIds.includes(newParentId)) return;

		// If we're dragging multiple selected elements, use moveElements
		// Otherwise, use single element move
		if (selectedElements.length > 1 && itemIds.every(id => selectedElements.some(el => el.id === id))) {
			moveElements(selectedElements.map(el => el.id), newParentId, position);
		} else if (itemIds.length === 1) {
			moveElement(itemIds[0], newParentId, position);
		} else {
			moveElements(itemIds, newParentId, position);
		}
	};

	// Get icon based on element type
	const getElementIcon = (element: EditorElement) => {
		// Define which HTML tags should be contenteditable (same as in live-preview.js)
		const CONTENTEDITABLE_TAGS = [
			'h1',
			'h2',
			'h3',
			'h4',
			'h5',
			'h6', // Headings
			'p',
			'span',
			'div', // Text containers
			'a',
			'strong',
			'em',
			'i',
			'b',
			'u', // Inline text elements
			'label',
			'button', // Form elements with text
			'blockquote',
			'pre',
			'code', // Special text elements
			'li',
			'dt',
			'dd' // List elements
		];

		// Show TypeIcon for content-editable elements (headings, text, etc.)
		if (CONTENTEDITABLE_TAGS.includes(element.tag)) {
			return TypeIcon;
		}
		// Show RowsIcon for layout elements or elements with children
		if (element.type === 'layout' || element.children.length > 0) {
			return RowsIcon;
		}
		return TypeIcon;
	};

	// Get element by ID
	const getElementById = (id: string): EditorElement | null => {
		const findElement = (elements: EditorElement[]): EditorElement | null => {
			for (const element of elements) {
				if (element.id === id) return element;
				if (element.children.length > 0) {
					const found = findElement(element.children);
					if (found) return found;
				}
			}
			return null;
		};
		return findElement(elements);
	};

	return (
		<>
			<h1 className="sticky h-10 top-0 z-10 bg-background text-xs font-medium px-3 py-3 uppercase text-muted-foreground flex items-center gap-2">
				<Layers size={16} /> Layers
				{selectedElements.length > 1 && (
					<span className="ml-auto text-[10px] bg-primary text-primary-foreground px-2 py-1 rounded">
						{selectedElements.length} selected
					</span>
				)}
			</h1>

			<ControlledTreeEnvironment
				items={dataProvider}
				canDragAndDrop={true}
				canReorderItems={true}
				canDropOnFolder={true}
				viewState={{
					'element-tree': {
						focusedItem,
						expandedItems,
						selectedItems: selectedElements.map(el => el.id as TreeItemIndex)
					}
				}}
				canSearch={false}
				canSearchByStartingTyping={false}
				onFocusItem={(item) => setFocusedItem(item.index)}
				onExpandItem={(item) =>
					setExpandedItems([...expandedItems, item.index])
				}
				onCollapseItem={(item) =>
					setExpandedItems(
						expandedItems.filter(
							(expandedItemIndex) => expandedItemIndex !== item.index
						)
					)
				}
				onSelectItems={(items) => {
					// Allow tree to handle selection changes for drag and drop operations
					// but don't sync back to store to avoid infinite loops
					if (items.length === 1 && items[0] !== 'root') {
						// Only update store for single selections that aren't from our multi-select logic
						const itemId = items[0] as string;
						if (!selectedElements.some(el => el.id === itemId)) {
							selectElement(itemId);
						}
					}
				}}
				onDrop={handleDrop}
				getItemTitle={(item) => item.data}
				renderItemTitle={({ title, item }) => {
					const element = getElementById(item.index.toString());
					return (
						<span className="text-sm font-medium">{element?.tag || title}</span>
					);
				}}
				renderItemArrow={({ item, context }) =>
					item.isFolder ? (
						<span {...context.arrowProps}>
							{context.isExpanded ? (
								<ChevronDown size={16} />
							) : (
								<ChevronRight size={16} />
							)}
						</span>
					) : null
				}
				renderItem={({ title, arrow, depth, context, children, item }) => {
					const element = getElementById(item.index.toString());
					const Icon = element ? getElementIcon(element) : TypeIcon;

					return (
						<li
							onMouseEnter={() => {
								if (item.index !== 'root') {
									hoverElement(item.index.toString());
								}
							}}
							onMouseLeave={() => {
								hoverElement(null);
							}}
						>
							<button
								onKeyDown={(e) => {
									if (e.key === 'Enter' || e.key === ' ') {
										if (e.shiftKey && selectedElements.length > 0) {
											// Range selection
											e.preventDefault();
											e.stopPropagation();
											const lastSelected = selectedElements[selectedElements.length - 1];
											selectElementsRange(lastSelected.id, item.index.toString());
										} else if (e.ctrlKey || e.metaKey) {
											// Toggle selection
											e.preventDefault();
											e.stopPropagation();
											toggleElementSelection(item.index.toString());
										} else {
											// Single selection - let tree handle it
											selectElement(item.index.toString());
										}
									}
									if (e.key === 'Backspace' || e.key === 'Delete') {
										e.preventDefault();
										e.stopPropagation();
										if (selectedElements.length > 1) {
											deleteElements(selectedElements.map(el => el.id));
										} else {
											deleteElement(item.index.toString());
										}
									}
								}}
								className={`flex w-full items-center gap-2 px-2 py-2.5 cursor-pointer ${selectedElements.some(el => el.id === item.index.toString())
									? 'bg-primary text-primary-foreground'
									: 'hover:bg-muted/50'
									} flex items-center group`}
								style={{
									paddingLeft: `${(depth + 1) * 12}px`
								}}
								{...context.itemContainerWithoutChildrenProps}
								{...context.interactiveElementProps}
								onClick={(e) => {
									// Don't interfere with drag operations
									if (e.detail === 0) return; // Ignore programmatic clicks

									if (item.index !== 'root') {
										if (e.shiftKey && selectedElements.length > 0) {
											// Range selection
											e.preventDefault();
											e.stopPropagation();
											const lastSelected = selectedElements[selectedElements.length - 1];
											selectElementsRange(lastSelected.id, item.index.toString());
										} else if (e.ctrlKey || e.metaKey) {
											// Toggle selection
											e.preventDefault();
											e.stopPropagation();
											toggleElementSelection(item.index.toString());
										} else {
											// Single selection - let the tree handle it normally
											selectElement(item.index.toString());
										}
									}
								}}
								type="button"
								tabIndex={0}
							>
								{arrow || <Icon size={16} />}
								{title}
								<div className="ml-auto hidden group-hover:flex items-center gap-1">
									<Eye size={16} />
									<Trash
										size={16}
										onClick={(e) => {
											e.stopPropagation();
											if (selectedElements.length > 1 && selectedElements.some(el => el.id === item.index.toString())) {
												deleteElements(selectedElements.map(el => el.id));
											} else {
												deleteElement(item.index.toString());
											}
										}}
									/>
								</div>
							</button>
							{children}
						</li>
					);
				}}
				renderTreeContainer={({ children, containerProps }) => (
					<div {...containerProps}>{children}</div>
				)}
				renderItemsContainer={({ children, containerProps }) => (
					<ul {...containerProps} className="space-y-1">
						{children}
					</ul>
				)}
				renderDragBetweenLine={({ lineProps, draggingPosition }) => (
					<div
						{...lineProps}
						style={{
							position: 'absolute',
							right: '0',
							top:
								draggingPosition.targetType === 'between-items' &&
									draggingPosition.linePosition === 'top'
									? '0px'
									: draggingPosition.targetType === 'between-items' &&
										draggingPosition.linePosition === 'bottom'
										? '-4px'
										: '-2px',
							left: `${draggingPosition.depth * 12}px`,
							height: '2px'
						}}
						className="bg-primary rounded-full"
					/>
				)}
			>
				<Tree
					treeId="element-tree"
					rootItem="root"
					treeLabel="Element Layers"
				/>
			</ControlledTreeEnvironment>
		</>
	);
}

export default ElementLayers;
