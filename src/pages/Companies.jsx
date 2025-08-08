import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import {
  MagnifyingGlassIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  UsersIcon,
  GlobeAltIcon,
  CheckBadgeIcon,
  StarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  AdjustmentsHorizontalIcon,
  ViewColumnsIcon,
  Squares2X2Icon,
  BriefcaseIcon,
  TrophyIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('name'); // 'name', 'size', 'jobs'
  const itemsPerPage = 12;

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await api.get('/companies/');
        const data = response.data.results || response.data;
        const companiesArray = Array.isArray(data) ? data : [];
        setCompanies(companiesArray);
        setFilteredCompanies(companiesArray);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.detail || 'Failed to fetch companies');
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  useEffect(() => {
    let filtered = companies.filter(company =>
      company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (company.description && company.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (company.industry && company.industry.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    // Sort companies
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'size':
          return (b.company_size || 0) - (a.company_size || 0);
        case 'jobs':
          return (b.jobs_count || 0) - (a.jobs_count || 0);
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredCompanies(filtered);
    setCurrentPage(1);
  }, [searchQuery, companies, sortBy]);

  const getCompanyLogoUrl = (company) => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
    const logoPath = company.logo_display_url;
    
    if (logoPath) {
      return logoPath.startsWith('http') ? logoPath : `${baseUrl}${logoPath}`;
    }
    
    if (company.logo_url) {
      return company.logo_url;
    }
    
    return '/placeholder.svg?height=80&width=80&text=Logo';
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCompanies = filteredCompanies.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: '#0C1B33', fontFamily: 'Poppins, sans-serif' }}
      >
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-transparent border-t-[#00FF84] mx-auto mb-6"></div>
            <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-b-[#00FF84] animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <p className="text-xl font-medium" style={{ color: '#FFFFFF' }}>Loading companies...</p>
          <p className="text-sm mt-2" style={{ color: '#B0B0B0' }}>Discovering amazing opportunities</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: '#0C1B33', fontFamily: 'Poppins, sans-serif' }}
      >
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: 'rgba(255, 107, 107, 0.1)' }}>
            <BuildingOfficeIcon className="h-10 w-10" style={{ color: '#FF6B6B' }} />
          </div>
          <h2 className="text-2xl font-bold mb-4" style={{ color: '#FFFFFF' }}>Oops! Something went wrong</h2>
          <p style={{ color: '#FF6B6B' }} className="text-lg font-medium">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-6 px-6 py-3 rounded-xl font-semibold transition-all duration-300"
            style={{ backgroundColor: '#00FF84', color: '#000000' }}
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
      {/* Hero Section */}
      <div className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0C1B33 0%, #1a2744 100%)' }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-40 h-40 rounded-full" style={{ background: 'radial-gradient(circle, #00FF84 0%, transparent 70%)' }}></div>
          <div className="absolute bottom-20 right-20 w-60 h-60 rounded-full" style={{ background: 'radial-gradient(circle, #00FF84 0%, transparent 70%)' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full" style={{ background: 'radial-gradient(circle, #00FF84 0%, transparent 70%)' }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
          <div className="text-center mb-12">
            <div className="flex justify-center items-center mb-6">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mr-4" style={{ backgroundColor: 'rgba(0, 255, 132, 0.1)', backdropFilter: 'blur(10px)' }}>
                <SparklesIcon className="h-8 w-8" style={{ color: '#00FF84' }} />
              </div>
              <h1 className="text-5xl font-bold" style={{ color: '#FFFFFF' }}>
                Discover Companies
              </h1>
            </div>
            <p className="text-xl max-w-2xl mx-auto leading-relaxed" style={{ color: '#B0B0B0' }}>
              Explore innovative companies, discover career opportunities, and find your perfect workplace match
            </p>
            <div className="flex justify-center items-center mt-6 space-x-6">
              <div className="flex items-center text-sm" style={{ color: '#00FF84' }}>
                <TrophyIcon className="h-5 w-5 mr-2" />
                <span className="font-semibold">{filteredCompanies.length} Companies</span>
              </div>
              <div className="flex items-center text-sm" style={{ color: '#00FF84' }}>
                <BriefcaseIcon className="h-5 w-5 mr-2" />
                <span className="font-semibold">{filteredCompanies.reduce((acc, company) => acc + (company.jobs_count || 0), 0)} Jobs</span>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="max-w-4xl mx-auto">
            <div className="backdrop-blur-xl rounded-3xl p-6 border" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', borderColor: 'rgba(0, 255, 132, 0.2)' }}>
              <div className="flex flex-col lg:flex-row gap-4 items-center">
                {/* Search Bar */}
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Search companies, industries, or keywords..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-6 pr-14 py-4 rounded-2xl border-2 outline-none text-lg font-medium transition-all duration-300 focus:scale-105"
                    style={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      borderColor: '#00FF84',
                      color: '#000000',
                      boxShadow: '0 10px 30px rgba(0, 255, 132, 0.1)'
                    }}
                  />
                  <MagnifyingGlassIcon 
                    className="absolute right-5 top-1/2 transform -translate-y-1/2 h-6 w-6"
                    style={{ color: '#00FF84' }}
                  />
                </div>

                {/* Sort Dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-6 py-4 rounded-2xl border-2 outline-none font-medium transition-all duration-300"
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    borderColor: '#00FF84',
                    color: '#000000'
                  }}
                >
                  <option value="name">Sort by Name</option>
                  <option value="size">Sort by Size</option>
                  <option value="jobs">Sort by Jobs</option>
                </select>

                {/* View Toggle */}
                <div className="flex rounded-2xl p-1" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-3 rounded-xl transition-all duration-300 ${viewMode === 'grid' ? 'shadow-lg' : ''}`}
                    style={{ 
                      backgroundColor: viewMode === 'grid' ? '#00FF84' : 'transparent',
                      color: viewMode === 'grid' ? '#000000' : '#FFFFFF'
                    }}
                  >
                    <Squares2X2Icon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-3 rounded-xl transition-all duration-300 ${viewMode === 'list' ? 'shadow-lg' : ''}`}
                    style={{ 
                      backgroundColor: viewMode === 'list' ? '#00FF84' : 'transparent',
                      color: viewMode === 'list' ? '#000000' : '#FFFFFF'
                    }}
                  >
                    <ViewColumnsIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Companies Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Results Info */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold mb-2" style={{ color: '#FFFFFF' }}>
              {searchQuery ? `Search Results for "${searchQuery}"` : 'All Companies'}
            </h2>
            <p style={{ color: '#B0B0B0' }}>
              Showing {startIndex + 1}-{Math.min(endIndex, filteredCompanies.length)} of {filteredCompanies.length} companies
            </p>
          </div>
        </div>

        {/* Companies Display */}
        {filteredCompanies.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-8" style={{ backgroundColor: 'rgba(176, 176, 176, 0.1)' }}>
              <BuildingOfficeIcon className="h-16 w-16" style={{ color: '#B0B0B0' }} />
            </div>
            <h3 className="text-3xl font-bold mb-4" style={{ color: '#FFFFFF' }}>
              {searchQuery ? 'No companies found' : 'No companies available'}
            </h3>
            <p className="text-xl max-w-md mx-auto mb-8" style={{ color: '#B0B0B0' }}>
              {searchQuery ? 'Try adjusting your search terms or filters' : 'Check back later for new companies'}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 hover:scale-105"
                style={{ backgroundColor: '#00FF84', color: '#000000' }}
              >
                Clear Search
              </button>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {currentCompanies.map((company, index) => (
              <Link
                key={company.id}
                to={`/companies/${company.slug}`}
                className="group block"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative rounded-3xl p-8 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 border-2 overflow-hidden"
                     style={{ 
                       backgroundColor: '#FFFFFF',
                       borderColor: 'transparent',
                       boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
                     }}
                     onMouseEnter={(e) => {
                       e.currentTarget.style.borderColor = '#00FF84';
                       e.currentTarget.style.boxShadow = '0 20px 60px rgba(0, 255, 132, 0.3)';
                     }}
                     onMouseLeave={(e) => {
                       e.currentTarget.style.borderColor = 'transparent';
                       e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
                     }}>
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                       style={{ background: 'linear-gradient(45deg, rgba(0, 255, 132, 0.05) 0%, rgba(0, 255, 132, 0.01) 100%)' }}></div>

                  {/* Company Header */}
                  <div className="relative text-center mb-6">
                    <div className="relative inline-block">
                      <div className="w-24 h-24 rounded-3xl overflow-hidden shadow-xl mx-auto mb-4 transition-transform duration-500 group-hover:rotate-6">
                        <img
                          src={getCompanyLogoUrl(company)}
                          alt={`${company.name} logo`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {company.is_verified && (
                        <div 
                          className="absolute -top-1 -right-1 w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
                          style={{ backgroundColor: '#00FF84' }}
                        >
                          <CheckBadgeIcon className="h-6 w-6" style={{ color: '#000000' }} />
                        </div>
                      )}
                    </div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-green-600 transition-colors duration-300" style={{ color: '#000000' }}>
                      {company.name}
                    </h3>
                    {company.industry && (
                      <p className="text-sm font-semibold px-3 py-1 rounded-full inline-block" style={{ 
                        color: '#00FF84',
                        backgroundColor: 'rgba(0, 255, 132, 0.1)'
                      }}>
                        {company.industry}
                      </p>
                    )}
                  </div>

                  {/* Company Details */}
                  <div className="space-y-4 mb-6">
                    {company.location && (
                      <div className="flex items-center text-sm">
                        <div className="w-10 h-10 rounded-2xl flex items-center justify-center mr-3 transition-colors duration-300 group-hover:bg-green-50"
                             style={{ backgroundColor: 'rgba(0, 255, 132, 0.1)' }}>
                          <MapPinIcon className="h-5 w-5" style={{ color: '#00FF84' }} />
                        </div>
                        <span className="font-semibold" style={{ color: '#666666' }}>{company.location}</span>
                      </div>
                    )}
                    {company.company_size && (
                      <div className="flex items-center text-sm">
                        <div className="w-10 h-10 rounded-2xl flex items-center justify-center mr-3 transition-colors duration-300 group-hover:bg-green-50"
                             style={{ backgroundColor: 'rgba(0, 255, 132, 0.1)' }}>
                          <UsersIcon className="h-5 w-5" style={{ color: '#00FF84' }} />
                        </div>
                        <span className="font-semibold" style={{ color: '#666666' }}>{company.company_size} employees</span>
                      </div>
                    )}
                    {company.website && (
                      <div className="flex items-center text-sm">
                        <div className="w-10 h-10 rounded-2xl flex items-center justify-center mr-3 transition-colors duration-300 group-hover:bg-green-50"
                             style={{ backgroundColor: 'rgba(0, 255, 132, 0.1)' }}>
                          <GlobeAltIcon className="h-5 w-5" style={{ color: '#00FF84' }} />
                        </div>
                        <span className="font-semibold" style={{ color: '#666666' }}>Website Available</span>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-sm mb-6 line-clamp-3 leading-relaxed" style={{ color: '#666666' }}>
                    {company.description || 'An innovative company creating amazing products and services for the modern world.'}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-6 border-t" style={{ borderColor: '#E5E5E5' }}>
                    <span className="text-sm font-bold group-hover:translate-x-2 transition-transform duration-300" style={{ color: '#00FF84' }}>
                      Explore Company →
                    </span>
                    {company.jobs_count > 0 && (
                      <span 
                        className="text-xs px-4 py-2 rounded-full font-bold"
                        style={{
                          backgroundColor: 'rgba(0, 255, 132, 0.1)',
                          color: '#00FF84'
                        }}
                      >
                        {company.jobs_count} positions
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          // List View
          <div className="space-y-6">
            {currentCompanies.map((company, index) => (
              <Link
                key={company.id}
                to={`/companies/${company.slug}`}
                className="block"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] border-2 flex items-center space-x-6"
                     style={{ 
                       backgroundColor: '#FFFFFF',
                       borderColor: 'transparent',
                       boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
                     }}
                     onMouseEnter={(e) => {
                       e.currentTarget.style.borderColor = '#00FF84';
                       e.currentTarget.style.boxShadow = '0 10px 40px rgba(0, 255, 132, 0.2)';
                     }}
                     onMouseLeave={(e) => {
                       e.currentTarget.style.borderColor = 'transparent';
                       e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
                     }}>
                  
                  {/* Company Logo */}
                  <div className="relative flex-shrink-0">
                    <img
                      src={getCompanyLogoUrl(company)}
                      alt={`${company.name} logo`}
                      className="w-16 h-16 rounded-2xl"
                    />
                    {company.is_verified && (
                      <div 
                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: '#00FF84' }}
                      >
                        <CheckBadgeIcon className="h-4 w-4" style={{ color: '#000000' }} />
                      </div>
                    )}
                  </div>

                  {/* Company Info */}
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold" style={{ color: '#000000' }}>
                        {company.name}
                      </h3>
                      {company.jobs_count > 0 && (
                        <span 
                          className="text-sm px-3 py-1 rounded-full font-bold"
                          style={{
                            backgroundColor: 'rgba(0, 255, 132, 0.1)',
                            color: '#00FF84'
                          }}
                        >
                          {company.jobs_count} positions
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-6 mb-3">
                      {company.industry && (
                        <span className="text-sm font-semibold" style={{ color: '#00FF84' }}>
                          {company.industry}
                        </span>
                      )}
                      {company.location && (
                        <div className="flex items-center text-sm" style={{ color: '#666666' }}>
                          <MapPinIcon className="h-4 w-4 mr-1" />
                          <span>{company.location}</span>
                        </div>
                      )}
                      {company.company_size && (
                        <div className="flex items-center text-sm" style={{ color: '#666666' }}>
                          <UsersIcon className="h-4 w-4 mr-1" />
                          <span>{company.company_size} employees</span>
                        </div>
                      )}
                    </div>
                    
                    <p className="text-sm line-clamp-2" style={{ color: '#666666' }}>
                      {company.description || 'An innovative company creating amazing products and services.'}
                    </p>
                  </div>

                  {/* Arrow */}
                  <div className="flex-shrink-0">
                    <ChevronRightIcon className="h-6 w-6" style={{ color: '#00FF84' }} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-16 space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-3 rounded-xl transition-all duration-300 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'}`}
              style={{ 
                backgroundColor: currentPage === 1 ? '#333' : '#00FF84',
                color: currentPage === 1 ? '#666' : '#000000'
              }}
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>

            {[...Array(totalPages)].map((_, index) => {
              const page = index + 1;
              const isCurrentPage = page === currentPage;
              const isNearCurrentPage = Math.abs(page - currentPage) <= 2;
              const isFirstOrLast = page === 1 || page === totalPages;

              if (!isNearCurrentPage && !isFirstOrLast) {
                if (page === 2 || page === totalPages - 1) {
                  return <span key={page} className="px-2" style={{ color: '#666666' }}>...</span>;
                }
                return null;
              }

              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${isCurrentPage ? 'scale-110 shadow-lg' : 'hover:scale-105'}`}
                  style={{
                    backgroundColor: isCurrentPage ? '#00FF84' : 'rgba(255, 255, 255, 0.1)',
                    color: isCurrentPage ? '#000000' : '#FFFFFF'
                  }}
                >
                  {page}
                </button>
              );
            })}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`p-3 rounded-xl transition-all duration-300 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'}`}
              style={{ 
                backgroundColor: currentPage === totalPages ? '#333' : '#00FF84',
                color: currentPage === totalPages ? '#666' : '#000000'
              }}
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Companies;