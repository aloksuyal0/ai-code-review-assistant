"use client";

import { useState } from "react";
import axios from "axios";

import Header from "@/components/layout/Header";
import LanguageSelector from "@/components/editor/LanguageSelector";
import CodeEditor from "@/components/editor/CodeEditor";
import ReviewButton from "@/components/review/ReviewButton";
import ReviewCard from "@/components/review/ReviewCard";

export default function Home() {
  const [code, setCode] = useState(`def hello():
    print("Hello World")`);

  const [language, setLanguage] = useState("python");
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);
  const [reviewTime, setReviewTime] = useState<number | null>(null);

  const reviewCode = async () => {
    if (!code.trim()) {
      setReview("Please write some code first.");
      return;
    }

    try {
      const startTime = performance.now();

      setLoading(true);
      setReview("");
      setReviewTime(null);

      const { data } = await axios.post(
        "http://127.0.0.1:8000/review",
        {
          code,
          language,
        }
      );

      if (data.review) {
        setReview(data.review);

        const endTime = performance.now();
        setReviewTime(
          Number(((endTime - startTime) / 1000).toFixed(2))
        );
      } else if (data.error) {
        setReview(`❌ ${data.error}`);
      } else {
        setReview("No response received.");
      }
    } catch (err: unknown) {
      console.error(err);

      if (axios.isAxiosError(err)) {
        setReview(
          err.response?.data?.error ||
            "Unable to connect to the backend."
        );
      } else {
        setReview("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100">
      <Header />

      <section className="mx-auto max-w-7xl px-6 py-10">
        {/* Hero */}
        <div className="mb-10 text-center">
          <h1 className="text-5xl font-extrabold tracking-tight text-slate-900">
            🤖 AI Code Review Assistant
          </h1>

          <p className="mt-4 text-lg text-slate-600">
            Review your code instantly with AI-powered feedback and
            professional suggestions.
          </p>
        </div>

        {/* Language */}
        <div className="mb-6">
          <LanguageSelector
            language={language}
            setLanguage={setLanguage}
          />
        </div>

        {/* Editor */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
          <CodeEditor
            code={code}
            language={language}
            setCode={setCode}
          />
        </div>

        {/* Button */}
        <div className="mt-8 flex justify-center">
          <ReviewButton
            onClick={reviewCode}
            loading={loading}
          />
        </div>

        {/* Review */}
        <div className="mt-10">
          <ReviewCard
            review={review}
            reviewTime={reviewTime}
          />
        </div>
      </section>
    </main>
  );
}