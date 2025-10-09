import { css } from '@codemirror/lang-css';
import { oneDark } from '@codemirror/theme-one-dark';
import CodeMirror from '@uiw/react-codemirror';
import { useBuilder } from '@windbase/engine';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@windbase/ui';

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
					<DialogTitle>Theme Config</DialogTitle>
					<DialogDescription>
						Customize your theme with TailwindCSS. Changes are saved automatically.
					</DialogDescription>
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
