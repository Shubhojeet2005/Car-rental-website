import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const AdminNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (_) {}
    }
    const handleChange = () => {
      const userData = localStorage.getItem('user');
      setUser(userData ? JSON.parse(userData) : null);
    };
    window.addEventListener('userLogin', handleChange);
    window.addEventListener('userLogout', handleChange);
    return () => {
      window.removeEventListener('userLogin', handleChange);
      window.removeEventListener('userLogout', handleChange);
    };
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 w-full z-50 bg-slate-900/95 border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center text-white font-bold">
              A
            </div>
            <span className="text-xl font-bold text-white">Admin Portal</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              to="/admin/dashboard"
              className="text-slate-300 hover:text-amber-400 transition-colors font-medium text-sm"
            >
              Dashboard
            </Link>
            {user && (
              <button
                onClick={() => {
                  localStorage.removeItem('user');
                  window.dispatchEvent(new Event('userLogout'));
                  window.location.href = '/admin/login';
                }}
                className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
