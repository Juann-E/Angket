import React, { useEffect, useState } from 'react';
import axiosClient from '../../api/axiosClient';

const LaporanHasil = () => {
  const [sekolahList, setSekolahList] = useState([]);
  const [kejuruanList, setKejuruanList] = useState([]);
  const [kelasList, setKelasList] = useState([]);

  const [selectedSekolah, setSelectedSekolah] = useState('');
  const [selectedKejuruan, setSelectedKejuruan] = useState('');
  const [selectedKelas, setSelectedKelas] = useState('');

  const [loadingFilter, setLoadingFilter] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [loadingTable, setLoadingTable] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [error, setError] = useState('');
  const [tableMessage, setTableMessage] = useState('');

  useEffect(() => {
    const fetchSekolah = async () => {
      try {
        setLoadingFilter(true);
        setError('');
        const sekolahRes = await axiosClient.get(
          '/pengaturan/pelajar_regis/sekolah'
        );
        setSekolahList(sekolahRes.data || []);
      } catch (err) {
        const message =
          err.response?.data?.message ||
          'Gagal memuat data sekolah. Silakan coba lagi.';
        setError(message);
      } finally {
        setLoadingFilter(false);
      }
    };

    fetchSekolah();
  }, []);

  const handleSekolahChange = async (e) => {
    const value = e.target.value;
    setSelectedSekolah(value);
    setSelectedKejuruan('');
    setSelectedKelas('');
    setKejuruanList([]);
    setKelasList([]);

    if (!value) {
      return;
    }

    try {
      setLoadingFilter(true);
      setError('');
      const kejuruanRes = await axiosClient.get(
        '/pengaturan/pelajar_regis/kejuruan',
        {
          params: { id_sekolah: value },
        }
      );
      setKejuruanList(kejuruanRes.data || []);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        'Gagal memuat data kejuruan. Silakan coba lagi.';
      setError(message);
    } finally {
      setLoadingFilter(false);
    }
  };

  const handleKejuruanChange = async (e) => {
    const value = e.target.value;
    setSelectedKejuruan(value);
    setSelectedKelas('');
    setKelasList([]);

    if (!value) {
      return;
    }

    try {
      setLoadingFilter(true);
      setError('');
      const kelasRes = await axiosClient.get(
        '/pengaturan/pelajar_regis/kelas',
        {
          params: { id_kejuruan: value },
        }
      );
      setKelasList(kelasRes.data || []);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        'Gagal memuat data kelas. Silakan coba lagi.';
      setError(message);
    } finally {
      setLoadingFilter(false);
    }
  };

  const handleKelasChange = (e) => {
    setSelectedKelas(e.target.value);
  };

  const downloadExcel = async () => {
    try {
      setDownloading(true);
      setError('');
      const response = await axiosClient.get(
        '/pendataan/export_hasil/excel',
        {
          params: {
            id_sekolah: selectedSekolah || '',
            id_kejuruan: selectedKejuruan || '',
            id_kelas: selectedKelas || '',
          },
          responseType: 'blob',
        }
      );

      const url = window.URL.createObjectURL(
        new Blob([response.data])
      );
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'hasil_survey.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Gagal mengunduh Excel', err);
      setError(
        err.response?.data?.message ||
          'Gagal mengunduh data laporan.'
      );
      alert('Gagal mengunduh data laporan.');
    } finally {
      setDownloading(false);
    }
  };

  useEffect(() => {
    const fetchTableData = async () => {
      try {
        setLoadingTable(true);
        setTableMessage('');
        setError('');

        const response = await axiosClient.get(
          '/pendataan/export_hasil/data',
          {
            params: {
              id_sekolah: selectedSekolah || '',
              id_kejuruan: selectedKejuruan || '',
              id_kelas: selectedKelas || '',
            },
          }
        );

        const data = Array.isArray(response.data)
          ? response.data
          : response.data?.data || [];

        if (!data.length) {
          setTableMessage(
            'Belum ada data hasil survei untuk filter yang dipilih.'
          );
        }

        setTableData(data);
      } catch (err) {
        if (err.response?.status === 404) {
          setTableData([]);
          setTableMessage(
            'Belum ada data atau API sedang disiapkan.'
          );
        } else {
          setTableData([]);
          setTableMessage(
            'Gagal memuat data laporan. Silakan coba lagi.'
          );
          setError(
            err.response?.data?.message ||
              'Gagal memuat data laporan.'
          );
        }
      } finally {
        setLoadingTable(false);
      }
    };

    fetchTableData();
  }, [selectedSekolah, selectedKejuruan, selectedKelas]);

  const getNamaSiswa = (row) =>
    row.nama_pelajar ||
    row.nama_siswa ||
    row.nama ||
    '-';

  const getNamaKelas = (row) =>
    row.nama_kelas ||
    row.kelas_nama ||
    row.kelas ||
    row.kelas_label ||
    '-';

  const getSkorTotal = (row) =>
    row.skor_total ||
    row.total_skor ||
    row.total_score ||
    row.nilai_total ||
    row.score ||
    '-';

  const getKategoriSDL = (row) =>
    row.level_sdness ||
    row.kategori_sdl ||
    row.sdl_kategori ||
    row.sdl_category ||
    row.level_sdl ||
    row.sdl_level ||
    '-';

  const getKategoriSDLInfo = (row) => {
    const label = getKategoriSDL(row);
    const normalized = (label || '').toString().toLowerCase().trim();

    if (!normalized || label === '-') {
      return {
        label: '-',
        className: 'bg-gray-100 text-gray-800',
      };
    }

    if (normalized.includes('low') || normalized.includes('rendah')) {
      return {
        label,
        className: 'bg-red-100 text-red-800',
      };
    }

    if (normalized.includes('moderate') || normalized.includes('sedang')) {
      return {
        label,
        className: 'bg-yellow-100 text-yellow-800',
      };
    }

    if (normalized.includes('high') || normalized.includes('tinggi')) {
      return {
        label,
        className: 'bg-green-100 text-green-800',
      };
    }

    return {
      label,
      className: 'bg-gray-100 text-gray-800',
    };
  };

  const getWaktuSelesai = (row) => {
    const raw =
      row.diselesaikan_pada ||
      row.waktu_selesai ||
      row.completed_at ||
      row.finished_at;

    if (!raw) {
      return '-';
    }

    const date = new Date(raw);
    if (Number.isNaN(date.getTime())) {
      return '-';
    }

    return date.toLocaleString('id-ID');
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Laporan Hasil Survei SDL
        </h1>
        <p className="text-sm text-gray-600">
          Gunakan filter berikut untuk melihat ringkasan hasil survei dan
          mengunduh laporan dalam bentuk file Excel.
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 lg:flex-1">
          <div>
            <label
              htmlFor="filter_sekolah"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Pilih Sekolah
            </label>
            <select
              id="filter_sekolah"
              value={selectedSekolah}
              onChange={handleSekolahChange}
              disabled={loadingFilter || sekolahList.length === 0}
              className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">
                Semua Sekolah
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
              htmlFor="filter_kejuruan"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Pilih Kejuruan
            </label>
            <select
              id="filter_kejuruan"
              value={selectedKejuruan}
              onChange={handleKejuruanChange}
              disabled={
                loadingFilter ||
                !selectedSekolah ||
                kejuruanList.length === 0
              }
              className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">
                {selectedSekolah ? 'Semua Kejuruan' : 'Pilih sekolah terlebih dahulu'}
              </option>
              {kejuruanList.map((kejuruan) => (
                <option key={kejuruan.id} value={kejuruan.id}>
                  {kejuruan.nama_kejuruan}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="filter_kelas"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Pilih Kelas
            </label>
            <select
              id="filter_kelas"
              value={selectedKelas}
              onChange={handleKelasChange}
              disabled={
                loadingFilter ||
                !selectedKejuruan ||
                kelasList.length === 0
              }
              className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">
                {selectedKejuruan ? 'Semua Kelas' : 'Pilih kejuruan terlebih dahulu'}
              </option>
              {kelasList.map((kelas) => (
                <option key={kelas.id} value={kelas.id}>
                  {kelas.nama_kelas}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-start lg:justify-end">
          <button
            type="button"
            onClick={downloadExcel}
            disabled={downloading}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-green-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {downloading ? 'Mengunduh...' : '📥 Download Laporan Excel'}
          </button>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900">
            Ringkasan Hasil Survei
          </h2>
          {loadingTable && (
            <p className="text-xs text-gray-500">
              Memuat data...
            </p>
          )}
        </div>

        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  No
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama Siswa
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kelas
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Skor Total
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kategori SDL
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Waktu Selesai
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tableData.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-4 py-6 text-center text-sm text-gray-500"
                  >
                    {tableMessage ||
                      'Belum ada data hasil survei untuk ditampilkan.'}
                  </td>
                </tr>
              ) : (
                tableData.map((row, index) => (
                  <tr key={row.id || index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {index + 1}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {getNamaSiswa(row)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {getNamaKelas(row)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {getSkorTotal(row)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      {(() => {
                        const info = getKategoriSDLInfo(row);
                        return (
                          <span
                            className={
                              'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ' +
                              info.className
                            }
                          >
                            {info.label}
                          </span>
                        );
                      })()}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {getWaktuSelesai(row)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LaporanHasil;
