"use client";

import { useState } from "react";
import { Settings, X, Type, Eye, EyeOff } from "lucide-react";
import { useQuran } from "../context/QuranContext";

export function SettingsDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const { settings, updateSettings } = useQuran();

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-primary dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
      >
        <Settings className="h-5 w-5" />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 z-50 h-[100dvh] w-full sm:w-80 bg-white dark:bg-slate-900 shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 p-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Settings</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-full p-1 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Font Size */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                <Type className="h-4 w-4" />
                Arabic Font Size
              </label>
              <input
                type="range"
                min="18"
                max="48"
                step="2"
                value={settings.fontSize}
                onChange={(e) => updateSettings({ fontSize: parseInt(e.target.value) })}
                className="w-full accent-primary"
              />
              <div className="mt-2 text-center font-amiri text-slate-900 dark:text-white" style={{ fontSize: settings.fontSize }}>
                بِسْمِ اللّٰهِ
              </div>
            </div>

            {/* Visibility Toggles */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Show Latin</span>
                <button
                  onClick={() => updateSettings({ showLatin: !settings.showLatin })}
                  className={`relative h-6 w-11 rounded-full transition-colors ${
                    settings.showLatin ? "bg-primary" : "bg-slate-200 dark:bg-slate-700"
                  }`}
                >
                  <span
                    className={`absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform ${
                      settings.showLatin ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Show Translation</span>
                <button
                  onClick={() => updateSettings({ showTranslation: !settings.showTranslation })}
                  className={`relative h-6 w-11 rounded-full transition-colors ${
                    settings.showTranslation ? "bg-primary" : "bg-slate-200 dark:bg-slate-700"
                  }`}
                >
                  <span
                    className={`absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform ${
                      settings.showTranslation ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
