interface BaseBlock {
  id: string;
  type: string;
  textContent?: string;
  allowNested: boolean;
  className?: string;
  category: (
    | 'text'
    | 'link'
    | 'image'
    | 'button'
    | 'spacer'
    | 'common'
    | 'div'
    | 'section'
  )[];
  blocks?: Block[];
}

interface TextBlock extends BaseBlock {
  type: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'strong' | 'em';
  text: string;
}

interface LinkBlock extends BaseBlock {
  type: 'a';
  text: string;
  url: string;
}

interface ImageBlock extends BaseBlock {
  type: 'img';
  src: string;
  alt: string;
}

interface ButtonBlock extends BaseBlock {
  type: 'button';
  text: string;
  url?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

interface SpacerBlock extends BaseBlock {
  type: 'spacer';
  size: number;
}

interface DividerBlock extends BaseBlock {
  type: 'divider';
  style?: 'solid' | 'dashed' | 'dotted';
  color?: string;
  allowNested: false;
}

interface DivBlock extends BaseBlock {
  type: 'div';
}

interface SectionBlock extends BaseBlock {
  type: 'section';
}

export type Block =
  | TextBlock
  | ImageBlock
  | ButtonBlock
  | SpacerBlock
  | DividerBlock
  | LinkBlock
  | DivBlock
  | SectionBlock;
