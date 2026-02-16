import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

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
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;