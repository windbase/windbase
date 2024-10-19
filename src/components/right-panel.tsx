'use client';

import { Block } from '@/lib/block';
import { useCanvasStore } from '@/store/canvas';

import React, { useEffect, useState } from 'react';

import { useDraggable } from '@dnd-kit/core';

import { blocksMap } from './blocks';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';

function RightPanel() {
  const classInputRef = React.useRef<HTMLInputElement>(null);
  const { selectedBlock, setBlockProperty } = useCanvasStore();
  const [selected, setSelected] = useState('blocks');

  useEffect(() => {
    setSelected('edit');
  }, [selectedBlock]);

  return (
    <div>
      <div className="flex gap-6 p-4 border-b">
        <h4
          className={`cursor-pointer  ${
            selected === 'edit' ? '' : 'opacity-50'
          }`}
          onClick={() => setSelected('edit')}
        >
          Edit
        </h4>
        <h4
          className={`cursor-pointer  ${
            selected === 'blocks' ? '' : 'opacity-50'
          }`}
          onClick={() => setSelected('blocks')}
        >
          Blocks
        </h4>
        <h4
          className={`cursor-pointer ${
            selected === 'theme' ? '' : 'opacity-50'
          }`}
          onClick={() => setSelected('theme')}
        >
          Theme
        </h4>
      </div>

      <div className="p-4">
        {selected === 'edit' && !!selectedBlock && (
          <div className="space-y-4">
            <div>{selectedBlock.type}</div>

            <div>
              <Textarea
                value={selectedBlock.textContent}
                onChange={(e) => {
                  setBlockProperty(
                    selectedBlock.id,
                    'textContent',
                    e.target.value,
                  );
                }}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Input placeholder="Add class" ref={classInputRef} />
                <Button
                  onClick={() => {
                    if (classInputRef.current) {
                      setBlockProperty(
                        selectedBlock.id,
                        'className',
                        selectedBlock.className
                          ? `${selectedBlock.className} ${classInputRef.current.value}`
                          : classInputRef.current.value,
                      );
                      classInputRef.current.value = '';
                    }
                  }}
                >
                  Add
                </Button>
              </div>

              <div className="flex gap-1 flex-wrap">
                {selectedBlock.className?.split(' ').map((className) => (
                  <Badge key={className} className="flex items-center gap-2">
                    <span>{className}</span>
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}
        {selected === 'blocks' && (
          <div className="space-y-2">
            {Object.entries(blocksMap).map(([key, Block], index) => (
              <BlockView key={key} block={Block} id={`${key}_${index}`} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

type BlockViewProps = {
  id: string;
  block: Partial<Block>;
};
function BlockView({ id, block }: BlockViewProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
    data: { block },
  });
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <h1 className="font-medium">{block.type}</h1>
    </div>
  );
}

export default RightPanel;
