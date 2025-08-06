import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import {
  MagnifyingGlassIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  UsersIcon,
  GlobeAltIcon,
  CheckBadgeIcon
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

  if (loading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: '#282828', fontFamily: 'Poppins, sans-serif' }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: '#54990b' }}></div>
          <p style={{ color: '#F0F0F0' }}>Loading companies...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: '#282828', fontFamily: 'Poppins, sans-serif' }}
      >
        <div className="text-center">
          <p style={{ color: '#D98C3F' }} className="text-lg">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen"
      style={{ backgroundColor: '#282828', fontFamily: 'Poppins, sans-serif' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4" style={{ color: '#F0F0F0' }}>
            Companies
          </h1>
          <p className="text-lg mb-6" style={{ color: '#A0A0A0' }}>
            Discover amazing companies and explore career opportunities
          </p>
          
          {/* Search Bar */}
          <div className="max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder="Search companies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-12 py-3 rounded-lg border-none outline-none text-gray-800 placeholder-gray-500"
              />
              <MagnifyingGlassIcon 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5"
                style={{ color: '#54990b' }}
              />
            </div>
          </div>
        </div>

        {/* Companies Grid */}
        {filteredCompanies.length === 0 ? (
          <div className="text-center py-12">
            <BuildingOfficeIcon className="h-16 w-16 mx-auto mb-4" style={{ color: '#A0A0A0' }} />
            <p className="text-lg mb-2" style={{ color: '#F0F0F0' }}>
              {searchQuery ? 'No companies found' : 'No companies available'}
            </p>
            <p style={{ color: '#A0A0A0' }}>
              {searchQuery ? 'Try adjusting your search terms' : 'Check back later for new companies'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompanies.map((company) => (
              <Link
                key={company.id}
                to={`/companies/${company.id}`}
                className="block rounded-xl p-6 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
              >
                {/* Company Header */}
                <div className="flex items-start space-x-4 mb-4">
                  <img
                    src={company.logo || "/placeholder.svg?height=60&width=60&text=Logo"}
                    alt={`${company.name} logo`}
                    className="w-16 h-16 rounded-lg bg-white flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h2 className="text-lg font-semibold truncate" style={{ color: '#F0F0F0' }}>
                        {company.name}
                      </h2>
                      {company.is_verified && (
                        <CheckBadgeIcon className="h-5 w-5 flex-shrink-0" style={{ color: '#54990b' }} />
                      )}
                    </div>
                    {company.industry && (
                      <p className="text-sm truncate" style={{ color: '#A0A0A0' }}>
                        {company.industry}
                      </p>
                    )}
                  </div>
                </div>

                {/* Company Details */}
                <div className="space-y-2 mb-4">
                  {company.location && (
                    <div className="flex items-center text-sm" style={{ color: '#A0A0A0' }}>
                      <MapPinIcon className="h-4 w-4 mr-2" />
                      {company.location}
                    </div>
                  )}
                  {company.company_size && (
                    <div className="flex items-center text-sm" style={{ color: '#A0A0A0' }}>
                      <UsersIcon className="h-4 w-4 mr-2" />
                      {company.company_size} employees
                    </div>
                  )}
                  {company.website && (
                    <div className="flex items-center text-sm" style={{ color: '#A0A0A0' }}>
                      <GlobeAltIcon className="h-4 w-4 mr-2" />
                      Website
                    </div>
                  )}
                </div>

                {/* Description */}
                <p className="text-sm mb-4 line-clamp-3" style={{ color: '#A0A0A0' }}>
                  {company.description || 'No description available for this company.'}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium" style={{ color: '#54990b' }}>
                    View Profile →
                  </span>
                  {company.jobs_count && (
                    <span className="text-xs px-2 py-1 rounded-full" style={{ 
                      backgroundColor: 'rgba(84, 153, 11, 0.2)',
                      color: '#54990b'
                    }}>
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
