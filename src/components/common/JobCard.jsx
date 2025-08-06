// components/JobCard.jsx
import React, { useState } from 'react';
import {
  MapPinIcon,
  ClockIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';

const JobCard = ({ job }) => {
  const [imageError] = useState(false);
  
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
    if (job.company?.name) return 'C';
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
      className="rounded-xl p-6 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl cursor-pointer"
      style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
    >
      {/* Company Logo and Info */}
      <div className="flex items-start mb-4">
        <div className="w-12 h-12 rounded-lg mr-4 flex-shrink-0 overflow-hidden bg-gray-200 flex items-center justify-center">
          {!imageError ? (
            <img
              src={getLogoUrl()}
              alt={`${job.company?.name || 'Company'} logo`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div 
              className="w-full h-full flex items-center justify-center text-white font-bold text-sm"
              style={{ backgroundColor: '#3F7A8C' }}
            >
              {getCompanyInitials()}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold mb-1 truncate" style={{ color: '#F0F0F0' }}>
            {job.title}
          </h3>
          <p className="text-sm truncate" style={{ color: '#A0A0A0' }}>
            {job.company?.name || 'Unknown Company'}
          </p>
        </div>
      </div>

      {/* Job Details */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center text-sm" style={{ color: '#A0A0A0' }}>
          <MapPinIcon className="h-4 w-4 mr-2 flex-shrink-0" />
          <span className="truncate">{job.location || 'Remote'}</span>
        </div>
        
        <div className="flex items-center text-sm" style={{ color: '#A0A0A0' }}>
          <ClockIcon className="h-4 w-4 mr-2 flex-shrink-0" />
          <span className="truncate">{job.job_type || 'Not specified'}</span>
        </div>
        
        <div className="flex items-center text-sm font-semibold" style={{ color: '#54990b' }}>
          <CurrencyDollarIcon className="h-4 w-4 mr-2 flex-shrink-0" />
          <span className="truncate">{formatSalary()}</span>
        </div>
      </div>

      {/* Experience Level Badge */}
      {job.experience_level && (
        <div className="mb-4">
          <span 
            className="inline-block px-3 py-1 text-xs font-medium rounded-full"
            style={{ 
              backgroundColor: 'rgba(63, 122, 140, 0.2)', 
              color: '#3F7A8C',
              border: '1px solid #3F7A8C'
            }}
          >
            {job.experience_level}
          </span>
        </div>
      )}

      {/* Description */}
      <p className="text-sm mb-4 line-clamp-2" style={{ color: '#A0A0A0' }}>
        {job.description || 'No description available'}
      </p>

      {/* Footer with Posted Date and Apply Button */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs" style={{ color: '#A0A0A0' }}>
          Posted {job.created_at ? new Date(job.created_at).toLocaleDateString() : 'Recently'}
        </span>
        {job.is_active && (
          <span 
            className="text-xs px-2 py-1 rounded-full"
            style={{ backgroundColor: 'rgba(84, 153, 11, 0.2)', color: '#54990b' }}
          >
            Active
          </span>
        )}
      </div>

      {/* Apply Button */}
      <a
        href={job.application_url || '#'}
        target="_blank"
        rel="noopener noreferrer"
        className="w-25 py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 hover:shadow-lg block text-center disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ backgroundColor: '#54990b' }}
        onMouseEnter={(e) => e.target.style.backgroundColor = '#6AA84F'}
        onMouseLeave={(e) => e.target.style.backgroundColor = '#54990b'}
      >
       apply
      </a>
    </div>
  );
};

export default JobCard;