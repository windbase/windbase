import { ChevronsUpDown, XIcon } from 'lucide-react';
import { useMemo, useRef } from 'react';
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { useBuilder } from '@/store/builder';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Separator } from './ui/separator';
import { Textarea } from './ui/textarea';

function ElementProperties() {
	const classInputRef = useRef<HTMLInputElement>(null);
	const { selectedElement, updateClasses, updateElement } = useBuilder();

	const classes = useMemo(() => {
		return selectedElement?.classes || [];
	}, [selectedElement]);

	const handleAddClass = () => {
		if (classInputRef.current) {
			updateClasses(selectedElement?.id as string, [
				...classes,
				classInputRef.current.value,
			]);
			classInputRef.current.value = '';
			classInputRef.current.focus();
		}
	};

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
					<Textarea
						key={selectedElement?.id}
						placeholder="Content"
						className="resize-none"
						rows={3}
						value={selectedElement?.content || ''}
						onChange={(e) => {
							if (selectedElement?.id) {
								updateElement(selectedElement.id, {
									content: e.target.value,
								});
							}
						}}
					/>
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
					<h1 className="uppercase text-xs font-medium text-muted-foreground">
						Classes
					</h1>
					<p className="text-xs text-muted-foreground mb-2 mt-0.5">
						Add or remove classes to the element.
					</p>
					<div className="flex flex-wrap gap-1 mt-2">
						{classes.map((className) => (
							<div
								key={className}
								className="flex items-center gap-2 text-sm text-muted-foreground px-2 py-1 rounded-md bg-muted cursor-pointer"
							>
								{className}
								<XIcon
									size={14}
									onClick={() => {
										updateClasses(
											selectedElement?.id as string,
											classes.filter((c) => c !== className),
										);
									}}
								/>
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
							onKeyDown={(e) => {
								if (e.key === 'Enter') {
									handleAddClass();
								}
							}}
						/>
						<Button onClick={handleAddClass}>Add</Button>
					</div>
				</CollapsibleContent>
			</Collapsible>
			<Separator className="my-2" />
		</div>
	);
}

export default ElementProperties;
