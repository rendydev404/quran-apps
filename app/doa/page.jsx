"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Search, Loader2, ArrowUp } from "lucide-react";
import { ThemeToggle } from "../../components/ThemeToggle";
import { DoaCard } from "../../components/DoaCard";

export default function DoaPage() {
  const [doas, setDoas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const fetchDoas = async () => {
      try {
        const res = await fetch("/api/doa");
        const data = await res.json();
        setDoas(data);
      } catch (error) {
        console.error("Failed to fetch doas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoas();
  }, []);

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

  const filteredDoas = doas.filter((doa) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      doa.doa.toLowerCase().includes(query) ||
      doa.artinya.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-slate-50 pb-20 transition-colors duration-300 dark:bg-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/80 transition-colors duration-300">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-slate-600 transition-colors hover:text-primary dark:text-slate-400"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Back</span>
          </Link>
          
          <h1 className="text-lg font-bold text-slate-900 dark:text-white">Kumpulan Doa</h1>

          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8 text-center">
          <h2 className="mb-2 text-3xl font-bold text-slate-900 dark:text-white">Doa Harian</h2>
          <p className="text-slate-600 dark:text-slate-400">
            Kumpulan doa sehari-hari untuk diamalkan
          </p>
        </div>

        {/* Search */}
        <div className="mb-8 relative">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari doa (misal: tidur, makan)..."
            className="h-14 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 text-lg outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-800 dark:bg-slate-900 dark:text-white shadow-sm"
          />
        </div>

        {/* Info Bar */}
        <div className="mb-6 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
          <span>
            Menampilkan {filteredDoas.length} doa
          </span>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {filteredDoas.length > 0 ? (
              filteredDoas.map((doa) => (
                <DoaCard
                  key={doa.id}
                  doa={doa}
                  highlight={searchQuery}
                />
              ))
            ) : (
              <div className="col-span-full rounded-2xl border border-dashed border-slate-200 p-12 text-center dark:border-slate-800">
                <p className="text-slate-500">Tidak ada doa ditemukan</p>
              </div>
            )}
          </div>
        )}
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
