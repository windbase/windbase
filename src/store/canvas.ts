import { Block } from '@/lib/block';
import { generateID } from '@/lib/id';

import { create } from 'zustand';

type CanvasState = {
  blocks: Block[];
  expandedBlocks: { [key: string]: boolean };
  activeDragSectionIndex: number | null;
  selectedBlock: Block | null;
};

type CanvasActions = {
  addBlock: (block: Block) => void;
  insertBlock: (block: Block, parentId: string) => void;
  setBlocks: (blocks: Block[]) => void;
  moveBlock: (activeId: string, overId: string) => void;
  toggleBlockVisibility: (blockId: string) => void;
  setActiveDragSectionIndex: (index: number | null) => void;
  setSelectedBlock: (block: Block | null) => void;
  setBlockProperty: (
    id: string,
    key: 'textContent' | 'className',
    value: any,
  ) => void;
};

export type CanvasStore = CanvasState & CanvasActions;

let count = 0;

const firstBlock: Block = {
  id: 'default',
  type: 'section',
  allowNested: true,
  category: ['section'],
  blocks: [],
};

export const useCanvasStore = create<CanvasStore>((set) => ({
  expandedBlocks: {},
  blocks: [firstBlock],
  selectedBlock: null,
  activeDragSectionIndex: null,

  setBlocks: (blocks) => set({ blocks }),
  setSelectedBlock: (block) => set({ selectedBlock: block }),

  setBlockProperty: (id, key, value) => {
    set((state) => {
      const findBlock = (blocks: Block[], id: string): Block | null => {
        for (const block of blocks) {
          if (block.id === id) return block;
          if (block.blocks) {
            const result = findBlock(block.blocks, id);
            if (result) return result;
          }
        }
        return null;
      };

      const block = findBlock(state.blocks, id);
      if (block) {
        block[key] = value;
      }

      return {
        blocks: [...state.blocks],
      };
    });
  },

  setActiveDragSectionIndex: (index) => set({ activeDragSectionIndex: index }),

  insertBlock: (block, parentId) => {
    set((state) => {
      const newBlock = { ...block, id: generateID(++count) };

      const findBlock = (blocks: Block[], id: string): Block | null => {
        for (const block of blocks) {
          if (block.id === id) return block;
          if (block.blocks) {
            const result = findBlock(block.blocks, id);
            if (result) return result;
          }
        }
        return null;
      };

      const parentBlock = findBlock(state.blocks, parentId);
      if (parentBlock && parentBlock.allowNested) {
        parentBlock.blocks = parentBlock.blocks || [];
        parentBlock.blocks.push(newBlock);
      } else {
      }

      return {
        blocks: [...state.blocks],
      };
    });
  },

  addBlock: (block) => {
    set((state) => {
      const newBlock = { ...block, id: generateID(++count) };
      state.blocks.push(newBlock);

      return {
        blocks: [...state.blocks],
      };
    });
  },

  toggleBlockVisibility: (blockId) => {
    set((state) => ({
      expandedBlocks: {
        ...state.expandedBlocks,
        [blockId]: !state.expandedBlocks[blockId],
      },
    }));
  },

  moveBlock: (activeId, overId) =>
    set((state) => {
      const findBlock = (
        blocks: Block[],
        id: string,
      ): [Block[], number] | null => {
        for (let i = 0; i < blocks.length; i++) {
          if (blocks[i].id === id) return [blocks, i];
          if (blocks[i].blocks) {
            const result = blocks[i].blocks
              ? findBlock(blocks[i].blocks as Block[], id)
              : null;
            if (result) return result;
          }
        }
        return null;
      };

      const activeBlockInfo = findBlock(state.blocks, activeId);

      if (activeBlockInfo) {
        const [activeParent, activeIndex] = activeBlockInfo;
        const [movedBlock] = activeParent.splice(activeIndex, 1);

        if (overId === '') {
          state.blocks.push(movedBlock);
        } else {
          const overBlockInfo = findBlock(state.blocks, overId);
          if (overBlockInfo) {
            const [overParent, overIndex] = overBlockInfo;
            if (
              overParent[overIndex].type === 'div' ||
              overParent[overIndex].type === 'section'
            ) {
              overParent[overIndex].blocks = overParent[overIndex].blocks || [];
              overParent[overIndex].blocks.push(movedBlock);
            } else {
              overParent.splice(overIndex, 0, movedBlock);
            }
          }
        }
      }

      return { blocks: [...state.blocks] };
    }),
}));
