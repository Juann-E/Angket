import React from 'react';
import { useAuth } from '../../context/AuthContext';

const Dashboard = () => {
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
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
          <a href="/admin/dashboard" className="block py-3 px-6 text-blue-400 bg-slate-700 border-l-4 border-blue-500">
            Dashboard
          </a>
          <a href="/admin/master-data/sekolah" className="block py-3 px-6 hover:bg-slate-700 hover:border-l-4 hover:border-blue-500 transition-all">
            Data Sekolah
          </a>
          <a href="/admin/master-data/kejuruan" className="block py-3 px-6 hover:bg-slate-700 hover:border-l-4 hover:border-blue-500 transition-all">
            Data Kejuruan
          </a>
          <a href="/admin/master-data/kelas" className="block py-3 px-6 hover:bg-slate-700 hover:border-l-4 hover:border-blue-500 transition-all">
            Data Kelas
          </a>
          <a href="/admin/bank-soal" className="block py-3 px-6 hover:bg-slate-700 hover:border-l-4 hover:border-blue-500 transition-all">
            Bank Soal
          </a>
        </nav>
        
        {/* Logout Button */}
        <div className="absolute bottom-0 w-64 p-6">
          <button
            onClick={handleLogout}
            className="w-full py-3 px-4 text-left text-red-300 hover:text-red-100 hover:bg-red-600 rounded-lg transition-colors"
          >
            <svg className="inline-block w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Admin</h1>
            <p className="text-gray-600 mb-6">Selamat datang di dashboard administrasi SDL Check</p>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-blue-900">Total Sekolah</h3>
                    <p className="text-3xl font-bold text-blue-600">0</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-green-50 p-6 rounded-lg border border-green-100">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-green-900">Total Responden</h3>
                    <p className="text-3xl font-bold text-green-600">0</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-purple-50 p-6 rounded-lg border border-purple-100">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-purple-900">Survei Aktif</h3>
                    <p className="text-3xl font-bold text-purple-600">0</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Recent Activity */}
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Aktivitas Terbaru</h2>
              <div className="bg-gray-50 rounded-lg p-6">
                <p className="text-gray-500 text-center py-8">Belum ada aktivitas terbaru</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;