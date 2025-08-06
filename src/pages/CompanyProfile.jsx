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
  const { id } = useParams();
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

        // Fetch company details
        const companyResponse = await api.get(`/companies/${id}/`);
        setCompany(companyResponse.data);

        // Fetch company jobs
        const jobsResponse = await api.get(`/jobs/?company=${id}`);
        const jobsData = jobsResponse.data.results || jobsResponse.data;
        setJobs(Array.isArray(jobsData) ? jobsData : []);

        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.detail || 'Failed to fetch company data');
        setLoading(false);
        console.error('Error fetching data:', err);
      }
    };

    if (id) {
      fetchCompanyData();
    }
  }, [id]);

  const handleFollowCompany = async () => {
    try {
      if (isFollowing) {
        await api.delete(`/companies/${id}/unfollow/`);
      } else {
        await api.post(`/companies/${id}/follow/`);
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

  if (loading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: '#282828', fontFamily: 'Poppins, sans-serif' }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: '#54990b' }}></div>
          <p style={{ color: '#F0F0F0' }}>Loading company profile...</p>
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

  if (!company) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: '#282828', fontFamily: 'Poppins, sans-serif' }}
      >
        <div className="text-center">
          <p style={{ color: '#F0F0F0' }} className="text-lg">Company not found</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen"
      style={{ backgroundColor: '#282828', fontFamily: 'Poppins, sans-serif' }}
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
                  src={company.logo || "/placeholder.svg?height=120&width=120&text=Logo"}
                  alt={`${company.name} logo`}
                  className="w-24 h-24 md:w-32 md:h-32 rounded-xl border-4 border-white shadow-lg bg-white"
                />
              </div>
              
              {/* Company Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-3 mb-2">
                  <h1 
                    className="text-3xl md:text-4xl font-bold truncate"
                    style={{ color: '#F0F0F0' }}
                  >
                    {company.name}
                  </h1>
                  {company.is_verified && (
                    <CheckBadgeSolidIcon 
                      className="h-8 w-8 flex-shrink-0"
                      style={{ color: '#54990b' }}
                    />
                  )}
                </div>
                
                {/* Key Stats */}
                <div className="flex flex-wrap items-center gap-6 text-sm" style={{ color: '#A0A0A0' }}>
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
                  className="flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold text-white transition-all duration-200 hover:shadow-lg"
                  style={{ backgroundColor: '#D98C3F' }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#E09A4F'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#D98C3F'}
                >
                  {isFollowing ? (
                    <HeartSolidIcon className="h-5 w-5" />
                  ) : (
                    <HeartIcon className="h-5 w-5" />
                  )}
                  <span>{isFollowing ? 'Following' : 'Follow Company'}</span>
                </button>
                
                <button className="p-3 rounded-lg transition-colors duration-200 hover:bg-white/10">
                  <ShareIcon className="h-5 w-5" style={{ color: '#F0F0F0' }} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="border-b mb-8" style={{ borderColor: '#3F7A8C' }}>
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === tab.id ? 'border-current' : 'border-transparent hover:border-gray-500'
                }`}
                style={{
                  color: activeTab === tab.id ? '#54990b' : '#A0A0A0',
                  borderColor: activeTab === tab.id ? '#54990b' : 'transparent'
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
                <h2 className="text-2xl font-semibold mb-4" style={{ color: '#F0F0F0' }}>
                  About {company.name}
                </h2>
                <p className="text-base leading-relaxed mb-6" style={{ color: '#A0A0A0' }}>
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
                      <h3 className="text-xl font-semibold mb-3" style={{ color: '#F0F0F0' }}>
                        Our Mission
                      </h3>
                      <p style={{ color: '#A0A0A0' }}>{company.mission}</p>
                    </div>
                  )}
                  
                  {company.values && (
                    <div>
                      <h3 className="text-xl font-semibold mb-3" style={{ color: '#F0F0F0' }}>
                        Our Values
                      </h3>
                      <p style={{ color: '#A0A0A0' }}>{company.values}</p>
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
                <h3 className="text-lg font-semibold mb-4" style={{ color: '#F0F0F0' }}>
                  Contact Information
                </h3>
                <div className="space-y-3">
                  {company.website && (
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 transition-colors duration-200"
                      style={{ color: '#A0A0A0' }}
                      onMouseEnter={(e) => e.target.style.color = '#3F7A8C'}
                      onMouseLeave={(e) => e.target.style.color = '#A0A0A0'}
                    >
                      <GlobeAltIcon className="h-5 w-5" style={{ color: '#3F7A8C' }} />
                      <span>Website</span>
                    </a>
                  )}
                  {company.email && (
                    <a
                      href={`mailto:${company.email}`}
                      className="flex items-center space-x-3 transition-colors duration-200"
                      style={{ color: '#A0A0A0' }}
                      onMouseEnter={(e) => e.target.style.color = '#3F7A8C'}
                      onMouseLeave={(e) => e.target.style.color = '#A0A0A0'}
                    >
                      <EnvelopeIcon className="h-5 w-5" style={{ color: '#3F7A8C' }} />
                      <span>{company.email}</span>
                    </a>
                  )}
                  {company.phone && (
                    <a
                      href={`tel:${company.phone}`}
                      className="flex items-center space-x-3 transition-colors duration-200"
                      style={{ color: '#A0A0A0' }}
                      onMouseEnter={(e) => e.target.style.color = '#3F7A8C'}
                      onMouseLeave={(e) => e.target.style.color = '#A0A0A0'}
                    >
                      <PhoneIcon className="h-5 w-5" style={{ color: '#3F7A8C' }} />
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
                <h3 className="text-lg font-semibold mb-4" style={{ color: '#F0F0F0' }}>
                  Company Stats
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span style={{ color: '#A0A0A0' }}>Open Positions</span>
                    <span style={{ color: '#54990b' }} className="font-semibold">{jobs.length}</span>
                  </div>
                  {company.followers_count && (
                    <div className="flex justify-between">
                      <span style={{ color: '#A0A0A0' }}>Followers</span>
                      <span style={{ color: '#54990b' }} className="font-semibold">{company.followers_count}</span>
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
              <h2 className="text-2xl font-semibold" style={{ color: '#F0F0F0' }}>
                Open Positions ({jobs.length})
              </h2>
            </div>
            
            {jobs.length === 0 ? (
              <div 
                className="text-center py-12 rounded-xl"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
              >
                <BuildingOfficeIcon className="h-16 w-16 mx-auto mb-4" style={{ color: '#A0A0A0' }} />
                <p className="text-lg mb-2" style={{ color: '#F0F0F0' }}>No open positions</p>
                <p style={{ color: '#A0A0A0' }}>Check back later for new opportunities</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs.map((job) => (
                  <div
                    key={job.id}
                    className="rounded-xl p-6 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl"
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                  >
                    <h3 className="text-lg font-semibold mb-2" style={{ color: '#F0F0F0' }}>
                      {job.title}
                    </h3>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm" style={{ color: '#A0A0A0' }}>
                        <MapPinIcon className="h-4 w-4 mr-2" />
                        {job.location || 'Location not specified'}
                      </div>
                      <div className="flex items-center text-sm" style={{ color: '#A0A0A0' }}>
                        <ClockIcon className="h-4 w-4 mr-2" />
                        {job.job_type || 'Full-time'}
                      </div>
                      {job.salary && (
                        <div className="flex items-center text-sm font-semibold" style={{ color: '#54990b' }}>
                          <CurrencyDollarIcon className="h-4 w-4 mr-2" />
                          {job.salary}
                        </div>
                      )}
                    </div>
                    
                    <p className="text-sm mb-4 line-clamp-3" style={{ color: '#A0A0A0' }}>
                      {job.description || 'No description available'}
                    </p>
                    
                    <Link
                      to={`/jobs/${job.id}`}
                      className="block w-full py-3 px-4 rounded-lg font-semibold text-white text-center transition-all duration-200 hover:shadow-lg"
                      style={{ backgroundColor: '#54990b' }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#6AA84F'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#54990b'}
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
              <h2 className="text-2xl font-semibold mb-6" style={{ color: '#F0F0F0' }}>
                Company Culture
              </h2>
              
              {company.culture_description ? (
                <p className="text-base leading-relaxed mb-6" style={{ color: '#A0A0A0' }}>
                  {company.culture_description}
                </p>
              ) : (
                <p style={{ color: '#A0A0A0' }}>
                  Learn more about our company culture and what it's like to work here.
                </p>
              )}
              
              {/* Culture Images */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="aspect-video roundeddose-lg overflow-hidden">
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
              <h3 className="text-xl font-semibold mb-6" style={{ color: '#F0F0F0' }}>
                What Our Employees Say
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Sample testimonials - replace with real data from API */}
                <div className="p-4 rounded-lg" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
                  <p className="text-sm mb-4" style={{ color: '#A0A0A0' }}>
                    "Great company culture with amazing colleagues. The work-life balance is excellent and there are many opportunities for growth."
                  </p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center mr-3">
                      <span className="text-sm font-semibold" style={{ color: '#F0F0F0' }}>JS</span>
                    </div>
                    <div>
                      <p className="font-medium" style={{ color: '#F0F0F0' }}>John Smith</p>
                      <p className="text-xs" style={{ color: '#A0A0A0' }}>Software Engineer</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 rounded-lg" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
                  <p className="text-sm mb-4" style={{ color: '#A0A0A0' }}>
                    "I love the innovative projects we work on and the supportive team environment. This company truly values its employees."
                  </p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center mr-3">
                      <span className="text-sm font-semibold" style={{ color: '#F0F0F0' }}>AD</span>
                    </div>
                    <div>
                      <p className="font-medium" style={{ color: '#F0F0F0' }}>Alice Davis</p>
                      <p className="text-xs" style={{ color: '#A0A0A0' }}>Product Manager</p>
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