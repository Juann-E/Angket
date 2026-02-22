import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Alert from '../../components/common/Alert';

const BankSoal = () => {
  const [pertanyaanList, setPertanyaanList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPertanyaan, setCurrentPertanyaan] = useState(null);
  const [activeTab, setActiveTab] = useState('Awareness');
  const [formData, setFormData] = useState({ 
    isi_pertanyaan: '', 
    bobot_persentase: 1
  });

  const MAX_PER_KATEGORI = 12;

  const normalizeKategori = (value) =>
    (value || '').toString().toLowerCase().trim();

  const kategoriTabs = [
    { value: 'Awareness', label: 'Awareness' },
    { value: 'Learning Strategies', label: 'Learning strategies' },
    { value: 'Learning Activities', label: 'Learning activities' },
    { value: 'Evaluation', label: 'Evaluation' },
    { value: 'Interpersonal Skills', label: 'Interpersonal skills' }
  ];

  // Truncate long text
  const truncateText = (text, maxLength = 80) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const getCountForKategori = (kategori) => {
    const target = normalizeKategori(kategori);
    return pertanyaanList.filter(
      (pertanyaan) => normalizeKategori(pertanyaan.kategori) === target
    ).length;
  };

  const filteredPertanyaan = pertanyaanList.filter(
    (pertanyaan) =>
      normalizeKategori(pertanyaan.kategori) === normalizeKategori(activeTab)
  );

  const activeTabCount = getCountForKategori(activeTab);

  useEffect(() => {
    fetchPertanyaan();
  }, []);

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
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'bobot_persentase' ? parseFloat(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const payload = {
        isi_pertanyaan: formData.isi_pertanyaan,
        bobot_persentase: formData.bobot_persentase || 1,
        tipe_soal: 'pilihan_ganda',
        kategori: activeTab,
        id_sekolah: 1
      };

      if (isEditing) {
        await axiosClient.patch(`/pertanyaan/${currentPertanyaan.id}`, payload);
      } else {
        await axiosClient.post('/pertanyaan', payload);
      }
      
      setShowModal(false);
      setFormData({ 
        isi_pertanyaan: '', 
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
    setActiveTab(pertanyaan.kategori);
    setCurrentPertanyaan(pertanyaan);
    setFormData({ 
      isi_pertanyaan: pertanyaan.isi_pertanyaan, 
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
      isi_pertanyaan: '', 
      bobot_persentase: 1
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({ 
      isi_pertanyaan: '', 
      bobot_persentase: 1
    });
    setCurrentPertanyaan(null);
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="p-6">
        <LoadingSpinner message="Memuat data pertanyaan..." />
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Kelola Pertanyaan</h1>
            <p className="mt-1 text-sm text-gray-500">
              Kelola pertanyaan untuk survei evaluasi kemandirian belajar siswa
            </p>
          </div>
          <button
            onClick={openCreateModal}
            disabled={activeTabCount >= MAX_PER_KATEGORI}
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
              activeTabCount >= MAX_PER_KATEGORI
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
            }`}
          >
            <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Tambah Pertanyaan
          </button>
        </div>

        <div className="mb-4">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-4" aria-label="Tabs">
              {kategoriTabs.map((tab) => {
                const count = getCountForKategori(tab.value);
                const isActive = activeTab === tab.value;
                return (
                  <button
                    key={tab.value}
                    type="button"
                    onClick={() => setActiveTab(tab.value)}
                    className={
                      isActive
                        ? 'border-b-2 border-blue-500 text-blue-600 whitespace-nowrap py-2 px-3 text-sm font-medium'
                        : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-2 px-3 text-sm font-medium'
                    }
                  >
                    {tab.label} ({count})
                  </button>
                );
              })}
            </nav>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Total soal untuk kategori {activeTab}: {activeTabCount}/{MAX_PER_KATEGORI}
          </p>
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
                  Isi Pertanyaan
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
              {filteredPertanyaan.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                    Belum ada pertanyaan pada kategori ini
                  </td>
                </tr>
              ) : (
                filteredPertanyaan.map((pertanyaan, index) => (
                  <tr key={pertanyaan.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                      {truncateText(pertanyaan.isi_pertanyaan)}
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
