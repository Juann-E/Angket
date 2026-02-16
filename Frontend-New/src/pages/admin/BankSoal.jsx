import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Alert from '../../components/common/Alert';

const BankSoal = () => {
  const [pertanyaanList, setPertanyaanList] = useState([]);
  const [sekolahList, setSekolahList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPertanyaan, setCurrentPertanyaan] = useState(null);
  const [formData, setFormData] = useState({ 
    id_sekolah: '',
    isi_pertanyaan: '', 
    kategori: 'Awareness',
    tipe_soal: 'pilihan_ganda',
    bobot_persentase: 1
  });
  const [fetchingSekolah, setFetchingSekolah] = useState(false);

  // Kategori options
  const kategoriOptions = [
    'Awareness',
    'Learning Strategies',
    'Evaluation',
    'Interpersonal Skills'
  ];

  // Tipe soal options
  const tipeSoalOptions = [
    'pilihan_ganda',
    'essay'
  ];

  // Get badge color based on kategori
  const getKategoriBadgeColor = (kategori) => {
    const colorMap = {
      'Awareness': 'bg-blue-100 text-blue-800',
      'Learning Strategies': 'bg-green-100 text-green-800',
      'Evaluation': 'bg-purple-100 text-purple-800',
      'Interpersonal Skills': 'bg-yellow-100 text-yellow-800'
    };
    return colorMap[kategori] || 'bg-gray-100 text-gray-800';
  };

  // Truncate long text
  const truncateText = (text, maxLength = 80) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // Fetch schools and questions
  useEffect(() => {
    fetchSekolahList();
    fetchPertanyaan();
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

  const fetchPertanyaan = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get('/pertanyaan');
      setPertanyaanList(response.data);
      setError('');
    } catch (err) {
      setError('Gagal mengambil data pertanyaan. Pastikan Backend NestJS sudah berjalan.');
      console.error('Error fetching questions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'bobot_persentase' ? parseFloat(value) : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (isEditing) {
        // Update existing question
        await axiosClient.patch(`/pertanyaan/${currentPertanyaan.id}`, {
          id_sekolah: parseInt(formData.id_sekolah),
          isi_pertanyaan: formData.isi_pertanyaan,
          kategori: formData.kategori,
          tipe_soal: formData.tipe_soal,
          bobot_persentase: formData.bobot_persentase
        });
      } else {
        // Create new question
        await axiosClient.post('/pertanyaan', {
          id_sekolah: parseInt(formData.id_sekolah),
          isi_pertanyaan: formData.isi_pertanyaan,
          kategori: formData.kategori,
          tipe_soal: formData.tipe_soal,
          bobot_persentase: formData.bobot_persentase
        });
      }
      
      setShowModal(false);
      setFormData({ 
        id_sekolah: '',
        isi_pertanyaan: '', 
        kategori: 'Awareness',
        tipe_soal: 'pilihan_ganda',
        bobot_persentase: 1
      });
      fetchPertanyaan(); // Refresh data
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                          (isEditing ? 'Gagal memperbarui pertanyaan.' : 'Gagal menambahkan pertanyaan.');
      setError(errorMessage);
      console.error(isEditing ? 'Error updating question:' : 'Error creating question:', err);
    }
  };

  const handleEdit = (pertanyaan) => {
    setCurrentPertanyaan(pertanyaan);
    setFormData({ 
      id_sekolah: pertanyaan.id_sekolah?.toString() || '',
      isi_pertanyaan: pertanyaan.isi_pertanyaan, 
      kategori: pertanyaan.kategori,
      tipe_soal: pertanyaan.tipe_soal,
      bobot_persentase: pertanyaan.bobot_persentase
    });
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus pertanyaan ini?')) {
      try {
        await axiosClient.delete(`/pertanyaan/${id}`);
        fetchPertanyaan(); // Refresh data
      } catch (err) {
        setError('Gagal menghapus pertanyaan.');
        console.error('Error deleting question:', err);
      }
    }
  };

  const openCreateModal = () => {
    setIsEditing(false);
    setCurrentPertanyaan(null);
    setFormData({ 
      id_sekolah: '',
      isi_pertanyaan: '', 
      kategori: 'Awareness',
      tipe_soal: 'pilihan_ganda',
      bobot_persentase: 1
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({ 
      id_sekolah: '',
      isi_pertanyaan: '', 
      kategori: 'Awareness',
      tipe_soal: 'pilihan_ganda',
      bobot_persentase: 1
    });
    setCurrentPertanyaan(null);
    setIsEditing(false);
  };

  if (loading || fetchingSekolah) {
    return (
      <div className="p-6">
        <LoadingSpinner message={fetchingSekolah ? "Memuat data sekolah..." : "Memuat data pertanyaan..."} />
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      {/* Header */}
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Bank Soal</h1>
            <p className="mt-1 text-sm text-gray-500">
              Kelola pertanyaan untuk survei evaluasi kemandirian belajar siswa
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Tambah Pertanyaan
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4">
            <Alert type="error" message={error} onClose={() => setError('')} />
          </div>
        )}

        {/* Questions Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  No
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sekolah
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kategori
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Isi Pertanyaan
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipe
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bobot
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pertanyaanList.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                    Belum ada pertanyaan dalam bank soal
                  </td>
                </tr>
              ) : (
                pertanyaanList.map((pertanyaan, index) => (
                  <tr key={pertanyaan.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {sekolahList.find(s => s.id === pertanyaan.id_sekolah)?.nama_sekolah || 'Sekolah tidak ditemukan'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getKategoriBadgeColor(pertanyaan.kategori)}`}>
                        {pertanyaan.kategori}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                      {truncateText(pertanyaan.isi_pertanyaan)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {pertanyaan.tipe_soal}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {pertanyaan.bobot_persentase}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(pertanyaan)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(pertanyaan.id)}
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
            
            <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 w-full sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                      {isEditing ? 'Edit Pertanyaan' : 'Tambah Pertanyaan Baru'}
                    </h3>
                    <div className="mt-2">
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                          <label htmlFor="id_sekolah" className="block text-sm font-medium text-gray-700 mb-1">
                            Pilih Sekolah <span className="text-red-500">*</span>
                          </label>
                          <select
                            id="id_sekolah"
                            name="id_sekolah"
                            required
                            value={formData.id_sekolah}
                            onChange={handleInputChange}
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
                          <label htmlFor="kategori" className="block text-sm font-medium text-gray-700 mb-1">
                            Kategori
                          </label>
                          <select
                            id="kategori"
                            name="kategori"
                            required
                            value={formData.kategori}
                            onChange={handleInputChange}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          >
                            {kategoriOptions.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        </div>
                        
                        <div>
                          <label htmlFor="tipe_soal" className="block text-sm font-medium text-gray-700 mb-1">
                            Tipe Soal
                          </label>
                          <select
                            id="tipe_soal"
                            name="tipe_soal"
                            required
                            value={formData.tipe_soal}
                            onChange={handleInputChange}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          >
                            {tipeSoalOptions.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        </div>
                        
                        <div>
                          <label htmlFor="bobot_persentase" className="block text-sm font-medium text-gray-700 mb-1">
                            Bobot Nilai
                          </label>
                          <input
                            type="number"
                            id="bobot_persentase"
                            name="bobot_persentase"
                            required
                            min="0.1"
                            step="0.1"
                            value={formData.bobot_persentase}
                            onChange={handleInputChange}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="Masukkan bobot nilai (contoh: 1.0)"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="isi_pertanyaan" className="block text-sm font-medium text-gray-700 mb-1">
                            Isi Pertanyaan
                          </label>
                          <textarea
                            id="isi_pertanyaan"
                            name="isi_pertanyaan"
                            required
                            rows="4"
                            value={formData.isi_pertanyaan}
                            onChange={handleInputChange}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="Masukkan pertanyaan survei..."
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

export default BankSoal;