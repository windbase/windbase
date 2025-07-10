import {
	Button,
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	Input
} from '@windbase/ui';
import { useEffect, useRef } from 'react';
import { useDialogInputStore } from '@/lib/store/dialog-input';

function DialogInputOverlay() {
	const {
		isOpen,
		title,
		description,
		resolver,
		setIsOpen,
		setValue,
		setResolver
	} = useDialogInputStore();

	const ref = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (isOpen) {
			ref.current?.focus();
		}
	}, [isOpen]);

	const handleSubmit = () => {
		const value = ref.current?.value || '';
		setValue(value);

		// Resolve the promise with the input value
		if (resolver) {
			resolver(value);
		}

		// Clean up
		setIsOpen(false);
		setResolver(null);
	};

	const handleClose = () => {
		// Clean up resolver when dialog is closed without submitting
		setIsOpen(false);
		setResolver(null);
	};

	return (
		<Dialog open={isOpen} onOpenChange={handleClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription>{description}</DialogDescription>
				</DialogHeader>

				<Input
					placeholder="Enter value"
					ref={ref}
					onKeyDown={(e) => {
						if (e.key === 'Enter') {
							handleSubmit();
						}
					}}
				/>

				<DialogFooter>
					<DialogClose asChild>
						<Button variant="outline">Close</Button>
					</DialogClose>
					<Button type="submit" onClick={handleSubmit}>
						Submit
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

export default DialogInputOverlay;
