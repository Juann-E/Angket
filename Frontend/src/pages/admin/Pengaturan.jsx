import React, { useEffect, useState } from 'react';
import axiosClient from '../../api/axiosClient';
import Alert from '../../components/common/Alert';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';

const Pengaturan = () => {
  const { user } = useAuth();
  const currentUsername = user?.user?.username || '';

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  const [adminList, setAdminList] = useState([]);
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminError, setAdminError] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [modalForm, setModalForm] = useState({
    username: '',
    password: '',
  });
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState('');

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');
    setPasswordLoading(true);

    try {
      await axiosClient.post('/pengaturan/account_management/change_password', {
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordSuccess('Password berhasil diperbarui.');
      setPasswordForm({
        oldPassword: '',
        newPassword: '',
      });
    } catch (error) {
      const message =
        error.response?.data?.message ||
        'Gagal mengubah password. Pastikan password lama benar dan server tersedia.';
      setPasswordError(message);
    } finally {
      setPasswordLoading(false);
    }
  };

  const fetchAdmins = async () => {
    setAdminLoading(true);
    setAdminError('');
    try {
      const response = await axiosClient.get('/pengaturan/account_management/admin');
      setAdminList(response.data || []);
    } catch (error) {
      const status = error.response?.status;
      if (status === 404) {
        setAdminError('Gagal memuat daftar admin atau API belum tersedia.');
      } else {
        const message =
          error.response?.data?.message ||
          'Terjadi kesalahan saat memuat daftar admin.';
        setAdminError(message);
      }
    } finally {
      setAdminLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const openAddModal = () => {
    setIsEditing(false);
    setSelectedAdmin(null);
    setModalForm({
      username: '',
      password: '',
    });
    setModalError('');
    setShowModal(true);
  };

  const openEditModal = (admin) => {
    setIsEditing(true);
    setSelectedAdmin(admin);
    setModalForm({
      username: admin.username || '',
      password: '',
    });
    setModalError('');
    setShowModal(true);
  };

  const closeModal = () => {
    if (modalLoading) return;
    setShowModal(false);
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    setModalError('');
    setModalLoading(true);

    try {
      if (isEditing && selectedAdmin) {
        const payload = {};
        if (modalForm.username && modalForm.username !== selectedAdmin.username) {
          payload.username = modalForm.username;
        }
        if (modalForm.password) {
          payload.password = modalForm.password;
        }
        if (Object.keys(payload).length === 0) {
          setModalError('Tidak ada perubahan yang disimpan.');
          setModalLoading(false);
          return;
        }
        await axiosClient.patch(
          `/pengaturan/account_management/admin/${selectedAdmin.id}`,
          payload
        );
      } else {
        await axiosClient.post('/pengaturan/account_management/admin', {
          username: modalForm.username,
          password: modalForm.password,
          role: 'admin',
        });
      }
      setShowModal(false);
      setModalForm({
        username: '',
        password: '',
      });
      await fetchAdmins();
    } catch (error) {
      const message =
        error.response?.data?.message ||
        'Terjadi kesalahan saat menyimpan data admin.';
      setModalError(message);
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteAdmin = async (admin) => {
    const confirmed = window.confirm(
      `Yakin ingin menghapus admin "${admin.username}"?`
    );
    if (!confirmed) return;

    try {
      await axiosClient.delete(`/pengaturan/account_management/admin/${admin.id}`);
      await fetchAdmins();
    } catch (error) {
      const message =
        error.response?.data?.message ||
        'Gagal menghapus admin. Silakan coba lagi.';
      setAdminError(message);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Pengaturan</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Profil Saya</h2>

          {passwordError && (
            <Alert
              type="error"
              message={passwordError}
              onClose={() => setPasswordError('')}
              className="mb-4"
            />
          )}
          {passwordSuccess && (
            <Alert
              type="success"
              message={passwordSuccess}
              onClose={() => setPasswordSuccess('')}
              className="mb-4"
            />
          )}

          <form className="space-y-4" onSubmit={handleChangePassword}>
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                value={currentUsername}
                disabled
                className="block w-full rounded-lg border border-gray-300 bg-gray-100 px-3 py-2 text-sm text-gray-900"
              />
            </div>

            <div>
              <label
                htmlFor="oldPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password Lama
              </label>
              <input
                id="oldPassword"
                type="password"
                value={passwordForm.oldPassword}
                onChange={(e) =>
                  setPasswordForm((prev) => ({
                    ...prev,
                    oldPassword: e.target.value,
                  }))
                }
                required
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password Baru
              </label>
              <input
                id="newPassword"
                type="password"
                placeholder="Masukkan password baru"
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm((prev) => ({
                    ...prev,
                    newPassword: e.target.value,
                  }))
                }
                required
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={passwordLoading}
              className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:opacity-60"
            >
              {passwordLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Manajemen Admin</h2>
            <button
              type="button"
              onClick={openAddModal}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
            >
              Tambah Admin Lain
            </button>
          </div>

          {adminError && (
            <Alert
              type="error"
              message={adminError}
              onClose={() => setAdminError('')}
              className="mb-4"
            />
          )}

          {adminLoading ? (
            <LoadingSpinner message="Memuat daftar admin..." size="sm" />
          ) : (
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium text-gray-700">
                      No
                    </th>
                    <th className="px-4 py-2 text-left font-medium text-gray-700">
                      Username
                    </th>
                    <th className="px-4 py-2 text-left font-medium text-gray-700">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {adminList.length === 0 ? (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-4 py-4 text-center text-sm text-gray-500"
                      >
                        Belum ada data admin.
                      </td>
                    </tr>
                  ) : (
                    adminList.map((admin, index) => (
                      <tr key={admin.id}>
                        <td className="px-4 py-2 text-gray-700">
                          {index + 1}
                        </td>
                        <td className="px-4 py-2 text-gray-700">
                          {admin.username}
                        </td>
                        <td className="px-4 py-2">
                          <button
                            type="button"
                            onClick={() => openEditModal(admin)}
                            className="mr-2 rounded border border-gray-300 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-100"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteAdmin(admin)}
                            className="rounded border border-red-300 px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
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
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 px-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              {isEditing ? 'Edit Admin' : 'Tambah Admin Baru'}
            </h3>

            {modalError && (
              <Alert
                type="error"
                message={modalError}
                onClose={() => setModalError('')}
                className="mb-4"
              />
            )}

            <form className="space-y-4" onSubmit={handleModalSubmit}>
              <div>
                <label
                  htmlFor="modalUsername"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Username
                </label>
                <input
                  id="modalUsername"
                  type="text"
                  value={modalForm.username}
                  onChange={(e) =>
                    setModalForm((prev) => ({
                      ...prev,
                      username: e.target.value,
                    }))
                  }
                  required
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="modalPassword"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {isEditing ? 'Password Baru (opsional)' : 'Password'}
                </label>
                <input
                  id="modalPassword"
                  type="password"
                  value={modalForm.password}
                  onChange={(e) =>
                    setModalForm((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  placeholder={isEditing ? 'Biarkan kosong jika tidak diubah' : ''}
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="mr-3 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                  disabled={modalLoading}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={modalLoading}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:opacity-60"
                >
                  {modalLoading ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pengaturan;

