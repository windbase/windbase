import { useBuilder } from '@windbase/engine';
import {
	Button,
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
	Input,
	Label
} from '@windbase/ui';
import { ChevronsUpDown, XIcon } from 'lucide-react';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';

const AdvancedPanel = memo(() => {
	const classInputRef = useRef<HTMLInputElement>(null);
	const editingInputRef = useRef<HTMLInputElement>(null);
	const [editingClass, setEditingClass] = useState<string | null>(null);
	const [editingValue, setEditingValue] = useState<string>('');
	const { selectedElement, updateClasses } = useBuilder();

	const classes = useMemo(() => {
		return selectedElement?.classes || [];
	}, [selectedElement?.classes]);

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

	const handleRemoveClass = useCallback(
		(classToRemove: string) => {
			if (selectedElement?.id) {
				updateClasses(
					selectedElement.id,
					classes.filter((c) => c !== classToRemove)
				);
			}
		},
		[classes, selectedElement?.id, updateClasses]
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
						c === oldClassName ? trimmedValue : c
					);
					updateClasses(selectedElement.id, newClasses);
				}
			}
			setEditingClass(null);
			setEditingValue('');
		},
		[classes, editingValue, selectedElement?.id, updateClasses]
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
		[]
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
		[handleAddClass, handleSaveClass, handleCancelEdit]
	);

	// Calculate input width based on content
	const getInputWidth = useCallback((value: string) => {
		return Math.max(value.length * 8, 50);
	}, []);

	if (!selectedElement) {
		return null;
	}

	return (
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
										minWidth: '50px'
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
	);
});

AdvancedPanel.displayName = 'AdvancedPanel';

export default AdvancedPanel;
