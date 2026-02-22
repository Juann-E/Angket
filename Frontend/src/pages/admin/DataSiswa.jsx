import React, { useEffect, useMemo, useState } from 'react';
import axiosClient from '../../api/axiosClient';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Alert from '../../components/common/Alert';

const ITEMS_PER_PAGE = 10;

const getStatusInfo = (siswa) => {
  const rawStatus =
    (siswa.status ||
      siswa.status_survei ||
      siswa.status_isi ||
      siswa.progress_status ||
      '').toString().toLowerCase();

  if (
    rawStatus.includes('selesai') ||
    rawStatus.includes('finish') ||
    rawStatus.includes('complete')
  ) {
    return {
      label: 'selesai',
      className: 'bg-green-100 text-green-800',
    };
  }

  if (
    rawStatus.includes('proses') ||
    rawStatus.includes('progress') ||
    rawStatus.includes('ongoing')
  ) {
    return {
      label: 'proses',
      className: 'bg-blue-100 text-blue-800',
    };
  }

  if (rawStatus) {
    return {
      label: 'proses',
      className: 'bg-blue-100 text-blue-800',
    };
  }

  return {
    label: 'belum',
    className: 'bg-red-100 text-red-800',
  };
};

const DataSiswa = () => {
  const [siswaList, setSiswaList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingSiswa, setEditingSiswa] = useState(null);
  const [editNama, setEditNama] = useState('');
  const [editAbsen, setEditAbsen] = useState('');
  const [sekolahList, setSekolahList] = useState([]);
  const [kejuruanList, setKejuruanList] = useState([]);
  const [kelasList, setKelasList] = useState([]);
  const [selectedSekolah, setSelectedSekolah] = useState('');
  const [selectedKejuruan, setSelectedKejuruan] = useState('');
  const [selectedKelas, setSelectedKelas] = useState('');
  const [loadingFilter, setLoadingFilter] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  useEffect(() => {
    const fetchSiswa = async () => {
      try {
        setLoading(true);
        setError('');
        setSuccess('');
        const response = await axiosClient.get(
          '/pengaturan/pelajar_regis/find_all',
          {
            params: {
              nama: debouncedSearch || undefined,
              id_sekolah: selectedSekolah || undefined,
              id_kelas: selectedKelas || undefined,
            },
          },
        );
        setSiswaList(response.data || []);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            'Gagal mengambil data siswa. Pastikan Backend NestJS sudah berjalan.',
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSiswa();

    DataSiswa.fetchSiswa = fetchSiswa;
  }, [debouncedSearch, selectedSekolah, selectedKelas]);

  useEffect(() => {
    const fetchSekolah = async () => {
      try {
        setLoadingFilter(true);
        setError('');
        const sekolahRes = await axiosClient.get(
          '/pengaturan/pelajar_regis/sekolah',
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

  const normalizedQuery = debouncedSearch.toLowerCase();

  const filteredSiswa = useMemo(() => {
    if (!normalizedQuery) {
      return siswaList;
    }

    return siswaList.filter((siswa) => {
      const nama = (siswa.nama_pelajar || siswa.nama || '')
        .toString()
        .toLowerCase();
      const absen = (siswa.nomor_absen || siswa.absen || '')
        .toString()
        .toLowerCase();
      const kelas =
        (siswa.nama_kelas ||
          siswa.kelas_nama ||
          siswa.kelas?.nama_kelas ||
          '')
          .toString()
          .toLowerCase();
      const kode =
        (siswa.access_code ||
          siswa.kode_akses?.code ||
          '')
          .toString()
          .toLowerCase();

      return (
        nama.includes(normalizedQuery) ||
        absen.includes(normalizedQuery) ||
        kelas.includes(normalizedQuery) ||
        kode.includes(normalizedQuery)
      );
    });
  }, [siswaList, normalizedQuery]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredSiswa.length / ITEMS_PER_PAGE),
  );
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * ITEMS_PER_PAGE;
  const paginatedSiswa = filteredSiswa.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );
  const from = filteredSiswa.length === 0 ? 0 : startIndex + 1;
  const to = Math.min(startIndex + ITEMS_PER_PAGE, filteredSiswa.length);

  const handleCopy = async (siswa) => {
    const kode =
      siswa?.access_code ||
      siswa?.kode_akses?.code ||
      '';
    if (!kode) {
      return;
    }
    if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(kode);
      setSuccess('Kode akses berhasil disalin.');
    } else {
      window.alert('Fitur salin kode tidak didukung di browser ini.');
    }
  };

  const handleDelete = async (siswa) => {
    const id = siswa.id_pelajar || siswa.id;
    if (!id) {
      window.alert('ID pelajar tidak ditemukan.');
      return;
    }

    const confirmed = window.confirm('Yakin ingin menghapus siswa ini?');
    if (!confirmed) {
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');
      await axiosClient.delete(`/pengaturan/pelajar_regis/${id}`);
      setSuccess('Data siswa berhasil dihapus.');
      if (typeof DataSiswa.fetchSiswa === 'function') {
        await DataSiswa.fetchSiswa();
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Gagal menghapus data siswa. Pastikan Backend NestJS sudah berjalan.',
      );
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (siswa) => {
    setEditingSiswa(siswa);
    setEditNama(siswa?.nama_pelajar || siswa?.nama || '');
    setEditAbsen(siswa?.nomor_absen || siswa?.absen || '');
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingSiswa) {
      return;
    }
    const id = editingSiswa.id_pelajar || editingSiswa.id;
    if (!id) {
      window.alert('ID pelajar tidak ditemukan.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');
      await axiosClient.patch(`/pengaturan/pelajar_regis/${id}`, {
        nama_pelajar: editNama,
        nomor_absen: editAbsen,
      });
      setShowEditModal(false);
      setEditingSiswa(null);
      setEditNama('');
      setEditAbsen('');
      setSuccess('Data siswa berhasil diperbarui.');
      if (typeof DataSiswa.fetchSiswa === 'function') {
        await DataSiswa.fetchSiswa();
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Gagal memperbarui data siswa. Pastikan Backend NestJS sudah berjalan.',
      );
    } finally {
      setLoading(false);
    }
  };

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
        },
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
      const kelasRes = await axiosClient.get('/pengaturan/pelajar_regis/kelas', {
        params: { id_kejuruan: value },
      });
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
    setCurrentPage(1);
  };

  const handleResetFilter = () => {
    setSelectedSekolah('');
    setSelectedKejuruan('');
    setSelectedKelas('');
    setKejuruanList([]);
    setKelasList([]);
    setSearchTerm('');
    setDebouncedSearch('');
    setCurrentPage(1);
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Data Siswa</h1>
            <p className="mt-1 text-sm text-gray-500">
              Menampilkan daftar seluruh siswa yang terdaftar dalam sistem
            </p>
          </div>
        </div>

        {success && (
          <div className="mb-4">
            <Alert
              type="success"
              message={success}
              onClose={() => setSuccess('')}
            />
          </div>
        )}

        {error && (
          <div className="mb-4">
            <Alert
              type="error"
              message={error}
              onClose={() => setError('')}
            />
          </div>
        )}

        <div className="mb-6 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:flex-1">
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
                <option value="">Semua Sekolah</option>
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
                  {selectedSekolah
                    ? 'Semua Kejuruan'
                    : 'Pilih sekolah terlebih dahulu'}
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
                  loadingFilter || !selectedKejuruan || kelasList.length === 0
                }
                className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">
                  {selectedKejuruan
                    ? 'Semua Kelas'
                    : 'Pilih kejuruan terlebih dahulu'}
                </option>
                {kelasList.map((kelas) => (
                  <option key={kelas.id} value={kelas.id}>
                    {kelas.nama_kelas}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="w-full sm:w-72">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pencarian Global
              </label>
              <input
                id="search_global_siswa"
                name="search_global_siswa"
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                }}
                placeholder="Cari nama, instansi, atau kode akses..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
            <div className="flex items-end">
              <button
                type="button"
                onClick={handleResetFilter}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Reset Filter
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-8">
              <LoadingSpinner message="Memuat data siswa..." />
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    No
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Identitas Siswa
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Asal Instansi
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Kode Akses
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSiswa.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      Belum ada data siswa
                    </td>
                  </tr>
                ) : (
                  paginatedSiswa.map((siswa, index) => {
                    const statusInfo = getStatusInfo(siswa);
                    const nama = siswa?.nama_pelajar || siswa?.nama || '-';
                    const absen = siswa?.nomor_absen || siswa?.absen || '-';
                    const identitas = `${nama} (Absen: ${absen})`;
                    const instansiParts = [
                      siswa?.nama_sekolah || siswa?.sekolah?.nama_sekolah || '',
                      siswa?.nama_kejuruan ||
                        siswa?.kejuruan?.nama_kejuruan ||
                        '',
                      siswa?.nama_kelas ||
                        siswa?.kelas_nama ||
                        siswa?.kelas?.nama_kelas ||
                        '',
                    ].filter(Boolean);
                    const asalInstansi =
                      instansiParts.length > 0
                        ? instansiParts.join(' | ')
                        : '-';
                    const kodeAkses =
                      siswa?.access_code ||
                      siswa?.kode_akses?.code ||
                      '-';
                    return (
                      <tr
                        key={
                          siswa.id_pelajar ||
                          siswa.id ||
                          `${siswa.nama_pelajar}-${index}`
                        }
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {startIndex + index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {identitas}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {asalInstansi}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono font-semibold text-gray-900">
                          {kodeAkses}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusInfo.className}`}
                          >
                            {statusInfo.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="inline-flex items-center space-x-3">
                            <button
                              type="button"
                              onClick={() => openEditModal(siswa)}
                              className="px-3 py-1 rounded-md text-xs font-medium bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(siswa)}
                              className="px-3 py-1 rounded-md text-xs font-medium bg-red-100 text-red-700 hover:bg-red-200"
                            >
                              Hapus
                            </button>
                            <button
                              type="button"
                              onClick={() => handleCopy(siswa)}
                              className="px-3 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-700 hover:bg-blue-200"
                            >
                              Copy Kode
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between px-2 sm:px-0 py-4 border-t border-gray-100 mt-2">
          <p className="text-sm text-gray-600 mb-3 sm:mb-0">
            Menampilkan {from}-{to} dari {filteredSiswa.length} data
          </p>
          <div className="inline-flex rounded-md shadow-sm">
            <button
              type="button"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={safePage === 1}
              className={`px-3 py-1 text-sm border border-gray-300 rounded-l-md ${
                safePage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }).map((_, index) => {
              const page = index + 1;
              const isActive = page === safePage;
              return (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 text-sm border-t border-b border-gray-300 ${
                    index === totalPages - 1 ? 'border-r' : ''
                  } ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              );
            })}
            <button
              type="button"
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={safePage === totalPages}
              className={`px-3 py-1 text-sm border border-gray-300 rounded-r-md ${
                safePage === totalPages && filteredSiswa.length > 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Edit Data Siswa
              </h3>
            </div>
            <form onSubmit={handleEditSubmit}>
              <div className="px-6 py-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Siswa
                  </label>
                  <input
                    type="text"
                    value={editNama}
                    onChange={(e) => setEditNama(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nomor Absen
                  </label>
                  <input
                    type="text"
                    value={editAbsen}
                    onChange={(e) => setEditAbsen(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                    required
                  />
                </div>
              </div>
              <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingSiswa(null);
                    setEditNama('');
                    setEditAbsen('');
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataSiswa;
