"use client";

type Props = {
  language: string;
  setLanguage: React.Dispatch<React.SetStateAction<string>>;
};

export default function LanguageSelector({
  language,
  setLanguage,
}: Props) {
  return (
    <select
      value={language}
      onChange={(e) => setLanguage(e.target.value)}
      className="rounded-md border p-2"
    >
      <option value="python">Python</option>
      <option value="javascript">JavaScript</option>
      <option value="typescript">TypeScript</option>
      <option value="java">Java</option>
      <option value="cpp">C++</option>
    </select>
  );
}