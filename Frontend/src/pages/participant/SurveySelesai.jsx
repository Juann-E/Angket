import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';

// Dictionary Kategori Data
const KATEGORI_DATA = {
  Low: {
    label: "Rendah 😕",
    colorClass: "text-red-600",
    penjelasan: "Kalau kamu ada di rentang ini, artinya kamu masih sangat butuh bimbingan dari guru. Belajarnya belum bisa dilakukan sendiri, jadi masih sering bergantung pada arahan orang lain. Kamu juga perlu mulai mengenali apa saja yang perlu diperbaiki dari cara belajarmu. Bahkan, mungkin perlu mengubah cara belajar secara keseluruhan supaya bisa lebih efektif dan tidak membingungkan.",
    rekomendasi: [
      "Mulai dari kebiasaan kecil dulu, seperti belajar 15–30 menit setiap hari secara rutin. Yang penting konsisten, bukan lama waktunya.",
      "Buat jadwal belajar sederhana, misalnya kapan belajar, kapan istirahat, dan kapan mengerjakan tugas.",
      "Jangan ragu untuk bertanya ke guru atau teman kalau kamu tidak paham. Lebih baik tanya daripada diam dan makin bingung.",
      "Coba kenali gaya belajarmu. Misalnya, apakah kamu lebih mudah paham lewat video, membaca, atau diskusi.",
      "Kurangi kebiasaan menunda-nunda tugas (prokrastinasi). Bisa dimulai dengan mengerjakan tugas yang paling mudah dulu supaya ada semangat.",
      "Lingkungan belajar juga penting—coba cari tempat yang nyaman dan minim gangguan (misalnya jauh dari HP saat belajar).",
      "Fokus dulu ke tujuan kecil, seperti memahami satu materi dalam satu waktu, jangan langsung semuanya."
    ],
    kesimpulan: "👉 Intinya: bangun dulu kebiasaan belajar dan rasa tanggung jawab terhadap belajar."
  },
  Moderate: {
    label: "Sedang 🙂",
    colorClass: "text-orange-500",
    penjelasan: "Di tahap ini, kamu sudah mulai menuju menjadi pembelajar mandiri, tapi masih dalam proses. Artinya, kamu sudah punya usaha untuk belajar sendiri, tapi tetap perlu bantuan guru di beberapa bagian. Yang penting sekarang adalah kamu mulai mengenali kekuranganmu, mengevaluasi cara belajarmu, dan mencoba strategi belajar yang lebih cocok buat kamu, dengan bimbingan jika diperlukan.",
    rekomendasi: [
      "Mulai biasakan belajar tanpa harus disuruh. Tanamkan mindset bahwa belajar itu kebutuhanmu, bukan hanya kewajiban dari guru.",
      "Evaluasi cara belajarmu: apakah sudah efektif? Kalau belum, coba ubah strategi, misalnya dengan membuat rangkuman, mind map, atau latihan soal.",
      "Buat target belajar yang lebih jelas, misalnya target harian atau mingguan supaya kamu punya arah.",
      "Latih diri untuk menyelesaikan tugas tepat waktu tanpa harus diingatkan.",
      "Saat menemui kesulitan, coba selesaikan sendiri dulu. Kalau benar-benar tidak bisa, baru minta bantuan.",
      "Mulai belajar mengatur waktu dengan baik antara belajar, istirahat, dan aktivitas lain.",
      "Tingkatkan fokus saat belajar, misalnya dengan mengurangi distraksi seperti media sosial."
    ],
    kesimpulan: "👉 Intinya: tingkatkan konsistensi, tanggung jawab, dan kepercayaan diri dalam belajar mandiri."
  },
  High: {
    label: "Tinggi 😎",
    colorClass: "text-green-600",
    penjelasan: "Kalau kamu ada di level ini, keren! Kamu sudah termasuk pembelajar yang mandiri dan efektif. Kamu sudah tahu bagaimana cara belajar yang cocok untuk dirimu sendiri dan bisa mengatur proses belajarmu dengan baik. Tantangannya sekarang adalah mempertahankan kebiasaan baik ini, terus mengembangkan kemampuan, dan menemukan cara supaya belajarmu makin maksimal.",
    rekomendasi: [
      "Pertahankan kebiasaan belajar yang sudah kamu punya, seperti disiplin waktu dan tanggung jawab terhadap tugas.",
      "Tantang diri dengan hal yang lebih tinggi, misalnya mencoba soal yang lebih sulit atau mencari materi tambahan di luar pelajaran sekolah.",
      "Jangan cepat puas—terus evaluasi cara belajarmu supaya bisa makin efektif.",
      "Kamu juga bisa membantu teman yang kesulitan. Selain membantu orang lain, ini juga bikin pemahamanmu makin kuat.",
      "Kembangkan keterampilan lain, seperti berpikir kritis, problem solving, dan manajemen waktu.",
      "Coba mulai belajar secara mandiri tanpa bergantung pada guru, misalnya mencari sumber belajar sendiri (buku, internet, video edukasi).",
      "Tetap jaga keseimbangan antara belajar dan istirahat supaya tidak burnout."
    ],
    kesimpulan: "👉 Intinya: pertahankan, kembangkan, dan jadikan dirimu pembelajar yang terus berkembang."
  }
};

