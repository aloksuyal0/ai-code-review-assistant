"use client";

import { useState } from "react";
import { Check, Clipboard, ClipboardCopy, TriangleAlert } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

type Props = { review: string; error: string; reviewTime: number | null };

export default function ReviewCard({ review, error, reviewTime }: Props) {
  const [copied, setCopied] = useState(false);
  const copyText = async (text: string) => {
    try { await navigator.clipboard.writeText(text); setCopied(true); window.setTimeout(() => setCopied(false), 2_000); } catch { setCopied(false); }
  };

  return (
    <section aria-live="polite" className="overflow-hidden rounded-2xl border border-slate-300 bg-white shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
        <div className="flex items-center gap-3"><span className="text-3xl" aria-hidden="true">🤖</span><div><h2 className="text-xl font-bold text-slate-900">AI Code Review</h2><p className="text-sm text-slate-500">Actionable feedback and a suggested rewrite</p>{reviewTime !== null && <p className="mt-1 text-sm font-medium text-green-600">✓ Review completed in {reviewTime} sec</p>}</div></div>
        {review && <button onClick={() => copyText(review)} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700">{copied ? <Check size={16} aria-hidden="true" /> : <Clipboard size={16} aria-hidden="true" />}{copied ? "Copied" : "Copy review"}</button>}
      </div>
      <div className="p-6 sm:p-8">
        {error ? <div role="alert" className="flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-800"><TriangleAlert className="mt-0.5 shrink-0" size={20} aria-hidden="true" /><div><p className="font-semibold">Review unavailable</p><p className="mt-1 text-sm">{error}</p></div></div> : !review ? <div className="py-10 text-center text-slate-500"><div className="mb-4 text-5xl" aria-hidden="true">💡</div><p className="text-lg">Your AI review will appear here.</p><p className="mt-2 text-sm">Paste your code and select <strong>Review Code</strong>.</p></div> : <article className="prose prose-slate max-w-none prose-headings:scroll-mt-24"><ReactMarkdown remarkPlugins={[remarkGfm]} components={{ code({ children, className }) { const match = /language-([\w+-]+)/.exec(className ?? ""); const code = String(children).replace(/\n$/, ""); return match ? <div className="relative my-6 overflow-hidden rounded-xl"><button onClick={() => copyText(code)} aria-label="Copy code" className="absolute right-3 top-3 z-10 inline-flex items-center gap-1 rounded-md bg-slate-700 px-3 py-1 text-xs text-white hover:bg-slate-600"><ClipboardCopy size={13} aria-hidden="true" /> Copy code</button><SyntaxHighlighter language={match[1]} style={oneDark} PreTag="div">{code}</SyntaxHighlighter></div> : <code className="rounded bg-slate-100 px-1 py-0.5 text-red-600">{children}</code>; } }}>{review}</ReactMarkdown></article>}
      </div>
    </section>
  );
}
