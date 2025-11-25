"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, MapPin, Compass, Loader2 } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "../../components/ThemeToggle";
import { SettingsDrawer } from "../../components/SettingsDrawer";

export default function PrayerTimes() {
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [qibla, setQibla] = useState(null);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState({ city: "Jakarta", country: "Indonesia", lat: -6.2088, long: 106.8456 });

  useEffect(() => {
    // Try to get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(prev => ({
            ...prev,
            lat: position.coords.latitude,
            long: position.coords.longitude
          }));
        },
        (error) => console.log("Location access denied, using default")
      );
    }
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const date = new Date();
        const [timesRes, qiblaRes] = await Promise.all([
          fetch(`https://api.aladhan.com/v1/timings/${Math.floor(date.getTime() / 1000)}?latitude=${location.lat}&longitude=${location.long}&method=11`),
          fetch(`https://api.aladhan.com/v1/qibla/${location.lat}/${location.long}`)
        ]);

        const timesData = await timesRes.json();
        const qiblaData = await qiblaRes.json();

        if (timesData.code === 200) setPrayerTimes(timesData.data);
        if (qiblaData.code === 200) setQibla(qiblaData.data);

      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [location.lat, location.long]);

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
          
          <h1 className="text-lg font-bold text-slate-900 dark:text-white">Prayer Times & Qibla</h1>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <SettingsDrawer />
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-4xl px-4 py-8">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2">
            {/* Prayer Times Card */}
            <div className="rounded-3xl bg-white dark:bg-slate-900 p-8 shadow-xl border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-primary/10 text-primary">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Jadwal Sholat</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {prayerTimes?.date.readable} • {prayerTimes?.meta.timezone}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map((prayer) => (
                  <div key={prayer} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                    <span className="font-medium text-slate-700 dark:text-slate-300">{prayer}</span>
                    <span className="font-bold text-xl text-primary">{prayerTimes?.timings[prayer]}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Qibla Compass Card */}
            <div className="rounded-3xl bg-white dark:bg-slate-900 p-8 shadow-xl border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center text-center">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Arah Kiblat</h2>
                <p className="text-slate-500 dark:text-slate-400">
                  {qibla?.direction.toFixed(2)}° dari Utara
                </p>
              </div>

              <div className="relative h-64 w-64">
                {/* Compass Circle */}
                <div className="absolute inset-0 rounded-full border-4 border-slate-200 dark:border-slate-700"></div>
                
                {/* North Marker */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded text-xs font-bold">N</div>

                {/* Kaaba Icon / Direction Indicator */}
                <div 
                  className="absolute inset-0 flex items-center justify-center transition-transform duration-1000 ease-out"
                  style={{ transform: `rotate(${qibla?.direction}deg)` }}
                >
                  <div className="relative h-full w-1 bg-gradient-to-t from-transparent via-primary/20 to-transparent">
                    <div className="absolute top-4 left-1/2 -translate-x-1/2">
                      <div className="h-12 w-12 bg-black rounded-lg flex items-center justify-center border-2 border-yellow-500 shadow-lg">
                        <div className="h-8 w-8 border border-yellow-500/50 rounded"></div>
                      </div>
                      <div className="mt-2 text-xs font-bold text-primary whitespace-nowrap">Kiblat</div>
                    </div>
                  </div>
                </div>
                
                {/* Center Point */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-4 w-4 bg-slate-900 dark:bg-white rounded-full border-4 border-slate-100 dark:border-slate-800"></div>
              </div>
              
              <p className="mt-8 text-xs text-slate-400 max-w-xs">
                Pastikan perangkat Anda memiliki sensor kompas dan izin lokasi diaktifkan untuk akurasi terbaik.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
