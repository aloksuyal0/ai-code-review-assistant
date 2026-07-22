"use client";

type Props = {
  language: string;
  setLanguage: React.Dispatch<React.SetStateAction<string>>;
};

const languages = [
  { value: "python", label: "🐍 Python" },
  { value: "javascript", label: "🟨 JavaScript" },
  { value: "typescript", label: "🔷 TypeScript" },
  { value: "java", label: "☕ Java" },
  { value: "cpp", label: "⚡ C++" },
];

export default function LanguageSelector({
  language,
  setLanguage,
}: Props) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor="language"
        className="text-sm font-semibold text-slate-700"
      >
        Programming Language
      </label>

      <select
        id="language"
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="w-64 rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-800 shadow-sm transition-all duration-200 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
      >
        {languages.map((lang) => (
          <option key={lang.value} value={lang.value}>
            {lang.label}
          </option>
        ))}
      </select>
    </div>
  );
}