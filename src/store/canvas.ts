import { Block } from '@/lib/block';
import { generateID } from '@/lib/id';
import { Section } from '@/types';

import { create } from 'zustand';

type CanvasState = {
  sections: Section[];
  expandedBlocks: { [key: string]: boolean };
};

type CanvasActions = {
  addSection: () => void;
  insertBlock: (block: Block, sectionIndex: number) => void;
  moveBlock: (
    activeId: string,
    overId: string,
    sourceSectionIndex: number,
    destinationSectionIndex: number,
  ) => void;
  toggleBlockVisibility: (blockId: string) => void;
};

export type CanvasStore = CanvasState & CanvasActions;

let count = 0;

const firstId = generateID(++count);
const firstSection: Section = {
  id: firstId,
  name: 'default',
  blocks: [],
};

export const useCanvasStore = create<CanvasStore>((set) => ({
  sections: [firstSection],

  expandedBlocks: {},

  insertBlock: (block, sectionIndex) => {
    set((state) => {
      const newBlock = { ...block, id: generateID(++count) };

      const section = state.sections[sectionIndex];
      section.blocks.push(newBlock);

      return {
        sections: [...state.sections],
      };
    });
  },

  addSection: () => {
    set((state) => {
      const id = generateID(++count);

      state.sections.push({
        id,
        name: `Section ${state.sections.length + 1}`,
        blocks: [],
      });

      return {
        sections: [...state.sections],
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

  moveBlock: (activeId, overId, sourceSectionIndex, destinationSectionIndex) =>
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

      const sourceSection = state.sections[sourceSectionIndex];
      const destinationSection = state.sections[destinationSectionIndex];

      const activeBlockInfo = findBlock(sourceSection.blocks, activeId);
      const overBlockInfo = findBlock(destinationSection.blocks, overId);

      if (activeBlockInfo && overBlockInfo) {
        const [activeParent, activeIndex] = activeBlockInfo;
        const [overParent, overIndex] = overBlockInfo;

        const [movedBlock] = activeParent.splice(activeIndex, 1);
        overParent.splice(overIndex, 0, movedBlock);
      }

      return { sections: [...state.sections] };
    }),
}));
