"use client";

import { useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import { Upload } from "lucide-react";

type Props = {
  code: string;
  language: string;
  setCode: (value: string) => void;
  onFileUpload: (file: File) => void;
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
  onFileUpload,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];

    if (file) {
      onFileUpload(file);
    }
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`overflow-hidden rounded-2xl border shadow-lg transition-all duration-200 ${
        isDragging
          ? "border-blue-500 ring-4 ring-blue-200"
          : "border-slate-300"
      }`}
    >
      <div className="flex items-center justify-between border-b border-slate-300 bg-slate-800 px-5 py-3">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-red-500" />
          <span className="h-3 w-3 rounded-full bg-yellow-400" />
          <span className="h-3 w-3 rounded-full bg-green-500" />

          <span className="ml-4 text-sm font-medium text-slate-200">
            Code Editor
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            <Upload size={16} />
            Upload File
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".py,.js,.ts,.java,.cpp,.cc,.cxx,.txt"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];

              if (file) {
                onFileUpload(file);
              }

              e.target.value = "";
            }}
          />

          <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
            {languageLabels[language] ?? language}
          </span>
        </div>
      </div>

      <div className="relative">
        {isDragging && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-blue-600/10 backdrop-blur-sm">
            <div className="rounded-xl border-2 border-dashed border-blue-600 bg-white px-8 py-6 text-center shadow-xl">
              <Upload className="mx-auto mb-3 text-blue-600" size={42} />

              <h3 className="text-lg font-bold text-slate-800">
                Drop your code file here
              </h3>

              <p className="mt-2 text-sm text-slate-600">
                Supported: .py .js .ts .java .cpp .txt
              </p>
            </div>
          </div>
        )}

        <Editor
          height="480px"
          language={language}
          theme="vs-dark"
          value={code}
          onChange={(value) => setCode(value ?? "")}
          options={{
            minimap: { enabled: false },
            fontSize: 15,
            fontLigatures: true,
            automaticLayout: true,
            scrollBeyondLastLine: false,
            wordWrap: "on",
            tabSize: 2,
            padding: { top: 20 },
          }}
        />
      </div>
    </div>
  );
}