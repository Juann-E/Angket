import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';
  const isLoginPage = location.pathname === '/login';

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3 flex-shrink-0">
            <Link to="/" className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <img
                  src="/Logo/UKSW.png"
                  alt="Logo UKSW"
                  className="h-10 md:h-12 w-auto object-contain"
                />
                <img
                  src="/Logo/FKIP.png"
                  alt="Logo FKIP"
                  className="h-10 md:h-12 w-auto object-contain"
                />
              </div>
              <span className="ml-2 text-xl font-bold text-blue-600">
                SDL Check
              </span>
            </Link>
          </div>
          
          {/* Menu */}
          <div className="flex items-center">
            {isLandingPage && (
              <Link
                to="/login"
                className="inline-flex items-center px-4 py-2 border border-blue-600 text-sm font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Login Admin
              </Link>
            )}
            
            {isLoginPage && (
              <Link
                to="/"
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Kembali ke Beranda
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
