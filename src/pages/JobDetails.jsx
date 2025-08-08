import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  MapPinIcon,
  ClockIcon,
  CurrencyDollarIcon,
  BriefcaseIcon,
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

const JobDetails = () => {
  const { slug } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState(false);
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

  // Fetch job details
  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${baseUrl}/api/jobs/${slug}/`);
        if (!response.ok) {
          throw new Error('Failed to fetch job details');
        }
        const data = await response.json();
        setJob(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [slug]);

  // Handle logo URL
  const getLogoUrl = () => {
    if (imageError) return '/placeholder.svg';
    const logoPath = job?.company?.logo_display_url;
    if (logoPath) {
      return logoPath.startsWith('http') ? logoPath : `${baseUrl}${logoPath}`;
    }
    if (job?.company?.logo_url) {
      return job.company.logo_url;
    }
    return '/placeholder.svg';
  };

  // Generate company initials
  const getCompanyInitials = () => {
    if (!job?.company?.name) return 'C';
    return job.company.name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Format salary
  const formatSalary = () => {
    if (!job?.salary_min) return 'Not specified';
    const min = job.salary_min.toLocaleString();
    const max = job.salary_max ? job.salary_max.toLocaleString() : '+';
    return `$${min} - $${max}`;
  };

  // Format date
  const formatDate = (dateString) => {
    return dateString ? new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }) : 'Recently';
  };

  if (loading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: '#0C1B33', fontFamily: 'Poppins, sans-serif' }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: '#00FF84' }}></div>
          <p style={{ color: '#FFFFFF' }}>Loading job details...</p>
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
          <p style={{ color: '#FF6B6B' }} className="text-lg">Error: {error}</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: '#0C1B33', fontFamily: 'Poppins, sans-serif' }}
      >
        <div className="text-center">
          <p style={{ color: '#FFFFFF' }} className="text-lg">Job not found</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen py-8"
      style={{ backgroundColor: '#0C1B33', fontFamily: 'Poppins, sans-serif' }}
    >
      <div className="max-w-4xl mx-auto p-6">
        {/* Header Section */}
        <div 
          className="rounded-xl p-8 mb-8 shadow-2xl"
          style={{ backgroundColor: '#FFFFFF' }}
        >
          <div className="flex items-start mb-8">
            <div className="w-20 h-20 rounded-xl mr-6 flex-shrink-0 overflow-hidden flex items-center justify-center shadow-lg">
              {!imageError ? (
                <img
                  src={getLogoUrl() || "/placeholder.svg"}
                  alt={`${job.company?.name || 'Company'} logo`}
                  className="w-full h-full object-cover"
                  onError={() => setImageError(true)}
                  loading="lazy"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center text-white font-bold text-xl"
                  style={{ backgroundColor: '#0C1B33' }}
                >
                  {getCompanyInitials()}
                </div>
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-3" style={{ color: '#000000' }}>
                {job.title}
              </h1>
              <p className="text-xl mb-4" style={{ color: '#666666' }}>
                {job.company?.name || 'Unknown Company'}
              </p>
              
              {/* Job Meta Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center text-sm" style={{ color: '#666666' }}>
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center mr-3"
                    style={{ backgroundColor: '#F0F8FF' }}
                  >
                    <MapPinIcon className="h-4 w-4" style={{ color: '#0C1B33' }} />
                  </div>
                  <span className="font-medium">{job.location || 'Remote'}</span>
                </div>
                <div className="flex items-center text-sm" style={{ color: '#666666' }}>
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center mr-3"
                    style={{ backgroundColor: '#F0F8FF' }}
                  >
                    <ClockIcon className="h-4 w-4" style={{ color: '#0C1B33' }} />
                  </div>
                  <span className="font-medium">{job.job_type || 'Not specified'}</span>
                </div>
                <div className="flex items-center text-sm font-semibold" style={{ color: '#00FF84' }}>
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center mr-3"
                    style={{ backgroundColor: 'rgba(0, 255, 132, 0.1)' }}
                  >
                    <CurrencyDollarIcon className="h-4 w-4" style={{ color: '#00FF84' }} />
                  </div>
                  <span>{formatSalary()}</span>
                </div>
                <div className="flex items-center text-sm" style={{ color: '#666666' }}>
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center mr-3"
                    style={{ backgroundColor: '#F0F8FF' }}
                  >
                    <BriefcaseIcon className="h-4 w-4" style={{ color: '#0C1B33' }} />
                  </div>
                  <span className="font-medium">{job.experience_level || 'Not specified'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Apply Button */}
          <Link
            to={`/${job.slug}/apply/`}
            className="inline-block py-4 px-8 rounded-lg font-bold text-lg transition-all duration-200 hover:shadow-lg transform hover:scale-105"
            style={{ 
              backgroundColor: '#00FF84',
              color: '#000000'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#00E676';
              e.target.style.boxShadow = '0 10px 25px rgba(0, 255, 132, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#00FF84';
              e.target.style.boxShadow = 'none';
            }}
          >
            Apply Now
          </Link>
        </div>

        {/* Job Details Section */}
        <div 
          className="rounded-xl p-8 shadow-2xl"
          style={{ backgroundColor: '#FFFFFF' }}
        >
          <h2 className="text-2xl font-bold mb-6" style={{ color: '#000000' }}>
            Job Description
          </h2>
          <div 
            className="text-base leading-relaxed mb-8 p-6 rounded-lg"
            style={{ 
              color: '#333333',
              backgroundColor: '#F8F9FA',
              lineHeight: '1.7'
            }}
          >
            {job.description || 'No description available'}
          </div>

          {/* Additional Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4 flex items-center" style={{ color: '#000000' }}>
                <div 
                  className="w-6 h-6 rounded-lg flex items-center justify-center mr-3"
                  style={{ backgroundColor: '#00FF84' }}
                >
                  <BriefcaseIcon className="h-4 w-4" style={{ color: '#000000' }} />
                </div>
                Category
              </h3>
              <p 
                className="text-base p-4 rounded-lg font-medium"
                style={{ 
                  color: '#666666',
                  backgroundColor: '#F8F9FA'
                }}
              >
                {job.category?.name || 'Not specified'}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4 flex items-center" style={{ color: '#000000' }}>
                <div 
                  className="w-6 h-6 rounded-lg flex items-center justify-center mr-3"
                  style={{ backgroundColor: '#00FF84' }}
                >
                  <CalendarIcon className="h-4 w-4" style={{ color: '#000000' }} />
                </div>
                Posted Date
              </h3>
              <p 
                className="text-base p-4 rounded-lg font-medium"
                style={{ 
                  color: '#666666',
                  backgroundColor: '#F8F9FA'
                }}
              >
                {formatDate(job.created_at)}
              </p>
            </div>

            <div className="md:col-span-2">
              <h3 className="text-lg font-bold mb-4 flex items-center" style={{ color: '#000000' }}>
                <div 
                  className="w-6 h-6 rounded-lg flex items-center justify-center mr-3"
                  style={{ backgroundColor: '#00FF84' }}
                >
                  {job.is_active ? (
                    <CheckCircleIcon className="h-4 w-4" style={{ color: '#000000' }} />
                  ) : (
                    <XCircleIcon className="h-4 w-4" style={{ color: '#000000' }} />
                  )}
                </div>
                Status
              </h3>
              <div className="flex items-center">
                <span
                  className="inline-flex items-center px-4 py-2 text-sm font-bold rounded-full"
                  style={{
                    backgroundColor: job.is_active
                      ? 'rgba(0, 255, 132, 0.1)'
                      : 'rgba(255, 107, 107, 0.1)',
                    color: job.is_active ? '#00FF84' : '#FF6B6B',
                  }}
                >
                  <div 
                    className="w-2 h-2 rounded-full mr-2"
                    style={{
                      backgroundColor: job.is_active ? '#00FF84' : '#FF6B6B'
                    }}
                  ></div>
                  {job.is_active ? 'Active - Accepting Applications' : 'Inactive - Not Accepting Applications'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
