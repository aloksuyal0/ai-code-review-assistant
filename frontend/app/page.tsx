"use client";

import { useState } from "react";
import axios from "axios";
import { RotateCcw } from "lucide-react";

import Header from "@/components/layout/Header";
import LanguageSelector from "@/components/editor/LanguageSelector";
import CodeEditor from "@/components/editor/CodeEditor";
import ReviewButton from "@/components/review/ReviewButton";
import ReviewCard from "@/components/review/ReviewCard";

const samples: Record<string, string> = {
  python: `def find_duplicates(items):
    duplicates = []
    for item in items:
        if items.count(item) > 1:
            duplicates.append(item)
    return duplicates`,

  javascript: `function findDuplicates(items) {
  const duplicates = [];
  for (const item of items) {
    if (items.filter((value) => value === item).length > 1) {
      duplicates.push(item);
    }
  }
  return duplicates;
}`,

  typescript: `function findDuplicates(items: string[]): string[] {
  const duplicates: string[] = [];
  for (const item of items) {
    if (items.filter((value) => value === item).length > 1) {
      duplicates.push(item);
    }
  }
  return duplicates;
}`,

  java: `import java.util.*;

class Main {
  static List<String> findDuplicates(List<String> items) {
    List<String> duplicates = new ArrayList<>();
    for (String item : items) {
      if (Collections.frequency(items, item) > 1) {
        duplicates.add(item);
      }
    }
    return duplicates;
  }
}`,

  cpp: `#include <algorithm>
#include <string>
#include <vector>

std::vector<std::string> findDuplicates(const std::vector<std::string>& items) {
  std::vector<std::string> duplicates;
  for (const auto& item : items) {
    if (std::count(items.begin(), items.end(), item) > 1) {
      duplicates.push_back(item);
    }
  }
  return duplicates;
}`,
};

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

export default function Home() {
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState(samples.python);
  const [review, setReview] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [reviewTime, setReviewTime] = useState<number | null>(null);

  const changeLanguage = (nextLanguage: string) => {
    setLanguage(nextLanguage);
    setCode(samples[nextLanguage] ?? "");
    setReview("");
    setError("");
    setReviewTime(null);
  };

  const resetEditor = () => {
    setCode(samples[language] ?? "");
    setReview("");
    setError("");
    setReviewTime(null);
  };

  const handleFileUpload = async (file: File) => {
    const text = await file.text();

    setCode(text);
    setReview("");
    setError("");
    setReviewTime(null);

    const extension = file.name.split(".").pop()?.toLowerCase();

    switch (extension) {
      case "py":
        setLanguage("python");
        break;

      case "js":
        setLanguage("javascript");
        break;

      case "ts":
        setLanguage("typescript");
        break;

      case "java":
        setLanguage("java");
        break;

      case "cpp":
      case "cc":
      case "cxx":
        setLanguage("cpp");
        break;

      default:
        break;
    }
  };

  const reviewCode = async () => {
    if (!code.trim()) {
      setError("Add some code before requesting a review.");
      return;
    }

    const startTime = performance.now();

    setLoading(true);
    setReview("");
    setError("");
    setReviewTime(null);

    try {
      const { data } = await axios.post(`${apiUrl}/review`, {
        code,
        language,
      });

      setReview(data.review);

      setReviewTime(
        Number(((performance.now() - startTime) / 1000).toFixed(2))
      );
    } catch (err: unknown) {
      console.error(err);

      if (axios.isAxiosError<{ detail?: string }>(err)) {
        setError(
          err.response?.data?.detail ??
            "Unable to connect to the review service."
        );
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100">
      <Header />

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            🤖 AI Code Review Assistant
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            Paste code, choose its language, and receive a clear review with
            bugs, improvements, complexity notes, and an optimized version.
          </p>
        </div>

        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <LanguageSelector
            language={language}
            setLanguage={changeLanguage}
          />

          <button
            type="button"
            onClick={resetEditor}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-400 hover:text-blue-700"
          >
            <RotateCcw size={16} />
            Load Example
          </button>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-lg sm:p-6">
          <CodeEditor
            code={code}
            language={language}
            setCode={setCode}
            onFileUpload={handleFileUpload}
          />
        </div>

        <div className="mt-8 flex justify-center">
          <ReviewButton
            onClick={reviewCode}
            loading={loading}
          />
        </div>

        <div className="mt-10">
          <ReviewCard
            review={review}
            error={error}
            reviewTime={reviewTime}
          />
        </div>
      </section>
    </main>
  );
}