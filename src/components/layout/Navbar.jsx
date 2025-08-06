import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/auth';
import {
  UserIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  MagnifyingGlassIcon,
  BellIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setUserMenuOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/jobs?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <nav 
      className="sticky top-0 z-50 shadow-lg"
      style={{ 
        backgroundColor: '#282828',
        borderBottom: '1px solid #3F7A8C',
        fontFamily: 'Poppins, sans-serif'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: '#54990b' }}
              >
                <span className="text-white font-bold text-lg">J</span>
              </div>
              <span 
                className="text-xl font-bold"
                style={{ color: '#54990b' }}
              >
                Golleh
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link
              to="/"
              className="font-medium transition-colors duration-200"
              style={{ color: '#F0F0F0' }}
              onMouseEnter={(e) => e.target.style.color = '#6AA84F'}
              onMouseLeave={(e) => e.target.style.color = '#F0F0F0'}
            >
              Home
            </Link>
            <Link
              to="/jobs"
              className="font-medium transition-colors duration-200"
              style={{ color: '#F0F0F0' }}
              onMouseEnter={(e) => e.target.style.color = '#6AA84F'}
              onMouseLeave={(e) => e.target.style.color = '#F0F0F0'}
            >
              Jobs
            </Link>
            <Link
              to="/companies"
              className="font-medium transition-colors duration-200"
              style={{ color: '#F0F0F0' }}
              onMouseEnter={(e) => e.target.style.color = '#6AA84F'}
              onMouseLeave={(e) => e.target.style.color = '#F0F0F0'}
            >
              Companies
            </Link>
            <Link
              to="/about"
              className="font-medium transition-colors duration-200"
              style={{ color: '#F0F0F0' }}
              onMouseEnter={(e) => e.target.style.color = '#6AA84F'}
              onMouseLeave={(e) => e.target.style.color = '#F0F0F0'}
            >
              About
            </Link>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search jobs, companies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-12 py-2 rounded-lg border-none outline-none text-gray-800 placeholder-gray-500"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 rounded-md transition-colors duration-200"
                  style={{ color: '#54990b' }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(84, 153, 11, 0.1)'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  <MagnifyingGlassIcon className="h-5 w-5" />
                </button>
              </div>
            </form>
          </div>

          {/* Right Side Menu */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Post Job Button */}
            <Link
              to="/post-job"
              className="px-4 py-2 rounded-lg font-semibold text-white transition-all duration-200 hover:shadow-lg"
              style={{ backgroundColor: '#D98C3F' }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#E09A4F'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#D98C3F'}
            >
              Post a Job
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                {/* Notifications */}
                <button className="relative p-2 rounded-lg transition-colors duration-200 hover:bg-white/10">
                  <BellIcon className="h-6 w-6" style={{ color: '#F0F0F0' }} />
                  <span 
                    className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
                    style={{ backgroundColor: '#D98C3F' }}
                  ></span>
                </button>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center space-x-2 p-2 rounded-lg transition-colors duration-200 hover:bg-white/10"
                  >
                    <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
                      <UserIcon className="h-5 w-5" style={{ color: '#F0F0F0' }} />
                    </div>
                    <span style={{ color: '#F0F0F0' }} className="font-medium">
                      {user?.first_name}
                    </span>
                    <ChevronDownIcon className="h-4 w-4" style={{ color: '#A0A0A0' }} />
                  </button>

                  {/* User Dropdown */}
                  {userMenuOpen && (
                    <div 
                      className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg py-2 z-50"
                      style={{ backgroundColor: '#282828', border: '1px solid #3F7A8C' }}
                    >
                      <Link
                        to="/dashboard"
                        className="block px-4 py-2 text-sm transition-colors duration-200"
                        style={{ color: '#F0F0F0' }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm transition-colors duration-200"
                        style={{ color: '#F0F0F0' }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm transition-colors duration-200"
                        style={{ color: '#F0F0F0' }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="font-medium transition-colors duration-200"
                  style={{ color: '#F0F0F0' }}
                  onMouseEnter={(e) => e.target.style.color = '#6AA84F'}
                  onMouseLeave={(e) => e.target.style.color = '#F0F0F0'}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-lg font-semibold transition-all duration-200 hover:shadow-lg"
                  style={{ backgroundColor: '#54990b', color: 'white' }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#6AA84F'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#54990b'}
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg transition-colors duration-200 hover:bg-white/10"
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" style={{ color: '#F0F0F0' }} />
              ) : (
                <Bars3Icon className="h-6 w-6" style={{ color: '#F0F0F0' }} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t" style={{ borderColor: '#3F7A8C' }}>
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Mobile Search */}
              <div className="px-3 py-2">
                <form onSubmit={handleSearch}>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search jobs..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-4 pr-12 py-2 rounded-lg border-none outline-none text-gray-800 placeholder-gray-500"
                    />
                    <button
                      type="submit"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5"
                      style={{ color: '#54990b' }}
                    >
                      <MagnifyingGlassIcon className="h-5 w-5" />
                    </button>
                  </div>
                </form>
              </div>

              <Link
                to="/"
                className="block px-3 py-2 rounded-md font-medium transition-colors duration-200"
                style={{ color: '#F0F0F0' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/jobs"
                className="block px-3 py-2 rounded-md font-medium transition-colors duration-200"
                style={{ color: '#F0F0F0' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                onClick={() => setMobileMenuOpen(false)}
              >
                Jobs
              </Link>
              <Link
                to="/companies"
                className="block px-3 py-2 rounded-md font-medium transition-colors duration-200"
                style={{ color: '#F0F0F0' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                onClick={() => setMobileMenuOpen(false)}
              >
                Companies
              </Link>
              <Link
                to="/about"
                className="block px-3 py-2 rounded-md font-medium transition-colors duration-200"
                style={{ color: '#F0F0F0' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>

              {/* Mobile Post Job Button */}
              <Link
                to="/post-job"
                className="block mx-3 my-2 px-4 py-2 rounded-lg font-semibold text-white text-center transition-all duration-200"
                style={{ backgroundColor: '#D98C3F' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Post a Job
              </Link>

              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    className="block px-3 py-2 rounded-md font-medium transition-colors duration-200"
                    style={{ color: '#F0F0F0' }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <div className="px-3 py-2">
                    <span className="text-sm" style={{ color: '#A0A0A0' }}>
                      {user?.first_name} {user?.last_name}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 rounded-md font-medium transition-colors duration-200"
                    style={{ color: '#F0F0F0' }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block px-3 py-2 rounded-md font-medium transition-colors duration-200"
                    style={{ color: '#F0F0F0' }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block mx-3 my-2 px-4 py-2 rounded-lg font-semibold text-white text-center transition-all duration-200"
                    style={{ backgroundColor: '#54990b' }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
