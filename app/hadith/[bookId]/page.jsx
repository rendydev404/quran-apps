"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { ArrowLeft, Search, Loader2, ChevronLeft, ChevronRight, Hash, ArrowUp } from "lucide-react";
import { ThemeToggle } from "../../../components/ThemeToggle";
import { HadithCard } from "../../../components/HadithCard";

export default function BookPage({ params }) {
  // Unwrap params using React.use()
  const resolvedParams = use(params);
  const { bookId } = resolvedParams;

  const [hadiths, setHadiths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [range, setRange] = useState({ start: 1, end: 20 });
  const [searchQuery, setSearchQuery] = useState("");
  const [jumpNumber, setJumpNumber] = useState("");
  const [bookInfo, setBookInfo] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Fetch book info (total hadiths)
  useEffect(() => {
    const fetchBookInfo = async () => {
      try {
        const res = await fetch("https://api.hadith.gading.dev/books");
        const data = await res.json();
        if (data.code === 200) {
          const book = data.data.find((b) => b.id === bookId);
          setBookInfo(book);
        }
      } catch (error) {
        console.error("Failed to fetch book info:", error);
      }
    };
    fetchBookInfo();
  }, [bookId]);

  // Fetch hadiths by range
  useEffect(() => {
    const fetchHadiths = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://api.hadith.gading.dev/books/${bookId}?range=${range.start}-${range.end}`
        );
        const data = await res.json();
        if (data.code === 200) {
          setHadiths(data.data.hadiths);
        }
      } catch (error) {
        console.error("Failed to fetch hadiths:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHadiths();
  }, [bookId, range]);

  // Handle scroll for "Scroll to Top" button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNextPage = () => {
    if (bookInfo && range.end >= bookInfo.available) return;
    setRange((prev) => ({
      start: prev.end + 1,
      end: prev.end + 20,
    }));
    setPage((prev) => prev + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePrevPage = () => {
    if (range.start <= 1) return;
    setRange((prev) => ({
      start: Math.max(1, prev.start - 20),
      end: Math.max(20, prev.end - 20),
    }));
    setPage((prev) => Math.max(1, prev - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleJumpToNumber = (e) => {
    e.preventDefault();
    if (!jumpNumber) return;
    
    const num = parseInt(jumpNumber);
    if (isNaN(num)) return;

    // Calculate range containing this number
    // e.g. 55 -> range 41-60
    const pageSize = 20;
    const pageNum = Math.ceil(num / pageSize);
    const newStart = (pageNum - 1) * pageSize + 1;
    const newEnd = pageNum * pageSize;

    setRange({ start: newStart, end: newEnd });
    setPage(pageNum);
    setJumpNumber("");
  };

  // Filter hadiths based on search query
  const filteredHadiths = hadiths.filter((hadith) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      hadith.id.toLowerCase().includes(query) ||
      hadith.arab.includes(query) ||
      hadith.number.toString().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-slate-50 pb-20 transition-colors duration-300 dark:bg-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/80">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link
            href="/hadith"
            className="flex items-center gap-2 text-slate-600 transition-colors hover:text-primary dark:text-slate-400"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Books</span>
          </Link>
          
          <h1 className="text-lg font-bold capitalize text-slate-900 dark:text-white">
            HR. {bookId.replace("-", " ")}
          </h1>

          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-4xl px-4 py-8">
        {/* Controls */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row">
          {/* Search within loaded */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari di halaman ini..."
              className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-12 pr-4 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
            />
          </div>

          {/* Jump to Number */}
          <form onSubmit={handleJumpToNumber} className="relative w-full md:w-48">
            <Hash className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="number"
              value={jumpNumber}
              onChange={(e) => setJumpNumber(e.target.value)}
              placeholder="No. Hadits"
              className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
            />
          </form>
        </div>

        {/* Info Bar */}
        <div className="mb-6 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
          <span>
            Menampilkan {range.start} - {range.end}
            {bookInfo && ` dari ${bookInfo.available.toLocaleString()}`}
          </span>
          {searchQuery && (
            <span className="text-primary">
              Ditemukan {filteredHadiths.length} hasil
            </span>
          )}
        </div>

        {/* List */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-4">
            {filteredHadiths.length > 0 ? (
              filteredHadiths.map((hadith) => (
                <HadithCard
                  key={hadith.number}
                  hadith={hadith}
                  bookName={bookId}
                  highlight={searchQuery}
                />
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 p-12 text-center dark:border-slate-800">
                <p className="text-slate-500">Tidak ada hadits ditemukan</p>
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            onClick={handlePrevPage}
            disabled={range.start <= 1 || loading}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white transition-colors hover:border-primary hover:text-primary disabled:opacity-50 dark:border-slate-800 dark:bg-slate-900"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          
          <span className="font-medium text-slate-900 dark:text-white">
            Halaman {page}
          </span>

          <button
            onClick={handleNextPage}
            disabled={(bookInfo && range.end >= bookInfo.available) || loading}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white transition-colors hover:border-primary hover:text-primary disabled:opacity-50 dark:border-slate-800 dark:bg-slate-900"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </main>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 z-50 rounded-full bg-primary p-4 text-white shadow-lg transition-all hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/20 ${
          showScrollTop ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
        }`}
      >
        <ArrowUp className="h-6 w-6" />
      </button>
    </div>
  );
}
