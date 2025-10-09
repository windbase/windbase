import { html } from '@codemirror/lang-html';
import CodeMirror, { oneDark } from '@uiw/react-codemirror';
import { useBuilder } from '@windbase/engine';
import {
	Button,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	Tooltip,
	TooltipContent,
	TooltipTrigger,
	useTheme
} from '@windbase/ui';
import { Code } from 'lucide-react';
import * as prettier from 'prettier';
import * as parserHtml from 'prettier/parser-html';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

function ViewCodeButton() {
	const [code, setCode] = useState('');
	const [open, setOpen] = useState(false);
	const { exportHtml } = useBuilder();
	const { theme } = useTheme();

	useEffect(() => {
		if (!open) return;
		setCode(exportHtml());
	}, [open, exportHtml]);

	function handleCopy() {
		navigator.clipboard.writeText(code);
		toast.success('Copied to clipboard');
	}

	async function handleFormat() {
		try {
			const formatted = await prettier.format(code, {
				parser: 'html',
				plugins: [parserHtml]
			});
			setCode(formatted);
		} catch (error) {
			toast.error('Failed to format code');
			console.error(error);
		}
	}

	async function handleDownload() {
		const blob = new Blob([code], { type: 'text/html' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'code.html';
		a.click();
	}

	return (
		<>
			<Tooltip delayDuration={200}>
				<TooltipTrigger asChild>
					<Button
						variant={'outline'}
						size={'icon'}
						onClick={() => setOpen(true)}
					>
						<Code />
					</Button>
				</TooltipTrigger>
				<TooltipContent>
					<p>View code</p>
				</TooltipContent>
			</Tooltip>

			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent className="min-w-[700px] p-0 border-none gap-0">
					<DialogHeader className="bg-muted dark:bg-muted/50 rounded-t-xl p-6 border-b">
						<DialogTitle>View Code</DialogTitle>
						<DialogDescription>
							Source code for the current page.
						</DialogDescription>

						<div className="flex items-center">
							<Button variant={'link'} className="pl-0 pb-0" onClick={handleCopy}>
								Copy
							</Button>
							<Button variant={'link'} className='pb-0' onClick={handleFormat}>
								Format
							</Button>
							<Button variant={'link'} className='pb-0' onClick={handleDownload}>
								Download
							</Button>
						</div>
					</DialogHeader>

					<div className="min-w-[700px]">
						<CodeMirror
							value={code}
							className="h-[500px] overflow-auto rounded-b-xl"
							extensions={[html()]}
							readOnly
							theme={theme === 'dark' ? oneDark : 'light'}
							basicSetup={{
								foldGutter: false,
								highlightActiveLine: false,
								highlightActiveLineGutter: false,
								indentOnInput: false,
							}}
						/>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
}

export default ViewCodeButton;
