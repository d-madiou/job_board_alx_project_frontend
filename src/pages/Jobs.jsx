import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../contexts/auth';
import JobCard from './../components/common/JobCard';
import {
  FunnelIcon,
  AdjustmentsHorizontalIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

const Jobs = () => {
  const { logout } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);
  const jobsPerPage = 12;

  // Filter states
  const [filters, setFilters] = useState({
    search: '',
    category: [],
    location: '',
    experience_level: '',
    salaryRange: [0, 200000],
    job_type: [],
    sort_by: 'created_at',
  });

  // Filter options
  const [categories, setCategories] = useState([]);
  const experienceLevels = ['Entry-level', 'Mid-level', 'Senior', 'Executive'];
  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship'];
  const sortOptions = [
    { value: 'created_at', label: 'Most Recent' },
    { value: 'salary_min', label: 'Highest Salary' },
    { value: 'title', label: 'Title' },
  ];

  // Fetch categories and jobs
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const response = await api.get('jobs/categories/');
        const categoriesData = Array.isArray(response.data)
          ? response.data
          : Array.isArray(response.data?.categories)
          ? response.data.categories
          : [];
        setCategories(categoriesData);
      } catch (err) {
        console.error('Failed to fetch categories:', err.response?.data || err.message);
        setCategories([]);
      }
    };

    const fetchJobs = async () => {
      try {
        setLoading(true);
        const params = {
          page: currentPage,
          page_size: jobsPerPage,
          search: filters.search,
          category: filters.category.join(','),
          location: filters.location,
          experience_level: filters.experience_level,
          job_type: filters.job_type.join(','),
          salary_min: filters.salaryRange[0],
          salary_max: filters.salaryRange[1],
          ordering: filters.sort_by === 'salary_min' ? '-salary_min' : filters.sort_by,
        };
        const response = await api.get('/jobs/', { params });
        setJobs(response.data.results || []);
        setTotalJobs(response.data.count || 0);
        setLoading(false);
      } catch (err) {
        console.error('Jobs error:', err.response?.data || err.message);
        if (err.response?.status === 401) {
          logout();
          setError('Session expired. Please log in again.');
        } else {
          setError(err.response?.data?.detail || 'Failed to fetch jobs');
        }
        setLoading(false);
      }
    };

    fetchFilterOptions();
    fetchJobs();
  }, [currentPage, filters, logout]);

  // Filter handlers
  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
    setCurrentPage(1);
  };

  const handleCategoryChange = (categoryId) => {
    setFilters((prev) => ({
      ...prev,
      category: prev.category.includes(categoryId)
        ? prev.category.filter((c) => c !== categoryId)
        : [...prev.category, categoryId],
    }));
    setCurrentPage(1);
  };

  const handleJobTypeChange = (jobType) => {
    setFilters((prev) => ({
      ...prev,
      job_type: prev.job_type.includes(jobType)
        ? prev.job_type.filter((t) => t !== jobType)
        : [...prev.job_type, jobType],
    }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: [],
      location: '',
      experience_level: '',
      salaryRange: [0, 200000],
      job_type: [],
      sort_by: 'created_at',
    });
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(totalJobs / jobsPerPage);

  // Loading state
  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: '#0C1B33', fontFamily: 'Poppins, sans-serif' }}
      >
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-12 w-12 border-b-4 mx-auto mb-4"
            style={{ borderColor: '#00FF84' }}
          ></div>
          <p className="text-lg font-medium" style={{ color: '#FFFFFF' }}>Loading jobs...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: '#0C1B33', fontFamily: 'Poppins, sans-serif' }}
      >
        <div className="text-center">
          <p style={{ color: '#FF6B6B' }} className="text-lg font-medium mb-4">
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 rounded-lg font-medium transition-colors duration-200"
            style={{ 
              backgroundColor: '#00FF84',
              color: '#000000'
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: '#0C1B33', fontFamily: 'Poppins, sans-serif' }}
    >
      <div className="flex">
        {/* Sidebar Filter Panel */}
        <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-80 transition-transform duration-300 ease-in-out`}>
          <div 
            className="h-full p-6 overflow-y-auto border-r-2"
            style={{ 
              backgroundColor: '#0C1B33',
              borderRightColor: '#00FF84'
            }}
          >
            {/* Mobile Close Button */}
            <div className="lg:hidden flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold" style={{ color: '#FFFFFF' }}>Filters</h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-lg hover:bg-white/10"
              >
                <XMarkIcon className="h-6 w-6" style={{ color: '#FFFFFF' }} />
              </button>
            </div>

            {/* Search Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2" style={{ color: '#FFFFFF' }}>
                Search Jobs
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Job title, company..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full pl-4 pr-10 py-3 rounded-lg border-2 outline-none font-medium"
                  style={{ 
                    backgroundColor: '#FFFFFF',
                    borderColor: '#00FF84',
                    color: '#000000'
                  }}
                />
                <MagnifyingGlassIcon 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5"
                  style={{ color: '#00FF84' }}
                />
              </div>
            </div>

            {/* Categories */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-3" style={{ color: '#FFFFFF' }}>
                Categories
              </label>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {categories.map((category) => (
                  <label key={category.id} className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.category.includes(category.id)}
                      onChange={() => handleCategoryChange(category.id)}
                      className="sr-only"
                    />
                    <div 
                      className={`w-5 h-5 rounded border-2 mr-3 flex items-center justify-center transition-colors duration-200 ${
                        filters.category.includes(category.id) ? 'border-transparent' : 'border-gray-400'
                      }`}
                      style={{ 
                        backgroundColor: filters.category.includes(category.id) ? '#00FF84' : 'transparent'
                      }}
                    >
                      {filters.category.includes(category.id) && (
                        <svg className="w-3 h-3" style={{ color: '#000000' }} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <span className="text-sm font-medium" style={{ color: '#FFFFFF' }}>{category.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Location */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2" style={{ color: '#FFFFFF' }}>
                Location
              </label>
              <select
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                className="w-full px-4 py-3 rounded-lg border-2 outline-none cursor-pointer font-medium"
                style={{ 
                  backgroundColor: '#FFFFFF',
                  borderColor: '#00FF84',
                  color: '#000000'
                }}
              >
                <option value="">All Locations</option>
                <option value="remote">Remote</option>
                <option value="san francisco">San Francisco, CA</option>
                <option value="new york">New York, NY</option>
                <option value="austin">Austin, TX</option>
                <option value="seattle">Seattle, WA</option>
              </select>
            </div>

            {/* Experience Level */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-3" style={{ color: '#FFFFFF' }}>
                Experience Level
              </label>
              <div className="space-y-2">
                {experienceLevels.map((level) => (
                  <label key={level} className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="experienceLevel"
                      value={level}
                      checked={filters.experience_level === level}
                      onChange={(e) => handleFilterChange('experience_level', e.target.value)}
                      className="sr-only"
                    />
                    <div 
                      className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center transition-colors duration-200 ${
                        filters.experience_level === level ? 'border-transparent' : 'border-gray-400'
                      }`}
                      style={{ 
                        backgroundColor: filters.experience_level === level ? '#00FF84' : 'transparent'
                      }}
                    >
                      {filters.experience_level === level && (
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#000000' }}></div>
                      )}
                    </div>
                    <span className="text-sm font-medium" style={{ color: '#FFFFFF' }}>{level}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Salary Range */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-3" style={{ color: '#FFFFFF' }}>
                Salary Range
              </label>
              <div className="px-2">
                <input
                  type="range"
                  min="0"
                  max="200000"
                  step="10000"
                  value={filters.salaryRange[1]}
                  onChange={(e) => handleFilterChange('salaryRange', [0, parseInt(e.target.value)])}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #00FF84 0%, #00FF84 ${(filters.salaryRange[1] / 200000) * 100}%, #FFFFFF ${(filters.salaryRange[1] / 200000) * 100}%, #FFFFFF 100%)`
                  }}
                />
                <div className="flex justify-between text-xs mt-2" style={{ color: '#FFFFFF' }}>
                  <span>$0</span>
                  <span>${filters.salaryRange[1].toLocaleString()}+</span>
                </div>
              </div>
            </div>

            {/* Job Types */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-3" style={{ color: '#FFFFFF' }}>
                Job Type
              </label>
              <div className="space-y-2">
                {jobTypes.map((type) => (
                  <label key={type} className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.job_type.includes(type)}
                      onChange={() => handleJobTypeChange(type)}
                      className="sr-only"
                    />
                    <div 
                      className={`w-12 h-6 rounded-full mr-3 relative transition-colors duration-200`}
                      style={{ 
                        backgroundColor: filters.job_type.includes(type) ? '#00FF84' : '#FFFFFF'
                      }}
                    >
                      <div 
                        className={`absolute top-0.5 w-5 h-5 rounded-full transition-transform duration-200 ${
                          filters.job_type.includes(type) ? 'translate-x-6' : 'translate-x-0.5'
                        }`}
                        style={{ 
                          backgroundColor: filters.job_type.includes(type) ? '#000000' : '#0C1B33'
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium" style={{ color: '#FFFFFF' }}>{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Clear Filters */}
            <button
              onClick={clearFilters}
              className="w-full py-3 px-4 rounded-lg font-bold transition-all duration-200 hover:shadow-lg"
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
              Clear Filters
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-0">
          <div className="p-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
              <div className="flex items-center mb-4 lg:mb-0">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden mr-4 p-2 rounded-lg hover:bg-white/10"
                >
                  <FunnelIcon className="h-6 w-6" style={{ color: '#FFFFFF' }} />
                </button>
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold mb-2" style={{ color: '#FFFFFF' }}>
                    Job Listings
                  </h1>
                  <p className="text-sm font-medium" style={{ color: '#B0B0B0' }}>
                    {totalJobs} jobs found
                  </p>
                </div>
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium" style={{ color: '#FFFFFF' }}>
                  Sort by:
                </label>
                <select
                  value={filters.sort_by}
                  onChange={(e) => handleFilterChange('sort_by', e.target.value)}
                  className="px-4 py-2 rounded-lg border-2 outline-none cursor-pointer font-medium"
                  style={{ 
                    backgroundColor: '#FFFFFF',
                    borderColor: '#00FF84',
                    color: '#000000'
                  }}
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Job Cards Grid */}
            {jobs.length === 0 ? (
              <div className="text-center py-12">
                <AdjustmentsHorizontalIcon
                  className="h-16 w-16 mx-auto mb-4"
                  style={{ color: '#B0B0B0' }}
                />
                <p className="text-lg mb-2 font-medium" style={{ color: '#FFFFFF' }}>
                  No jobs found
                </p>
                <p className="mb-4" style={{ color: '#B0B0B0' }}>
                  Try adjusting your filters to see more results
                </p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                  style={{ 
                    backgroundColor: '#00FF84',
                    color: '#000000'
                  }}
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 mb-8">
                {jobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10"
                >
                  <ChevronLeftIcon className="h-5 w-5" style={{ color: '#FFFFFF' }} />
                </button>

                {/* Pagination numbers */}
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let page;
                  if (totalPages <= 5) {
                    page = i + 1;
                  } else if (currentPage <= 3) {
                    page = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    page = totalPages - 4 + i;
                  } else {
                    page = currentPage - 2 + i;
                  }
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                        currentPage === page ? 'text-black' : ''
                      }`}
                      style={{
                        backgroundColor: currentPage === page ? '#00FF84' : 'transparent',
                        color: currentPage === page ? '#000000' : '#FFFFFF',
                      }}
                      onMouseEnter={(e) => {
                        if (currentPage !== page) {
                          e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (currentPage !== page) {
                          e.target.style.backgroundColor = 'transparent';
                        }
                      }}
                    >
                      {page}
                    </button>
                  );
                })}

                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10"
                >
                  <ChevronRightIcon className="h-5 w-5" style={{ color: '#FFFFFF' }} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default Jobs;
