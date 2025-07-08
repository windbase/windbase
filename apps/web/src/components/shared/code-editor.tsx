import Editor, { type Monaco } from '@monaco-editor/react';
import type { editor } from 'monaco-editor';
import Dracula from 'monaco-themes/themes/Dracula.json';
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
			// biome-ignore lint/suspicious/noExplicitAny: it's valid
			monaco.editor.defineTheme('dracula', Dracula as any);
			monaco.editor.setTheme('dracula');
		} catch (error) {
			console.warn('Failed to load:', error);
		}
	};

	return (
		<Editor
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
