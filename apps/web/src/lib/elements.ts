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
			inputAttributes: [
				{
					attribute: 'placeholder',
					type: 'text',
					label: 'Placeholder',
				},
				{
					attribute: 'type',
					type: 'select',
					label: 'Type',
					options: ['text', 'number', 'email', 'password'],
				},
			],
		},
		{
			id: 'button',
			type: 'form',
			tag: 'button',
			classes: ['border', 'border-gray-300', 'px-4', 'py-2', 'rounded'],
			content: 'Button',
			isContentEditable: true,
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
			isContentEditable: true,
			children: [],
		},
		{
			id: 'heading',
			type: 'other',
			tag: 'h2',
			classes: ['text-2xl', 'font-bold'],
			content: 'Heading',
			isContentEditable: true,
			children: [],
		},
	],
};
