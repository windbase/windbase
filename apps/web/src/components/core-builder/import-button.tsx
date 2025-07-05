import { javascript } from '@codemirror/lang-javascript';
import CodeMirror from '@uiw/react-codemirror';
import { ArrowBigDown } from 'lucide-react';
import { useCallback, useState } from 'react';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { htmlToBuilderElements } from '@/lib/transformer';
import { useBuilder } from '@/store/builder';
import { Button } from '../ui/button';

function ImportButton() {
	const [value, setValue] = useState('');
	const { loadTemplate } = useBuilder();

	const onChange = useCallback((value: string) => {
		setValue(value);
	}, []);

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button className="w-full">
					<ArrowBigDown />
					Import
				</Button>
			</DialogTrigger>
			<DialogContent className="animate-slide-down">
				<DialogHeader>
					<DialogTitle>Import from Code</DialogTitle>
					<DialogDescription>
						Import your HTML code into the builder.
					</DialogDescription>
				</DialogHeader>
				<div className="space-y-4">
					<CodeMirror
						value={value}
						height="300px"
						extensions={[javascript({ jsx: true })]}
						onChange={onChange}
					/>

					<Button
						onClick={() => {
							loadTemplate(htmlToBuilderElements(value));
						}}
					>
						Import
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}

export default ImportButton;
