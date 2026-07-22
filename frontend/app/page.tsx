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

  const reviewCode = async () => {
    if (!code.trim()) {
      setReview("Please write some code first.");
      return;
    }

    try {
      setLoading(true);
      setReview("");

      const { data } = await axios.post(
        "http://127.0.0.1:8000/review",
        {
          code,
          language,
        }
      );

      if (data.review) {
        setReview(data.review);
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
    <main className="min-h-screen bg-gray-100">
      <Header />

      <section className="mx-auto max-w-6xl space-y-6 p-8">
        <LanguageSelector
          language={language}
          setLanguage={setLanguage}
        />

        <CodeEditor
          code={code}
          setCode={setCode}
        />

        <ReviewButton
          onClick={reviewCode}
          loading={loading}
        />

        <ReviewCard
          review={review}
        />
      </section>
    </main>
  );
}