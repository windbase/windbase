/** biome-ignore-all lint/suspicious/noExplicitAny: we don't know the type of the element */
import { ChevronsUpDown, XIcon } from 'lucide-react';
import { memo, useCallback, useMemo, useRef } from 'react';
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { useBuilder } from '@/store/builder';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Textarea } from './ui/textarea';

const ElementProperties = memo(() => {
	const classInputRef = useRef<HTMLInputElement>(null);
	const { selectedElement, updateClasses, updateElement } = useBuilder();

	const classes = useMemo(() => {
		return selectedElement?.classes || [];
	}, [selectedElement?.classes]);

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
			// Check if the attribute exists on the element
			return (selectedElement as any)[attribute] || '';
		},
		[selectedElement],
	);

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

	const handleContentChange = useCallback(
		(content: string) => {
			if (selectedElement?.id) {
				updateElement(selectedElement.id, { content });
			}
		},
		[selectedElement?.id, updateElement],
	);

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			if (e.key === 'Enter') {
				handleAddClass();
			}
		},
		[handleAddClass],
	);

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
						<select
							id={inputId}
							defaultValue={value}
							onChange={(e) => handleAttributeChange(attribute, e.target.value)}
							className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
						>
							<option value="">Select {label || attribute}</option>
							{options.map((option: string) => (
								<option key={option} value={option}>
									{option}
								</option>
							))}
						</select>
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
		if (
			!selectedElement?.inputAttributes ||
			selectedElement.inputAttributes.length === 0
		) {
			return null;
		}
		return selectedElement.inputAttributes.map(renderAttributeInput);
	}, [selectedElement?.inputAttributes, renderAttributeInput]);

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
					{selectedElement.isContentEditable && (
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

					{!selectedElement.isContentEditable && !attributeInputs && (
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
								{className}
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
