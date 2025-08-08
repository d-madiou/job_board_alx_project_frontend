import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/auth';
import api from '../utils/api';
import {
  MagnifyingGlassIcon,
  MapPinIcon,
  ClockIcon,
  CurrencyDollarIcon,
  BriefcaseIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  CheckIcon,
  StarIcon,
  ChevronLeftIcon,
  ChevronRightIcon
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
          api.get('/jobs/featured/', { params: { page_size: 10 } }),
          api.get('/jobs/categories/')
        ]);

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

  const getCompanyLogoUrl = (company) => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
    
    const logoPath = company.logo_display_url;
    
    if (logoPath) {
      return logoPath.startsWith('http') ? logoPath : `${baseUrl}${logoPath}`;
    }
    
    if (company.logo_url) {
      return company.logo_url;
    }
    
    return '/placeholder.svg?height=60&width=60&text=Logo';
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const queryParams = new URLSearchParams();
    if (searchQuery) queryParams.set('search', searchQuery);
    if (selectedCategory && selectedCategory !== 'All Categories') {
      queryParams.set('category', selectedCategory);
    }
    navigate(`/jobs?${queryParams.toString()}`);
  };

  const scrollLeft = () => {
    document.getElementById('featured-jobs-container').scrollBy({ left: -300, behavior: 'smooth' });
  };

  const scrollRight = () => {
    document.getElementById('featured-jobs-container').scrollBy({ left: 300, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: '#0C1B33' }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 mx-auto mb-4" style={{ borderColor: '#00FF84' }}></div>
          <p className="text-lg font-medium" style={{ color: '#FFFFFF' }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: '#0C1B33' }}
      >
        <div className="text-center">
          <p className="text-lg font-medium mb-4" style={{ color: '#FF6B6B' }}>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 font-medium rounded-lg transition-all duration-300 hover:shadow-lg"
            style={{ 
              backgroundColor: '#00FF84',
              color: '#000000'
            }}
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
      <div 
        className="relative min-h-screen flex items-center justify-center"
        style={{ backgroundColor: '#0C1B33' }}
      >
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img 
            src="https://i.pinimg.com/736x/1b/aa/07/1baa07042c398f6d200917fab158833b.jpg"
            alt="Professional workplace"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80"></div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 opacity-30 animate-float hidden lg:block">
          <div 
            className="backdrop-blur-sm rounded-xl p-4 w-48 shadow-xl border"
            style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderColor: '#00FF84'
            }}
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg" style={{ backgroundColor: '#00FF84' }}></div>
              <div>
                <div className="h-3 rounded w-20 mb-1" style={{ backgroundColor: 'rgba(255, 255, 255, 0.6)' }}></div>
                <div className="h-2 rounded w-16" style={{ backgroundColor: 'rgba(255, 255, 255, 0.4)' }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute top-40 right-20 opacity-30 animate-float hidden lg:block" style={{ animationDelay: '1s' }}>
          <div 
            className="backdrop-blur-sm rounded-xl p-4 w-40 shadow-xl border"
            style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderColor: '#00FF84'
            }}
          >
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-lg" style={{ backgroundColor: '#00FF84' }}></div>
              <div>
                <div className="h-2 rounded w-16 mb-1" style={{ backgroundColor: 'rgba(255, 255, 255, 0.6)' }}></div>
                <div className="h-2 rounded w-12" style={{ backgroundColor: 'rgba(255, 255, 255, 0.4)' }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-40 left-20 opacity-30 animate-float hidden lg:block" style={{ animationDelay: '2s' }}>
          <div 
            className="backdrop-blur-sm rounded-xl p-4 w-44 shadow-xl border"
            style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderColor: '#00FF84'
            }}
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg" style={{ backgroundColor: '#00FF84' }}></div>
              <div>
                <div className="h-3 rounded w-18 mb-1" style={{ backgroundColor: 'rgba(255, 255, 255, 0.6)' }}></div>
                <div className="h-2 rounded w-14" style={{ backgroundColor: 'rgba(255, 255, 255, 0.4)' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
            style={{ color: '#FFFFFF' }}
          >
            Find Your Dream Job Today
          </h1>
          <p 
            className="text-lg md:text-xl lg:text-2xl mb-10 max-w-3xl mx-auto font-medium leading-relaxed"
            style={{ color: '#B0B0B0' }}
          >
            Connect with top companies and discover opportunities that match your skills
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-4xl mx-auto mb-10">
            <div 
              className="flex flex-col md:flex-row gap-3 p-3 rounded-xl shadow-xl border"
              style={{ 
                backgroundColor: '#FFFFFF',
                borderColor: '#00FF84'
              }}
            >
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search jobs, companies, or locations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 text-lg bg-transparent border-none outline-none font-medium"
                  style={{ color: '#000000' }}
                />
              </div>
              <div className="md:w-56">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 text-lg bg-transparent border-none outline-none cursor-pointer font-medium"
                  style={{ color: '#000000' }}
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
                className="px-6 py-3 font-bold text-lg rounded-lg transition-all duration-300 hover:shadow-lg flex items-center justify-center space-x-2"
                style={{ 
                  backgroundColor: '#00FF84',
                  color: '#000000'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#00E676';
                  e.target.style.boxShadow = '0 8px 20px rgba(0, 255, 132, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#00FF84';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <MagnifyingGlassIcon className="h-5 w-5" />
                <span>Search</span>
              </button>
            </div>
          </form>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/jobs"
              className="px-8 py-4 font-bold text-lg rounded-xl transition-all duration-300 hover:shadow-lg transform hover:scale-105"
              style={{ 
                backgroundColor: '#00FF84',
                color: '#000000'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#00E676';
                e.target.style.boxShadow = '0 10px 25px rgba(0, 255, 132, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#00FF84';
                e.target.style.boxShadow = 'none';
              }}
            >
              Browse Jobs
            </Link>
            <Link
              to="/employers"
              className="px-8 py-4 font-bold text-lg rounded-xl transition-all duration-300 hover:shadow-lg transform hover:scale-105 border-2"
              style={{ 
                backgroundColor: 'transparent',
                color: '#FFFFFF',
                borderColor: '#FFFFFF'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#FFFFFF';
                e.target.style.color = '#000000';
                e.target.style.boxShadow = '0 10px 25px rgba(255, 255, 255, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = '#FFFFFF';
                e.target.style.boxShadow = 'none';
              }}
            >
              For Employers
            </Link>
          </div>
        </div>
      </div>

      {/* Welcome Message for Authenticated Users */}
      {isAuthenticated && (
        <div 
          className="border-b"
          style={{ 
            backgroundColor: '#0C1B33',
            borderBottomColor: '#00FF84'
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="text-center">
              <p className="text-lg font-medium" style={{ color: '#FFFFFF' }}>
                Welcome back, <span className="font-bold" style={{ color: '#00FF84' }}>{user?.first_name}</span>!
                Ready to find your next opportunity?
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Section */}
      <div 
        className="py-16 relative"
        style={{ backgroundColor: '#0C1B33' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Active Jobs */}
            <div 
              className="text-center p-6 rounded-xl transition-all duration-300 hover:transform hover:scale-105 cursor-pointer group border"
              style={{ 
                backgroundColor: '#FFFFFF',
                borderColor: 'transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#00FF84';
                e.currentTarget.style.boxShadow = '0 15px 30px rgba(0, 255, 132, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'transparent';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div className="mb-4">
                <div 
                  className="w-12 h-12 rounded-xl mx-auto flex items-center justify-center"
                  style={{ backgroundColor: '#00FF84' }}
                >
                  <BriefcaseIcon className="h-6 w-6" style={{ color: '#000000' }} />
                </div>
              </div>
              <div 
                className="text-3xl md:text-4xl font-bold mb-2"
                style={{ color: '#00FF84' }}
              >
                1,200+
              </div>
              <div 
                className="text-lg font-medium"
                style={{ color: '#000000' }}
              >
                Active Jobs
              </div>
            </div>

            {/* Companies */}
            <div 
              className="text-center p-6 rounded-xl transition-all duration-300 hover:transform hover:scale-105 cursor-pointer group border"
              style={{ 
                backgroundColor: '#FFFFFF',
                borderColor: 'transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#00FF84';
                e.currentTarget.style.boxShadow = '0 15px 30px rgba(0, 255, 132, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'transparent';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div className="mb-4">
                <div 
                  className="w-12 h-12 rounded-xl mx-auto flex items-center justify-center"
                  style={{ backgroundColor: '#00FF84' }}
                >
                  <BuildingOfficeIcon className="h-6 w-6" style={{ color: '#000000' }} />
                </div>
              </div>
              <div 
                className="text-3xl md:text-4xl font-bold mb-2"
                style={{ color: '#00FF84' }}
              >
                500+
              </div>
              <div 
                className="text-lg font-medium"
                style={{ color: '#000000' }}
              >
                Companies
              </div>
            </div>

            {/* Job Seekers */}
            <div 
              className="text-center p-6 rounded-xl transition-all duration-300 hover:transform hover:scale-105 cursor-pointer group border"
              style={{ 
                backgroundColor: '#FFFFFF',
                borderColor: 'transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#00FF84';
                e.currentTarget.style.boxShadow = '0 15px 30px rgba(0, 255, 132, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'transparent';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div className="mb-4">
                <div 
                  className="w-12 h-12 rounded-xl mx-auto flex items-center justify-center"
                  style={{ backgroundColor: '#00FF84' }}
                >
                  <UserGroupIcon className="h-6 w-6" style={{ color: '#000000' }} />
                </div>
              </div>
              <div 
                className="text-3xl md:text-4xl font-bold mb-2"
                style={{ color: '#00FF84' }}
              >
                50,000+
              </div>
              <div 
                className="text-lg font-medium"
                style={{ color: '#000000' }}
              >
                Job Seekers
              </div>
            </div>

            {/* Success Rate */}
            <div 
              className="text-center p-6 rounded-xl transition-all duration-300 hover:transform hover:scale-105 cursor-pointer group border"
              style={{ 
                backgroundColor: '#FFFFFF',
                borderColor: 'transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#00FF84';
                e.currentTarget.style.boxShadow = '0 15px 30px rgba(0, 255, 132, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'transparent';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div className="mb-4">
                <div 
                  className="w-12 h-12 rounded-xl mx-auto flex items-center justify-center"
                  style={{ backgroundColor: '#00FF84' }}
                >
                  <CheckIcon className="h-6 w-6" style={{ color: '#000000' }} />
                </div>
              </div>
              <div 
                className="text-3xl md:text-4xl font-bold mb-2"
                style={{ color: '#00FF84' }}
              >
                95%
              </div>
              <div 
                className="text-lg font-medium"
                style={{ color: '#000000' }}
              >
                Success Rate
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Jobs Section */}
      <div 
        className="py-16"
        style={{ backgroundColor: '#0C1B33' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: '#FFFFFF' }}
            >
              Featured Opportunities
            </h2>
            <p 
              className="text-lg font-medium"
              style={{ color: '#B0B0B0' }}
            >
              Discover the best job opportunities from top companies
            </p>
          </div>

          {/* Scrollable Featured Jobs */}
          <div className="relative">
            {/* Scroll Buttons */}
            <button
              onClick={scrollLeft}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
              style={{ 
                backgroundColor: '#00FF84',
                color: '#000000'
              }}
            >
              <ChevronLeftIcon className="h-6 w-6" />
            </button>
            
            <button
              onClick={scrollRight}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
              style={{ 
                backgroundColor: '#00FF84',
                color: '#000000'
              }}
            >
              <ChevronRightIcon className="h-6 w-6" />
            </button>

            {/* Scrollable Container */}
            <div 
              id="featured-jobs-container"
              className="flex overflow-x-auto scrollbar-hide space-x-6 pb-4"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {featuredJobs.map((job) => (
                <div
                  key={job.id}
                  className="flex-shrink-0 w-80 rounded-xl p-6 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-xl cursor-pointer group border"
                  style={{ 
                    backgroundColor: '#FFFFFF',
                    borderColor: 'transparent'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#00FF84';
                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 255, 132, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'transparent';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {/* Featured Badge */}
                  <div className="flex justify-end mb-4">
                    <span 
                      className="px-3 py-1 text-sm font-bold rounded-full flex items-center"
                      style={{ 
                        backgroundColor: '#00FF84',
                        color: '#000000'
                      }}
                    >
                      <StarIcon className="h-4 w-4 mr-1" />
                      Featured
                    </span>
                  </div>

                  {/* Company Logo */}
                  <div className="flex items-center mb-4">
                    <img
                      src={getCompanyLogoUrl(job.company) || "/placeholder.svg"}
                      alt={`${job.company?.name || 'Company'} logo`}
                      className="w-12 h-12 rounded-lg mr-3 shadow-md"
                    />
                    <div>
                      <h3 
                        className="text-lg font-bold mb-1"
                        style={{ color: '#000000' }}
                      >
                        {job.title}
                      </h3>
                      <p 
                        className="text-sm font-medium"
                        style={{ color: '#666666' }}
                      >
                        {job.company?.name || 'Unknown Company'}
                      </p>
                    </div>
                  </div>

                  {/* Job Details */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center space-x-3 flex-wrap gap-2">
                      <span 
                        className="px-3 py-1 text-sm font-medium rounded-lg flex items-center"
                        style={{ 
                          backgroundColor: 'rgba(12, 27, 51, 0.1)',
                          color: '#0C1B33'
                        }}
                      >
                        <MapPinIcon className="h-4 w-4 mr-1" />
                        {job.location || 'Remote'}
                      </span>
                      <span 
                        className="px-3 py-1 text-sm font-medium rounded-lg flex items-center"
                        style={{ 
                          backgroundColor: 'rgba(12, 27, 51, 0.1)',
                          color: '#0C1B33'
                        }}
                      >
                        <ClockIcon className="h-4 w-4 mr-1" />
                        {job.job_type || 'Full-time'}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <CurrencyDollarIcon className="h-5 w-5 mr-2" style={{ color: '#00FF84' }} />
                      <span 
                        className="text-lg font-bold"
                        style={{ color: '#00FF84' }}
                      >
                        {job.salary_min ? `$${job.salary_min.toLocaleString()} - $${job.salary_max?.toLocaleString() || '+'}` : 'Competitive Salary'}
                      </span>
                    </div>
                  </div>

                  {/* Apply Button */}
                  <Link
                    to={`/${job.slug}/`}
                    className="w-full py-3 font-bold rounded-lg transition-all duration-300 hover:shadow-lg block text-center"
                    style={{ 
                      backgroundColor: '#00FF84',
                      color: '#000000'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#00E676';
                      e.target.style.boxShadow = '0 6px 20px rgba(0, 255, 132, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#00FF84';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* View All Jobs CTA */}
          <div className="text-center mt-12">
            <Link
              to="/jobs"
              className="inline-block px-10 py-4 font-bold text-xl rounded-xl transition-all duration-300 hover:shadow-lg transform hover:scale-105"
              style={{ 
                backgroundColor: '#00FF84',
                color: '#000000'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#00E676';
                e.target.style.boxShadow = '0 12px 30px rgba(0, 255, 132, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#00FF84';
                e.target.style.boxShadow = 'none';
              }}
            >
              View All Jobs
            </Link>
          </div>
        </div>
      </div>

      {/* CTA Section for Non-Authenticated Users */}
      {!isAuthenticated && (
        <div 
          className="py-16"
          style={{ backgroundColor: '#0C1B33' }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: '#FFFFFF' }}
            >
              Ready to Start Your Job Search?
            </h2>
            <p 
              className="text-lg md:text-xl mb-10 font-medium"
              style={{ color: '#B0B0B0' }}
            >
              Join thousands of job seekers who found their dream jobs through our platform.
            </p>
            <Link
              to="/register"
              className="inline-block px-10 py-4 font-bold text-xl rounded-xl transition-all duration-300 hover:shadow-lg transform hover:scale-105"
              style={{ 
                backgroundColor: '#00FF84',
                color: '#000000'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#00E676';
                e.target.style.boxShadow = '0 12px 30px rgba(0, 255, 132, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#00FF84';
                e.target.style.boxShadow = 'none';
              }}
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
