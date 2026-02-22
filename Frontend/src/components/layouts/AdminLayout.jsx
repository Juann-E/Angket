import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = () => {
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isDashboardActive = location.pathname === '/admin/dashboard';
  const isSekolahActive = location.pathname.includes('/admin/master-data/sekolah');
  const isKejuruanActive = location.pathname.includes('/admin/master-data/kejuruan');
  const isKelasActive = location.pathname.includes('/admin/master-data/kelas');
  const isMasterDataActive = isSekolahActive || isKejuruanActive || isKelasActive;

  const [isMasterDataOpen, setIsMasterDataOpen] = useState(isMasterDataActive);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleCancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  const handleConfirmLogout = async () => {
    setShowLogoutConfirm(false);
    await handleLogout();
  };

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <div className="w-64 bg-slate-800 text-white">
        <div className="p-6">
          <h1 className="text-xl font-bold text-white">SDL Check</h1>
          <p className="text-sm text-blue-300 mt-1">Administrator Panel</p>
        </div>
        <nav className="mt-5">
          <a
            href="/admin/dashboard"
            className={`flex items-center py-3 px-6 ${isDashboardActive ? 'text-blue-400 bg-slate-700 border-l-4 border-blue-500' : 'hover:bg-slate-700 hover:border-l-4 hover:border-blue-500'} transition-all`}
          >
            <svg
              className="inline-block w-4 h-4 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 9.75A2.25 2.25 0 015.25 7.5h3.5A2.25 2.25 0 0111 9.75v8A2.25 2.25 0 018.75 20h-3.5A2.25 2.25 0 013 17.75v-8zM13 6.25A2.25 2.25 0 0115.25 4h3.5A2.25 2.25 0 0121 6.25v11.5A2.25 2.25 0 0118.75 20h-3.5A2.25 2.25 0 013 17.75V13"
              />
            </svg>
            <span>Dashboard</span>
          </a>

          <button
            type="button"
            onClick={() => setIsMasterDataOpen((prev) => !prev)}
            className={`w-full flex items-center justify-between py-3 px-6 text-left transition-all ${
              isMasterDataActive
                ? 'text-blue-400 bg-slate-700 border-l-4 border-blue-500'
                : 'text-slate-300 hover:text-white hover:bg-slate-700 hover:border-l-4 hover:border-blue-500'
            }`}
          >
            <span className="flex items-center">
              <svg
                className="inline-block w-4 h-4 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 7.5A2.5 2.5 0 015.5 5h13A2.5 2.5 0 0121 7.5v1A2.5 2.5 0 0118.5 11h-13A2.5 2.5 0 013 8.5v-1zM3 15.5A2.5 2.5 0 015.5 13h6A2.5 2.5 0 0114 15.5v1A2.5 2.5 0 0111.5 19h-6A2.5 2.5 0 013 16.5v-1z"
                />
              </svg>
              <span>Master Data</span>
            </span>
            <svg
              className={`w-4 h-4 transform transition-transform ${
                isMasterDataOpen ? 'rotate-90' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          {isMasterDataOpen && (
            <div className="mt-1 space-y-1">
              <a
                href="/admin/master-data/sekolah"
                className={`flex items-center py-2 pl-12 pr-6 text-sm ${
                  isSekolahActive
                    ? 'text-blue-400 bg-slate-700 border-l-4 border-blue-500'
                    : 'text-slate-100 hover:bg-slate-700/80'
                } transition-all`}
              >
                <svg
                  className="inline-block w-4 h-4 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10.75L12 4l9 6.75M5 20h14a1 1 0 001-1v-6.5L12 7l-8 5.5V19a1 1 0 001 1z"
                  />
                </svg>
                <span>Data Sekolah</span>
              </a>
              <a
                href="/admin/master-data/kejuruan"
                className={`flex items-center py-2 pl-12 pr-6 text-sm ${
                  isKejuruanActive
                    ? 'text-blue-400 bg-slate-700 border-l-4 border-blue-500'
                    : 'text-slate-100 hover:bg-slate-700/80'
                } transition-all`}
              >
                <svg
                  className="inline-block w-4 h-4 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 7h5l2 4h8a2 2 0 011.994 1.85L20 13v4a2 2 0 01-1.85 1.994L18 19H8l-2 4H3V7z"
                  />
                </svg>
                <span>Data Kejuruan</span>
              </a>
              <a
                href="/admin/master-data/kelas"
                className={`flex items-center py-2 pl-12 pr-6 text-sm ${
                  isKelasActive
                    ? 'text-blue-400 bg-slate-700 border-l-4 border-blue-500'
                    : 'text-slate-100 hover:bg-slate-700/80'
                } transition-all`}
              >
                <svg
                  className="inline-block w-4 h-4 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a4 4 0 00-3-3.87M9 11a4 4 0 11-8 0 4 4 0 018 0zm8-5a4 4 0 11-8 0 4 4 0 018 0zM9 17a6 6 0 016 6H3a6 6 0 016-6z"
                  />
                </svg>
                <span>Data Kelas</span>
              </a>
            </div>
          )}

          <a href="/admin/data-siswa" className={`block py-3 px-6 ${location.pathname.includes('/admin/data-siswa') ? 'text-blue-400 bg-slate-700 border-l-4 border-blue-500' : 'hover:bg-slate-700 hover:border-l-4 hover:border-blue-500'} transition-all`}>
            <svg className="inline-block w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-3-3.87M12 12a4 4 0 100-8 4 4 0 000 8zm-7 8h5v-2a4 4 0 013-3.87" />
            </svg>
            Data Siswa
          </a>
          <a href="/admin/laporan" className={`block py-3 px-6 ${location.pathname.includes('/admin/laporan') ? 'text-blue-400 bg-slate-700 border-l-4 border-blue-500' : 'hover:bg-slate-700 hover:border-l-4 hover:border-blue-500'} transition-all`}>
            <svg className="inline-block w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v2a1 1 0 001 1h8m-9-3h3m1 3h4a1 1 0 001-1V7.414A1 1 0 0017.414 7L13 2.586A1 1 0 0012.293 2H6a1 1 0 00-1 1v5m0 9h3m-3 0H4a1 1 0 01-1-1v-4m0 0h3m-3 0V9" />
            </svg>
            Laporan Hasil
          </a>
          <a href="/admin/bank-soal" className={`block py-3 px-6 ${location.pathname === '/admin/bank-soal' ? 'text-blue-400 bg-slate-700 border-l-4 border-blue-500' : 'hover:bg-slate-700 hover:border-l-4 hover:border-blue-500'} transition-all`}>
            <svg className="inline-block w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 5a2 2 0 012-2h6l4 4v10a2 2 0 01-2 2H9a2 2 0 01-2-2V5z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 3v4h4" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6M9 17h3" />
            </svg>
            Kelola Pertanyaan
          </a>
          <a href="/admin/pengaturan" className={`block py-3 px-6 ${location.pathname.includes('/admin/pengaturan') ? 'text-blue-400 bg-slate-700 border-l-4 border-blue-500' : 'hover:bg-slate-700 hover:border-l-4 hover:border-blue-500'} transition-all`}>
            <svg className="inline-block w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317a1 1 0 011.35-.948l.39.144a1 1 0 00.95-.174l.28-.243a1 1 0 011.497.302l.2.39a1 1 0 00.78.54l.42.06a1 1 0 01.85.99v.48a1 1 0 00.3.71l.34.34a1 1 0 01.12 1.27l-.24.35a1 1 0 00-.12.86l.14.39a1 1 0 01-.95 1.3l-.42.06a1 1 0 00-.78.54l-.2.39a1 1 0 01-1.5.3l-.28-.24a1 1 0 00-.95-.17l-.39.14a1 1 0 01-1.3-.95l-.06-.42a1 1 0 00-.54-.78l-.39-.2a1 1 0 01-.3-1.5l.24-.28a1 1 0 00.17-.95l-.14-.39a1 1 0 01.95-1.3l.42-.06a1 1 0 00.78-.54l.2-.39z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
            </svg>
            Pengaturan
          </a>
        </nav>
        
        {/* Logout Button */}
        <div className="absolute bottom-0 w-64 p-6">
          <button
            type="button"
            onClick={handleLogoutClick}
            className="w-full inline-flex items-center justify-center py-2.5 px-4 text-sm font-medium text-red-600 border border-red-200 rounded-lg bg-slate-800 hover:bg-red-50/10 hover:border-red-300 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
          >
            <svg className="inline-block w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          <Outlet />
        </div>
      </div>

      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 px-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-2xl transform transition-all">
            <h3 className="text-lg font-semibold text-gray-900">
              Konfirmasi Logout
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Apakah Anda yakin ingin keluar?
            </p>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleCancelLogout}
                className="px-4 py-2 rounded-md border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmLogout}
                className="px-4 py-2 rounded-md border border-transparent text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 transition-colors"
              >
                Ya, Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLayout;
