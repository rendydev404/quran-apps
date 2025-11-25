
// app/page.jsx
"use client";

import { useState, useEffect } from "react";
import { BookOpen, Search, Loader2, Compass, Clock } from "lucide-react";
import { SurahCard } from "../components/SurahCard";
import { ThemeToggle } from "../components/ThemeToggle";
import { SettingsDrawer } from "../components/SettingsDrawer";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  const [surahs, setSurahs] = useState([]);
  const [filteredSurahs, setFilteredSurahs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchSurahs() {
      try {
        const res = await fetch("https://equran.id/api/v2/surat");
        const data = await res.json();
        if (data.code === 200) {
          setSurahs(data.data);
          setFilteredSurahs(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch surahs:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchSurahs();
  }, []);

  useEffect(() => {
    const filtered = surahs.filter((surah) =>
      surah.namaLatin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      surah.arti.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredSurahs(filtered);
  }, [searchQuery, surahs]);

  const handleSearchSubmit = (e) => {
    if (e.key === "Enter" && searchQuery) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
              <BookOpen className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">QuranApp</span>
          </div>
          
          <div className="relative w-full max-w-md hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search Surah or Verse..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchSubmit}
              className="h-10 w-full rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 pl-10 pr-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all dark:text-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <Link href="/jadwal-sholat" className="rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-primary dark:text-slate-400 dark:hover:bg-slate-800 transition-colors" title="Prayer Times">
               <Clock className="h-5 w-5" />
            </Link>
            <ThemeToggle />
            <SettingsDrawer />
          </div>
        </div>
        
        {/* Mobile Search */}
        <div className="md:hidden px-4 pb-4">
           <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search Surah or Verse..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchSubmit}
              className="h-10 w-full rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 pl-10 pr-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all dark:text-white"
            />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            <span className="text-primary">Al-Quran</span> Online
          </h1>
          <p className="text-slate-500 dark:text-slate-400">Read, listen, and understand the Holy Quran</p>
        </div>

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredSurahs.map((surah) => (
              <SurahCard key={surah.nomor} surah={surah} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}