import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/auth';
import api from '../utils/api';
import {
  UserIcon,
  BriefcaseIcon,
  Bars3Icon,
  XMarkIcon,
  PencilIcon,
  MagnifyingGlassIcon,
  ArrowUpTrayIcon
} from '@heroicons/react/24/outline';

const PostJob = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    responsibilities: '',
    benefits: '',
    location: '',
    is_remote: false,
    remote_type: 'on_site',
    job_type: 'full_time',
    experience_level: 'mid_level',
    salary_min: '',
    salary_max: '',
    salary_currency: 'USD',
    salary_type: 'yearly',
    show_salary: true,
    status: 'active',
    is_active: true,
    is_featured: false,
    is_urgent: false,
    application_url: '',
    application_email: '',
    accept_applications: true,
    skills_required: '',
    expires_at: '',
    category: '',
    company: ''
  });

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: UserIcon },
    { id: 'profile', label: 'Profile', icon: UserIcon },
    { id: 'applications', label: 'Applications', icon: BriefcaseIcon }
  ];

  useEffect(() => {
    if (!isAuthenticated || (user?.role !== 'admin' && user?.role !== 'employer')) {
      navigate('/dashboard');
      return;
    }

    const fetchCategoriesAndCompany = async () => {
      try {
        const [categoriesResponse, companyResponse] = await Promise.all([
          api.get('/categories/'),
          api.get('/companies/my-company/') // Assuming an endpoint for fetching the user's company
        ]);
        setCategories(categoriesResponse.data.results || categoriesResponse.data || []);
        if (companyResponse.data) {
          setFormData(prev => ({ ...prev, company: companyResponse.data.id }));
        }
      // eslint-disable-next-line no-unused-vars
      } catch (err) {
        setError('Failed to fetch categories or company data');
      }
    };

    fetchCategoriesAndCompany();
  }, [isAuthenticated, user?.role, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        ...formData,
        skills_required: formData.skills_required.trim(),
        salary_min: formData.salary_min ? parseFloat(formData.salary_min) : null,
        salary_max: formData.salary_max ? parseFloat(formData.salary_max) : null,
        expires_at: formData.expires_at || null,
        posted_by: user.id,
        category: formData.category || null
      };

      await api.post('/jobs/create/', payload);
      alert('Job posted successfully!');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: '#0C1B33', fontFamily: 'Poppins, sans-serif' }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: '#00FF84' }}></div>
          <p style={{ color: '#FFFFFF' }}>Loading...</p>
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

  return (
    <div 
      className="min-h-screen flex"
      style={{ backgroundColor: '#0C1B33', fontFamily: 'Poppins, sans-serif' }}
    >
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 transition-transform duration-300 ease-in-out`}>
        <div 
          className="h-full p-6 overflow-y-auto border-r-2"
          style={{ backgroundColor: '#0C1B33', borderRightColor: '#00FF84' }}
        >
          <div className="mb-8">
            <h2 className="text-xl font-bold" style={{ color: '#00FF84' }}>Dashboard</h2>
          </div>
          
          <nav className="space-y-2">
            {sidebarItems.map((item) => (
              <Link
                key={item.id}
                to={`/${item.id}`}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 hover:bg-white/5"
                style={{ color: '#B0B0B0' }}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        <div className="p-6">
          {/* Mobile Menu Button */}
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-white/10"
            >
              <Bars3Icon className="h-6 w-6" style={{ color: '#FFFFFF' }} />
            </button>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2" style={{ color: '#FFFFFF' }}>
              Post a New Job
            </h1>
            <p style={{ color: '#B0B0B0' }}>
              Fill out the details below to create a new job posting
            </p>
          </div>

          {/* Form */}
          <div 
            className="rounded-xl p-6"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#FFFFFF' }}>
                  Job Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border-0 focus:outline-none focus:ring-2"
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                    color: '#FFFFFF',
                    focusRingColor: '#00FF84'
                  }}
                  placeholder="e.g. Senior Software Engineer"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#FFFFFF' }}>
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border-0 focus:outline-none focus:ring-2"
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                    color: '#FFFFFF',
                    focusRingColor: '#00FF84'
                  }}
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#FFFFFF' }}>
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows="5"
                  className="w-full px-4 py-3 rounded-lg border-0 focus:outline-none focus:ring-2"
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                    color: '#FFFFFF',
                    focusRingColor: '#00FF84'
                  }}
                  placeholder="Describe the job role and responsibilities..."
                />
              </div>

              {/* Requirements */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#FFFFFF' }}>
                  Requirements
                </label>
                <textarea
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-3 rounded-lg border-0 focus:outline-none focus:ring-2"
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                    color: '#FFFFFF',
                    focusRingColor: '#00FF84'
                  }}
                  placeholder="List the job requirements..."
                />
              </div>

              {/* Responsibilities */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#FFFFFF' }}>
                  Responsibilities
                </label>
                <textarea
                  name="responsibilities"
                  value={formData.responsibilities}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-3 rounded-lg border-0 focus:outline-none focus:ring-2"
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                    color: '#FFFFFF',
                    focusRingColor: '#00FF84'
                  }}
                  placeholder="List the job responsibilities..."
                />
              </div>

              {/* Benefits */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#FFFFFF' }}>
                  Benefits
                </label>
                <textarea
                  name="benefits"
                  value={formData.benefits}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-3 rounded-lg border-0 focus:outline-none focus:ring-2"
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                    color: '#FFFFFF',
                    focusRingColor: '#00FF84'
                  }}
                  placeholder="List the job benefits..."
                />
              </div>

              {/* Location and Remote */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#FFFFFF' }}>
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border-0 focus:outline-none focus:ring-2"
                    style={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                      color: '#FFFFFF',
                      focusRingColor: '#00FF84'
                    }}
                    placeholder="e.g. San Francisco, CA"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#FFFFFF' }}>
                    Remote Type
                  </label>
                  <select
                    name="remote_type"
                    value={formData.remote_type}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border-0 focus:outline-none focus:ring-2"
                    style={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                      color: '#FFFFFF',
                      focusRingColor: '#00FF84'
                    }}
                  >
                    <option value="on_site">On Site</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="fully_remote">Fully Remote</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="is_remote"
                    checked={formData.is_remote}
                    onChange={handleChange}
                    className="rounded border-gray-300 text-green-500 focus:ring-green-500"
                  />
                  <span style={{ color: '#FFFFFF' }}>Is Remote?</span>
                </label>
              </div>

              {/* Job Type and Experience Level */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#FFFFFF' }}>
                    Job Type
                  </label>
                  <select
                    name="job_type"
                    value={formData.job_type}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border-0 focus:outline-none focus:ring-2"
                    style={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                      color: '#FFFFFF',
                      focusRingColor: '#00FF84'
                    }}
                  >
                    <option value="full_time">Full Time</option>
                    <option value="part_time">Part Time</option>
                    <option value="contract">Contract</option>
                    <option value="freelance">Freelance</option>
                    <option value="internship">Internship</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#FFFFFF' }}>
                    Experience Level
                  </label>
                  <select
                    name="experience_level"
                    value={formData.experience_level}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border-0 focus:outline-none focus:ring-2"
                    style={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                      color: '#FFFFFF',
                      focusRingColor: '#00FF84'
                    }}
                  >
                    <option value="entry_level">Entry Level</option>
                    <option value="mid_level">Mid Level</option>
                    <option value="senior_level">Senior Level</option>
                    <option value="executive">Executive</option>
                  </select>
                </div>
              </div>

              {/* Salary Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#FFFFFF' }}>
                    Salary Minimum
                  </label>
                  <input
                    type="number"
                    name="salary_min"
                    value={formData.salary_min}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border-0 focus:outline-none focus:ring-2"
                    style={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                      color: '#FFFFFF',
                      focusRingColor: '#00FF84'
                    }}
                    placeholder="e.g. 50000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#FFFFFF' }}>
                    Salary Maximum
                  </label>
                  <input
                    type="number"
                    name="salary_max"
                    value={formData.salary_max}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border-0 focus:outline-none focus:ring-2"
                    style={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                      color: '#FFFFFF',
                      focusRingColor: '#00FF84'
                    }}
                    placeholder="e.g. 80000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#FFFFFF' }}>
                    Salary Type
                  </label>
                  <select
                    name="salary_type"
                    value={formData.salary_type}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border-0 focus:outline-none focus:ring-2"
                    style={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                      color: '#FFFFFF',
                      focusRingColor: '#00FF84'
                    }}
                  >
                    <option value="hourly">Hourly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="show_salary"
                    checked={formData.show_salary}
                    onChange={handleChange}
                    className="rounded border-gray-300 text-green-500 focus:ring-green-500"
                  />
                  <span style={{ color: '#FFFFFF' }}>Show Salary</span>
                </label>
              </div>

              {/* Application Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#FFFFFF' }}>
                    Application URL
                  </label>
                  <input
                    type="url"
                    name="application_url"
                    value={formData.application_url}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border-0 focus:outline-none focus:ring-2"
                    style={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                      color: '#FFFFFF',
                      focusRingColor: '#00FF84'
                    }}
                    placeholder="e.g. https://company.com/apply"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#FFFFFF' }}>
                    Application Email
                  </label>
                  <input
                    type="email"
                    name="application_email"
                    value={formData.application_email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border-0 focus:outline-none focus:ring-2"
                    style={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                      color: '#FFFFFF',
                      focusRingColor: '#00FF84'
                    }}
                    placeholder="e.g. jobs@company.com"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="accept_applications"
                    checked={formData.accept_applications}
                    onChange={handleChange}
                    className="rounded border-gray-300 text-green-500 focus:ring-green-500"
                  />
                  <span style={{ color: '#FFFFFF' }}>Accept Applications</span>
                </label>
              </div>

              {/* Skills Required */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#FFFFFF' }}>
                  Skills Required
                </label>
                <input
                  type="text"
                  name="skills_required"
                  value={formData.skills_required}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border-0 focus:outline-none focus:ring-2"
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                    color: '#FFFFFF',
                    focusRingColor: '#00FF84'
                  }}
                  placeholder="e.g. JavaScript, React, Python"
                />
                <p className="text-sm mt-1" style={{ color: '#B0B0B0' }}>
                  Enter skills as a comma-separated list
                </p>
              </div>

              {/* Expires At */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#FFFFFF' }}>
                  Expires At
                </label>
                <input
                  type="date"
                  name="expires_at"
                  value={formData.expires_at}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border-0 focus:outline-none focus:ring-2"
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                    color: '#FFFFFF',
                    focusRingColor: '#00FF84'
                  }}
                />
              </div>

              {/* Status and Flags */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#FFFFFF' }}>
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border-0 focus:outline-none focus:ring-2"
                    style={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                      color: '#FFFFFF',
                      focusRingColor: '#00FF84'
                    }}
                  >
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="paused">Paused</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
                <div>
                  <label className="flex items-center space-x-2 mt-4">
                    <input
                      type="checkbox"
                      name="is_featured"
                      checked={formData.is_featured}
                      onChange={handleChange}
                      className="rounded border-gray-300 text-green-500 focus:ring-green-500"
                    />
                    <span style={{ color: '#FFFFFF' }}>Featured Job</span>
                  </label>
                </div>
                <div>
                  <label className="flex items-center space-x-2 mt-4">
                    <input
                      type="checkbox"
                      name="is_urgent"
                      checked={formData.is_urgent}
                      onChange={handleChange}
                      className="rounded border-gray-300 text-green-500 focus:ring-green-500"
                    />
                    <span style={{ color: '#FFFFFF' }}>Urgent Job</span>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4">
                <Link
                  to="/dashboard"
                  className="px-6 py-3 rounded-lg font-medium transition-all duration-200"
                  style={{ backgroundColor: '#B0B0B0', color: '#000000' }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#A0A0A0'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#B0B0B0'}
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 rounded-lg font-medium transition-all duration-200"
                  style={{ 
                    backgroundColor: '#00FF84', 
                    color: '#000000',
                    opacity: loading ? 0.6 : 1
                  }}
                  onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = '#00E676')}
                  onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = '#00FF84')}
                >
                  {loading ? 'Posting...' : 'Post Job'}
                </button>
              </div>
            </form>
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

export default PostJob;