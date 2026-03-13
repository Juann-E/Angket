import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Alert from '../../components/common/Alert';
import axiosClient from '../../api/axiosClient';
import { Copy, Check, ArrowLeft } from 'lucide-react';

const RegistrasiSiswa = () => {
  const navigate = useNavigate();
  const [nama, setNama] = useState('');
  const [nomorAbsen, setNomorAbsen] = useState('');
  const [sekolahList, setSekolahList] = useState([]);
  const [kejuruanList, setKejuruanList] = useState([]);
  const [kelasList, setKelasList] = useState([]);
  const [selectedSekolah, setSelectedSekolah] = useState('');
  const [selectedKejuruan, setSelectedKejuruan] = useState('');
  const [selectedKelas, setSelectedKelas] = useState('');
  const [loadingData, setLoadingData] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchSekolah = async () => {
      try {
        setLoadingData(true);
        setError('');
        const sekolahRes = await axiosClient.get(
          '/pengaturan/pelajar_regis/sekolah'
        );
        setSekolahList(sekolahRes.data || []);
      } catch (err) {
        const message =
          err.response?.data?.message ||
          'Gagal memuat data sekolah, kejuruan, atau kelas. Silakan coba lagi.';
        setError(message);
      } finally {
        setLoadingData(false);
      }
    };

    fetchSekolah();
  }, []);

  const handleSekolahChange = (e) => {
    const value = e.target.value;
    setSelectedSekolah(value);
    setSelectedKejuruan('');
    setSelectedKelas('');
    setKejuruanList([]);
    setKelasList([]);

    if (!value) {
      return;
    }

    const fetchKejuruan = async () => {
      try {
        setLoadingData(true);
        setError('');
        const kejuruanRes = await axiosClient.get(
          '/pengaturan/pelajar_regis/kejuruan',
          {
            params: { id_sekolah: value }
          }
        );
        setKejuruanList(kejuruanRes.data || []);
      } catch (err) {
        const message =
          err.response?.data?.message ||
          'Gagal memuat data kejuruan. Silakan coba lagi.';
        setError(message);
      } finally {
        setLoadingData(false);
      }
    };

    fetchKejuruan();
  };

  const handleKejuruanChange = (e) => {
    const value = e.target.value;
    setSelectedKejuruan(value);
    setSelectedKelas('');
    setKelasList([]);

    if (!value) {
      return;
    }

    const fetchKelas = async () => {
      try {
        setLoadingData(true);
        setError('');
        const kelasRes = await axiosClient.get(
          '/pengaturan/pelajar_regis/kelas',
          {
            params: { id_kejuruan: value }
          }
        );
        setKelasList(kelasRes.data || []);
      } catch (err) {
        const message =
          err.response?.data?.message ||
          'Gagal memuat data kelas. Silakan coba lagi.';
        setError(message);
      } finally {
        setLoadingData(false);
      }
    };

    fetchKelas();
  };

  const handleKelasChange = (e) => {
    setSelectedKelas(e.target.value);
  };

  const filteredKejuruan = kejuruanList;
  const filteredKelas = kelasList;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nama.trim() || !nomorAbsen.trim()) {
      setError('Nama lengkap dan nomor absen wajib diisi.');
      return;
    }

    if (!selectedSekolah || !selectedKejuruan || !selectedKelas) {
      setError('Sekolah, kejuruan, dan kelas wajib dipilih.');
      return;
    }

    try {
      setSubmitting(true);
      setIsLoading(true);
      setError('');

      const regResponse = await axiosClient.post(
        '/pengaturan/pelajar_regis/register',
        {
          nama_pelajar: nama.trim(),
          nomor_absen: nomorAbsen.trim(),
          id_kelas: Number(selectedKelas)
        }
      );

      console.log('DATA DARI BACKEND REGISTER:', regResponse.data);

      const idPelajar =
        regResponse.data?.id ?? regResponse.data?.id_pelajar;

      if (!idPelajar) {
        throw new Error('ID pelajar tidak ditemukan dari respons backend.');
      }

      const codeResponse = await axiosClient.post(
        '/pengaturan/code_management/generate',
        {
          id_pelajar: idPelajar
        }
      );

      console.log('DATA DARI BACKEND GENERATE CODE:', codeResponse.data);

      const accessCode =
        codeResponse.data?.code ?? codeResponse.data;

      if (accessCode) {
        localStorage.setItem('survey_pin', accessCode);
        setGeneratedCode(accessCode);
        setShowSuccessModal(true);
      }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        'Gagal mendaftarkan data pelajar. Silakan coba lagi.';
      setError(message);
    } finally {
      setSubmitting(false);
      setIsLoading(false);
    }
  };

  const handleBackToHome = () => {
    setShowSuccessModal(false);
    navigate('/');
  };

  const handleCopyCode = async () => {
    if (!generatedCode) return;
    try {
      await navigator.clipboard.writeText(generatedCode);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error('Gagal menyalin kode:', err);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="inline-flex items-center text-sm text-gray-600 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          <span>Kembali ke Beranda</span>
        </button>
      </div>
      <div className="flex items-center justify-center px-4 py-8 sm:py-10">
        <div className="w-full max-w-lg">
          <div className="bg-white rounded-xl shadow-lg px-6 py-8">
            <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
              Registrasi Peserta Survei
            </h1>
            <p className="text-sm text-gray-600 text-center mb-6">
              Lengkapi data berikut untuk mendapatkan kode akses survei Anda.
            </p>

            {error && (
              <div className="mb-4">
                <Alert
                  type="error"
                  message={error}
                  onClose={() => setError('')}
                />
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="nama"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Nama Lengkap
                </label>
                <input
                  id="nama"
                  type="text"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out text-gray-900"
                  placeholder="Tuliskan nama lengkap Anda"
                  autoComplete="name"
                  disabled={loadingData || submitting}
                />
              </div>

              <div>
                <label
                  htmlFor="nomor_absen"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Nomor Absen
                </label>
                <input
                  id="nomor_absen"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={nomorAbsen}
                  onChange={(e) => {
                    const onlyDigits = e.target.value.replace(/[^0-9]/g, '');
                    setNomorAbsen(onlyDigits);
                  }}
                  className="appearance-none block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out text-gray-900"
                  placeholder="Contoh: 12"
                  disabled={loadingData || submitting}
                />
              </div>

              <div>
                <label
                  htmlFor="sekolah"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Pilih Sekolah
                </label>
                <select
                  id="sekolah"
                  value={selectedSekolah}
                  onChange={handleSekolahChange}
                  disabled={loadingData || sekolahList.length === 0 || submitting}
                  className="appearance-none block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                >
                  <option value="">
                    Pilih Sekolah
                  </option>
                  {sekolahList.map((sekolah) => (
                    <option key={sekolah.id} value={sekolah.id}>
                      {sekolah.nama_sekolah}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="kejuruan"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Pilih Kejuruan
                </label>
                <select
                  id="kejuruan"
                  value={selectedKejuruan}
                  onChange={handleKejuruanChange}
                  disabled={
                    loadingData ||
                    !selectedSekolah ||
                    filteredKejuruan.length === 0 ||
                    submitting
                  }
                  className="appearance-none block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                >
                  <option value="">
                    {selectedSekolah ? 'Pilih Kejuruan' : 'Pilih sekolah terlebih dahulu'}
                  </option>
                  {filteredKejuruan.map((kejuruan) => (
                    <option key={kejuruan.id} value={kejuruan.id}>
                      {kejuruan.nama_kejuruan}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="kelas"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Pilih Kelas
                </label>
                <select
                  id="kelas"
                  value={selectedKelas}
                  onChange={handleKelasChange}
                  disabled={
                    loadingData ||
                    !selectedKejuruan ||
                    filteredKelas.length === 0 ||
                    submitting
                  }
                  className="appearance-none block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                >
                  <option value="">
                    {selectedKejuruan ? 'Pilih Kelas' : 'Pilih kejuruan terlebih dahulu'}
                  </option>
                  {filteredKelas.map((kelas) => (
                    <option key={kelas.id} value={kelas.id}>
                      {kelas.nama_kelas}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={isLoading || submitting || loadingData}
                className="mt-4 w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Memproses...' : 'Daftar & Dapatkan Kode'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {showSuccessModal && generatedCode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6">
            <h2 className="text-2xl font-bold text-gray-900 text-center">
              Registrasi Berhasil! 🎉
            </h2>
            <p className="mt-3 text-sm text-gray-600 text-center">
              Ini adalah kode akses survei Anda. Simpan kode ini dengan baik.
            </p>
            <div className="mt-6 mb-2 flex justify-center">
              <div className="inline-flex items-center gap-3 px-5 py-3 bg-gray-50 border border-gray-300 rounded-xl shadow-sm">
                <span className="text-2xl sm:text-3xl font-mono font-bold tracking-widest text-blue-700">
                  {generatedCode}
                </span>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="inline-flex items-center justify-center p-2 rounded-md bg-white border border-gray-300 text-gray-600 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  aria-label="Salin kode akses"
                >
                  {copied ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
            {copied && (
              <div className="mb-2 flex justify-center">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-50 border border-green-200 text-xs font-medium text-green-700 shadow-sm">
                  Kode berhasil disalin!
                </div>
              </div>
            )}
            <p className="text-xs sm:text-sm text-orange-600 text-center">
              ⚠️ PERHATIAN: Harap screenshot, foto, atau salin (copy) kode akses ini.
              Jika kode ini hilang, Anda tidak dapat melanjutkan survei dan harus
              menghubungi guru atau admin.
            </p>
            <div className="mt-6">
              <button
                type="button"
                onClick={handleBackToHome}
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Kembali ke Beranda
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistrasiSiswa;
