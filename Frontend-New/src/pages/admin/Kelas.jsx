import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Alert from '../../components/common/Alert';

const Kelas = () => {
  const [kelasList, setKelasList] = useState([]);
  const [sekolahList, setSekolahList] = useState([]);
  const [kejuruanList, setKejuruanList] = useState([]);
  const [selectedSekolah, setSelectedSekolah] = useState('');
  const [selectedKejuruan, setSelectedKejuruan] = useState('');
  const [filterSekolah, setFilterSekolah] = useState('');
  const [filterKejuruan, setFilterKejuruan] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentKelas, setCurrentKelas] = useState(null);
  const [formData, setFormData] = useState({ nama_kelas: '' });
  const [fetchingSekolah, setFetchingSekolah] = useState(false);
  const [fetchingKejuruan, setFetchingKejuruan] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchSekolahList();
    fetchAllKejuruan();
    fetchKelas();
  }, []);

  const fetchSekolahList = async () => {
    try {
      setFetchingSekolah(true);
      const response = await axiosClient.get('/sekolah');
      setSekolahList(response.data);
    } catch (err) {
      setError('Gagal mengambil data sekolah. Pastikan Backend NestJS sudah berjalan.');
      console.error('Error fetching schools:', err);
    } finally {
      setFetchingSekolah(false);
    }
  };

  const fetchAllKejuruan = async () => {
    try {
      setFetchingKejuruan(true);
      const response = await axiosClient.get('/kejuruan');
      setKejuruanList(response.data);
    } catch (err) {
      setError('Gagal mengambil data kejuruan. Pastikan Backend NestJS sudah berjalan.');
      console.error('Error fetching kejuruan:', err);
    } finally {
      setFetchingKejuruan(false);
    }
  };

  const fetchKelas = async (idKejuruan) => {
    try {
      setLoading(true);
      const response = await axiosClient.get('/kelas', {
        params: idKejuruan ? { id_kejuruan: idKejuruan } : {},
      });
      setKelasList(response.data);
      setError('');
    } catch (err) {
      setError('Gagal mengambil data kelas. Pastikan Backend NestJS sudah berjalan.');
      console.error('Error fetching kelas:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKelas(filterKejuruan || undefined);
    setCurrentPage(1);
  }, [filterKejuruan]);

  const handleSekolahChange = (e) => {
    setSelectedSekolah(e.target.value);
    setSelectedKejuruan('');
  };

  const handleKejuruanChange = (e) => {
    setSelectedKejuruan(e.target.value);
  };

  const handleFilterSekolahChange = (e) => {
    setFilterSekolah(e.target.value);
    setFilterKejuruan('');
    setCurrentPage(1);
  };

  const handleFilterKejuruanChange = (e) => {
    setFilterKejuruan(e.target.value);
    setCurrentPage(1);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (isEditing) {
        await axiosClient.patch(`/kelas/${currentKelas.id}`, {
          ...formData,
          id_kejuruan: selectedKejuruan
        });
      } else {
        await axiosClient.post('/kelas', {
          ...formData,
          id_kejuruan: selectedKejuruan
        });
      }
      
      setShowModal(false);
      setFormData({ nama_kelas: '' });
      fetchKelas(filterKejuruan || undefined);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                          (isEditing ? 'Gagal memperbarui kelas.' : 'Gagal menambahkan kelas.');
      setError(errorMessage);
      console.error(isEditing ? 'Error updating kelas:' : 'Error creating kelas:', err);
    }
  };

  const handleEdit = (kelas) => {
    setCurrentKelas(kelas);
    setFormData({ nama_kelas: kelas.nama_kelas });
    setSelectedKejuruan(kelas.id_kejuruan ? String(kelas.id_kejuruan) : '');
    const kejuruan = kejuruanList.find(
      (k) => k.id === kelas.id_kejuruan || k.id === Number(kelas.id_kejuruan)
    );
    setSelectedSekolah(kejuruan?.id_sekolah ? String(kejuruan.id_sekolah) : '');
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus?')) {
      try {
        await axiosClient.delete(`/kelas/${id}`);
        fetchKelas(filterKejuruan || undefined);
      } catch (err) {
        setError('Gagal menghapus kelas.');
        console.error('Error deleting kelas:', err);
      }
    }
  };

  const openCreateModal = () => {
    setIsEditing(false);
    setCurrentKelas(null);
    setFormData({ nama_kelas: '' });
    setSelectedSekolah('');
    setSelectedKejuruan('');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({ nama_kelas: '' });
    setCurrentKelas(null);
    setIsEditing(false);
  };

  const ITEMS_PER_PAGE = 10;
  const normalizedQuery = searchQuery.toLowerCase();
  const filteredKelas = kelasList.filter((kelas) => {
    const kejuruan = kejuruanList.find(
      (k) => k.id === kelas.id_kejuruan || k.id === Number(kelas.id_kejuruan)
    );
    const sekolah = kejuruan
      ? sekolahList.find(
          (s) => s.id === kejuruan.id_sekolah || s.id === Number(kejuruan.id_sekolah)
        )
      : null;
    if (filterSekolah) {
      if (!sekolah || String(sekolah.id) !== String(filterSekolah)) {
        return false;
      }
    }
    if (filterKejuruan) {
      if (!kejuruan || String(kejuruan.id) !== String(filterKejuruan)) {
        return false;
      }
    }
    const namaSekolah = (sekolah?.nama_sekolah || '').toLowerCase();
    const namaKejuruan = (kejuruan?.nama_kejuruan || '').toLowerCase();
    const namaKelas = (kelas.nama_kelas || '').toLowerCase();
    if (!normalizedQuery) {
      return true;
    }
    return (
      namaSekolah.includes(normalizedQuery) ||
      namaKejuruan.includes(normalizedQuery) ||
      namaKelas.includes(normalizedQuery)
    );
  });
  const totalPages = Math.max(1, Math.ceil(filteredKelas.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * ITEMS_PER_PAGE;
  const paginatedKelas = filteredKelas.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const from = filteredKelas.length === 0 ? 0 : startIndex + 1;
  const to = Math.min(startIndex + ITEMS_PER_PAGE, filteredKelas.length);

  if (fetchingSekolah) {
    return (
      <div className="p-6">
        <LoadingSpinner message="Memuat data sekolah..." />
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Data Kelas</h1>
            <p className="mt-1 text-sm text-gray-500">
              Kelola data kelas berdasarkan kejuruan
            </p>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full lg:w-auto">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full lg:max-w-2xl">
              <select
                value={filterSekolah}
                onChange={handleFilterSekolahChange}
                className="w-full sm:w-48 max-w-xs px-3 py-1.5 border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-900"
              >
                <option value="">Semua Sekolah</option>
                {sekolahList.map((sekolah) => (
                  <option key={sekolah.id} value={sekolah.id}>
                    {sekolah.nama_sekolah}
                  </option>
                ))}
              </select>
              <select
                value={filterKejuruan}
                onChange={handleFilterKejuruanChange}
                disabled={!filterSekolah}
                className={`w-full sm:w-52 max-w-xs px-3 py-1.5 border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-900 ${
                  !filterSekolah ? 'bg-gray-100 cursor-not-allowed' : ''
                }`}
              >
                <option value="">
                  {filterSekolah ? 'Semua Kejuruan' : 'Pilih sekolah terlebih dahulu'}
                </option>
                {kejuruanList
                  .filter((kejuruan) =>
                    filterSekolah
                      ? kejuruan.id_sekolah === Number(filterSekolah) ||
                        kejuruan.id_sekolah === filterSekolah
                      : true
                  )
                  .map((kejuruan) => (
                    <option key={kejuruan.id} value={kejuruan.id}>
                      {kejuruan.nama_kejuruan}
                    </option>
                  ))}
              </select>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Cari berdasarkan sekolah, kejuruan, atau kelas..."
                className="w-full sm:w-64 max-w-xs px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
            <button
              onClick={openCreateModal}
              className="inline-flex items-center justify-center px-4 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-auto"
            >
              <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Tambah Kelas
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4">
            <Alert type="error" message={error} onClose={() => setError('')} />
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  No
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama Sekolah
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama Kejuruan
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama Kelas
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredKelas.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                    Belum ada data kelas
                  </td>
                </tr>
              ) : (
                paginatedKelas.map((kelas, index) => (
                  <tr key={kelas.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {startIndex + index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {(() => {
                        const kejuruan = kejuruanList.find(
                          (k) => k.id === kelas.id_kejuruan || k.id === Number(kelas.id_kejuruan)
                        );
                        const sekolah = kejuruan
                          ? sekolahList.find(
                              (s) =>
                                s.id === kejuruan.id_sekolah || s.id === Number(kejuruan.id_sekolah)
                            )
                          : null;
                        return sekolah?.nama_sekolah || '-';
                      })()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {(() => {
                        const kejuruan = kejuruanList.find(
                          (k) => k.id === kelas.id_kejuruan || k.id === Number(kelas.id_kejuruan)
                        );
                        return kejuruan?.nama_kejuruan || '-';
                      })()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {kelas.nama_kelas}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(kelas)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(kelas.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between px-2 sm:px-0 py-4 border-t border-gray-100 mt-2">
          <p className="text-sm text-gray-600 mb-3 sm:mb-0">
            Menampilkan {from}-{to} dari {filteredKelas.length} data
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
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={safePage === totalPages}
              className={`px-3 py-1 text-sm border border-gray-300 rounded-r-md ${
                safePage === totalPages && filteredKelas.length > 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Modal for Create/Edit */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
            
            <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md sm:align-middle">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 w-full sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                      {isEditing ? 'Edit Kelas' : 'Tambah Kelas Baru'}
                    </h3>
                    <div className="mt-2">
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                          <label htmlFor="nama_kelas" className="block text-sm font-medium text-gray-700 mb-1">
                            Nama Kelas
                          </label>
                          <input
                            type="text"
                            id="nama_kelas"
                            name="nama_kelas"
                            required
                            value={formData.nama_kelas}
                            onChange={handleInputChange}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="Masukkan nama kelas"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="modal-sekolah-select" className="block text-sm font-medium text-gray-700 mb-1">
                            Pilih Sekolah
                          </label>
                          <select
                            id="modal-sekolah-select"
                            value={selectedSekolah}
                            onChange={handleSekolahChange}
                            required
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          >
                            <option value="">Pilih Sekolah...</option>
                            {sekolahList.map((sekolah) => (
                              <option key={sekolah.id} value={sekolah.id}>
                                {sekolah.nama_sekolah}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label htmlFor="modal-kejuruan-select" className="block text-sm font-medium text-gray-700 mb-1">
                            Pilih Kejuruan
                          </label>
                          <select
                            id="modal-kejuruan-select"
                            value={selectedKejuruan}
                            onChange={handleKejuruanChange}
                            required
                            disabled={!selectedSekolah}
                            className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                              !selectedSekolah ? 'bg-gray-100 cursor-not-allowed' : ''
                            }`}
                          >
                            <option value="">Pilih Kejuruan...</option>
                            {kejuruanList
                              .filter((kejuruan) =>
                                selectedSekolah
                                  ? kejuruan.id_sekolah === Number(selectedSekolah) ||
                                    kejuruan.id_sekolah === selectedSekolah
                                  : true
                              )
                              .map((kejuruan) => (
                                <option key={kejuruan.id} value={kejuruan.id}>
                                  {kejuruan.nama_kejuruan}
                                </option>
                              ))}
                          </select>
                        </div>
                        
                        <div className="flex justify-end space-x-3 pt-4">
                          <button
                            type="button"
                            onClick={closeModal}
                            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            Batal
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            {isEditing ? 'Perbarui' : 'Simpan'}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Kelas;
