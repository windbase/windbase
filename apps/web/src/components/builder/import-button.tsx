import { useBuilder } from '@windbase/engine';
import {
	Button,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@windbase/ui';
import { htmlToBuilderElements } from '@windbase/utils';
import { ArrowBigDown } from 'lucide-react';
import { useCallback, useState } from 'react';
import CodeEditor from '../shared/code-editor';

function ImportButton() {
	const [value, setValue] = useState('');
	const { loadTemplate } = useBuilder();

	const onChange = useCallback((value: string | undefined) => {
		setValue(value || '');
	}, []);

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button className="w-full">
					<ArrowBigDown />
					Import
				</Button>
			</DialogTrigger>
			<DialogContent className="animate-slide-down max-w-3xl">
				<DialogHeader>
					<DialogTitle>Import from Code</DialogTitle>
					<DialogDescription>
						Import your HTML code into the builder.
					</DialogDescription>
				</DialogHeader>
				<div className="space-y-4">
					<CodeEditor
						defaultLanguage="html"
						defaultValue={value}
						value={value}
						onChange={onChange}
						className="h-[300px] w-full"
					/>
				</div>

				<DialogFooter className="mr-auto">
					<Button
						onClick={() => {
							loadTemplate(htmlToBuilderElements(value));
						}}
					>
						Import
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

export default ImportButton;
