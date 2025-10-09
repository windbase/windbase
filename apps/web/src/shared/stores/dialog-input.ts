import { create } from 'zustand';

type DialogInputState = {
	isOpen: boolean;
	title: string;
	description: string;
	value: string;
	resolver: ((value: string) => void) | null;
};

type DialogInputActions = {
	setIsOpen: (isOpen: boolean) => void;
	setTitle: (title: string) => void;
	setDescription: (description: string) => void;
	setValue: (value: string) => void;
	setResolver: (resolver: ((value: string) => void) | null) => void;
};

export const useDialogInputStore = create<
	DialogInputState & DialogInputActions
>((set) => ({
	isOpen: false,
	title: '',
	description: '',
	value: '',
	resolver: null,

	setIsOpen: (isOpen: boolean) => set({ isOpen }),
	setTitle: (title: string) => set({ title }),
	setDescription: (description: string) => set({ description }),
	setValue: (value: string) => set({ value }),
	setResolver: (resolver: ((value: string) => void) | null) => set({ resolver })
}));
