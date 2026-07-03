import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiLogOut, FiUser, FiSun, FiMoon } from 'react-icons/fi';
import { Button } from '../common';
import { useAuth } from '../../context/AuthContext';
import ProfileModal from './ProfileModal';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-neutral-200 shadow-soft dark:bg-neutral-900 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-3">
            <div className="w-11 h-11 bg-primary-600 rounded-xl flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-xl">T</span>
            </div>
            <span className="text-2xl font-extrabold text-neutral-900 dark:text-neutral-50 tracking-tight">TaskManager</span>
          </Link>

          {/* Right side - User Avatar and Logout */}
          <div className="flex items-center space-x-5">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2.5 text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <FiMoon className="text-xl" /> : <FiSun className="text-xl" />}
            </button>

            {/* User Avatar */}
            <div onClick={() => setIsProfileOpen(true)} className="flex items-center space-x-3 cursor-pointer hover:opacity-85 transition-opacity">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-950/60 rounded-full flex items-center justify-center">
                <FiUser className="text-primary-600 dark:text-primary-400 text-xl" />
              </div>
              <div className="hidden sm:block">
                <p className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
                  {user?.name || 'User'}
                </p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 capitalize">
                  {user?.role || 'User'}
                </p>
              </div>
            </div>

            {/* Logout Button */}
            <Button
              variant="secondary"
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2"
            >
              <FiLogOut className="text-base" />
              <span className="hidden sm:inline font-medium">Logout</span>
            </Button>
          </div>
        </div>
      </div>
      <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </nav>
  );
};

export default Navbar;
