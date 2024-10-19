import { Block } from '@/lib/block';

import React from 'react';

import { cx } from 'class-variance-authority';

import { Button } from './ui/button';

const BlockRenderer = ({
  block,
  children,
}: {
  block: Block;
  children: React.ReactNode;
}) => {
  // Common props for all elements
  const commonProps = {
    className: cx(block.className, 'flex'),
    id: block.id,
  };

  switch (block.type) {
    // Text blocks
    case 'h1':
    case 'h2':
    case 'h3':
    case 'h4':
    case 'p':
    case 'span':
    case 'strong':
    case 'em': {
      const Component = block.type;
      return <Component {...commonProps}>{block.textContent}</Component>;
    }

    // Link block
    case 'a':
      return (
        <a {...commonProps} href={block.url}>
          {children}
        </a>
      );

    // Image block
    case 'img':
      return <img {...commonProps} src={block.src} alt={block.alt} />;

    // Button block
    case 'button': {
      return <Button {...commonProps}>{block.textContent}</Button>;
    }

    // Spacer block
    case 'spacer':
      return <div {...commonProps} style={{ height: `${block.size}px` }} />;

    // Divider block
    case 'divider':
      return (
        <hr
          {...commonProps}
          style={{
            borderStyle: block.style || 'solid',
            borderColor: block.color || 'currentColor',
          }}
        />
      );

    // Container blocks
    case 'div':
    case 'section':
      const Component = block.type;
      return <Component {...commonProps}>{children}</Component>;

    default:
      return null;
  }
};

export default BlockRenderer;
