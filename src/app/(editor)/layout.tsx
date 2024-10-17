'use client';

import CanvasArea from '@/components/canvas';
import Header from '@/components/header';
import LeftPanel from '@/components/left-panel';
import RightPanel from '@/components/right-panel';
import { Block } from '@/lib/block';
import { useCanvasStore } from '@/store/canvas';

import React from 'react';

import { DndContext } from '@dnd-kit/core';

function Layout() {
  const { insertBlock } = useCanvasStore();

  return (
    <DndContext
      onDragEnd={(e) => {
        const droppedOver = e.over?.id.toString();
        if (droppedOver?.startsWith('section')) {
          const [_, sectionIndex] = droppedOver.split('-');

          const data = e.active.data.current as { block: Block };

          insertBlock(data.block as Block, parseInt(sectionIndex));
        }
      }}
    >
      <div className="h-screen overflow-hidden flex flex-col relative">
        <Header />
        <div className="flex-1 flex">
          <div className="h-full w-72 border-r">
            <LeftPanel />
          </div>
          <div className="h-full flex-1 bg-neutral-900">
            <CanvasArea />
          </div>
          <div className="h-full w-72 border-l">
            <RightPanel />
          </div>
        </div>
      </div>
    </DndContext>
  );
}

export default Layout;