const SurveySelesai = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const hasilSurvei = location.state?.hasilSurvei;
  const levelScor = hasilSurvei?.level_sdness || 'Low';
  const dataKategori = KATEGORI_DATA[levelScor] || KATEGORI_DATA['Low'];

  const handleBackToHome = () => {
    navigate('/', { replace: true });
  };

  return (
    <div className="min-h-screen bg-blue-50">
      <Navbar />
      <div className="flex items-center justify-center px-4 py-16">
        <div className="bg-white rounded-xl shadow-lg px-6 py-10 max-w-3xl w-full text-left">
          
          <div className="text-center mb-8 border-b pb-6">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
              <svg
                className="h-10 w-10 text-blue-600"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 12.75L11.25 15 15 9.75M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Terima Kasih! 🎉
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Kuesioner berhasil diselesaikan. Berikut adalah mini rapor untuk profil belajarmu.
            </p>
          </div>

          <div className="mb-6 space-y-5">
            <div className="flex flex-col items-center justify-center text-center w-full my-6">
              <p className="text-sm font-bold text-gray-500 tracking-wider mb-2 uppercase">Hasil Kemandirian Belajar Anda:</p>
              <div className={`text-4xl sm:text-5xl font-extrabold ${dataKategori.colorClass}`}>
                {dataKategori.label}
              </div>
              {hasilSurvei?.total_skor && (
                <p className="text-lg font-medium text-gray-700 mt-2">
                  Total Skor Anda: <span className="text-blue-600 font-bold">{hasilSurvei.total_skor}</span>
                </p>
              )}
            </div>

            <p className="text-gray-800 leading-relaxed text-sm sm:text-base">
              {dataKategori.penjelasan}
            </p>

            <div className="bg-gray-50 p-5 rounded-lg border border-gray-100 mt-6 mb-2">
              <h3 className="font-semibold text-gray-900 mb-3">Rekomendasi untuk Kamu:</h3>
              <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base text-gray-700">
                {dataKategori.rekomendasi.map((rek, idx) => (
                  <li key={idx}>{rek}</li>
                ))}
              </ul>
            </div>
            
            <p className="font-bold text-gray-900 mt-4 text-sm sm:text-base">
              {dataKategori.kesimpulan}
            </p>
          </div>

          <div className="mt-8">
            <button
              type="button"
              onClick={handleBackToHome}
              className="w-full inline-flex justify-center items-center px-6 py-3 rounded-md text-base font-semibold shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition"
            >
              Kembali ke Beranda
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default SurveySelesai;
