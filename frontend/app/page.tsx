"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useTheme } from "next-themes";
import { Moon, RotateCcw, Sun, Trash2 } from "lucide-react";
import Header from "@/components/layout/Header";
import LanguageSelector from "@/components/editor/LanguageSelector";
import CodeEditor from "@/components/editor/CodeEditor";
import ReviewButton from "@/components/review/ReviewButton";
import ReviewCard from "@/components/review/ReviewCard";
import { ReviewHistoryItem } from "@/types/review";

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
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setMounted(true);
    });
    return () => cancelAnimationFrame(id);
  }, []);
  const [review, setReview] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [repoUrl, setRepoUrl] = useState("");

  const [repoData, setRepoData] = useState<{
    name: string;
    description: string;
    default_branch: string;
    language: string;
    stars: number;
    review: string;
  } | null>(null);

  const [repoLoading, setRepoLoading] = useState(false);
  const [repoError, setRepoError] = useState("");

  const [reviewTime, setReviewTime] = useState<number | null>(null);

  const [history, setHistory] = useState<ReviewHistoryItem[]>([]);

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

  const loadHistory = (item: ReviewHistoryItem) => {
    setLanguage(item.language);
    setCode(item.code);
    setReview(item.review);
    setReviewTime(item.reviewTime);
    setError("");
  };

  const deleteHistory = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };
  const clearHistory = () => {
    setHistory([]);
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

  useEffect(() => {
    localStorage.setItem("review-history", JSON.stringify(history));
  }, [history]);

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

      const timeTaken = Number(
        ((performance.now() - startTime) / 1000).toFixed(2),
      );

      setReview(data.review);
      setReviewTime(timeTaken);

      const newReview: ReviewHistoryItem = {
        id: crypto.randomUUID(),
        language,
        code,
        review: data.review,
        reviewTime: timeTaken,
        createdAt: new Date().toLocaleString(),
      };

      setHistory((prev) => [newReview, ...prev]);
    } catch (err: unknown) {
      console.error(err);

      if (axios.isAxiosError<{ detail?: string }>(err)) {
        setError(
          err.response?.data?.detail ??
            "Unable to connect to the review service.",
        );
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };
  const reviewRepository = async () => {
    if (!repoUrl.trim()) {
      setRepoError("Please enter a GitHub repository URL.");
      return;
    }

    setRepoLoading(true);
    setRepoError("");
    setRepoData(null);

    try {
      const { data } = await axios.post(`${apiUrl}/review-repository`, {
        repo_url: repoUrl,
      });

      setRepoData(data);
    } catch (err: unknown) {
      console.error(err);

      if (axios.isAxiosError<{ detail?: string }>(err)) {
        setRepoError(
          err.response?.data?.detail ?? "Unable to review repository.",
        );
      } else {
        setRepoError("Something went wrong.");
      }
    } finally {
      setRepoLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-900 dark:text-slate-100">
      <Header />

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
            🤖 AI Code Review Assistant
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
            Paste code, choose its language, and receive a clear review with
            bugs, improvements, complexity notes, and an optimized version.
          </p>
        </div>
        <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-700 dark:bg-slate-800">
          <h2 className="mb-4 text-xl font-bold text-slate-800 dark:text-white">
            GitHub Repository Review
          </h2>

          <div className="flex gap-3">
            <input
              type="text"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="https://github.com/username/repository"
              className="flex-1 rounded-lg border border-slate-300 px-4 py-3 dark:bg-slate-900 dark:text-white"
            />

            <button
              onClick={reviewRepository}
              disabled={repoLoading}
              className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {repoLoading ? "Reviewing..." : "Review Repository"}
            </button>
          </div>

          {repoError && <p className="mt-4 text-red-500">{repoError}</p>}

          {repoData && (
            <div className="mt-6 rounded-lg border border-slate-300 p-6 dark:border-slate-600">
              <p>
                <strong>Name:</strong> {repoData.name}
              </p>

              <p>
                <strong>Description:</strong> {repoData.description}
              </p>

              <p>
                <strong>Language:</strong> {repoData.language}
              </p>

              <p>
                <strong>Default Branch:</strong> {repoData.default_branch}
              </p>

              <p>
                <strong>⭐ Stars:</strong> {repoData.stars}
              </p>

              <hr className="my-6 border-slate-300 dark:border-slate-700" />

              <h3 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">
                🤖 AI Repository Review
              </h3>

              <div className="overflow-x-auto rounded-lg bg-slate-100 p-4 dark:bg-slate-900">
                <pre className="whitespace-pre-wrap text-sm leading-7 text-slate-800 dark:text-slate-200">
                  {repoData.review}
                </pre>
              </div>
            </div>
          )}
        </div>
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <LanguageSelector language={language} setLanguage={changeLanguage} />

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() =>
                setTheme(resolvedTheme === "dark" ? "light" : "dark")
              }
              className="rounded-xl border border-slate-300 bg-white p-3 text-slate-700 shadow-sm transition hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
              title="Toggle Theme"
            >
              {mounted ? (
                resolvedTheme === "dark" ? (
                  <Sun size={18} />
                ) : (
                  <Moon size={18} />
                )
              ) : null}
            </button>

            <button
              type="button"
              onClick={resetEditor}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-400 hover:text-blue-700 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
            >
              <RotateCcw size={16} />
              Load Example
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-lg dark:border-slate-700 dark:bg-slate-800 sm:p-6">
          <CodeEditor
            code={code}
            language={language}
            setCode={setCode}
            onFileUpload={handleFileUpload}
          />
        </div>

        <div className="mt-8 flex justify-center">
          <ReviewButton onClick={reviewCode} loading={loading} />
        </div>

        <div className="mt-10">
          <ReviewCard
            review={review}
            error={error}
            reviewTime={reviewTime}
            language={language}
            code={code}
          />
        </div>
        {history.length > 0 && (
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-700 dark:bg-slate-800">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                Review History
              </h2>
              <button
                onClick={clearHistory}
                className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
              >
                Clear all
              </button>
            </div>

            <div className="space-y-3">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start justify-between rounded-lg border border-slate-300 p-4 transition hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-700"
                >
                  <div
                    onClick={() => loadHistory(item)}
                    className="flex-1 cursor-pointer"
                  >
                    <p className="font-semibold">
                      {item.language.toUpperCase()}
                    </p>

                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {item.createdAt}
                    </p>

                    <p className="mt-2 text-sm">
                      Review Time: {item.reviewTime}s
                    </p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteHistory(item.id);
                    }}
                    className="rounded-lg p-2 text-red-500 transition hover:bg-red-100"
                    title="Delete review"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
