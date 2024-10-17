'use client';

import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

import {
  ChevronDown,
  ComponentIcon,
  EyeIcon,
  InfoIcon,
  KeyboardIcon,
  MonitorIcon,
  PlusIcon,
  RedoIcon,
  Smartphone,
  TabletIcon,
  UndoIcon,
} from 'lucide-react';
import React from 'react';

import Image from 'next/image';

import BlockPicker from './block-picker';

function Header() {
  return (
    <div className="p-4 border-b flex items-center gap-1.5">
      <Button variant="secondary" className="px-2.5 gap-1">
        <Image src="/logo.svg" alt="logo" width={20} height={20} />
        <ChevronDown size={15} />
      </Button>
      <Button variant="secondary">
        <InfoIcon size={20} />
      </Button>
      <Button variant="secondary">
        <KeyboardIcon size={20} />
      </Button>
      <Button variant="secondary">
        <EyeIcon size={20} />
      </Button>
      <BlockPicker>
        <Button variant="secondary">
          <ComponentIcon size={20} />
        </Button>
      </BlockPicker>
      <Button variant="secondary">
        <PlusIcon
          size={20}
          className="mr-2 p-0.5 rounded bg-primary text-primary-foreground"
        />
        Add Section
      </Button>

      <div className="flex-1" />

      <div className="flex">
        <Button variant="secondary" className="rounded-r-none">
          <UndoIcon size={20} />
        </Button>
        <Button variant="secondary" className="rounded-l-none">
          <RedoIcon size={20} />
        </Button>
      </div>
      <Tabs defaultValue="desktop">
        <TabsList>
          <TabsTrigger value="mobile">
            <Smartphone size={20} />
          </TabsTrigger>
          <TabsTrigger value="tablet">
            <TabletIcon size={20} />
          </TabsTrigger>
          <TabsTrigger value="desktop">
            <MonitorIcon size={20} />
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <Button>Export Code</Button>
    </div>
  );
}

export default Header;
