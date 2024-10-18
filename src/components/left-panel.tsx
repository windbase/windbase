import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Block } from '@/lib/block';
import { useCanvasStore } from '@/store/canvas';

import {
  ChevronDown,
  ChevronRight,
  HomeIcon,
  RowsIcon,
  TypeIcon,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import {
  ControlledTreeEnvironment,
  Tree,
  TreeItem,
  TreeItemIndex,
} from 'react-complex-tree';

const LeftPanel = () => {
  const { blocks, setBlocks } = useCanvasStore();
  const [focusedItem, setFocusedItem] = useState<TreeItemIndex>();
  const [expandedItems, setExpandedItems] = useState<TreeItemIndex[]>([]);
  const [selectedItems, setSelectedItems] = useState([]);

  function getChildren(block: Block) {
    const flatten = block.blocks?.flatMap((block) => {
      if (block.blocks) {
        return [block, ...getChildren(block)];
      }

      return block;
    }) as Block[];

    return flatten || [];
  }

  const dataProvider = useMemo(() => {
    const items: Record<TreeItemIndex, TreeItem<string>> = {
      root: {
        index: 'root',
        isFolder: true,
        children: [],
        data: 'root',
      },
    };

    for (const block of blocks) {
      items.root.children?.push(block.id);
      const flatten = getChildren(block);

      const data = {
        index: block.id,
        canMove: true,
        isFolder: true,
        children: block.blocks?.map((block) => block.id) || [],
        data: block.id,
        canRename: true,
      };

      items[block.id] = data;

      for (const item of flatten) {
        items[item.id] = {
          index: item.id,
          canMove: true,
          isFolder: item.type === 'div' || item.type === 'section',
          children: item.blocks?.map((block) => block.id) || [],
          data: item.id,
          canRename: true,
        };
      }
    }

    return items;
  }, [blocks]);

  return (
    <div className="h-full overflow-auto p-4">
      <Tabs defaultValue="blocks" className="w-full space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pages">Pages</TabsTrigger>
          <TabsTrigger value="blocks">Blocks</TabsTrigger>
        </TabsList>
        <TabsContent value="pages">
          Make changes to your account here.
        </TabsContent>
        <TabsContent value="blocks">
          <Select defaultValue="home">
            <SelectTrigger>
              <div className="flex items-center gap-2">
                <HomeIcon size={18} />
                <span>Home</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="home">Home</SelectItem>
              <SelectItem value="about">About</SelectItem>
              <SelectItem value="contact">Contact</SelectItem>
            </SelectContent>
          </Select>

          <hr className="my-4 border-t" />

          <div className="space-y-4">
            <h1 className="text-lg font-medium mt-4">Layers</h1>

            <ControlledTreeEnvironment
              items={dataProvider}
              canDragAndDrop={true}
              canReorderItems={true}
              canDropOnFolder={true}
              viewState={{
                ['tree-2']: {
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
              getItemTitle={(item) => item.data}
              renderItemTitle={({ title }) => (
                <p className="text-sm font-medium">{title}</p>
              )}
              onDrop={(items, target) => {
                const item = items[0];
                if (!item) return;

                const final = { ...dataProvider };

                // Remove the item from its original parent
                for (const key in final) {
                  const parent = final[key];
                  if (parent.children) {
                    parent.children = parent.children.filter(
                      (child) => child.toString() !== item.index,
                    );
                  }
                }

                // Add the item to the new location
                if (target.targetType === 'between-items') {
                  const parent = final[target.parentItem];
                  let children = parent.children || [];
                  children.splice(target.childIndex, 0, item.index);

                  final[target.parentItem].children = children;
                } else if (target.targetType === 'item') {
                  const parent = final[target.targetItem];

                  let children = parent.children || [];

                  children.push(item.index);
                }

                const _blocks: Block[] = [];

                function buildBlocks(parentId: string): Block[] {
                  const parentData = final[parentId];
                  const children = parentData.children || [];
                  const blocks: Block[] = [];

                  for (const childId of children) {
                    const block = blocksData.find(
                      (item) => item.id === childId.toString(),
                    );
                    if (!block) continue;

                    const childBlocks = buildBlocks(childId.toString());
                    blocks.push({ ...block, blocks: childBlocks });
                  }

                  return blocks;
                }

                const blocksData = blocks.flatMap((block) =>
                  getChildren(block).concat(block),
                );

                const rootChildren = final.root.children || [];

                for (const childId of rootChildren) {
                  const block = blocksData.find(
                    (item) => item.id === childId.toString(),
                  );
                  if (!block) continue;

                  const childBlocks = buildBlocks(childId.toString());
                  _blocks.push({ ...block, blocks: childBlocks });
                }

                setBlocks(_blocks);
              }}
              renderItemArrow={({ item, context }) =>
                item.isFolder ? (
                  <span {...context.arrowProps}>
                    {context.isExpanded ? (
                      <ChevronDown size={18} />
                    ) : (
                      <ChevronRight size={18} />
                    )}
                  </span>
                ) : (
                  <ChevronDown size={18} className="opacity-0" />
                )
              }
              renderItem={({
                title,
                arrow,
                depth,
                context,
                children,
                item,
              }) => (
                <li
                  style={{
                    margin: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                  }}
                  {...context.itemContainerWithChildrenProps}
                >
                  <div
                    className="flex items-center gap-2 p-2 rounded-xl cursor-pointer"
                    {...context.itemContainerWithoutChildrenProps}
                    {...context.interactiveElementProps}
                    style={{
                      marginLeft: `${depth * 20}px`,
                    }}
                  >
                    {arrow}
                    {item.isFolder ? (
                      <RowsIcon size={18} className="text-primary" />
                    ) : (
                      <TypeIcon size={18} className="text-primary" />
                    )}
                    {title}
                  </div>
                  {children}
                </li>
              )}
              renderTreeContainer={({ children, containerProps }) => (
                <div {...containerProps}>{children}</div>
              )}
              renderItemsContainer={({ children, containerProps }) => (
                <ul {...containerProps}>{children}</ul>
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
                    left: `${draggingPosition.depth * 23}px`,
                    height: '4px',
                  }}
                  className="bg-primary h-1 w-full"
                />
              )}
            >
              <Tree treeId="tree-2" rootItem="root" treeLabel="Tree Example" />
            </ControlledTreeEnvironment>

            {/* <Tree
            al
              renderItem={(item) => (
                <div className="flex items-center gap-2 p-2 rounded-xl cursor-pointer">
                  <ChevronRight
                    size={18}
                    className={`transition-transform ${
                      expandedBlocks[item.id] ? 'rotate-90' : ''
                    }`}
                    onClick={() => handleToggle(item.id)}
                  />
                  {item.data.category.includes('text') ? (
                    <TypeIcon size={18} className="text-primary" />
                  ) : (
                    <Rows2Icon size={18} className="text-primary" />
                  )}
                  <p className="text-sm font-medium">{item.data.type}</p>
                </div>
              )}
              onDrop={handleDrop}
            /> */}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LeftPanel;
