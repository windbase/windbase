'use client';

import {
	ChevronDown,
	ChevronRight,
	Eye,
	RowsIcon,
	Trash,
	TypeIcon,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import {
	ControlledTreeEnvironment,
	type DraggingPosition,
	Tree,
	type TreeItem,
	type TreeItemIndex,
} from 'react-complex-tree';
import type { BuilderElement } from '@/store/builder';
import { useBuilder } from '@/store/builder';

function ElementLayers() {
	const { elements, selectedElement, selectElement, moveElement } =
		useBuilder();
	const [focusedItem, setFocusedItem] = useState<TreeItemIndex>();
	const [expandedItems, setExpandedItems] = useState<TreeItemIndex[]>(['root']);
	const [selectedItems, setSelectedItems] = useState<TreeItemIndex[]>([]);

	// Update selected items when selectedElement changes
	useEffect(() => {
		if (selectedElement) {
			setSelectedItems([selectedElement]);
		} else {
			setSelectedItems([]);
		}
	}, [selectedElement]);

	// Update selected element when tree selection changes
	useEffect(() => {
		const item = selectedItems[0];
		if (item && item !== 'root') {
			selectElement(item.toString());
		}
	}, [selectedItems, selectElement]);

	// Create data provider for react-complex-tree
	const dataProvider = useMemo(() => {
		const items: Record<TreeItemIndex, TreeItem<string>> = {
			root: {
				index: 'root',
				isFolder: true,
				children: elements.map((element) => element.id),
				data: 'root',
			},
		};

		// Add all elements to the tree
		const processElement = (element: BuilderElement) => {
			const isFolder = element.type === 'layout' || element.children.length > 0;

			items[element.id] = {
				index: element.id,
				canMove: true,
				isFolder,
				children: element.children?.map((child) => child.id) || [],
				data: element.tag,
				canRename: true,
			};

			// Process children recursively
			element.children?.forEach(processElement);
		};

		elements.forEach(processElement);

		return items;
	}, [elements]);

	// Handle drag and drop
	const handleDrop = (items: TreeItem<string>[], target: DraggingPosition) => {
		const itemId = items[0]?.index;
		if (!itemId || itemId === 'root') return;

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
		if (newParentId === itemId) return;

		moveElement(itemId.toString(), newParentId, position);
	};

	// Get icon based on element type
	const getElementIcon = (element: BuilderElement) => {
		if (element.type === 'layout' || element.children.length > 0) {
			return RowsIcon;
		}
		return TypeIcon;
	};

	// Get element by ID
	const getElementById = (id: string): BuilderElement | null => {
		const findElement = (elements: BuilderElement[]): BuilderElement | null => {
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
		<div>
			<h1 className="text-xs font-medium p-4 uppercase text-muted-foreground">
				Layers
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
						selectedItems,
					},
				}}
				onFocusItem={(item) => setFocusedItem(item.index)}
				onExpandItem={(item) =>
					setExpandedItems([...expandedItems, item.index])
				}
				onCollapseItem={(item) =>
					setExpandedItems(
						expandedItems.filter(
							(expandedItemIndex) => expandedItemIndex !== item.index,
						),
					)
				}
				onSelectItems={(items) => {
					setSelectedItems(items);
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
						<li>
							<div
								className={`flex items-center gap-2 px-2 py-2.5 cursor-pointer ${
									context.isSelected ? 'bg-primary text-primary-foreground' : ''
								} flex items-center group`}
								{...context.itemContainerWithoutChildrenProps}
								{...context.interactiveElementProps}
								style={{
									paddingLeft: `${(depth + 1) * 12}px`,
								}}
							>
								{arrow || <Icon size={16} />}
								{title}
								<div className="ml-auto hidden group-hover:flex items-center gap-1">
									<Eye size={16} />
									<Trash size={16} />
								</div>
							</div>
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
							height: '2px',
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
		</div>
	);
}

export default ElementLayers;
