import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Alert from '../../components/common/Alert';

const Sekolah = () => {
  const [sekolahList, setSekolahList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentSekolah, setCurrentSekolah] = useState(null);
  const [formData, setFormData] = useState({ nama_sekolah: '' });

  // Fetch schools
  useEffect(() => {
    fetchSekolah();
  }, []);

  const fetchSekolah = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get('/sekolah');
      setSekolahList(response.data);
      setError('');
    } catch (err) {
      setError('Gagal mengambil data sekolah. Pastikan Backend NestJS sudah berjalan.');
      console.error('Error fetching schools:', err);
    } finally {
      setLoading(false);
    }
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
        // Update existing school
        await axiosClient.patch(`/sekolah/${currentSekolah.id}`, formData);
      } else {
        // Create new school
        await axiosClient.post('/sekolah', formData);
      }
      
      setShowModal(false);
      setFormData({ nama_sekolah: '' });
      fetchSekolah(); // Refresh data
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                          (isEditing ? 'Gagal memperbarui sekolah.' : 'Gagal menambahkan sekolah.');
      setError(errorMessage);
      console.error(isEditing ? 'Error updating school:' : 'Error creating school:', err);
    }
  };

  const handleEdit = (sekolah) => {
    setCurrentSekolah(sekolah);
    setFormData({ nama_sekolah: sekolah.nama_sekolah });
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus?')) {
      try {
        await axiosClient.delete(`/sekolah/${id}`);
        fetchSekolah(); // Refresh data
      } catch (err) {
        setError('Gagal menghapus sekolah.');
        console.error('Error deleting school:', err);
      }
    }
  };

  const openCreateModal = () => {
    setIsEditing(false);
    setCurrentSekolah(null);
    setFormData({ nama_sekolah: '' });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({ nama_sekolah: '' });
    setCurrentSekolah(null);
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="p-6">
        <LoadingSpinner message="Memuat data sekolah..." />
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Data Sekolah</h1>
          <p className="mt-1 text-sm text-gray-500">
            Kelola data sekolah dalam sistem
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          + Tambah Sekolah
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-4">
          <Alert type="error" message={error} onClose={() => setError('')} />
        </div>
      )}

      {/* Schools Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
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
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sekolahList.length === 0 ? (
                <tr>
                  <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-500">
                    Belum ada data sekolah
                  </td>
                </tr>
              ) : (
                sekolahList.map((sekolah, index) => (
                  <tr key={sekolah.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {sekolah.nama_sekolah}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(sekolah)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(sekolah.id)}
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
                      {isEditing ? 'Edit Sekolah' : 'Tambah Sekolah Baru'}
                    </h3>
                    <div className="mt-2">
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                          <label htmlFor="nama_sekolah" className="block text-sm font-medium text-gray-700 mb-1">
                            Nama Sekolah
                          </label>
                          <input
                            type="text"
                            id="nama_sekolah"
                            name="nama_sekolah"
                            required
                            value={formData.nama_sekolah}
                            onChange={handleInputChange}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="Masukkan nama sekolah"
                          />
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

export default Sekolah;