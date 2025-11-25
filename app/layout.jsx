import { Geist, Geist_Mono, Amiri } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { QuranProvider } from "../context/QuranContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const amiri = Amiri({
  variable: "--font-amiri",
  weight: ["400", "700"],
  subsets: ["arabic"],
  display: "swap",
});

export const metadata = {
  title: "QuranApp - Professional Al-Quran Digital",
  description: "Read, listen, and understand the Holy Quran with a modern interface.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${amiri.variable} antialiased bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors duration-300`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <QuranProvider>
            {children}
          </QuranProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
