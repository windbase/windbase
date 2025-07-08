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
	Separator,
	Textarea,
} from '@windbase/ui';
import { ChevronsUpDown, XIcon } from 'lucide-react';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';

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
	'dd', // List elements
];

const ElementProperties = memo(() => {
	const classInputRef = useRef<HTMLInputElement>(null);
	const editingInputRef = useRef<HTMLInputElement>(null);
	const [editingClass, setEditingClass] = useState<string | null>(null);
	const [editingValue, setEditingValue] = useState<string>('');
	const { selectedElement, updateClasses, updateElement } = useBuilder();

	const classes = useMemo(() => {
		return selectedElement?.classes || [];
	}, [selectedElement?.classes]);

	// Check if the selected element should be contenteditable
	const isContentEditable = useMemo(() => {
		return selectedElement
			? CONTENTEDITABLE_TAGS.includes(selectedElement.tag)
			: false;
	}, [selectedElement]);

	// Focus and position cursor when editing starts
	useEffect(() => {
		if (editingClass && editingInputRef.current) {
			const inputElement = editingInputRef.current;
			inputElement.focus();
			inputElement.setSelectionRange(editingValue.length, editingValue.length);
		}
	}, [editingClass, editingValue.length]);

	const handleAddClass = useCallback(() => {
		if (classInputRef.current && selectedElement?.id) {
			const newClass = classInputRef.current.value.trim();
			if (newClass && !classes.includes(newClass)) {
				updateClasses(selectedElement.id, [...classes, newClass]);
				classInputRef.current.value = '';
				classInputRef.current.focus();
			}
		}
	}, [classes, selectedElement?.id, updateClasses]);

	const handleAttributeChange = useCallback(
		(attribute: string, value: string) => {
			if (selectedElement?.id) {
				updateElement(selectedElement.id, {
					attributes: {
						...selectedElement.attributes,
						[attribute]: value,
					},
				});
			}
		},
		[selectedElement?.id, selectedElement?.attributes, updateElement],
	);

	const getAttributeValue = useCallback(
		(attribute: string): string => {
			if (!selectedElement) return '';
			// Check if the attribute exists in the element's attributes
			return selectedElement.attributes?.[attribute] || '';
		},
		[selectedElement],
	);

	// Get element definition that matches the selected element
	const getElementDefinition = useCallback(() => {
		if (!selectedElement) return null;

		const elementCategory = elements.filter(
			(el) => el.type === selectedElement.type,
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

	const handleRemoveClass = useCallback(
		(classToRemove: string) => {
			if (selectedElement?.id) {
				updateClasses(
					selectedElement.id,
					classes.filter((c) => c !== classToRemove),
				);
			}
		},
		[classes, selectedElement?.id, updateClasses],
	);

	const handleEditClass = useCallback((className: string) => {
		setEditingClass(className);
		setEditingValue(className);
	}, []);

	const handleSaveClass = useCallback(
		(oldClassName: string) => {
			if (selectedElement?.id) {
				const trimmedValue = editingValue.trim();
				if (
					trimmedValue &&
					trimmedValue !== oldClassName &&
					!classes.includes(trimmedValue)
				) {
					const newClasses = classes.map((c) =>
						c === oldClassName ? trimmedValue : c,
					);
					updateClasses(selectedElement.id, newClasses);
				}
			}
			setEditingClass(null);
			setEditingValue('');
		},
		[classes, editingValue, selectedElement?.id, updateClasses],
	);

	const handleCancelEdit = useCallback(() => {
		setEditingClass(null);
		setEditingValue('');
	}, []);

	const handleInputChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const value = e.target.value;
			setEditingValue(value);
			// Auto-resize input based on content
			e.target.style.width = `${Math.max(value.length * 8, 50)}px`;
		},
		[],
	);

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent, className?: string) => {
			if (e.key === 'Enter') {
				if (className) {
					handleSaveClass(className);
				} else {
					handleAddClass();
				}
			} else if (e.key === 'Escape' && className) {
				handleCancelEdit();
			}
		},
		[handleAddClass, handleSaveClass, handleCancelEdit],
	);

	// Calculate input width based on content
	const getInputWidth = useCallback((value: string) => {
		return Math.max(value.length * 8, 50);
	}, []);

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
		[getAttributeValue, handleAttributeChange, selectedElement?.id],
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
		[selectedElement?.id, updateElement],
	);

	if (!selectedElement) {
		return (
			<div className="py-2 px-4">
				<div className="text-sm text-muted-foreground h-20 flex items-center justify-center w-full">
					No element selected
				</div>
			</div>
		);
	}

	const contentInputId = `${selectedElement.id}-content`;

	return (
		<div className="py-2">
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

					{attributeInputs && (
						<div className="space-y-2">{attributeInputs}</div>
					)}

					{!isContentEditable && !attributeInputs && (
						<div className="text-sm text-muted-foreground h-20 flex items-center justify-center w-full">
							No editable properties
						</div>
					)}
				</CollapsibleContent>
			</Collapsible>

			<Separator className="my-2" />

			<Collapsible defaultOpen>
				<div className="flex items-center justify-between gap-4 px-2">
					<h4 className="text-sm uppercase font-medium">Advanced</h4>
					<CollapsibleTrigger asChild>
						<Button variant="ghost" size="icon" className="size-8">
							<ChevronsUpDown />
							<span className="sr-only">Toggle</span>
						</Button>
					</CollapsibleTrigger>
				</div>

				<CollapsibleContent className="px-2 mt-2">
					<Label className="block text-xs uppercase font-medium mb-2">
						Classes
					</Label>
					<div className="flex flex-wrap gap-1 mt-2">
						{classes.map((className) => (
							<div
								key={className}
								className="flex items-center gap-2 text-sm text-muted-foreground px-2 py-1 rounded-md bg-muted cursor-pointer"
							>
								{editingClass === className ? (
									<input
										ref={editingInputRef}
										type="text"
										value={editingValue}
										onChange={handleInputChange}
										onBlur={() => handleSaveClass(className)}
										onKeyDown={(e) => handleKeyDown(e, className)}
										className="bg-transparent border-none outline-none text-sm"
										style={{
											width: `${getInputWidth(editingValue)}px`,
											minWidth: '50px',
										}}
									/>
								) : (
									<button
										type="button"
										onClick={() => handleEditClass(className)}
										onKeyDown={(e) => {
											if (e.key === 'Enter' || e.key === ' ') {
												handleEditClass(className);
											}
										}}
										className="bg-transparent border-none outline-none text-sm min-w-0 flex-1 text-left"
									>
										{className}
									</button>
								)}
								<XIcon size={14} onClick={() => handleRemoveClass(className)} />
							</div>
						))}
						{classes.length === 0 && (
							<div className="text-sm text-muted-foreground h-20 flex items-center justify-center w-full">
								No classes
							</div>
						)}
					</div>

					<div className="flex items-center gap-2 mt-2">
						<Input
							placeholder="Add class"
							ref={classInputRef}
							onKeyDown={handleKeyDown}
						/>
						<Button onClick={handleAddClass}>Add</Button>
					</div>
				</CollapsibleContent>
			</Collapsible>
			<Separator className="my-2" />
		</div>
	);
});

ElementProperties.displayName = 'ElementProperties';

export default ElementProperties;
