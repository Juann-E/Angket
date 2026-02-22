import React, { useEffect, useState } from 'react';
import axiosClient from '../../api/axiosClient';
import Alert from '../../components/common/Alert';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import {
  PieChart,
  Pie,
  Tooltip,
  Legend,
  Cell,
  ResponsiveContainer,
} from 'recharts';

const Dashboard = () => {
  const [totalSekolah, setTotalSekolah] = useState(0);
  const [totalSiswa, setTotalSiswa] = useState(0);
  const [totalSurveiSelesai, setTotalSurveiSelesai] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError('');

        const [sekolahRes, siswaRes, exportRes] = await Promise.all([
          axiosClient.get('/pengaturan/pelajar_regis/sekolah'),
          axiosClient.get('/pengaturan/pelajar_regis/find_all'),
          axiosClient.get('/pendataan/export_hasil/data'),
        ]);

        const sekolahData = sekolahRes.data || [];
        const siswaData = siswaRes.data || [];

        const sekolahCount = Array.isArray(sekolahData)
          ? sekolahData.length
          : 0;
        const siswaCount = Array.isArray(siswaData) ? siswaData.length : 0;

        const surveiSelesaiCount = Array.isArray(siswaData)
          ? siswaData.filter((siswa) => {
              const rawStatus =
                (siswa.status ||
                  siswa.status_survei ||
                  siswa.status_isi ||
                  siswa.progress_status ||
                  ''
                )
                  .toString()
                  .toLowerCase();

              if (!rawStatus) {
                return false;
              }

              return (
                rawStatus.includes('selesai') ||
                rawStatus.includes('finish') ||
                rawStatus.includes('complete')
              );
            }).length
          : 0;

        const rawExportData = Array.isArray(exportRes.data)
          ? exportRes.data
          : exportRes.data?.data || [];

        let lowCount = 0;
        let moderateCount = 0;
        let highCount = 0;

        rawExportData.forEach((row) => {
          const kategori =
            row.level_sdness ||
            row.kategori_sdl ||
            row.sdl_kategori ||
            row.sdl_category ||
            row.level_sdl ||
            row.sdl_level ||
            '';

          const normalizedKategori = kategori
            .toString()
            .toLowerCase()
            .trim();

          if (!normalizedKategori) {
            return;
          }

          if (
            normalizedKategori.includes('low') ||
            normalizedKategori.includes('rendah')
          ) {
            lowCount += 1;
            return;
          }

          if (
            normalizedKategori.includes('moderate') ||
            normalizedKategori.includes('sedang')
          ) {
            moderateCount += 1;
            return;
          }

          if (
            normalizedKategori.includes('high') ||
            normalizedKategori.includes('tinggi')
          ) {
            highCount += 1;
          }
        });

        const sdlChartData = [
          { name: 'Low', value: lowCount, fill: '#ef4444' },
          { name: 'Moderate', value: moderateCount, fill: '#f59e0b' },
          { name: 'High', value: highCount, fill: '#10b981' },
        ];

        setTotalSekolah(sekolahCount);
        setTotalSiswa(siswaCount);
        setTotalSurveiSelesai(surveiSelesaiCount);
        setChartData(sdlChartData);
      } catch (err) {
        const message =
          err.response?.data?.message ||
          'Gagal memuat data dashboard. Pastikan Backend NestJS sudah berjalan.';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const totalResponden = chartData.reduce(
    (sum, item) => sum + (item.value || 0),
    0
  );

  const hasChartData = chartData.some((item) => item.value > 0);

  const formatNumber = (value) =>
    typeof value === 'number' ? value.toLocaleString('id-ID') : '-';

  if (loading && !chartData.length && !totalSekolah && !totalSiswa) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Selamat Datang di Panel Admin SDL Check
          </h1>
          <p className="text-sm text-gray-600">
            Memuat ringkasan data dashboard...
          </p>
        </div>
        <LoadingSpinner message="Mengambil data dashboard..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Selamat Datang di Panel Admin SDL Check
          </h1>
          <p className="text-sm text-gray-600">
            Gunakan menu di sebelah kiri untuk mengelola data sekolah, peserta,
            dan melihat laporan hasil survei kemandirian belajar siswa.
          </p>
          {loading && (
            <p className="mt-2 text-xs text-gray-500">
              Memuat ringkasan data dashboard...
            </p>
          )}
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-lg border border-blue-100 bg-blue-50 p-5">
            <div className="flex items-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                <svg
                  className="h-5 w-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 17v2a1 1 0 001 1h8m-9-3H7a2 2 0 01-2-2V5a2 2 0 012-2h7.586a1 1 0 01.707.293l3.414 3.414A1 1 0 0120 7.414V14a2 2 0 01-2 2h-2m-7 1h3"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-xs font-medium uppercase tracking-wide text-blue-700">
                  Total Sekolah
                </p>
                {loading ? (
                  <div className="mt-2 h-6 w-16 rounded-md bg-blue-100 animate-pulse" />
                ) : (
                  <p className="mt-1 text-2xl font-bold text-blue-900">
                    {formatNumber(totalSekolah)}
                  </p>
                )}
                <p className="mt-1 text-xs text-blue-700/80">
                  Sekolah yang sudah terdaftar di sistem
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-green-100 bg-green-50 p-5">
            <div className="flex items-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                <svg
                  className="h-5 w-5 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a4 4 0 00-3-3.87M9 10a4 4 0 11-8 0 4 4 0 018 0zm8-4a4 4 0 11-8 0 4 4 0 018 0zM9 16a6 6 0 016 6H3a6 6 0 016-6zm8-2a4 4 0 014 4v2h-4"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-xs font-medium uppercase tracking-wide text-green-700">
                  Total Siswa
                </p>
                {loading ? (
                  <div className="mt-2 h-6 w-20 rounded-md bg-green-100 animate-pulse" />
                ) : (
                  <p className="mt-1 text-2xl font-bold text-green-900">
                    {formatNumber(totalSiswa)}
                  </p>
                )}
                <p className="mt-1 text-xs text-green-700/80">
                  Peserta yang memiliki kode akses survei
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-purple-100 bg-purple-50 p-5">
            <div className="flex items-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                <svg
                  className="h-5 w-5 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-xs font-medium uppercase tracking-wide text-purple-700">
                  Survei Selesai
                </p>
                {loading ? (
                  <div className="mt-2 h-6 w-24 rounded-md bg-purple-100 animate-pulse" />
                ) : (
                  <p className="mt-1 text-2xl font-bold text-purple-900">
                    {formatNumber(totalSurveiSelesai)}
                  </p>
                )}
                <p className="mt-1 text-xs text-purple-700/80">
                  Siswa yang sudah menyelesaikan seluruh butir instrumen
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div className="md:w-1/3 space-y-2">
            <h2 className="text-lg font-semibold text-gray-900">
              Distribusi Kategori SDL
            </h2>
            <p className="text-sm text-gray-600">
              Visualisasi jumlah siswa pada kategori Self-Directed Learning
              Low, Moderate, dan High.
            </p>
            <div className="mt-2 space-y-1 text-sm text-gray-700">
              <p>
                Total responden dengan hasil survei:
                <span className="ml-1 font-semibold">
                  {formatNumber(totalResponden)}
                </span>
              </p>
              <div className="space-y-1 text-xs text-gray-500">
                <p>
                  <span className="inline-block h-3 w-3 rounded-sm mr-2 bg-red-500" />
                  Low: {formatNumber(chartData[0]?.value || 0)} siswa
                </p>
                <p>
                  <span className="inline-block h-3 w-3 rounded-sm mr-2 bg-amber-500" />
                  Moderate: {formatNumber(chartData[1]?.value || 0)} siswa
                </p>
                <p>
                  <span className="inline-block h-3 w-3 rounded-sm mr-2 bg-emerald-500" />
                  High: {formatNumber(chartData[2]?.value || 0)} siswa
                </p>
              </div>
            </div>
          </div>

          <div className="md:w-2/3 h-72">
            {loading && !hasChartData ? (
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
                  <p className="text-sm text-gray-500">
                    Menyiapkan visualisasi hasil survei...
                  </p>
                </div>
              </div>
            ) : hasChartData ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    stroke="#ffffff"
                    strokeWidth={2}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [
                      `${value} siswa`,
                      name,
                    ]}
                  />
                  <Legend
                    verticalAlign="bottom"
                    align="center"
                    iconType="circle"
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center">
                <p className="text-sm text-gray-500">
                  Belum ada data hasil survei untuk divisualisasikan.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
