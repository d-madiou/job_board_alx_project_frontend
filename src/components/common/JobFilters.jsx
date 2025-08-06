// components/JobFilters.jsx
import React from 'react';
import {
  MagnifyingGlassIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

const JobFilters = ({
  sidebarOpen,
  setSidebarOpen,
  filters,
  categories,
  onFilterChange,
  onCategoryChange,
  onJobTypeChange,
  onClearFilters,
  jobs
}) => {
  const experienceLevels = ['Entry-level', 'Mid-level', 'Senior', 'Executive'];
  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship'];

  return (
    <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-80 transition-transform duration-300 ease-in-out`}>
      <div 
        className="h-full p-6 overflow-y-auto"
        style={{ backgroundColor: '#282828', borderRight: '1px solid #3F7A8C' }}
      >
        {/* Mobile Close Button */}
        <div className="lg:hidden flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold" style={{ color: '#F0F0F0' }}>Filters</h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-lg hover:bg-white/10"
          >
            <XMarkIcon className="h-6 w-6" style={{ color: '#F0F0F0' }} />
          </button>
        </div>

        {/* Search Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2" style={{ color: '#F0F0F0' }}>
            Search Jobs
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Job title, company..."
              value={filters.search}
              onChange={(e) => onFilterChange('search', e.target.value)}
              className="w-full pl-4 pr-10 py-3 rounded-lg border-none outline-none text-gray-800 placeholder-gray-500"
            />
            <MagnifyingGlassIcon 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5"
              style={{ color: '#54990b' }}
            />
          </div>
        </div>

                {/* Categories */}
            <div className="mb-6">
            <label className="block text-sm font-medium mb-3" style={{ color: '#F0F0F0' }}>
                Categories
            </label>
            <div className="space-y-2 max-h-48 overflow-y-auto">
                {categories.map((category) => (
                <label key={category.id} className="flex items-center cursor-pointer space-x-2">
                    <input
                    type="checkbox"
                    checked={filters.category.includes(category.id)}
                    onChange={() => onCategoryChange(category.id)}
                    className="form-checkbox h-4 w-4 text-green-600"
                    />
                    <span className="text-sm" style={{ color: '#A0A0A0' }}>
                    {category.name || category.slug}
                    </span>
                </label>
                ))}
            </div>
            </div>

        {/* Location */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2" style={{ color: '#F0F0F0' }}>
            Location
          </label>
          <select
            value={filters.location}
            onChange={(e) => onFilterChange('location', e.target.value)}
            className="w-full px-4 py-3 rounded-lg border-none outline-none text-white cursor-pointer"
          >
            <option value="" >All Locations</option>
            {[...new Set(jobs.map(job => job.location))].filter(Boolean).map(location => (
              <option key={location} value={location} className='bg-black'>{location}</option>
            ))}
          </select>
        </div>

        {/* Experience Level */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-3" style={{ color: '#F0F0F0' }}>
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
                  onChange={(e) => onFilterChange('experience_level', e.target.value)}
                  className="sr-only"
                />
                <div 
                  className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center transition-colors duration-200 ${
                    filters.experience_level === level ? 'border-transparent' : 'border-gray-400'
                  }`}
                  style={{ 
                    backgroundColor: filters.experience_level === level ? '#3F7A8C' : 'transparent'
                  }}
                >
                  {filters.experience_level === level && (
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  )}
                </div>
                <span className="text-sm" style={{ color: '#A0A0A0' }}>{level}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Salary Range */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-3" style={{ color: '#F0F0F0' }}>
            Salary Range
          </label>
          <div className="px-2">
            <input
              type="range"
              min="0"
              max="200000"
              step="10000"
              value={filters.salaryRange[1]}
              onChange={(e) => onFilterChange('salaryRange', [0, parseInt(e.target.value)])}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #54990b 0%, #54990b ${(filters.salaryRange[1] / 200000) * 100}%, #3F7A8C ${(filters.salaryRange[1] / 200000) * 100}%, #3F7A8C 100%)`
              }}
            />
            <div className="flex justify-between text-xs mt-2" style={{ color: '#A0A0A0' }}>
              <span>$0</span>
              <span>${filters.salaryRange[1].toLocaleString()}+</span>
            </div>
          </div>
        </div>

        {/* Job Types */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-3" style={{ color: '#F0F0F0' }}>
            Job Type
          </label>
          <div className="space-y-2">
            {jobTypes.map((type) => (
              <label key={type} className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.job_type.includes(type)}
                  onChange={() => onJobTypeChange(type)}
                  className="sr-only"
                />
                <div 
                  className={`w-12 h-6 rounded-full mr-3 relative transition-colors duration-200`}
                  style={{ 
                    backgroundColor: filters.job_type.includes(type) ? '#54990b' : '#3F7A8C'
                  }}
                >
                  <div 
                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
                      filters.job_type.includes(type) ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  ></div>
                </div>
                <span className="text-sm" style={{ color: '#A0A0A0' }}>{type}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Clear Filters */}
        <button
          onClick={onClearFilters}
          className="w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 hover:shadow-lg"
          style={{ backgroundColor: '#D98C3F' }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#E09A4F'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#D98C3F'}
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
};

export default JobFilters;