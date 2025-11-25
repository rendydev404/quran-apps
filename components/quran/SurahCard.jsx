// components/quran/SurahCard.jsx
import Link from 'next/link';

export function SurahCard({ surah }) {
  return (
    <Link href={`/${surah.nomor}`}>
      <div className="group block rounded-lg border bg-white p-4 transition-all duration-300 hover:border-primary hover:shadow-lg hover:-translate-y-1">
        <div className="flex items-center space-x-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-md bg-gray-100 font-bold text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
            {surah.nomor}
          </div>
          <div>
            <p className="font-bold text-lg text-gray-800">{surah.namaLatin}</p>
            <p className="text-sm text-gray-500">{surah.arti}</p>
          </div>
        </div>
        <div className="mt-4 flex justify-between items-center">
          <p className="text-sm text-gray-600 font-medium">{surah.jumlahAyat} Ayat</p>
          <p className="text-lg font-bold font-['Amiri',_serif] text-primary">{surah.nama}</p>
        </div>
      </div>
    </Link>
  );
}