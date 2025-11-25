"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Play, Pause, Loader2, BookOpen, Bookmark, Settings, Book } from "lucide-react";
import { AudioPlayer } from "../../components/AudioPlayer";
import { useQuran } from "../../context/QuranContext";
import { SettingsDrawer } from "../../components/SettingsDrawer";
import { ThemeToggle } from "../../components/ThemeToggle";

export default function SurahDetail({ params }) {
  const { surahId } = use(params);
  
  const [surah, setSurah] = useState(null);
  const [tafsir, setTafsir] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentAudio, setCurrentAudio] = useState(null);
  const [audioTitle, setAudioTitle] = useState("");
  const [showTafsir, setShowTafsir] = useState(false);
  const [activeTafsirAyat, setActiveTafsirAyat] = useState(null);

  const { bookmarks, addBookmark, removeBookmark, settings, setLastRead } = useQuran();

  useEffect(() => {
    async function fetchData() {
      try {
        const [surahRes, tafsirRes] = await Promise.all([
          fetch(`https://equran.id/api/v2/surat/${surahId}`),
          fetch(`https://equran.id/api/v2/tafsir/${surahId}`)
        ]);
        
        const surahData = await surahRes.json();
        const tafsirData = await tafsirRes.json();

        if (surahData.code === 200) setSurah(surahData.data);
        if (tafsirData.code === 200) setTafsir(tafsirData.data);
        
        // Set last read
        if (surahData.code === 200) {
           setLastRead({
             surah: { nomor: surahData.data.nomor, namaLatin: surahData.data.namaLatin },
             timestamp: Date.now()
           });
        }

      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [surahId, setLastRead]);

  // Handle scroll to verse after loading
  useEffect(() => {
    if (!loading && window.location.hash) {
      const id = window.location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          // Add highlight effect
          element.classList.add('ring-2', 'ring-primary', 'ring-offset-2', 'dark:ring-offset-slate-900');
          setTimeout(() => {
            element.classList.remove('ring-2', 'ring-primary', 'ring-offset-2', 'dark:ring-offset-slate-900');
          }, 2000);
        }, 500); // Small delay to ensure rendering
      }
    }
  }, [loading]);

  const playAudio = (url, title) => {
    setCurrentAudio(url);
    setAudioTitle(title);
  };

  const isBookmarked = (ayatId) => {
    return bookmarks.some(b => b.surah.nomor === surah.nomor && b.ayat.nomorAyat === ayatId);
  };

  const toggleBookmark = (ayat) => {
    if (isBookmarked(ayat.nomorAyat)) {
      removeBookmark(surah.nomor, ayat.nomorAyat);
    } else {
      addBookmark(
        { nomor: surah.nomor, namaLatin: surah.namaLatin },
        { nomorAyat: ayat.nomorAyat }
      );
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!surah) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-32 transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl transition-colors duration-300">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Kembali</span>
          </Link>
          
          <div className="text-center">
            <h1 className="text-lg font-bold text-slate-900 dark:text-white">{surah.namaLatin}</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">{surah.arti}</p>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <SettingsDrawer />
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-4xl px-4 py-8">
        {/* Surah Info Card */}
        <div className="mb-8 overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-purple-600 p-8 text-white shadow-xl shadow-primary/20 relative">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-64 w-64 rounded-full bg-black/10 blur-3xl" />
          
          <div className="flex flex-col items-center text-center relative z-10">
            <h2 className="mb-2 font-amiri text-5xl drop-shadow-sm">{surah.nama}</h2>
            <p className="mb-6 text-lg opacity-90 font-medium tracking-wide">{surah.namaLatin} • {surah.jumlahAyat} Ayat</p>
            
            <div className="flex gap-4">
              <button
                onClick={() => playAudio(surah.audioFull["05"], `Full Surah ${surah.namaLatin}`)}
                className="flex items-center gap-2 rounded-full bg-white/20 px-8 py-3 font-bold backdrop-blur-md transition-all hover:bg-white/30 hover:scale-105 active:scale-95 shadow-lg"
              >
                <Play className="h-5 w-5 fill-current" />
                Putar Full Surah
              </button>
            </div>
          </div>
        </div>

        {/* Bismillah */}
        {surah.nomor !== 1 && surah.nomor !== 9 && (
          <div className="mb-12 text-center">
            <p className="font-amiri text-4xl text-slate-800 dark:text-slate-200 leading-loose drop-shadow-sm">
              بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ
            </p>
          </div>
        )}

        {/* Verses List */}
        <div className="space-y-6">
          {surah.ayat.map((ayat) => (
            <div
              key={ayat.nomorAyat}
              id={`ayat-${ayat.nomorAyat}`}
              className={`group rounded-2xl border bg-white dark:bg-slate-900 p-6 transition-all duration-300 hover:shadow-xl ${
                isBookmarked(ayat.nomorAyat) 
                  ? "border-primary/50 shadow-primary/5 ring-1 ring-primary/20" 
                  : "border-slate-100 dark:border-slate-800 hover:border-primary/30 hover:shadow-primary/5"
              }`}
            >
              <div className="mb-6 flex items-center justify-between rounded-xl bg-slate-50 dark:bg-slate-800/50 px-4 py-3 border border-transparent group-hover:border-primary/10 transition-colors">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white font-bold shadow-md shadow-primary/20">
                  {ayat.nomorAyat}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleBookmark(ayat)}
                    className={`rounded-full p-2 transition-all duration-300 ${
                      isBookmarked(ayat.nomorAyat)
                        ? "text-primary bg-primary/10 scale-110"
                        : "text-slate-400 hover:bg-primary/10 hover:text-primary hover:scale-110"
                    }`}
                    title="Bookmark"
                  >
                    <Bookmark className={`h-5 w-5 ${isBookmarked(ayat.nomorAyat) ? "fill-current" : ""}`} />
                  </button>
                  <button
                    onClick={() => {
                        setActiveTafsirAyat(activeTafsirAyat === ayat.nomorAyat ? null : ayat.nomorAyat);
                    }}
                    className={`rounded-full p-2 transition-all duration-300 ${
                        activeTafsirAyat === ayat.nomorAyat
                        ? "text-primary bg-primary/10 scale-110"
                        : "text-slate-400 hover:bg-primary/10 hover:text-primary hover:scale-110"
                    }`}
                    title="Tafsir"
                  >
                    <BookOpen className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => playAudio(ayat.audio["05"], `${surah.namaLatin} - Ayat ${ayat.nomorAyat}`)}
                    className="rounded-full p-2 text-slate-400 hover:bg-primary/10 hover:text-primary hover:scale-110 transition-all duration-300"
                    title="Play Verse"
                  >
                    <Play className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="mb-8 text-right pl-8">
                <p 
                  className="font-amiri leading-[2.5] text-slate-900 dark:text-white drop-shadow-sm"
                  style={{ fontSize: settings.fontSize }}
                >
                  {ayat.teksArab}
                </p>
              </div>

              <div className="space-y-4">
                {settings.showLatin && (
                  <p className="text-lg font-medium text-primary/90 tracking-wide">
                    {ayat.teksLatin}
                  </p>
                )}
                {settings.showTranslation && (
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed border-l-4 border-slate-200 dark:border-slate-700 pl-4">
                    {ayat.teksIndonesia}
                  </p>
                )}
                
                {/* Tafsir Section */}
                {activeTafsirAyat === ayat.nomorAyat && tafsir && (
                    <div className="mt-6 rounded-2xl bg-slate-50 dark:bg-slate-800/80 p-6 text-sm text-slate-600 dark:text-slate-300 leading-relaxed animate-in fade-in slide-in-from-top-4 border border-slate-100 dark:border-slate-700 shadow-inner">
                        <h4 className="font-bold mb-3 text-primary flex items-center gap-2 text-base">
                          <Book className="h-4 w-4" />
                          Tafsir Ayat {ayat.nomorAyat}
                        </h4>
                        <div className="prose dark:prose-invert max-w-none text-justify">
                          {tafsir.tafsir.find(t => t.ayat === ayat.nomorAyat)?.teks}
                        </div>
                    </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Navigation Footer */}
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="flex justify-between">
          {surah.suratSebelumnya ? (
            <Link
              href={`/${surah.suratSebelumnya.nomor}`}
              className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 px-6 py-3 text-sm font-bold text-slate-600 dark:text-slate-400 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all duration-300"
            >
              <ArrowLeft className="h-4 w-4" />
              {surah.suratSebelumnya.namaLatin}
            </Link>
          ) : <div />}
          
          {surah.suratSelanjutnya ? (
            <Link
              href={`/${surah.suratSelanjutnya.nomor}`}
              className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 px-6 py-3 text-sm font-bold text-slate-600 dark:text-slate-400 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all duration-300"
            >
              {surah.suratSelanjutnya.namaLatin}
              <ArrowRight className="h-4 w-4" />
            </Link>
          ) : <div />}
        </div>
      </div>

      {currentAudio && (
        <AudioPlayer
          audioUrl={currentAudio}
          title={audioTitle}
          onEnded={() => setCurrentAudio(null)}
        />
      )}
    </div>
  );
}
