import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useCanvasStore } from '@/store/canvas';

import React from 'react';

import { blocksMap } from './blocks';

function BlockPicker({ children }: { children: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add new block</DialogTitle>
        </DialogHeader>

        <div className="space-y-2">
          {Object.entries(blocksMap).map(([key, Block]) => (
            <div key={key} className="p-4 border rounded-xl" onClick={() => {}}>
              <h1 className="text-lg font-medium">{Block.type}</h1>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default BlockPicker;
