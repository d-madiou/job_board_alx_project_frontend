// pages/Jobs.jsx
import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../contexts/auth';
import JobFilters from '../components/common/JobFilters';
import JobCard from '../components/common/JobCard';
import {
  FunnelIcon,
  AdjustmentsHorizontalIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
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
        // Log the response to inspect its structure
        console.log('Categories API response:', response.data);
        // Ensure categories is an array
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
        style={{ backgroundColor: '#282828', fontFamily: 'Poppins, sans-serif' }}
      >
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
            style={{ borderColor: '#54990b' }}
          ></div>
          <p style={{ color: '#F0F0F0' }}>Loading jobs...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: '#282828', fontFamily: 'Poppins, sans-serif' }}
      >
        <div className="text-center">
          <p style={{ color: '#D98C3F' }} className="text-lg">
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 rounded-lg font-medium text-white transition-colors duration-200"
            style={{ backgroundColor: '#54990b' }}
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
      style={{ backgroundColor: '#282828', fontFamily: 'Poppins, sans-serif' }}
    >
      <div className="flex">
        {/* Sidebar Filter Panel */}
        <JobFilters
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          filters={filters}
          categories={categories}
          jobs={jobs}
          onFilterChange={handleFilterChange}
          onCategoryChange={handleCategoryChange}
          onJobTypeChange={handleJobTypeChange}
          onClearFilters={clearFilters}
        />

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
                  <FunnelIcon className="h-6 w-6" style={{ color: '#F0F0F0' }} />
                </button>
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold mb-2" style={{ color: '#F0F0F0' }}>
                    Job Listings
                  </h1>
                  <p className="text-sm" style={{ color: '#A0A0A0' }}>
                    {totalJobs} jobs found
                  </p>
                </div>
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium" style={{ color: '#F0F0F0' }}>
                  Sort by:
                </label>
                <select
                  value={filters.sort_by}
                  onChange={(e) => handleFilterChange('sort_by', e.target.value)}
                  className="px-4 py-2 rounded-lg border-none outline-none text-gray-800 cursor-pointer"
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
                  style={{ color: '#A0A0A0' }}
                />
                <p className="text-lg mb-2" style={{ color: '#F0F0F0' }}>
                  No jobs found
                </p>
                <p style={{ color: '#A0A0A0' }}>
                  Try adjusting your filters to see more results
                </p>
                <button
                  onClick={clearFilters}
                  className="mt-4 px-6 py-2 rounded-lg font-medium text-white transition-colors duration-200"
                  style={{ backgroundColor: '#54990b' }}
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
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
                  <ChevronLeftIcon className="h-5 w-5" style={{ color: '#F0F0F0' }} />
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
                        currentPage === page ? 'text-white' : ''
                      }`}
                      style={{
                        backgroundColor: currentPage === page ? '#54990b' : 'transparent',
                        color: currentPage === page ? 'white' : '#F0F0F0',
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
                  <ChevronRightIcon className="h-5 w-5" style={{ color: '#F0F0F0' }} />
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