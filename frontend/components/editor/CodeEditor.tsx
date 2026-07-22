"use client";

import Editor from "@monaco-editor/react";

type Props = {
  code: string;
  language: string;
  setCode: (value: string) => void;
};

const languageLabels: Record<string, string> = {
  python: "🐍 Python",
  javascript: "🟨 JavaScript",
  typescript: "🔷 TypeScript",
  java: "☕ Java",
  cpp: "⚡ C++",
};

export default function CodeEditor({
  code,
  language,
  setCode,
}: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-300 shadow-lg">
      {/* Editor Header */}
      <div className="flex items-center justify-between border-b border-slate-300 bg-slate-800 px-5 py-3">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-red-500"></span>
          <span className="h-3 w-3 rounded-full bg-yellow-400"></span>
          <span className="h-3 w-3 rounded-full bg-green-500"></span>

          <span className="ml-4 text-sm font-medium text-slate-200">
            Code Editor
          </span>
        </div>

        <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
          {languageLabels[language] ?? language}
        </span>
      </div>

      <Editor
        height="500px"
        language={language}
        theme="vs-dark"
        value={code}
        onChange={(value) => setCode(value || "")}
        options={{
          minimap: {
            enabled: false,
          },
          fontSize: 15,
          fontLigatures: true,
          automaticLayout: true,
          scrollBeyondLastLine: false,
          wordWrap: "on",
          padding: {
            top: 20,
          },
        }}
      />
    </div>
  );
}