import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';

const Landing = () => {
  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-700 to-blue-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Evaluasi Kemandirian Belajar Siswa
            </h1>
            <p className="text-xl text-blue-100 mb-10 max-w-3xl mx-auto">
              Platform pengukuran Self-Directed Learning yang akurat dan mudah
            </p>
            <Link
              to="/validasi-kode"
              className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-md shadow-sm text-blue-700 bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
            >
              Mulai Pengukuran
            </Link>
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
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Validasi Kode
              </h3>
              <p className="text-gray-600">
                Masukkan kode akses yang diberikan oleh guru untuk memulai pengukuran
              </p>
            </div>
            
            {/* Step 2 */}
            <div className="bg-white rounded-lg shadow-sm p-8 text-center hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Isi Instrumen
              </h3>
              <p className="text-gray-600">
                Jawab pertanyaan kuesioner dengan jujur untuk hasil yang akurat
              </p>
            </div>
            
            {/* Step 3 */}
            <div className="bg-white rounded-lg shadow-sm p-8 text-center hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-blue-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Lihat Hasil
              </h3>
              <p className="text-gray-600">
                Data tersimpan otomatis dan dapat diakses oleh guru untuk analisis
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
    </div>
  );
};

export default Landing;