import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import axiosClient from '../../api/axiosClient';
import { GraduationCap, Users } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinCode, setPinCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [pinError, setPinError] = useState('');
  const slides = [
    '/Images/Slide1.jpg',
    '/Images/Slide2.jpg',
    '/Images/Slide3.jpg',
    '/Images/Slide4.jpg',
    '/Images/Slide5.jpg',
  ];
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(id);
  }, [slides.length]);

  const goPrev = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handleOpenModal = () => {
    setPinError('');
    setPinCode('');
    setShowPinModal(true);
  };

  const handleGoToRegistrasi = () => {
    navigate('/survey/registrasi');
  };

  const handleCloseModal = () => {
    if (submitting) return;
    setShowPinModal(false);
  };

  const handlePinChange = (e) => {
    const value = e.target.value.toUpperCase();
    setPinCode(value);
    if (pinError) setPinError('');
  };

  const handleValidatePin = async (e) => {
    e.preventDefault();
    if (!pinCode.trim()) {
      setPinError('Kode akses tidak boleh kosong');
      return;
    }

    try {
      setSubmitting(true);
      setPinError('');
      const response = await axiosClient.post('/pengaturan/code_management/validate', { code: pinCode.trim() });
      
      // Jika kode sudah digunakan dan memiliki hasil survei, arahkan ke halaman hasil
      if (response.data?.used && response.data?.hasilSurvei) {
        setShowPinModal(false);
        navigate('/survey/selesai', { state: { hasilSurvei: response.data.hasilSurvei } });
        return;
      }

      localStorage.setItem('survey_pin', pinCode.trim());
      setShowPinModal(false);
      navigate('/survey/mulai');
    } catch (err) {
      const message =
        err.response?.data?.message ||
        'Kode tidak valid atau sudah digunakan';
      setPinError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <Navbar />
      
      {/* Hero Section */}
      <div
        className="relative bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/Images/header.png')" }}
      >
        <div className="absolute inset-0 bg-blue-900/50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Self Direction Learning (SDL Check)
              </h1>
              <p className="text-lg md:text-xl text-blue-100 mb-8 md:mb-10 max-w-2xl mx-auto md:mx-0 leading-relaxed">
                Ukur tingkat Self-Directed Learning (SDL) siswa dengan mudah, cepat, dan akurat.
              </p>
              <div className="flex flex-col sm:flex-row items-center md:items-start justify-center md:justify-start gap-4">
                <button
                  type="button"
                  onClick={handleOpenModal}
                  className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-md shadow-sm text-blue-700 bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                >
                  Mulai Survei
                </button>
                <button
                  type="button"
                  onClick={handleGoToRegistrasi}
                  className="inline-flex items-center px-8 py-4 border text-lg font-medium rounded-md shadow-sm text-white border-white bg-transparent hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
                >
                  Registrasi Peserta Baru
                </button>
              </div>
            </div>
            <div className="order-first md:order-none relative rounded-2xl shadow-2xl ring-1 ring-white/20 overflow-hidden h-64 md:h-96 group">
              <div
                className="flex h-full transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {slides.map((src, idx) => (
                  <img
                    key={src}
                    src={src}
                    alt={`Slide ${idx + 1}`}
                    className="w-full h-full object-cover flex-shrink-0"
                    style={{ minWidth: '100%' }}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={goPrev}
                aria-label="Sebelumnya"
                className="absolute left-3 top-1/2 -translate-y-1/2 inline-flex items-center justify-center h-8 w-8 md:h-9 md:w-9 rounded-full bg-white/70 hover:bg-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto"
              >
                <span className="text-lg md:text-xl font-semibold text-gray-800 leading-none">
                  &lt;
                </span>
              </button>
              <button
                type="button"
                onClick={goNext}
                aria-label="Berikutnya"
                className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex items-center justify-center h-8 w-8 md:h-9 md:w-9 rounded-full bg-white/70 hover:bg-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto"
              >
                <span className="text-lg md:text-xl font-semibold text-gray-800 leading-none">
                  &gt;
                </span>
              </button>
              <div className="absolute inset-x-0 bottom-3 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {slides.map((_, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    aria-label={`Slide ${idx + 1}`}
                    className={`h-2 rounded-full transition-all ${idx === currentSlide ? 'bg-white w-4' : 'bg-white/60 hover:bg-white w-2'}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="bg-blue-50 py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Mengenal Self-Directed Learning (SDL)
          </h2>
          <p className="text-gray-700 leading-relaxed text-justify">
            Self-Directed Learning (SDL) adalah proses belajar di mana individu secara mandiri bertanggung jawab atas pembelajarannya, mulai dari menentukan tujuan, memilih strategi, hingga mengevaluasi hasil belajar. Pengukuran Self-Directed Learning (SDL) diperlukan untuk mengetahui tingkat kemandirian belajar individu, mengidentifikasi kekuatan dan kelemahannya, serta menjadi dasar dalam merancang intervensi atau strategi pembelajaran yang lebih tepat.
          </p>
        </div>
      </section>
      
      {/* Steps Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Cara Kerja SDL Check
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Proses pengukuran yang sederhana dan efisien dalam 3 langkah mudah
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-white rounded-lg shadow-sm p-8 text-center hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-10 h-10 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 21v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.5 11a3.5 3.5 0 100-7 3.5 3.5 0 000 7z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8h4m-2-2v4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                1. Registrasi Diri
              </h3>
              <p className="text-gray-600">
                Isi data diri Anda untuk mendapatkan Kode Akses.
              </p>
            </div>
            
            {/* Step 2 */}
            <div className="bg-white rounded-lg shadow-sm p-8 text-center hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-10 h-10 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 4h8l4 4v10a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 2v4H8"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 13h6M9 17h3"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                2. Masukkan Kode & Isi Kuesioner
              </h3>
              <p className="text-gray-600">
                Gunakan kode Anda dan jawab kuesioner dengan jujur.
              </p>
            </div>
            
            {/* Step 3 */}
            <div className="bg-white rounded-lg shadow-sm p-8 text-center hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-10 h-10 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 19h16M4 15l4-8 4 10 4-6 4 4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                3. Hasil Langsung Teranalisis
              </h3>
              <p className="text-gray-600">
                Skor otomatis dihitung dan masuk ke laporan Admin.
              </p>
            </div>
          </div>
        </div>
      </div>

      <section className="bg-white py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Dikembangkan Oleh:
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="group rounded-xl bg-white p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-t-4 border-blue-600">
              <div className="flex items-center gap-5">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                  <GraduationCap className="w-12 h-12 text-blue-600" />
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-800">
                    Mahendra Adi N
                  </p>
                  <p className="text-sm text-gray-500">
                    NIM: 132022036
                  </p>
                  <span className="inline-block mt-2 text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                    Bimbingan Konseling, FKIP
                  </span>
                </div>
              </div>
            </div>
            <div className="group rounded-xl bg-white p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-t-4 border-blue-600">
              <div className="flex items-center gap-5">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
                  <GraduationCap className="w-12 h-12 text-amber-600" />
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-800">
                    Robby Maulana B
                  </p>
                  <p className="text-sm text-gray-500">
                    NIM: 132022030
                  </p>
                  <span className="inline-block mt-2 text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                    Bimbingan Konseling, FKIP
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8">
            <h4 className="text-base font-semibold text-gray-900 mb-4">
              Pengembang
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="group rounded-xl bg-white p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-t-4 border-blue-600">
                <div className="flex items-center gap-5">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                    <Users className="w-12 h-12 text-gray-700" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-800">
                      Rangga Prawiro Utomo
                    </p>
                    <p className="text-sm text-gray-500">
                      Frontend Developer
                    </p>
                  </div>
                </div>
              </div>
              <div className="group rounded-xl bg-white p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-t-4 border-blue-600">
                <div className="flex items-center gap-5">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                    <Users className="w-12 h-12 text-gray-700" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-800">
                      Juannito Eriyadi
                    </p>
                    <p className="text-sm text-gray-500">
                      Backend Developer
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-500">
            © 2026 SDL Check System
          </p>
        </div>
      </footer>

      {showPinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 text-center">
                Masukkan Kode Akses
              </h2>
              <p className="mt-2 text-sm text-gray-600 text-center">
                Silakan masukkan kode PIN untuk memulai survei.
              </p>
            </div>
            <form onSubmit={handleValidatePin}>
              <div className="px-6 py-5">
                <input
                  type="text"
                  value={pinCode}
                  onChange={handlePinChange}
                  className="w-full text-center text-2xl tracking-widest uppercase px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="MASUKKAN KODE"
                  maxLength={12}
                  autoFocus
                />
                {pinError && (
                  <p className="mt-3 text-sm text-red-600 text-center">
                    {pinError}
                  </p>
                )}
              </div>
              <div className="px-6 pb-5 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={submitting}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {submitting ? 'Memvalidasi...' : 'Validasi Kode'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Landing;
