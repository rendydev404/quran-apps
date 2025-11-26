"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Search, Loader2, BookOpen, ArrowRight } from "lucide-react";
import { ThemeToggle } from "../../components/ThemeToggle";
import { SettingsDrawer } from "../../components/SettingsDrawer";

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(`https://api.alquran.cloud/v1/search/${query}/all/id.indonesian`);
      const data = await res.json();
      if (data.code === 200) {
        setResults(data.data);
      }
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  };

  // Auto search if query param exists
  useEffect(() => {
    if (initialQuery) {
      handleSearch({ preventDefault: () => {} });
    }
  }, [initialQuery]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Back</span>
          </Link>
          
          <h1 className="text-lg font-bold text-slate-900 dark:text-white">Global Search</h1>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <SettingsDrawer />
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-4xl px-4 py-8">
        {/* Search Input */}
        <form onSubmit={handleSearch} className="mb-8 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search verses (e.g., 'cahaya', 'sabar')..."
            className="h-14 w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 pl-12 pr-4 text-lg outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all dark:text-white shadow-sm"
          />
          <button
            type="submit"
            disabled={loading}
            className="absolute right-2 top-2 bottom-2 rounded-xl bg-primary px-6 font-medium text-white transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Search"}
          </button>
        </form>

        {/* Results */}
        {results && (
          <div className="space-y-6">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Found {results.count} matches for "{query}"
            </p>

            {results.matches.map((match, index) => (
              <Link
                key={index}
                href={`/${match.surah.number}#ayat-${match.numberInSurah}`}
                className="block group rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 transition-all hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
                      {match.surah.number}:{match.numberInSurah}
                    </span>
                    <h3 className="font-bold text-slate-900 dark:text-white">
                      {match.surah.englishName} ({match.surah.name})
                    </h3>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-primary transition-colors" />
                </div>

                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {match.text.split(new RegExp(`(${query})`, "gi")).map((part, i) => 
                    part.toLowerCase() === query.toLowerCase() ? (
                      <span key={i} className="bg-yellow-400 text-primary px-0.5 rounded">
                        {part}
                      </span>
                    ) : (
                      part
                    )
                  )}
                </p>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
      <SearchContent />
    </Suspense>
  );
}
