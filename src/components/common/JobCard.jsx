import React, { useState } from 'react';
import {
  MapPinIcon,
  ClockIcon,
  CurrencyDollarIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const JobCard = ({ job }) => {
  const [imageError, setImageError] = useState(false);
  
  // Enhanced logo handling with better fallbacks
  const getLogoUrl = () => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
    if (imageError) {
      return '/placeholder.svg';
    }
    const logoPath = job.company?.logo_display_url;
    if (logoPath) {
      return logoPath.startsWith('http')
        ? logoPath
        : `${baseUrl}${logoPath}`;
    }
    if (job.company?.logo_url) {
      return job.company.logo_url;
    }
    return '/placeholder.svg';
  };

  // Generate initials from company name as additional fallback
  const getCompanyInitials = () => {
    if (!job.company?.name) return 'C';
    return job.company.name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatSalary = () => {
    if (!job.salary_min) return 'Not specified';
    
    const min = job.salary_min.toLocaleString();
    const max = job.salary_max ? job.salary_max.toLocaleString() : '+';
    return `$${min} - $${max}`;
  };

  return (
    <div
      className="rounded-lg p-4 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-xl cursor-pointer group border"
      style={{ 
        backgroundColor: '#0C1B33',
        borderColor: '#00FF84'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 255, 132, 0.3)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Featured Badge */}
      {job.featured && (
        <div className="flex justify-end mb-2">
          <div 
            className="flex items-center px-2 py-1 rounded-full text-xs font-bold"
            style={{ 
              backgroundColor: '#00FF84',
              color: '#000000'
            }}
          >
            <StarIcon className="h-3 w-3 mr-1" />
            Featured
          </div>
        </div>
      )}

      {/* Company Logo and Info */}
      <div className="flex items-start mb-3">
        <div className="w-10 h-10 rounded-lg mr-3 flex-shrink-0 overflow-hidden shadow-md flex items-center justify-center">
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
              className="w-full h-full flex items-center justify-center text-white font-bold text-sm"
              style={{ backgroundColor: '#FFFFFF' }}
            >
              <span style={{ color: '#0C1B33' }}>{getCompanyInitials()}</span>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold mb-1 truncate" style={{ color: '#FFFFFF' }}>
            {job.title}
          </h3>
          <p className="text-xs font-medium truncate" style={{ color: '#B0B0B0' }}>
            {job.company?.name || 'Unknown Company'}
          </p>
        </div>
      </div>

      {/* Job Details */}
      <div className="space-y-2 mb-3">
        <div className="flex items-center text-xs" style={{ color: '#B0B0B0' }}>
          <MapPinIcon className="h-3 w-3 mr-2 flex-shrink-0" style={{ color: '#00FF84' }} />
          <span className="truncate">{job.location || 'Remote'}</span>
        </div>
        
        <div className="flex items-center text-xs" style={{ color: '#B0B0B0' }}>
          <ClockIcon className="h-3 w-3 mr-2 flex-shrink-0" style={{ color: '#00FF84' }} />
          <span className="truncate">{job.job_type || 'Not specified'}</span>
        </div>
        
        <div className="flex items-center text-xs font-bold" style={{ color: '#00FF84' }}>
          <CurrencyDollarIcon className="h-3 w-3 mr-2 flex-shrink-0" />
          <span className="truncate">{formatSalary()}</span>
        </div>
      </div>

      {/* Experience Level Badge */}
      {job.experience_level && (
        <div className="mb-3">
          <span 
            className="inline-block px-2 py-1 text-xs font-bold rounded"
            style={{
              backgroundColor: 'rgba(0, 255, 132, 0.2)',
              color: '#00FF84'
            }}
          >
            {job.experience_level}
          </span>
        </div>
      )}

      {/* Description */}
      <p className="text-xs mb-3 line-clamp-2 leading-relaxed" style={{ color: '#B0B0B0' }}>
        {job.description ? job.description.substring(0, 80) + '...' : 'No description available'}
      </p>

      {/* Footer with Posted Date and Status */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs" style={{ color: '#B0B0B0' }}>
          {job.created_at ? new Date(job.created_at).toLocaleDateString() : 'Recently'}
        </span>
        {job.is_active && (
          <span 
            className="text-xs px-2 py-1 rounded-full font-bold"
            style={{ 
              backgroundColor: 'rgba(0, 255, 132, 0.2)', 
              color: '#00FF84'
            }}
          >
            Active
          </span>
        )}
      </div>

      {/* Apply Button */}
      <Link
        to={`/${job.slug}/`}
        className="w-full py-2 px-4 rounded-lg font-bold text-sm transition-all duration-200 hover:shadow-lg block text-center hover:scale-105"
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
        View Details
      </Link>
    </div>
  );
};

export default JobCard;
