'use client';

import { Block } from '@/lib/block';
import { useCanvasStore } from '@/store/canvas';

import { PlusIcon } from 'lucide-react';
import React from 'react';

import { useDroppable } from '@dnd-kit/core';

type SectionProps = {
  id: string;
  blocks: Block[];
};
function Section({ id, blocks }: SectionProps) {
  const { isOver, setNodeRef } = useDroppable({
    id,
  });

  return (
    <>
      <div
        ref={setNodeRef}
        className={`border border-dashed rounded min-h-20 flex flex-col items-center justify-center w-full ${
          isOver
            ? 'border-neutral-700'
            : 'border-transparent hover:border-neutral-700'
        }`}
      >
        {blocks.map((block, blockIndex) => (
          <div key={blockIndex} className="">
            {block.type}
          </div>
        ))}
      </div>
    </>
  );
}

function CanvasArea() {
  const { sections, addSection } = useCanvasStore();

  return (
    <div className="h-full flex flex-col gap-4 overflow-auto p-10">
      <div className="w-full">
        {sections.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            <Section id={`section-${sectionIndex}`} blocks={section.blocks} />
          </div>
        ))}
      </div>

      <button
        className="border rounded border-neutral-700 border-dashed h-20 flex gap-2 items-center justify-center"
        onClick={() => {
          addSection();
        }}
      >
        <PlusIcon size={20} /> Add Section
      </button>
    </div>
  );
}

export default CanvasArea;
