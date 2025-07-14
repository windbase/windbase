import { css } from '@codemirror/lang-css';
import { oneDark } from '@codemirror/theme-one-dark';
import CodeMirror from '@uiw/react-codemirror';
import { useBuilder } from '@windbase/engine';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@windbase/ui';

type TailwindCSSConfigProps = {
	open: boolean;
	setOpen: (open: boolean) => void;
};

function TailwindCSSConfig({ open, setOpen }: TailwindCSSConfigProps) {
	const { tailwindCSSConfig, setTailwindCSSConfig } = useBuilder();

	const onChange = (value: string) => {
		setTailwindCSSConfig(value);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent className="min-w-[800px]">
				<DialogHeader>
					<DialogTitle>TailwindCSS Config</DialogTitle>
				</DialogHeader>

				<CodeMirror
					value={tailwindCSSConfig}
					onChange={onChange}
					height="600px"
					theme={oneDark}
					extensions={[css()]}
					className="text-sm overflow-auto"
					basicSetup={{
						foldGutter: false,
						highlightActiveLine: false,
						dropCursor: false,
						tabSize: 2
					}}
				/>
			</DialogContent>
		</Dialog>
	);
}

export default TailwindCSSConfig;
