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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentKelas, setCurrentKelas] = useState(null);
  const [formData, setFormData] = useState({ nama_kelas: '' });
  const [fetchingSekolah, setFetchingSekolah] = useState(false);
  const [fetchingKejuruan, setFetchingKejuruan] = useState(false);

  // Fetch sekolah list
  useEffect(() => {
    fetchSekolahList();
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

  // Fetch kejuruan list when sekolah is selected
  useEffect(() => {
    if (selectedSekolah) {
      fetchKejuruanBySekolah(selectedSekolah);
    } else {
      setKejuruanList([]);
      setSelectedKejuruan('');
    }
  }, [selectedSekolah]);

  // Fetch kelas list when kejuruan is selected
  useEffect(() => {
    if (selectedKejuruan) {
      fetchKelasByKejuruan(selectedKejuruan);
    } else {
      setKelasList([]);
    }
  }, [selectedKejuruan]);

  const fetchKejuruanBySekolah = async (sekolahId) => {
    try {
      setFetchingKejuruan(true);
      const response = await axiosClient.get(`/kejuruan?id_sekolah=${sekolahId}`);
      setKejuruanList(response.data);
    } catch (err) {
      setError('Gagal mengambil data kejuruan. Pastikan Backend NestJS sudah berjalan.');
      console.error('Error fetching kejuruan:', err);
    } finally {
      setFetchingKejuruan(false);
    }
  };

  const fetchKelasByKejuruan = async (kejuruanId) => {
    try {
      setLoading(true);
      const response = await axiosClient.get(`/kelas?id_kejuruan=${kejuruanId}`);
      setKelasList(response.data);
      setError('');
    } catch (err) {
      setError('Gagal mengambil data kelas. Pastikan Backend NestJS sudah berjalan.');
      console.error('Error fetching kelas:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSekolahChange = (e) => {
    setSelectedSekolah(e.target.value);
    setSelectedKejuruan(''); // Reset kejuruan when sekolah changes
  };

  const handleKejuruanChange = (e) => {
    setSelectedKejuruan(e.target.value);
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
        // Update existing kelas
        await axiosClient.patch(`/kelas/${currentKelas.id}`, {
          ...formData,
          id_kejuruan: selectedKejuruan
        });
      } else {
        // Create new kelas
        await axiosClient.post('/kelas', {
          ...formData,
          id_kejuruan: selectedKejuruan
        });
      }
      
      setShowModal(false);
      setFormData({ nama_kelas: '' });
      fetchKelasByKejuruan(selectedKejuruan); // Refresh data
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
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus?')) {
      try {
        await axiosClient.delete(`/kelas/${id}`);
        fetchKelasByKejuruan(selectedKejuruan); // Refresh data
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
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({ nama_kelas: '' });
    setCurrentKelas(null);
    setIsEditing(false);
  };

  if (fetchingSekolah) {
    return (
      <div className="p-6">
        <LoadingSpinner message="Memuat data sekolah..." />
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      {/* Header */}
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Data Kelas</h1>
            <p className="mt-1 text-sm text-gray-500">
              Kelola data kelas berdasarkan kejuruan
            </p>
          </div>
        </div>

        {/* Filter Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label htmlFor="sekolah-select" className="block text-sm font-medium text-gray-700 mb-2">
              Pilih Sekolah
            </label>
            <select
              id="sekolah-select"
              value={selectedSekolah}
              onChange={handleSekolahChange}
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
            <label htmlFor="kejuruan-select" className="block text-sm font-medium text-gray-700 mb-2">
              Pilih Kejuruan
            </label>
            <select
              id="kejuruan-select"
              value={selectedKejuruan}
              onChange={handleKejuruanChange}
              disabled={!selectedSekolah || fetchingKejuruan}
              className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                !selectedSekolah || fetchingKejuruan ? 'bg-gray-100 cursor-not-allowed' : ''
              }`}
            >
              <option value="">Pilih Kejuruan...</option>
              {fetchingKejuruan ? (
                <option value="">Memuat kejuruan...</option>
              ) : (
                kejuruanList.map((kejuruan) => (
                  <option key={kejuruan.id} value={kejuruan.id}>
                    {kejuruan.nama_kejuruan}
                  </option>
                ))
              )}
            </select>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4">
            <Alert type="error" message={error} onClose={() => setError('')} />
          </div>
        )}

        {/* Content Area */}
        {!selectedKejuruan ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {!selectedSekolah 
                ? 'Silakan pilih sekolah dan kejuruan terlebih dahulu' 
                : 'Silakan pilih kejuruan terlebih dahulu'}
            </p>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-medium text-gray-900">
                  Kelas di {kejuruanList.find(k => k.id === parseInt(selectedKejuruan))?.nama_kejuruan}
                </h2>
                <p className="text-sm text-gray-500">
                  Sekolah: {sekolahList.find(s => s.id === parseInt(selectedSekolah))?.nama_sekolah}
                </p>
              </div>
              <button
                onClick={openCreateModal}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Tambah Kelas
              </button>
            </div>

            {/* Kelas Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      No
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
                  {kelasList.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-500">
                        Belum ada data kelas untuk kejuruan ini
                      </td>
                    </tr>
                  ) : (
                    kelasList.map((kelas, index) => (
                      <tr key={kelas.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {index + 1}
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
          </>
        )}
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
                        
                        <div className="bg-gray-50 p-4 rounded-md">
                          <p className="text-sm text-gray-600">
                            <strong>Sekolah:</strong> {sekolahList.find(s => s.id === parseInt(selectedSekolah))?.nama_sekolah}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            <strong>Kejuruan:</strong> {kejuruanList.find(k => k.id === parseInt(selectedKejuruan))?.nama_kejuruan}
                          </p>
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