/** biome-ignore-all lint/suspicious/noExplicitAny: we don't know the type of the element */

import type { AttributeInput } from '@windbase/core';
import { elements } from '@windbase/core';
import { useBuilder } from '@windbase/engine';
import {
	Button,
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
	Input,
	Label,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	Textarea
} from '@windbase/ui';
import { ChevronsUpDown } from 'lucide-react';
import { memo, useCallback, useMemo } from 'react';

// Define which HTML tags should be contenteditable (same as in live-preview.js)
const CONTENTEDITABLE_TAGS = [
	'h1',
	'h2',
	'h3',
	'h4',
	'h5',
	'h6', // Headings
	'p',
	'span',
	'div', // Text containers
	'a',
	'strong',
	'em',
	'i',
	'b',
	'u', // Inline text elements
	'label',
	'button', // Form elements with text
	'blockquote',
	'pre',
	'code', // Special text elements
	'li',
	'dt',
	'dd' // List elements
];

const BasicPanel = memo(() => {
	const { selectedElement, updateElement } = useBuilder();

	// Check if the selected element should be contenteditable
	const isContentEditable = useMemo(() => {
		return selectedElement
			? CONTENTEDITABLE_TAGS.includes(selectedElement.tag)
			: false;
	}, [selectedElement]);

	const handleAttributeChange = useCallback(
		(attribute: string, value: string) => {
			if (selectedElement?.id) {
				updateElement(selectedElement.id, {
					attributes: {
						...selectedElement.attributes,
						[attribute]: value
					}
				});
			}
		},
		[selectedElement?.id, selectedElement?.attributes, updateElement]
	);

	const getAttributeValue = useCallback(
		(attribute: string): string => {
			if (!selectedElement) return '';
			// Check if the attribute exists in the element's attributes
			return selectedElement.attributes?.[attribute] || '';
		},
		[selectedElement]
	);

	// Get element definition that matches the selected element
	const getElementDefinition = useCallback(() => {
		if (!selectedElement) return null;

		const elementCategory = elements.filter(
			(el) => el.type === selectedElement.type
		);
		if (!elementCategory.length) return null;

		// Find the element definition that matches the tag
		return elementCategory.find((el) => el.tag === selectedElement.tag) || null;
	}, [selectedElement]);

	// Get input attributes from the element definition
	const getInputAttributes = useCallback((): AttributeInput[] => {
		const definition = getElementDefinition();
		return definition?.inputAttributes || [];
	}, [getElementDefinition]);

	const renderAttributeInput = useCallback(
		(inputAttr: any) => {
			const { attribute, type, label, options } = inputAttr;
			const value = getAttributeValue(attribute);
			const inputId = `${selectedElement?.id}-${attribute}`;

			if (type === 'select' && options) {
				return (
					<div key={attribute} className="mb-4">
						<Label
							htmlFor={inputId}
							className="block text-xs uppercase font-medium mb-2"
						>
							{label || attribute}
						</Label>
						<Select
							defaultValue={value}
							onValueChange={(value) => handleAttributeChange(attribute, value)}
						>
							<SelectTrigger className="w-full">
								<SelectValue placeholder={`Select ${label || attribute}`} />
							</SelectTrigger>
							<SelectContent>
								{options.map((option: string) => (
									<SelectItem key={option} value={option}>
										{option}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				);
			}

			return (
				<div key={attribute} className="mb-4">
					<Label
						htmlFor={inputId}
						className="block text-xs uppercase font-medium mb-2"
					>
						{label || attribute}
					</Label>
					<Input
						id={inputId}
						type="text"
						defaultValue={value}
						onChange={(e) => handleAttributeChange(attribute, e.target.value)}
						placeholder={`Enter ${label || attribute}`}
					/>
				</div>
			);
		},
		[getAttributeValue, handleAttributeChange, selectedElement?.id]
	);

	const attributeInputs = useMemo(() => {
		const inputAttributes = getInputAttributes();
		if (inputAttributes.length === 0) {
			return null;
		}
		return inputAttributes.map(renderAttributeInput);
	}, [getInputAttributes, renderAttributeInput]);

	const handleContentChange = useCallback(
		(content: string) => {
			if (selectedElement?.id) {
				updateElement(selectedElement.id, { content });
			}
		},
		[selectedElement?.id, updateElement]
	);

	if (!selectedElement) {
		return null;
	}

	const contentInputId = `${selectedElement.id}-content`;

	return (
		<Collapsible defaultOpen>
			<div className="flex items-center justify-between gap-4 px-2">
				<h4 className="text-sm uppercase font-medium">Basic</h4>
				<CollapsibleTrigger asChild>
					<Button variant="ghost" size="icon" className="size-8">
						<ChevronsUpDown />
						<span className="sr-only">Toggle</span>
					</Button>
				</CollapsibleTrigger>
			</div>
			<CollapsibleContent className="px-2 mt-2">
				{/* Only show textarea for content-editable elements */}
				{isContentEditable && (
					<div className="mb-4">
						<Label
							htmlFor={contentInputId}
							className="block text-xs uppercase font-medium mb-2"
						>
							Content
						</Label>
						<Textarea
							id={contentInputId}
							key={selectedElement.id}
							placeholder="Content"
							className="resize-none"
							rows={3}
							value={selectedElement.content || ''}
							onChange={(e) => handleContentChange(e.target.value)}
						/>
					</div>
				)}

				{attributeInputs && <div className="space-y-2">{attributeInputs}</div>}

				{!isContentEditable && !attributeInputs && (
					<div className="text-sm text-muted-foreground h-20 flex items-center justify-center w-full">
						No editable properties
					</div>
				)}
			</CollapsibleContent>
		</Collapsible>
	);
});

BasicPanel.displayName = 'BasicPanel';

export default BasicPanel;
