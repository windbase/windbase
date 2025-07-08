import Editor, { type Monaco } from '@monaco-editor/react';
import type { editor } from 'monaco-editor';
import { parseTmTheme } from 'monaco-themes';
import { useRef } from 'react';

type DefaultLanguage = 'html' | 'css' | 'javascript' | 'typescript';

type CodeEditorProps = {
	defaultLanguage: DefaultLanguage;
	defaultValue: string;
	value: string;
	onChange: (value: string | undefined) => void;
	className: string;
};

const CodeEditor = (props: CodeEditorProps) => {
	const { defaultLanguage, defaultValue, value, onChange, className } = props;
	const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

	const onMount = async (
		editor: editor.IStandaloneCodeEditor,
		monaco: Monaco
	) => {
		editorRef.current = editor;

		try {
			// Import Night Owl theme and convert it using parseTmTheme
			const nightOwlTheme = await import('monaco-themes/themes/Dawn.json');
			const convertedTheme = parseTmTheme(
				JSON.stringify(nightOwlTheme.default)
			);

			monaco.editor.defineTheme('dawn', convertedTheme);
		} catch (error) {
			console.warn('Failed to load Night Owl theme:', error);
		}
	};

	const getTheme = () => {
		return 'vs-dark';
	};

	return (
		<Editor
			theme={getTheme()}
			onMount={onMount}
			defaultLanguage={defaultLanguage}
			defaultValue={defaultValue}
			value={value}
			onChange={onChange}
			className={className}
			options={{
				minimap: {
					enabled: false
				}
			}}
		/>
	);
};

export default CodeEditor;
