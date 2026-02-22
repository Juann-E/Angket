import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';

const SurveySelesai = () => {
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate('/', { replace: true });
  };

  return (
    <div className="min-h-screen bg-blue-50">
      <Navbar />
      <div className="flex items-center justify-center px-4 py-16">
        <div className="bg-white rounded-xl shadow-lg px-6 py-10 max-w-md w-full text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <svg
              className="h-10 w-10 text-green-600"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 12.75L11.25 15 15 9.75"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle
                cx="12"
                cy="12"
                r="8"
                stroke="currentColor"
                strokeWidth="1.8"
              />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            Terima Kasih! 🎉
          </h1>
          <p className="text-sm sm:text-base text-gray-700 mb-6">
            Jawaban survei Anda telah berhasil disimpan. Anda sudah boleh
            menutup halaman ini.
          </p>
          <button
            type="button"
            onClick={handleBackToHome}
            className="inline-flex justify-center items-center px-6 py-3 rounded-md text-sm font-semibold shadow-sm border border-transparent text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    </div>
  );
};

export default SurveySelesai;
