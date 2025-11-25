// components/quran/Ayah.jsx

export function Ayah({ ayat }) {
  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      {/* Header Ayat */}
      <div className="mb-4 flex items-center justify-between">
        <span className="rounded-full bg-primary px-3 py-1 text-sm font-bold text-white">
          {ayat.nomorAyat}
        </span>
        {/* Di sini nanti kita bisa tambahkan tombol play audio */}
      </div>

      {/* Teks Arab */}
      <p dir="rtl" className="mb-4 text-right font-['Amiri',_serif] text-4xl leading-relaxed text-gray-800">
        {ayat.teksArab}
      </p>

      {/* Teks Latin (Transliterasi) */}
      <p className="mb-2 text-left text-sm italic text-gray-500">
        {ayat.teksLatin}
      </p>

      {/* Terjemahan Indonesia */}
      <p className="text-left text-base text-gray-700">
        {ayat.teksIndonesia}
      </p>
    </div>
  );
}