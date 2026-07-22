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

 const [review, setReview] = useState(null);
  async function reviewCode() {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/review",
        {
          code,
          language: "python",
        }
      );

      setReview(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <Header />

      <section className="mx-auto max-w-6xl space-y-6 p-8">
        <LanguageSelector />

        <CodeEditor
          code={code}
          setCode={setCode}
        />

        <ReviewButton onClick={reviewCode} />

        <ReviewCard review={review} />
      </section>
    </main>
  );
}