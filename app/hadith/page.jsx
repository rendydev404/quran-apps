"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Book, Loader2, ChevronRight } from "lucide-react";
import { ThemeToggle } from "../../components/ThemeToggle";

export default function HadithPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch("https://api.hadith.gading.dev/books");
        const data = await res.json();
        if (data.code === 200) {
          setBooks(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch books:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 pb-20 transition-colors duration-300 dark:bg-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/80">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-slate-600 transition-colors hover:text-primary dark:text-slate-400"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Back</span>
          </Link>
          
          <h1 className="text-lg font-bold text-slate-900 dark:text-white">Kumpulan Hadits</h1>

          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8 text-center">
          <h2 className="mb-2 text-3xl font-bold text-slate-900 dark:text-white">Kutubus Sittah & Lainnya</h2>
          <p className="text-slate-600 dark:text-slate-400">
            Kumpulan hadits shahih dari 9 perawi terkemuka
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {books.map((book) => (
              <Link
                key={book.id}
                href={`/hadith/${book.id}`}
                className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                  <Book className="h-6 w-6" />
                </div>
                
                <h3 className="mb-1 text-lg font-bold text-slate-900 dark:text-white">
                  {book.name}
                </h3>
                <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
                  {book.available.toLocaleString()} Hadits
                </p>

                <div className="flex items-center text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                  Baca Hadits <ChevronRight className="ml-1 h-4 w-4" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
