import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/auth';
import api from '../utils/api';
import {
  MagnifyingGlassIcon,
  MapPinIcon,
  ClockIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

const HomePage = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [jobsRes, categoriesRes] = await Promise.all([
          api.get('/jobs/featured/', { params: { page_size: 5 } }),
          api.get('/jobs/categories/')
        ]);
        // Ensure categoriesRes.data is an array
        const categoriesData = Array.isArray(categoriesRes.data) ? categoriesRes.data : [];
        setFeaturedJobs(jobsRes.data.results || jobsRes.data || []);
        setCategories([{ id: '', name: 'All Categories' }, ...categoriesData]);
        setLoading(false);
      } catch (err) {
        console.error('Home page data error:', {
          status: err.response?.status,
          data: err.response?.data,
          message: err.message
        });
        if (err.response?.status === 401) {
          logout();
          setError('Session expired. Please log in again.');
        } else if (err.response?.status === 404) {
          setError('Requested resources not found. Please try again later.');
        } else {
          setError(err.response?.data?.detail || err.message || 'Failed to load data. Please try again.');
        }
        setLoading(false);
      }
    };
    fetchData();
  }, [logout]);

  const handleSearch = (e) => {
    e.preventDefault();
    const queryParams = new URLSearchParams();
    if (searchQuery) queryParams.set('search', searchQuery);
    if (selectedCategory && selectedCategory !== 'All Categories') {
      queryParams.set('category', selectedCategory);
    }
    navigate(`/jobs?${queryParams.toString()}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#282828]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4 border-[#54990b]"></div>
          <p className="text-[#F0F0F0] text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#282828]">
        <div className="text-center">
          <p className="text-[#D98C3F] text-lg">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 text-white font-semibold rounded-md transition-all duration-300 hover:shadow-lg"
            style={{ backgroundColor: '#54990b' }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#6AA84F'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#54990b'}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ fontFamily: 'Poppins, sans-serif' }}>
      {/* Hero Section */}
      <div className="relative min-h-[70vh] sm:min-h-screen flex items-center justify-center bg-[#282828]">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img 
            src="https://i.pinimg.com/736x/1b/aa/07/1baa07042c398f6d200917fab158833b.jpg"
            alt="Professional workplace"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70"></div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-10 left-4 sm:top-20 sm:left-10 opacity-20 animate-float hidden sm:block">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 w-40 sm:w-48">
            <div className="flex items-center space-x-3">
              <div className="w-6 sm:w-8 h-6 sm:h-8 bg-green-500 rounded"></div>
              <div>
                <div className="h-2 sm:h-3 bg-white/50 rounded w-16 sm:w-20 mb-1"></div>
                <div className="h-2 bg-white/30 rounded w-12 sm:w-16"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute top-20 right-4 sm:top-40 sm:right-10 md:right-20 opacity-20 animate-float hidden sm:block" style={{ animationDelay: '1s' }}>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 w-32 sm:w-40">
            <div className="flex items-center space-x-2">
              <div className="w-5 sm:w-6 h-5 sm:h-6 bg-blue-500 rounded"></div>
              <div>
                <div className="h-2 bg-white/50 rounded w-12 sm:w-16 mb-1"></div>
                <div className="h-2 bg-white/30 rounded w-10 sm:w-12"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 left-4 sm:bottom-40 sm:left-10 md:left-20 opacity-20 animate-float hidden sm:block" style={{ animationDelay: '2s' }}>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 w-36 sm:w-44">
            <div className="flex items-center space-x-3">
              <div className="w-6 sm:w-8 h-6 sm:h-8 bg-orange-500 rounded"></div>
              <div>
                <div className="h-2 sm:h-3 bg-white/50 rounded w-14 sm:w-18 mb-1"></div>
                <div className="h-2 bg-white/30 rounded w-12 sm:w-14"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-[#F0F0F0]">
            Find Your Dream Job Today
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-8 sm:mb-12 max-w-3xl sm:max-w-4xl mx-auto text-[#A0A0A0]">
            Connect with top companies and discover opportunities that match your skills
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-3xl sm:max-w-4xl mx-auto mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 bg-white rounded-lg p-2 shadow-2xl">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search jobs, companies, or locations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-gray-800 bg-transparent border-none outline-none text-sm sm:text-base lg:text-lg"
                />
              </div>
              <div className="sm:w-48 md:w-56 lg:w-64">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-gray-800 bg-transparent border-none outline-none text-sm sm:text-base lg:text-lg cursor-pointer"
                >
                  {categories.map((category) => (
                    <option key={category.id || 'all'} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="px-4 sm:px-6 lg:px-8 py-2 sm:py-3 text-white font-semibold rounded-md transition-all duration-300 hover:shadow-lg flex items-center justify-center space-x-2 text-sm sm:text-base"
                style={{ backgroundColor: '#54990b' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#6AA84F'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#54990b'}
              >
                <MagnifyingGlassIcon className="h-4 sm:h-5 w-4 sm:w-5" />
                <span>Search</span>
              </button>
            </div>
          </form>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link
              to="/jobs"
              className="px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 text-white font-semibold text-sm sm:text-base lg:text-lg rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-105"
              style={{ backgroundColor: '#54990b' }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#6AA84F'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#54990b'}
            >
              Browse Jobs
            </Link>
            <Link
              to="/employers"
              className="px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 text-white font-semibold text-sm sm:text-base lg:text-lg rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-105"
              style={{ backgroundColor: '#D98C3F' }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#E09A4F'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#D98C3F'}
            >
              For Employers
            </Link>
          </div>
        </div>
      </div>

      {/* Welcome Message for Authenticated Users */}
      {isAuthenticated && (
        <div className="bg-[#282828] border-b border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            <div className="text-center">
              <p className="text-base sm:text-lg text-[#A0A0A0]">
                Welcome back, <span className="font-semibold text-[#54990b]">{user?.first_name}</span>!
                Ready to find your next opportunity?
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Featured Jobs Section */}
      <div className="py-12 sm:py-16 lg:py-20 bg-[#282828]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-4 text-[#F0F0F0]">
              Featured Opportunities
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-10 sm:mb-12">
            {featuredJobs.slice(0, 5).map((job) => (
              <div
                key={job.id}
                className="rounded-xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer group bg-[rgba(255,255,255,0.05)]"
              >
                {/* Featured Badge */}
                <div className="flex justify-end mb-4">
                  <span className="px-3 py-1 text-xs font-semibold rounded-full text-white bg-[#D98C3F]">
                    Featured
                  </span>
                </div>

                {/* Company Logo */}
                <div className="flex items-center mb-4">
                  <img
                    src={job.company?.logo || "/placeholder.svg"}
                    alt={`${job.company?.name || 'Company'} logo`}
                    className="w-12 h-12 rounded-lg mr-4"
                  />
                  <div>
                    <h3 className="text-base sm:text-lg font-medium mb-1 text-[#F0F0F0]">
                      {job.title}
                    </h3>
                    <p className="text-sm text-[#A0A0A0]">
                      {job.company?.name || 'Unknown Company'}
                    </p>
                  </div>
                </div>

                {/* Job Details */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-2 sm:space-x-4 flex-wrap gap-2">
                    <span className="px-3 py-1 text-xs font-medium rounded-full text-white bg-[#3F7A8C]">
                      <MapPinIcon className="h-3 w-3 inline mr-1" />
                      {job.location || 'N/A'}
                    </span>
                    <span className="px-3 py-1 text-xs font-medium rounded-full text-white bg-[#3F7A8C]">
                      <ClockIcon className="h-3 w-3 inline mr-1" />
                      {job.job_type || 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <CurrencyDollarIcon className="h-4 w-4 mr-1 text-[#54990b]" />
                    <span className="text-base sm:text-lg font-medium text-[#54990b]">
                      {job.salary_min ? `$${job.salary_min.toLocaleString()} - $${job.salary_max?.toLocaleString() || '+'}` : 'Not specified'}
                    </span>
                  </div>
                </div>

                {/* Apply Button */}
                <a
                  href={job.application_url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 sm:py-3 text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg block text-center text-sm sm:text-base"
                  style={{ backgroundColor: '#54990b' }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#6AA84F'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#54990b'}
                >
                  Apply Now
                </a>
              </div>
            ))}
          </div>

          {/* View All Jobs CTA */}
          <div className="text-center">
            <Link
              to="/jobs"
              className="inline-block px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 text-white font-semibold text-sm sm:text-base lg:text-lg rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-105"
              style={{ backgroundColor: '#54990b' }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#6AA84F'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#54990b'}
            >
              View All Jobs
            </Link>
          </div>
        </div>
      </div>

      {/* CTA Section for Non-Authenticated Users */}
      {!isAuthenticated && (
        <div className="py-12 sm:py-16 lg:py-20 bg-[#282828]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-[#F0F0F0]">
              Ready to Start Your Job Search?
            </h2>
            <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 text-[#A0A0A0]">
              Join thousands of job seekers who found their dream jobs through our platform.
            </p>
            <Link
              to="/register"
              className="inline-block px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 text-white font-semibold text-sm sm:text-base lg:text-lg rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-105"
              style={{ backgroundColor: '#54990b' }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#6AA84F'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#54990b'}
            >
              Create Your Account
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;