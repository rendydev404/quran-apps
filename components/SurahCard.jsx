"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BookOpen, ArrowRight, Bookmark, PlayCircle, RotateCcw } from "lucide-react";
import { useQuran } from "../context/QuranContext";

export function SurahCard({ surah }) {
  const router = useRouter();
  const { bookmarks } = useQuran();
  const [showModal, setShowModal] = useState(false);

  // Find the latest bookmark for this surah
  const surahBookmark = bookmarks.find(b => b.surah.nomor === surah.nomor);

  const handleClick = (e) => {
    if (surahBookmark) {
      e.preventDefault();
      setShowModal(true);
    }
  };

  const handleContinue = () => {
    router.push(`/${surah.nomor}#ayat-${surahBookmark.ayat.nomorAyat}`);
    setShowModal(false);
  };

  const handleRestart = () => {
    router.push(`/${surah.nomor}`);
    setShowModal(false);
  };

  return (
    <>
      <Link
        href={`/${surah.nomor}`}
        onClick={handleClick}
        className="group relative flex flex-col justify-between rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10 dark:hover:shadow-primary/5"
      >
        <div className="absolute top-0 right-0 h-24 w-24 bg-gradient-to-br from-primary/5 to-transparent rounded-tr-2xl rounded-bl-[4rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {surahBookmark && (
          <div className="absolute top-4 right-4 z-20 animate-in fade-in zoom-in duration-300">
            <div className="bg-primary/10 p-1.5 rounded-full text-primary">
              <Bookmark className="h-4 w-4 fill-current" />
            </div>
          </div>
        )}
        
        <div className="flex items-start justify-between relative z-10">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white font-bold shadow-md shadow-primary/20 group-hover:scale-110 transition-all duration-300">
              {surah.nomor}
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors duration-300">
                {surah.namaLatin}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">
                {surah.arti}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-amiri text-xl font-bold text-slate-900 dark:text-white mb-1 group-hover:text-primary transition-colors duration-300">
              {surah.nama}
            </p>
            <p className="text-xs font-medium text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full">
              {surah.jumlahAyat} Ayat
            </p>
          </div>
        </div>
        
        <div className="mt-6 flex items-center justify-between border-t border-slate-50 dark:border-slate-800 pt-4 relative z-10">
          <span className="text-xs font-medium uppercase tracking-wider text-slate-400 group-hover:text-primary/70 transition-colors">
            {surah.tempatTurun}
          </span>
          <span className="flex items-center gap-1 text-sm font-medium text-primary opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
            Baca Surah <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </Link>

      {/* Bookmark Modal */}
      {showModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setShowModal(false)}
        >
          <div 
            className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-slate-100 dark:border-slate-800 animate-in zoom-in-95 duration-200"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-full bg-primary/10 text-primary">
                <Bookmark className="h-6 w-6 fill-current" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Bookmark Ditemukan</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Terakhir dibaca</p>
              </div>
            </div>
            
            <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
              Kamu memiliki bookmark di <strong>{surah.namaLatin}</strong> pada <strong>Ayat {surahBookmark.ayat.nomorAyat}</strong>. Ingin lanjut membaca?
            </p>
            
            <div className="flex flex-col gap-3">
              <button 
                onClick={handleContinue} 
                className="flex items-center justify-center gap-2 w-full py-3.5 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-primary/20"
              >
                <PlayCircle className="h-5 w-5" />
                Lanjut Baca
              </button>
              <button 
                onClick={handleRestart} 
                className="flex items-center justify-center gap-2 w-full py-3.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <RotateCcw className="h-5 w-5" />
                Mulai dari Awal
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
