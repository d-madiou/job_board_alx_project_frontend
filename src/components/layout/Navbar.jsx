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
      className="sticky top-0 z-50 shadow-lg border-b-2"
      style={{
        backgroundColor: '#0C1B33',
        borderBottomColor: '#00FF84',
        fontFamily: 'Poppins, sans-serif'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: '#00FF84' }}
              >
                <span className="text-xl font-black" style={{ color: '#000000' }}>J</span>
              </div>
              <span
                className="text-2xl font-black"
                style={{ color: '#00FF84' }}
              >
                Golleh
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link
              to="/"
              className="font-bold transition-colors duration-200"
              style={{ color: '#FFFFFF' }}
              onMouseEnter={(e) => e.target.style.color = '#00FF84'}
              onMouseLeave={(e) => e.target.style.color = '#FFFFFF'}
            >
              Home
            </Link>
            <Link
              to="/jobs"
              className="font-bold transition-colors duration-200"
              style={{ color: '#FFFFFF' }}
              onMouseEnter={(e) => e.target.style.color = '#00FF84'}
              onMouseLeave={(e) => e.target.style.color = '#FFFFFF'}
            >
              Jobs
            </Link>
            <Link
              to="/companies"
              className="font-bold transition-colors duration-200"
              style={{ color: '#FFFFFF' }}
              onMouseEnter={(e) => e.target.style.color = '#00FF84'}
              onMouseLeave={(e) => e.target.style.color = '#FFFFFF'}
            >
              Companies
            </Link>
            <Link
              to="/about"
              className="font-bold transition-colors duration-200"
              style={{ color: '#FFFFFF' }}
              onMouseEnter={(e) => e.target.style.color = '#00FF84'}
              onMouseLeave={(e) => e.target.style.color = '#FFFFFF'}
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
                  className="w-full pl-4 pr-12 py-2 rounded-lg border-2 outline-none font-medium"
                  style={{ 
                    backgroundColor: '#FFFFFF',
                    borderColor: '#00FF84',
                    color: '#000000'
                  }}
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 rounded-md transition-colors duration-200"
                  style={{ color: '#00FF84' }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(0, 255, 132, 0.1)'}
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
              className="px-6 py-3 rounded-xl font-bold transition-all duration-200 hover:shadow-lg border-2"
              style={{ 
                backgroundColor: 'transparent',
                color: '#FFFFFF',
                borderColor: '#FFFFFF'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#FFFFFF';
                e.target.style.color = '#000000';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = '#FFFFFF';
              }}
            >
              Post a Job
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                {/* Notifications */}
                <button className="relative p-2 rounded-lg transition-colors duration-200 hover:bg-white/10">
                  <BellIcon className="h-6 w-6" style={{ color: '#FFFFFF' }} />
                  <span
                    className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
                    style={{ backgroundColor: '#00FF84' }}
                  ></span>
                </button>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center space-x-2 p-2 rounded-lg transition-colors duration-200 hover:bg-white/10"
                  >
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: '#00FF84' }}
                    >
                      <UserIcon className="h-5 w-5" style={{ color: '#000000' }} />
                    </div>
                    <span style={{ color: '#FFFFFF' }} className="font-bold">
                      {user?.first_name}
                    </span>
                    <ChevronDownIcon className="h-4 w-4" style={{ color: '#FFFFFF' }} />
                  </button>

                  {/* User Dropdown */}
                  {userMenuOpen && (
                    <div
                      className="absolute right-0 mt-2 w-48 rounded-xl shadow-lg py-2 z-50 border-2"
                      style={{ 
                        backgroundColor: '#0C1B33',
                        borderColor: '#00FF84'
                      }}
                    >
                      <Link
                        to="/dashboard"
                        className="block px-4 py-2 text-sm font-medium transition-colors duration-200"
                        style={{ color: '#FFFFFF' }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(0, 255, 132, 0.1)'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm font-medium transition-colors duration-200"
                        style={{ color: '#FFFFFF' }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(0, 255, 132, 0.1)'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm font-medium transition-colors duration-200"
                        style={{ color: '#FFFFFF' }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(0, 255, 132, 0.1)'}
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
                  className="font-bold transition-colors duration-200"
                  style={{ color: '#FFFFFF' }}
                  onMouseEnter={(e) => e.target.style.color = '#00FF84'}
                  onMouseLeave={(e) => e.target.style.color = '#FFFFFF'}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-3 rounded-xl font-bold transition-all duration-200 hover:shadow-lg"
                  style={{ 
                    backgroundColor: '#00FF84',
                    color: '#000000'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#00E676';
                    e.target.style.boxShadow = '0 4px 15px rgba(0, 255, 132, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#00FF84';
                    e.target.style.boxShadow = 'none';
                  }}
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
                <XMarkIcon className="h-6 w-6" style={{ color: '#FFFFFF' }} />
              ) : (
                <Bars3Icon className="h-6 w-6" style={{ color: '#FFFFFF' }} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t-2" style={{ borderTopColor: '#00FF84' }}>
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
                      className="w-full pl-4 pr-12 py-2 rounded-lg border-2 outline-none font-medium"
                      style={{ 
                        backgroundColor: '#FFFFFF',
                        borderColor: '#00FF84',
                        color: '#000000'
                      }}
                    />
                    <button
                      type="submit"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5"
                      style={{ color: '#00FF84' }}
                    >
                      <MagnifyingGlassIcon className="h-5 w-5" />
                    </button>
                  </div>
                </form>
              </div>

              <Link
                to="/"
                className="block px-3 py-2 rounded-md font-bold transition-colors duration-200"
                style={{ color: '#FFFFFF' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(0, 255, 132, 0.1)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/jobs"
                className="block px-3 py-2 rounded-md font-bold transition-colors duration-200"
                style={{ color: '#FFFFFF' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(0, 255, 132, 0.1)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                onClick={() => setMobileMenuOpen(false)}
              >
                Jobs
              </Link>
              <Link
                to="/companies"
                className="block px-3 py-2 rounded-md font-bold transition-colors duration-200"
                style={{ color: '#FFFFFF' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(0, 255, 132, 0.1)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                onClick={() => setMobileMenuOpen(false)}
              >
                Companies
              </Link>
              <Link
                to="/about"
                className="block px-3 py-2 rounded-md font-bold transition-colors duration-200"
                style={{ color: '#FFFFFF' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(0, 255, 132, 0.1)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>

              {/* Mobile Post Job Button */}
              <Link
                to="/post-job"
                className="block mx-3 my-2 px-4 py-2 rounded-lg font-bold text-center transition-all duration-200 border-2"
                style={{ 
                  backgroundColor: 'transparent',
                  color: '#FFFFFF',
                  borderColor: '#FFFFFF'
                }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Post a Job
              </Link>

              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    className="block px-3 py-2 rounded-md font-bold transition-colors duration-200"
                    style={{ color: '#FFFFFF' }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(0, 255, 132, 0.1)'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <div className="px-3 py-2">
                    <span className="text-sm font-medium" style={{ color: '#B0B0B0' }}>
                      {user?.first_name} {user?.last_name}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 rounded-md font-bold transition-colors duration-200"
                    style={{ color: '#FFFFFF' }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(0, 255, 132, 0.1)'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block px-3 py-2 rounded-md font-bold transition-colors duration-200"
                    style={{ color: '#FFFFFF' }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(0, 255, 132, 0.1)'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block mx-3 my-2 px-4 py-2 rounded-lg font-bold text-center transition-all duration-200"
                    style={{ 
                      backgroundColor: '#00FF84',
                      color: '#000000'
                    }}
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
