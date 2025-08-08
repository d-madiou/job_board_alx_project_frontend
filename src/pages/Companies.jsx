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
  StarIcon
} from '@heroicons/react/24/outline';

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCompanies, setFilteredCompanies] = useState([]);

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
    const filtered = companies.filter(company =>
      company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (company.description && company.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (company.industry && company.industry.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setFilteredCompanies(filtered);
  }, [searchQuery, companies]);

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

  if (loading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: '#0C1B33', fontFamily: 'Poppins, sans-serif' }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 mx-auto mb-4" style={{ borderColor: '#00FF84' }}></div>
          <p className="text-lg font-medium" style={{ color: '#FFFFFF' }}>Loading companies...</p>
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
        <div className="text-center">
          <p style={{ color: '#FF6B6B' }} className="text-lg font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen"
      style={{ backgroundColor: '#0C1B33', fontFamily: 'Poppins, sans-serif' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4" style={{ color: '#FFFFFF' }}>
            Companies
          </h1>
          <p className="text-xl mb-8" style={{ color: '#B0B0B0' }}>
            Discover amazing companies and explore career opportunities
          </p>
          
          {/* Search Bar */}
          <div className="max-w-lg">
            <div className="relative">
              <input
                type="text"
                placeholder="Search companies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-12 py-4 rounded-xl border-2 outline-none text-lg font-medium"
                style={{ 
                  backgroundColor: '#FFFFFF',
                  borderColor: '#00FF84',
                  color: '#000000'
                }}
              />
              <MagnifyingGlassIcon 
                className="absolute right-4 top-1/2 transform -translate-y-1/2 h-6 w-6"
                style={{ color: '#00FF84' }}
              />
            </div>
          </div>
        </div>

        {/* Companies Grid */}
        {filteredCompanies.length === 0 ? (
          <div className="text-center py-16">
            <BuildingOfficeIcon className="h-20 w-20 mx-auto mb-6" style={{ color: '#B0B0B0' }} />
            <p className="text-2xl mb-4 font-medium" style={{ color: '#FFFFFF' }}>
              {searchQuery ? 'No companies found' : 'No companies available'}
            </p>
            <p className="text-lg" style={{ color: '#B0B0B0' }}>
              {searchQuery ? 'Try adjusting your search terms' : 'Check back later for new companies'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredCompanies.map((company) => (
              <Link
                key={company.id}
                to={`/companies/${company.slug}`}
                className="block rounded-2xl p-6 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl border-2"
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
                {/* Company Header */}
                <div className="text-center mb-6">
                  <div className="relative inline-block">
                    <img
                      src={getCompanyLogoUrl(company) || "/placeholder.svg"}
                      alt={`${company.name} logo`}
                      className="w-20 h-20 rounded-2xl mx-auto shadow-lg"
                    />
                    {company.is_verified && (
                      <div 
                        className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: '#00FF84' }}
                      >
                        <CheckBadgeIcon className="h-5 w-5" style={{ color: '#000000' }} />
                      </div>
                    )}
                  </div>
                  <h2 className="text-xl font-bold mt-4 mb-2" style={{ color: '#000000' }}>
                    {company.name}
                  </h2>
                  {company.industry && (
                    <p className="text-sm font-medium" style={{ color: '#666666' }}>
                      {company.industry}
                    </p>
                  )}
                </div>

                {/* Company Details */}
                <div className="space-y-3 mb-6">
                  {company.location && (
                    <div className="flex items-center text-sm" style={{ color: '#666666' }}>
                      <div 
                        className="w-8 h-8 rounded-lg flex items-center justify-center mr-3"
                        style={{ backgroundColor: 'rgba(0, 255, 132, 0.1)' }}
                      >
                        <MapPinIcon className="h-4 w-4" style={{ color: '#00FF84' }} />
                      </div>
                      <span className="font-medium">{company.location}</span>
                    </div>
                  )}
                  {company.company_size && (
                    <div className="flex items-center text-sm" style={{ color: '#666666' }}>
                      <div 
                        className="w-8 h-8 rounded-lg flex items-center justify-center mr-3"
                        style={{ backgroundColor: 'rgba(0, 255, 132, 0.1)' }}
                      >
                        <UsersIcon className="h-4 w-4" style={{ color: '#00FF84' }} />
                      </div>
                      <span className="font-medium">{company.company_size} employees</span>
                    </div>
                  )}
                  {company.website && (
                    <div className="flex items-center text-sm" style={{ color: '#666666' }}>
                      <div 
                        className="w-8 h-8 rounded-lg flex items-center justify-center mr-3"
                        style={{ backgroundColor: 'rgba(0, 255, 132, 0.1)' }}
                      >
                        <GlobeAltIcon className="h-4 w-4" style={{ color: '#00FF84' }} />
                      </div>
                      <span className="font-medium">Website</span>
                    </div>
                  )}
                </div>

                {/* Description */}
                <p className="text-sm mb-6 line-clamp-3 leading-relaxed" style={{ color: '#666666' }}>
                  {company.description || 'No description available for this company.'}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: '#E5E5E5' }}>
                  <span className="text-sm font-bold" style={{ color: '#00FF84' }}>
                    View Profile →
                  </span>
                  {company.jobs_count && (
                    <span 
                      className="text-xs px-3 py-1 rounded-full font-bold"
                      style={{
                        backgroundColor: 'rgba(0, 255, 132, 0.1)',
                        color: '#00FF84'
                      }}
                    >
                      {company.jobs_count} open positions
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Companies;