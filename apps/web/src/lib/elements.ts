import type { BuilderElement } from '@/store/builder';
import type { ElementType } from './elementTypes';

export const elements: Record<ElementType, BuilderElement[]> = {
	layout: [
		{
			id: 'div',
			type: 'layout',
			tag: 'div',
			classes: [],
			children: [],
		},
		{
			id: 'container',
			type: 'layout',
			tag: 'div',
			classes: ['container', 'mx-auto', 'px-4'],
			children: [],
		},
		{
			id: 'grid',
			type: 'layout',
			tag: 'div',
			classes: ['grid', 'grid-cols-2', 'gap-4'],
			children: [],
		},
		{
			id: 'flex',
			type: 'layout',
			tag: 'div',
			classes: ['flex', 'items-center', 'justify-between'],
			children: [],
		},
	],
	form: [
		{
			id: 'input',
			type: 'form',
			tag: 'input',
			classes: ['border', 'rounded', 'px-4', 'py-2'],
			children: [],
		},
		{
			id: 'button',
			type: 'form',
			tag: 'button',
			classes: ['bg-primary', 'text-white', 'px-4', 'py-2', 'rounded'],
			content: 'Button',
			children: [],
		},
	],
	media: [
		{
			id: 'image',
			type: 'media',
			tag: 'img',
			classes: ['w-full', 'h-auto', 'rounded'],
			children: [],
		},
	],
	list: [
		{
			id: 'unordered-list',
			type: 'list',
			tag: 'ul',
			classes: ['list-disc', 'list-inside'],
			children: [],
		},
	],
	other: [
		{
			id: 'text',
			type: 'other',
			tag: 'p',
			classes: ['text-base'],
			content: 'Text content',
			children: [],
		},
		{
			id: 'heading',
			type: 'other',
			tag: 'h2',
			classes: ['text-2xl', 'font-bold'],
			content: 'Heading',
			children: [],
		},
	],
};
