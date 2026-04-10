import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Alert from '../../components/common/Alert';
import axiosClient from '../../api/axiosClient';

const kategoriOrder = [
  { key: 'Awareness', label: 'Awareness' },
  { key: 'Learning Strategies', label: 'Learning strategies' },
  { key: 'Learning Activities', label: 'Learning activities' },
  { key: 'Evaluation', label: 'Evaluation' },
  { key: 'Interpersonal Skills', label: 'Interpersonal skills' },
];

const skalaOptions = [
  { value: 5, label: 'Selalu' },
  { value: 4, label: 'Sering' },
  { value: 3, label: 'Kadang-kadang' },
  { value: 2, label: 'Jarang' },
  { value: 1, label: 'Tidak Pernah' },
];

const IsiSurvey = () => {
  const navigate = useNavigate();
  const [pertanyaan, setPertanyaan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [jawaban, setJawaban] = useState({});
  const [statusSimpan, setStatusSimpan] = useState({});
  const [submittingFinish, setSubmittingFinish] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const pin = localStorage.getItem('survey_pin');
    if (!pin) {
      navigate('/', { replace: true });
      return;
    }

    const fetchPertanyaan = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await axiosClient.get('/pertanyaan');
        setPertanyaan(response.data || []);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            'Gagal memuat pertanyaan. Silakan coba lagi.',
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPertanyaan();
  }, [navigate]);

  const flatPertanyaan = useMemo(() => {
    if (!pertanyaan || pertanyaan.length === 0) return [];

    const byKategori = {};
    kategoriOrder.forEach(({ key }) => {
      byKategori[key] = [];
    });

    pertanyaan.forEach((p) => {
      const key = p.kategori;
      if (!byKategori[key]) {
        byKategori[key] = [];
      }
      byKategori[key].push(p);
    });

    const ordered = [];

    kategoriOrder.forEach(({ key, label }) => {
      const list = byKategori[key] || [];
      list.forEach((p) => {
        ordered.push({
          ...p,
          kategoriLabel: label,
        });
      });
    });

    pertanyaan.forEach((p) => {
      if (!ordered.find((q) => q.id === p.id)) {
        ordered.push({
          ...p,
          kategoriLabel: p.kategori || 'Lainnya',
        });
      }
    });

    return ordered;
  }, [pertanyaan]);

  const totalPertanyaan = flatPertanyaan.length;
  const totalTerjawab = useMemo(
    () => Object.keys(jawaban).length,
    [jawaban],
  );
  const semuaTerjawab =
    totalPertanyaan > 0 && totalTerjawab === totalPertanyaan;

  const handleJawab = async (idPertanyaan, skor) => {
    setJawaban((prev) => ({
      ...prev,
      [idPertanyaan]: skor,
    }));

    setStatusSimpan((prev) => ({
      ...prev,
      [idPertanyaan]: 'saving',
    }));

    const code = localStorage.getItem('survey_pin');
    if (!code) {
      navigate('/', { replace: true });
      return;
    }

    await axiosClient
      .post('/pengaturan/code_management/submit_response', {
        code,
        id_pertanyaan: idPertanyaan,
        skor_poin: skor,
      })
      .then(() => {
        setStatusSimpan((prev) => ({
          ...prev,
          [idPertanyaan]: 'saved',
        }));
      })
      .catch(() => {
        setStatusSimpan((prev) => ({
          ...prev,
          [idPertanyaan]: 'error',
        }));
      });
  };

  const handleFinish = async () => {
    if (!semuaTerjawab || submittingFinish) {
      return;
    }
    const code = localStorage.getItem('survey_pin');
    if (!code) {
      navigate('/', { replace: true });
      return;
    }

    try {
      setSubmittingFinish(true);
      setError('');
      const response = await axiosClient.post('/pengaturan/code_management/finish', { code });
      localStorage.removeItem('survey_pin');
      navigate('/survey/selesai', { state: { hasilSurvei: response.data } });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Gagal menyelesaikan survei. Silakan coba lagi.',
      );
    } finally {
      setSubmittingFinish(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center px-4 py-16">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Memuat pertanyaan survei...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Pengisian Survei
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Silakan baca setiap pernyataan dan pilih jawaban yang paling sesuai
            dengan kebiasaan Anda.
          </p>
        </div>

        {error && (
          <div className="mb-4">
            <Alert
              type="error"
              message={error}
              onClose={() => setError('')}
            />
          </div>
        )}

        <div className="mb-4 sm:mb-6 flex flex-wrap items-center justify-between gap-2">
          <div className="text-sm text-gray-600">
            Terjawab{' '}
            <span className="font-semibold">
              {totalTerjawab}/{totalPertanyaan}
            </span>
          </div>
          <div className="flex flex-wrap gap-2 text-xs sm:text-sm text-gray-500">
            {skalaOptions.map((opt) => (
              <div
                key={opt.value}
                className="flex items-center space-x-1 bg-white px-2 py-1 rounded-full border border-gray-200"
              >
                <span className="font-semibold text-gray-700">
                  {opt.value}
                </span>
                <span>{opt.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 lg:mt-6 lg:grid lg:grid-cols-[minmax(0,2.1fr)_minmax(0,1fr)] lg:gap-6 xl:gap-8">
          <div className="mb-6 lg:mb-0">
            {totalPertanyaan === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                <p className="text-sm text-gray-600">
                  Belum ada pertanyaan yang tersedia untuk survei ini.
                </p>
              </div>
            ) : (
              (() => {
                const safeIndex =
                  totalPertanyaan === 0
                    ? 0
                    : Math.min(currentIndex, totalPertanyaan - 1);
                const q = flatPertanyaan[safeIndex];
                const currentValue = jawaban[q.id];
                const status = statusSimpan[q.id];

                return (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                          Kategori
                        </p>
                        <p className="text-sm font-semibold text-gray-900">
                          {q.kategoriLabel || q.kategori || '-'}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">
                          Soal
                        </span>
                        <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                          {safeIndex + 1} / {totalPertanyaan}
                        </span>
                      </div>
                    </div>

                    <p className="text-sm sm:text-base text-gray-900 mb-4">
                      {q.isi_pertanyaan}
                    </p>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
                        {skalaOptions.map((opt) => {
                          const selected = currentValue === opt.value;
                          return (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => handleJawab(q.id, opt.value)}
                              className={
                                'px-3 py-2 rounded-md text-xs sm:text-sm font-medium border transition-colors ' +
                                (selected
                                  ? 'bg-blue-600 text-white border-blue-600'
                                  : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50')
                              }
                            >
                              <span className="font-semibold mr-1">
                                {opt.value}
                              </span>
                              <span>{opt.label}</span>
                            </button>
                          );
                        })}
                      </div>

                      <div className="text-xs sm:text-sm text-right">
                        {status === 'saving' && (
                          <span className="text-gray-500">
                            Menyimpan...
                          </span>
                        )}
                        {status === 'saved' && (
                          <span className="text-green-600">Tersimpan</span>
                        )}
                        {status === 'error' && (
                          <span className="text-red-600">
                            Gagal menyimpan. Coba lagi.
                          </span>
                        )}
                        {!status && currentValue && (
                          <span className="text-gray-400">
                            Menunggu konfirmasi
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-6 flex flex-col sm:flex-row justify-between gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          setCurrentIndex((prev) =>
                            Math.max(0, prev - 1),
                          )
                        }
                        disabled={safeIndex === 0}
                        className={
                          'inline-flex justify-center items-center px-4 py-2 rounded-md text-sm font-medium border shadow-sm transition-colors ' +
                          (safeIndex === 0
                            ? 'bg-gray-200 text-gray-500 border-gray-200 cursor-not-allowed'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50')
                        }
                      >
                        Sebelumnya
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setCurrentIndex((prev) =>
                            Math.min(totalPertanyaan - 1, prev + 1),
                          )
                        }
                        disabled={safeIndex === totalPertanyaan - 1}
                        className={
                          'inline-flex justify-center items-center px-4 py-2 rounded-md text-sm font-medium border shadow-sm transition-colors ' +
                          (safeIndex === totalPertanyaan - 1
                            ? 'bg-gray-200 text-gray-500 border-gray-200 cursor-not-allowed'
                            : 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700')
                        }
                      >
                        Selanjutnya
                      </button>
                    </div>
                  </div>
                );
              })()
            )}
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-gray-900">
                  Navigasi Soal
                </h2>
                {totalPertanyaan > 0 && (
                  <span className="text-xs text-gray-500">
                    Soal {Math.min(currentIndex + 1, totalPertanyaan)} dari{' '}
                    {totalPertanyaan}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2">
                {flatPertanyaan.map((q, index) => {
                  const answered = jawaban[q.id] !== undefined;
                  const isActive = index === Math.min(currentIndex, Math.max(0, totalPertanyaan - 1));
                  const baseClass = answered
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300';
                  const activeRing = isActive ? ' ring-2 ring-blue-500' : '';

                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => setCurrentIndex(index)}
                      className={
                        'h-8 w-8 sm:h-9 sm:w-9 flex items-center justify-center rounded-md text-xs font-semibold border transition ' +
                        baseClass +
                        activeRing
                      }
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>

              <div className="mt-3 text-xs text-gray-500 space-y-1">
                <p>
                  <span className="inline-block h-3 w-3 rounded-sm bg-blue-600 mr-2" />
                  Sudah dijawab
                </p>
                <p>
                  <span className="inline-block h-3 w-3 rounded-sm border border-gray-300 mr-2" />
                  Belum dijawab
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-5">
              <p className="text-sm text-gray-600 mb-3">
                Pastikan semua pertanyaan sudah terjawab sebelum
                menyelesaikan survei.
              </p>
              <button
                type="button"
                onClick={handleFinish}
                disabled={!semuaTerjawab || submittingFinish}
                className={
                  'w-full inline-flex justify-center items-center px-6 py-3 rounded-md text-sm font-semibold shadow-sm border transition-colors ' +
                  (!semuaTerjawab || submittingFinish
                    ? 'bg-gray-300 text-gray-600 border-gray-300 cursor-not-allowed'
                    : 'bg-green-600 text-white border-green-600 hover:bg-green-700')
                }
              >
                {submittingFinish ? 'Menyelesaikan...' : 'Selesaikan Survei'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IsiSurvey;
