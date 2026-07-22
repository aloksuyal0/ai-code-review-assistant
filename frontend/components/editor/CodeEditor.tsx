"use client";

import Editor from "@monaco-editor/react";

type Props = {
  code: string;
  setCode: (value: string) => void;
};

export default function CodeEditor({ code, setCode }: Props) {
  return (
    <Editor
      height="500px"
      theme="vs-dark"
      defaultLanguage="python"
      value={code}
      onChange={(value) => setCode(value || "")}
      options={{
        minimap: {
          enabled: false,
        },
        fontSize: 15,
      }}
    />
  );
}