import { Block } from '@/lib/block';

export const blocksMap: Record<string, Partial<Block>> = {
  div: {
    type: 'div',
    isEditable: false,
    category: ['common'],
  },
  h1: {
    type: 'h1',
    isEditable: true,
    category: ['text'],
  },
  h2: {
    type: 'h2',
    isEditable: true,
    category: ['text'],
  },
  h3: {
    type: 'h3',
    isEditable: true,
    category: ['text'],
  },
  p: {
    type: 'p',
    isEditable: true,
    category: ['text'],
  },
  img: {
    type: 'img',
    isEditable: false,
    category: ['image'],
  },
  button: {
    type: 'button',
    isEditable: true,
    variant: 'primary',
    size: 'md',
    category: ['button'],
  },
  spacer: {
    type: 'spacer',
    isEditable: false,
    category: ['spacer'],
  },
  divider: {
    type: 'divider',
    isEditable: false,
    className: 'border-t border-neutral-200 my-4',
    category: ['common'],
  },
};
