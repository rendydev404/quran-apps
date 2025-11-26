"use client";

import { Share2, Bookmark, Copy, Check } from "lucide-react";
import { useState } from "react";

export function HadithCard({ hadith, bookName, highlight }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = `${hadith.arab}\n\n${hadith.id}\n\n(HR. ${bookName} No. ${hadith.number})`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getHighlightedText = (text, highlight) => {
    if (!highlight) return text;
    const parts = text.split(new RegExp(`(${highlight})`, "gi"));
    return parts.map((part, i) => 
      part.toLowerCase() === highlight.toLowerCase() ? (
        <span key={i} className="bg-yellow-200 text-slate-900 dark:bg-yellow-500/50 dark:text-white rounded px-0.5">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:border-primary/20 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary">
          {hadith.number}
        </span>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
            title="Copy Hadith"
          >
            {copied ? <Check className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Arabic Text */}
      <div className="mb-6 text-right">
        <p className="font-amiri text-2xl leading-loose text-slate-900 dark:text-white" dir="rtl">
          {hadith.arab}
        </p>
      </div>

      {/* Translation */}
      <div className="text-slate-600 dark:text-slate-300">
        <p className="leading-relaxed">
          {getHighlightedText(hadith.id, highlight)}
        </p>
      </div>
    </div>
  );
}
