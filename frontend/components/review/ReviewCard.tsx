"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

type Props = {
  review: string;
  reviewTime: number | null;
};

export default function ReviewCard({
  review,
  reviewTime,
}: Props) {
  const [copied, setCopied] = useState(false);

  const copyReview = async () => {
    if (!review) return;

    await navigator.clipboard.writeText(review);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="mt-10 overflow-hidden rounded-2xl border border-slate-300 bg-white shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🤖</span>

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              AI Code Review
            </h2>

            <p className="text-sm text-slate-500">
              AI-powered analysis and suggestions
            </p>

            {reviewTime !== null && (
              <p className="mt-1 text-sm font-medium text-green-600">
                ✅ Review completed in {reviewTime} sec
              </p>
            )}
          </div>
        </div>

        {review && (
          <button
            onClick={copyReview}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            {copied ? "✅ Copied" : "📋 Copy"}
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-8">
        {!review ? (
          <div className="py-10 text-center text-slate-500">
            <div className="mb-4 text-5xl">💡</div>

            <p className="text-lg">
              Your AI review will appear here.
            </p>

            <p className="mt-2 text-sm">
              Paste your code and click <strong>Review Code</strong>.
            </p>
          </div>
        ) : (
          <article className="prose prose-slate max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code(props) {
                  const { children, className } = props;

                  const match = /language-(\w+)/.exec(className || "");

                  if (match) {
                    return (
                      <div className="relative my-6 overflow-hidden rounded-xl">
                        <button
                          onClick={() =>
                            navigator.clipboard.writeText(
                              String(children).replace(/\n$/, "")
                            )
                          }
                          className="absolute right-3 top-3 rounded-md bg-slate-700 px-3 py-1 text-xs text-white hover:bg-slate-600"
                        >
                          📋 Copy Code
                        </button>

                        <SyntaxHighlighter
                          language={match[1]}
                          style={oneDark}
                          PreTag="div"
                        >
                          {String(children).replace(/\n$/, "")}
                        </SyntaxHighlighter>
                      </div>
                    );
                  }

                  return (
                    <code className="rounded bg-slate-100 px-1 py-0.5 text-red-600">
                      {children}
                    </code>
                  );
                },
              }}
            >
              {review}
            </ReactMarkdown>
          </article>
        )}
      </div>
    </div>
  );
}