import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import axiosClient from '../../api/axiosClient';

const Landing = () => {
  const navigate = useNavigate();
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinCode, setPinCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [pinError, setPinError] = useState('');

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
      await axiosClient.post('/pengaturan/code_management/validate', { code: pinCode.trim() });
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
      <div className="bg-gradient-to-br from-blue-700 to-blue-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Self Direction Learning (SDL Check)
            </h1>
            <p className="text-xl text-blue-100 mb-10 max-w-3xl mx-auto">
              Ukur tingkat Self-Directed Learning (SDL) siswa dengan mudah, cepat, dan akurat.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
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
        </div>
      </div>
      
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
