import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import {
  MapPinIcon,
  UsersIcon,
  CalendarIcon,
  BuildingOfficeIcon,
  CheckBadgeIcon,
  HeartIcon,
  ShareIcon,
  GlobeAltIcon,
  EnvelopeIcon,
  PhoneIcon,
  ClockIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import {
  HeartIcon as HeartSolidIcon,
  CheckBadgeIcon as CheckBadgeSolidIcon
} from '@heroicons/react/24/solid';

const CompanyProfile = () => {
  const { slug } = useParams();
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('about');
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch company details using slug
        const companyResponse = await api.get(`/companies/${slug}/`);
        setCompany(companyResponse.data);
        
        // Fetch company jobs
        const jobsResponse = await api.get(`/jobs/?company=${companyResponse.data.id}`);
        const jobsData = jobsResponse.data.results || jobsResponse.data;
        setJobs(Array.isArray(jobsData) ? jobsData : []);
        
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.detail || 'Failed to fetch company data');
        setLoading(false);
        console.error('Error fetching data:', err);
      }
    };

    if (slug) {
      fetchCompanyData();
    }
  }, [slug]);

  const handleFollowCompany = async () => {
    try {
      if (isFollowing) {
        await api.delete(`/companies/${slug}/unfollow/`);
      } else {
        await api.post(`/companies/${slug}/follow/`);
      }
      setIsFollowing(!isFollowing);
    } catch (err) {
      console.error('Failed to follow/unfollow company:', err);
      setError('Failed to follow/unfollow company');
    }
  };

  const tabs = [
    { id: 'about', label: 'About' },
    { id: 'jobs', label: 'Jobs' },
    { id: 'culture', label: 'Culture' }
  ];

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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: '#00FF84' }}></div>
          <p style={{ color: '#FFFFFF' }}>Loading company profile...</p>
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
          <p style={{ color: '#00FF84' }} className="text-lg">{error}</p>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: '#0C1B33', fontFamily: 'Poppins, sans-serif' }}
      >
        <div className="text-center">
          <p style={{ color: '#FFFFFF' }} className="text-lg">Company not found</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen"
      style={{ backgroundColor: '#0C1B33', fontFamily: 'Poppins, sans-serif' }}
    >
      {/* Hero Banner */}
      <div className="relative h-80 overflow-hidden">
        <img
          src={company.cover_image || "/placeholder.svg?height=320&width=1200&text=Company+Cover"}
          alt={`${company.name} cover`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
        
        {/* Company Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-start md:items-end space-y-4 md:space-y-0 md:space-x-6">
              {/* Company Logo */}
              <div className="flex-shrink-0">
                <img
                  src={getCompanyLogoUrl(company) || "/placeholder.svg"}
                  alt={`${company.name} logo`}
                  className="w-24 h-24 md:w-32 md:h-32 rounded-xl border-4 border-white shadow-lg bg-white"
                />
              </div>
              
              {/* Company Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-3 mb-2">
                  <h1 
                    className="text-3xl md:text-4xl font-bold truncate"
                    style={{ color: '#FFFFFF' }}
                  >
                    {company.name}
                  </h1>
                  {company.is_verified && (
                    <CheckBadgeSolidIcon 
                      className="h-8 w-8 flex-shrink-0"
                      style={{ color: '#00FF84' }}
                    />
                  )}
                </div>
                
                {/* Key Stats */}
                <div className="flex flex-wrap items-center gap-6 text-sm" style={{ color: '#B0B0B0' }}>
                  {company.founded_year && (
                    <div className="flex items-center space-x-2">
                      <CalendarIcon className="h-4 w-4" />
                      <span>Founded {company.founded_year}</span>
                    </div>
                  )}
                  {company.company_size && (
                    <div className="flex items-center space-x-2">
                      <UsersIcon className="h-4 w-4" />
                      <span>{company.company_size} employees</span>
                    </div>
                  )}
                  {company.industry && (
                    <div className="flex items-center space-x-2">
                      <BuildingOfficeIcon className="h-4 w-4" />
                      <span>{company.industry}</span>
                    </div>
                  )}
                  {company.location && (
                    <div className="flex items-center space-x-2">
                      <MapPinIcon className="h-4 w-4" />
                      <span>{company.location}</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleFollowCompany}
                  className="flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 hover:shadow-lg"
                  style={{ backgroundColor: '#00FF84', color: '#000000' }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#00E676'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#00FF84'}
                >
                  {isFollowing ? (
                    <HeartSolidIcon className="h-5 w-5" />
                  ) : (
                    <HeartIcon className="h-5 w-5" />
                  )}
                  <span>{isFollowing ? 'Following' : 'Follow Company'}</span>
                </button>
                
                <button className="p-3 rounded-lg transition-colors duration-200 hover:bg-white/10">
                  <ShareIcon className="h-5 w-5" style={{ color: '#FFFFFF' }} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="border-b-2 mb-8" style={{ borderColor: '#00FF84' }}>
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === tab.id ? 'border-current' : 'border-transparent hover:border-gray-500'
                }`}
                style={{
                  color: activeTab === tab.id ? '#00FF84' : '#B0B0B0',
                  borderColor: activeTab === tab.id ? '#00FF84' : 'transparent'
                }}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'about' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* About Section */}
              <div 
                className="rounded-xl p-6"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
              >
                <h2 className="text-2xl font-semibold mb-4" style={{ color: '#FFFFFF' }}>
                  About {company.name}
                </h2>
                <p className="text-base leading-relaxed mb-6" style={{ color: '#B0B0B0' }}>
                  {company.description || 'No description available for this company.'}
                </p>
              </div>

              {/* Mission & Values */}
              {(company.mission || company.values) && (
                <div 
                  className="rounded-xl p-6"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                >
                  {company.mission && (
                    <div className="mb-6">
                      <h3 className="text-xl font-semibold mb-3" style={{ color: '#FFFFFF' }}>
                        Our Mission
                      </h3>
                      <p style={{ color: '#B0B0B0' }}>{company.mission}</p>
                    </div>
                  )}
                  
                  {company.values && (
                    <div>
                      <h3 className="text-xl font-semibold mb-3" style={{ color: '#FFFFFF' }}>
                        Our Values
                      </h3>
                      <p style={{ color: '#B0B0B0' }}>{company.values}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Information */}
              <div 
                className="rounded-xl p-6"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
              >
                <h3 className="text-lg font-semibold mb-4" style={{ color: '#FFFFFF' }}>
                  Contact Information
                </h3>
                <div className="space-y-3">
                  {company.website && (
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 transition-colors duration-200"
                      style={{ color: '#B0B0B0' }}
                      onMouseEnter={(e) => e.target.style.color = '#00FF84'}
                      onMouseLeave={(e) => e.target.style.color = '#B0B0B0'}
                    >
                      <GlobeAltIcon className="h-5 w-5" style={{ color: '#00FF84' }} />
                      <span>Website</span>
                    </a>
                  )}
                  {company.email && (
                    <a
                      href={`mailto:${company.email}`}
                      className="flex items-center space-x-3 transition-colors duration-200"
                      style={{ color: '#B0B0B0' }}
                      onMouseEnter={(e) => e.target.style.color = '#00FF84'}
                      onMouseLeave={(e) => e.target.style.color = '#B0B0B0'}
                    >
                      <EnvelopeIcon className="h-5 w-5" style={{ color: '#00FF84' }} />
                      <span>{company.email}</span>
                    </a>
                  )}
                  {company.phone && (
                    <a
                      href={`tel:${company.phone}`}
                      className="flex items-center space-x-3 transition-colors duration-200"
                      style={{ color: '#B0B0B0' }}
                      onMouseEnter={(e) => e.target.style.color = '#00FF84'}
                      onMouseLeave={(e) => e.target.style.color = '#B0B0B0'}
                    >
                      <PhoneIcon className="h-5 w-5" style={{ color: '#00FF84' }} />
                      <span>{company.phone}</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Company Stats */}
              <div 
                className="rounded-xl p-6"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
              >
                <h3 className="text-lg font-semibold mb-4" style={{ color: '#FFFFFF' }}>
                  Company Stats
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span style={{ color: '#B0B0B0' }}>Open Positions</span>
                    <span style={{ color: '#00FF84' }} className="font-semibold">{jobs.length}</span>
                  </div>
                  {company.followers_count && (
                    <div className="flex justify-between">
                      <span style={{ color: '#B0B0B0' }}>Followers</span>
                      <span style={{ color: '#00FF84' }} className="font-semibold">{company.followers_count}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'jobs' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold" style={{ color: '#FFFFFF' }}>
                Open Positions ({jobs.length})
              </h2>
            </div>
            
            {jobs.length === 0 ? (
              <div 
                className="text-center py-12 rounded-xl"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
              >
                <BuildingOfficeIcon className="h-16 w-16 mx-auto mb-4" style={{ color: '#B0B0B0' }} />
                <p className="text-lg mb-2" style={{ color: '#FFFFFF' }}>No open positions</p>
                <p style={{ color: '#B0B0B0' }}>Check back later for new opportunities</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs.map((job) => (
                  <div
                    key={job.id}
                    className="rounded-xl p-6 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl border-2 border-transparent"
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                    onMouseEnter={(e) => e.target.style.borderColor = '#00FF84'}
                    onMouseLeave={(e) => e.target.style.borderColor = 'transparent'}
                  >
                    <h3 className="text-lg font-semibold mb-2" style={{ color: '#FFFFFF' }}>
                      {job.title}
                    </h3>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm" style={{ color: '#B0B0B0' }}>
                        <MapPinIcon className="h-4 w-4 mr-2" />
                        {job.location || 'Location not specified'}
                      </div>
                      <div className="flex items-center text-sm" style={{ color: '#B0B0B0' }}>
                        <ClockIcon className="h-4 w-4 mr-2" />
                        {job.job_type || 'Full-time'}
                      </div>
                      {job.salary && (
                        <div className="flex items-center text-sm font-semibold" style={{ color: '#00FF84' }}>
                          <CurrencyDollarIcon className="h-4 w-4 mr-2" />
                          {job.salary}
                        </div>
                      )}
                    </div>
                    
                    <p className="text-sm mb-4 line-clamp-3" style={{ color: '#B0B0B0' }}>
                      {job.description || 'No description available'}
                    </p>
                    
                    <Link
                      to={`/jobs/${job.slug || job.id}`}
                      className="block w-full py-3 px-4 rounded-lg font-semibold text-center transition-all duration-200 hover:shadow-lg"
                      style={{ backgroundColor: '#00FF84', color: '#000000' }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#00E676'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#00FF84'}
                    >
                      View Details
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'culture' && (
          <div className="space-y-8">
            {/* Company Culture */}
            <div 
              className="rounded-xl p-6"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
            >
              <h2 className="text-2xl font-semibold mb-6" style={{ color: '#FFFFFF' }}>
                Company Culture
              </h2>
              
              {company.culture_description ? (
                <p className="text-base leading-relaxed mb-6" style={{ color: '#B0B0B0' }}>
                  {company.culture_description}
                </p>
              ) : (
                <p style={{ color: '#B0B0B0' }}>
                  Learn more about our company culture and what it's like to work here.
                </p>
              )}
              
              {/* Culture Images */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="aspect-video rounded-lg overflow-hidden">
                    <img
                      src={`/placeholder.svg?height=200&width=300&text=Culture+Image+${i}`}
                      alt={`Company culture ${i}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Employee Testimonials */}
            <div 
              className="rounded-xl p-6"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
            >
              <h3 className="text-xl font-semibold mb-6" style={{ color: '#FFFFFF' }}>
                What Our Employees Say
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Sample testimonials - replace with real data from API */}
                <div className="p-4 rounded-lg" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
                  <p className="text-sm mb-4" style={{ color: '#B0B0B0' }}>
                    "Great company culture with amazing colleagues. The work-life balance is excellent and there are many opportunities for growth."
                  </p>
                  <div className="flex items-center">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                      style={{ backgroundColor: 'rgba(0, 255, 132, 0.1)' }}
                    >
                      <span className="text-sm font-semibold" style={{ color: '#00FF84' }}>JS</span>
                    </div>
                    <div>
                      <p className="font-medium" style={{ color: '#FFFFFF' }}>John Smith</p>
                      <p className="text-xs" style={{ color: '#B0B0B0' }}>Software Engineer</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 rounded-lg" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
                  <p className="text-sm mb-4" style={{ color: '#B0B0B0' }}>
                    "I love the innovative projects we work on and the supportive team environment. This company truly values its employees."
                  </p>
                  <div className="flex items-center">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                      style={{ backgroundColor: 'rgba(0, 255, 132, 0.1)' }}
                    >
                      <span className="text-sm font-semibold" style={{ color: '#00FF84' }}>AD</span>
                    </div>
                    <div>
                      <p className="font-medium" style={{ color: '#FFFFFF' }}>Alice Davis</p>
                      <p className="text-xs" style={{ color: '#B0B0B0' }}>Product Manager</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyProfile;
