'use client';

import { Block } from '@/lib/block';

import React, { useState } from 'react';

import { useDraggable } from '@dnd-kit/core';

import { blocksMap } from './blocks';

function RightPanel() {
  const [selected, setSelected] = useState('blocks');

  return (
    <div>
      <div className="flex gap-6 p-4 border-b">
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
        <div className="space-y-2">
          {Object.entries(blocksMap).map(([key, Block], index) => (
            <BlockView key={key} block={Block} id={`${key}_${index}`} />
          ))}
        </div>
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
