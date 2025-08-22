import { useRef } from 'react';
import Editor from '@monaco-editor/react';

interface MonacoEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  height?: string;
  readOnly?: boolean;
}

export function MonacoEditor({
  value,
  onChange,
  language = 'javascript',
  height = '300px',
  readOnly = false,
}: MonacoEditorProps) {
  const monacoRef = useRef<any>(null);

  const handleEditorDidMount = (editor: any, monaco: any) => {
    monacoRef.current = monaco;
  };

  return (
    <div className="border rounded-md overflow-hidden">
      <Editor
        height={height}
        language={language}
        value={value}
        onChange={(value) => onChange(value || '')}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          roundedSelection: false,
          scrollBeyondLastLine: false,
          readOnly,
          automaticLayout: true,
        }}
        onMount={handleEditorDidMount}
      />
    </div>
  );
}