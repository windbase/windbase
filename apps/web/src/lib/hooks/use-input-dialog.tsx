import { useDialogInputStore } from '../store/dialog-input';

export function useInputDialog() {
	const { setIsOpen, setTitle, setDescription, setResolver } =
		useDialogInputStore();

	return {
		ask: async (title: string, description: string) => {
			return new Promise<string>((resolve) => {
				setTitle(title);
				setDescription(description);
				setResolver(resolve);
				setIsOpen(true);
			});
		}
	};
}
