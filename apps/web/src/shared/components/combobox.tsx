import {
	Button,
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	cn,
	Popover,
	PopoverContent,
	PopoverTrigger
} from '@windbase/ui';
import { CheckIcon, ChevronsUpDownIcon } from 'lucide-react';
import { useState } from 'react';

type ComboboxProps = {
	items: { value: string; label: string }[];
	placeholder?: string;
	value: string;
	onChange: (value: string) => void;
};

export function Combobox({
	items,
	placeholder,
	value,
	onChange
}: ComboboxProps) {
	const [open, setOpen] = useState(false);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					aria-expanded={open}
					className="justify-between text-xs px-2"
				>
					{value
						? items.find((item) => item.value === value)?.label
						: placeholder}
					<ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-full p-0">
				<Command>
					<CommandInput placeholder="Search..." />
					<CommandList>
						<CommandEmpty>No items found.</CommandEmpty>
						<CommandGroup>
							{items.map((framework) => (
								<CommandItem
									key={framework.value}
									value={framework.value}
									onSelect={(currentValue) => {
										onChange(currentValue === value ? '' : currentValue);
										setOpen(false);
									}}
									className="text-xs"
								>
									<CheckIcon
										className={cn(
											'mr-2 h-4 w-4',
											value === framework.value ? 'opacity-100' : 'opacity-0'
										)}
									/>
									{framework.label}
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
