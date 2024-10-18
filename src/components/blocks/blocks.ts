import { Block } from '@/lib/block';

export const blocksMap: Record<string, Partial<Block>> = {
  div: {
    type: 'div',
    allowNested: false,
    category: ['common'],
  },
  h1: {
    type: 'h1',
    allowNested: true,
    category: ['text'],
  },
  h2: {
    type: 'h2',
    allowNested: true,
    category: ['text'],
  },
  h3: {
    type: 'h3',
    allowNested: true,
    category: ['text'],
  },
  p: {
    type: 'p',
    allowNested: true,
    category: ['text'],
  },
  img: {
    type: 'img',
    allowNested: false,
    category: ['image'],
  },
  button: {
    type: 'button',
    allowNested: true,
    variant: 'primary',
    size: 'md',
    category: ['button'],
  },
  spacer: {
    type: 'spacer',
    allowNested: false,
    category: ['spacer'],
  },
  divider: {
    type: 'divider',
    allowNested: false,
    className: 'border-t border-neutral-200 my-4',
    category: ['common'],
  },
};
