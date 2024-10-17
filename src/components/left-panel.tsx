import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Block } from '@/lib/block';
import { useCanvasStore } from '@/store/canvas';

import { ChevronRight, HomeIcon, Rows2Icon, TypeIcon } from 'lucide-react';
import React from 'react';

import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const renderBlocks = (blocks: Block[], sectionIndex: number, level = 1) => {
  return (
    <>
      {blocks.map((block) => (
        <SortableItem
          key={block.id}
          id={`${sectionIndex}-${block.id}`}
          block={block}
          level={level}
          sectionIndex={sectionIndex}
        />
      ))}
    </>
  );
};
function SortableItem({
  id,
  block,
  level,
  sectionIndex,
}: {
  id: string;
  block: Block;
  level: number;
  sectionIndex: number;
}) {
  const { expandedBlocks, toggleBlockVisibility } = useCanvasStore();

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    marginLeft: level * 10,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <div
        className="flex items-center gap-2 p-2 rounded-xl cursor-pointer"
        onClick={() => block.type === 'div' && toggleBlockVisibility(block.id)}
      >
        <ChevronRight
          size={18}
          className={`transition-transform ${
            expandedBlocks[block.id] ? 'rotate-90' : ''
          } ${block.type === 'div' ? '' : 'opacity-0'}`}
        />
        {block.category.includes('text') ? (
          <TypeIcon size={18} className="text-primary" />
        ) : (
          <Rows2Icon size={18} className="text-primary" />
        )}
        <p className="text-sm font-medium">{block.type}</p>
      </div>
      {expandedBlocks[block.id] && block.blocks && (
        <div>{renderBlocks(block.blocks, sectionIndex, level + 1)}</div>
      )}
    </div>
  );
}

function LeftPanel() {
  const { sections, expandedBlocks, toggleBlockVisibility, moveBlock } =
    useCanvasStore();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={(event) => {
        const { active, over } = event;
        if (active.id !== over?.id.toString()) {
          if (over?.id) {
            const [activeSectionIndex, activeBlockId] = active.id
              .toString()
              .split('-');
            const [overSectionIndex, overBlockId] = over.id
              .toString()
              .split('-');
            moveBlock(
              activeBlockId,
              overBlockId,
              parseInt(activeSectionIndex, 10),
              parseInt(overSectionIndex, 10),
            );
          }
        }
      }}
    >
      <div className="h-full overflow-auto p-4">
        <Tabs defaultValue="sections" className="w-full space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="pages">Pages</TabsTrigger>
            <TabsTrigger value="sections">Sections</TabsTrigger>
          </TabsList>
          <TabsContent value="pages">
            Make changes to your account here.
          </TabsContent>
          <TabsContent value="sections">
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
              <h1 className="text-lg font-medium mt-4">Sections</h1>

              <div className="space-y-2">
                <SortableContext
                  items={sections.flatMap((section, index) =>
                    section.blocks.map((block) => `${index}-${block.id}`),
                  )}
                >
                  {sections.map((section, index) => (
                    <div key={index}>
                      <div
                        className="flex items-center gap-2 p-2 rounded-xl cursor-pointer"
                        onClick={() => toggleBlockVisibility(section.id)}
                      >
                        <ChevronRight
                          size={18}
                          className={`transition-transform ${
                            expandedBlocks[section.id] ? 'rotate-90' : ''
                          }`}
                        />
                        <Rows2Icon size={18} className="text-primary" />
                        <p className="text-sm font-medium">{section.name}</p>
                      </div>
                      {expandedBlocks[section.id] && (
                        <div>{renderBlocks(section.blocks, index)}</div>
                      )}
                    </div>
                  ))}
                </SortableContext>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DndContext>
  );
}

export default LeftPanel;
