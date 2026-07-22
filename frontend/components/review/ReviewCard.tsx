"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Props = {
  review: string;
};

export default function ReviewCard({ review }: Props) {
  if (!review) return null;

  return (
    <div className="mt-8 rounded-xl border border-gray-300 bg-white p-8 shadow-lg">
      <h2 className="mb-6 text-3xl font-bold text-blue-600">
        🤖 AI Code Review
      </h2>

      <article className="prose prose-lg max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {review}
        </ReactMarkdown>
      </article>
    </div>
  );
}