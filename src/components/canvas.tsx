'use client';

import { Block } from '@/lib/block';
import { useCanvasStore } from '@/store/canvas';

import { PlusIcon } from 'lucide-react';
import React, { useCallback, useState } from 'react';

import { useDroppable } from '@dnd-kit/core';

import BlockRenderer from './block-render';

type BlockProps = {
  id: string;
  block: Block;
  children?: React.ReactNode;
  onHover: (id: string | null) => void;
  hoveredId: string | null;
};

function RenderBlocks({ id, block, children, onHover, hoveredId }: BlockProps) {
  const { setSelectedBlock } = useCanvasStore();
  const { isOver, setNodeRef } = useDroppable({ id });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const isDirectHover =
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom &&
        e.clientX >= rect.left &&
        e.clientX <= rect.right;

      if (isDirectHover) {
        onHover(id);
      }
    },
    [id, onHover],
  );

  const handleMouseLeave = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      const relatedTarget = e.relatedTarget as HTMLElement;
      if (!e.currentTarget.contains(relatedTarget)) {
        onHover(null);
      }
    },
    [onHover],
  );

  return (
    <div
      ref={setNodeRef}
      className={`border border-dashed rounded ${
        isOver || hoveredId === id ? 'border-neutral-700' : 'border-transparent'
      }`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedBlock(block);
      }}
    >
      <BlockRenderer block={block}>{children}</BlockRenderer>
    </div>
  );
}

function CanvasArea() {
  const { blocks, addBlock } = useCanvasStore();
  const [hoveredBlockId, setHoveredBlockId] = useState<string | null>(null);

  const handleHover = useCallback((id: string | null) => {
    setHoveredBlockId(id);
  }, []);

  const renderNestedBlocks = (blocks: Block[]) => {
    return blocks.map((block) => (
      <RenderBlocks
        key={block.id}
        id={block.id}
        block={block}
        onHover={handleHover}
        hoveredId={hoveredBlockId}
      >
        {block.blocks && renderNestedBlocks(block.blocks)}
      </RenderBlocks>
    ));
  };

  return (
    <div className="h-full flex flex-col gap-4 overflow-auto p-10">
      {renderNestedBlocks(blocks)}

      <button
        className="border rounded border-neutral-700 border-dashed h-20 flex gap-2 items-center justify-center"
        onClick={() => {
          addBlock({
            id: `block-${blocks.length}`,
            type: 'div',
            allowNested: true,
            category: ['div'],
            blocks: [],
          });
        }}
      >
        <PlusIcon size={20} /> Add Block
      </button>
    </div>
  );
}

export default CanvasArea;
