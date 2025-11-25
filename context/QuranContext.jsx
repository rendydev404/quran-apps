"use client";

import { createContext, useContext, useState, useEffect } from "react";

const QuranContext = createContext();

export function QuranProvider({ children }) {
  const [bookmarks, setBookmarks] = useState([]);
  const [lastRead, setLastRead] = useState(null);
  const [settings, setSettings] = useState({
    arabicFont: "LPMQ", // LPMQ, Amiri, Uthmani
    fontSize: 24,
    showTranslation: true,
    showLatin: true,
  });

  // Load from localStorage on mount
  useEffect(() => {
    const savedBookmarks = localStorage.getItem("quran_bookmarks");
    const savedLastRead = localStorage.getItem("quran_last_read");
    const savedSettings = localStorage.getItem("quran_settings");

    if (savedBookmarks) setBookmarks(JSON.parse(savedBookmarks));
    if (savedLastRead) setLastRead(JSON.parse(savedLastRead));
    if (savedSettings) setSettings(JSON.parse(savedSettings));
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem("quran_bookmarks", JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    if (lastRead) localStorage.setItem("quran_last_read", JSON.stringify(lastRead));
  }, [lastRead]);

  useEffect(() => {
    localStorage.setItem("quran_settings", JSON.stringify(settings));
  }, [settings]);

  const addBookmark = (surah, ayat) => {
    const newBookmark = { surah, ayat, timestamp: Date.now() };
    // Check if already exists
    if (!bookmarks.some(b => b.surah.nomor === surah.nomor && b.ayat.nomorAyat === ayat.nomorAyat)) {
      setBookmarks([newBookmark, ...bookmarks]);
    }
  };

  const removeBookmark = (surahId, ayatId) => {
    setBookmarks(bookmarks.filter(b => !(b.surah.nomor === surahId && b.ayat.nomorAyat === ayatId)));
  };

  const updateSettings = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return (
    <QuranContext.Provider
      value={{
        bookmarks,
        addBookmark,
        removeBookmark,
        lastRead,
        setLastRead,
        settings,
        updateSettings,
      }}
    >
      {children}
    </QuranContext.Provider>
  );
}

export function useQuran() {
  return useContext(QuranContext);
}
