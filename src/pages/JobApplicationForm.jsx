import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BriefcaseIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/auth';

const JobApplicationForm = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user, getAuthToken } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    cover_letter: '',
    resume_url: '',
    portfolio_url: '',
    linkedin_url: '',
    phone: '',
    email: '',
    years_of_experience: '',
    expected_salary: '',
    availability_date: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState(null);
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://jobboardalxprojectbackend-production.up.railway.app';

  // Auto-fill email from user context if available
  useEffect(() => {
    if (user && user.email) {
      setFormData(prev => ({
        ...prev,
        email: user.email
      }));
    }
  }, [user]);

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
  }, [slug, baseUrl]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    setFormErrors((prev) => ({ ...prev, [name]: '' }));
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    if (!formData.email) errors.email = 'Email is required';
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Invalid email format';
    }
    if (formData.resume_url && !/^https?:\/\/.*/.test(formData.resume_url)) {
      errors.resume_url = 'Invalid URL format';
    }
    if (formData.portfolio_url && !/^https?:\/\/.*/.test(formData.portfolio_url)) {
      errors.portfolio_url = 'Invalid URL format';
    }
    if (formData.linkedin_url && !/^https?:\/\/.*/.test(formData.linkedin_url)) {
      errors.linkedin_url = 'Invalid URL format';
    }
    if (formData.years_of_experience && isNaN(formData.years_of_experience)) {
      errors.years_of_experience = 'Must be a number';
    }
    if (formData.expected_salary && isNaN(formData.expected_salary)) {
      errors.expected_salary = 'Must be a number';
    }
    return errors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      setSubmitStatus('submitting');
      
      // Try to get token from auth context first, then fallback to localStorage
      let token = null;
      if (getAuthToken && typeof getAuthToken === 'function') {
        token = getAuthToken();
      } else {
        // Fallback to checking localStorage/sessionStorage
        token = localStorage.getItem('access_token') || 
               localStorage.getItem('authToken') || 
               localStorage.getItem('token') ||
               sessionStorage.getItem('access_token') ||
               sessionStorage.getItem('authToken') ||
               sessionStorage.getItem('token');
      }
      
      console.log('Auth token found:', !!token);
      console.log('User from context:', user);
      
      const headers = {
        'Content-Type': 'application/json',
      };
      
      // Add authorization header if token exists
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      // Prepare application data
      const applicationData = {
        job: job.id,
        cover_letter: formData.cover_letter || '',
        resume_url: formData.resume_url || '',
        portfolio_url: formData.portfolio_url || '',
        linkedin_url: formData.linkedin_url || '',
        phone: formData.phone || '',
        email: formData.email,
        years_of_experience: formData.years_of_experience
          ? parseInt(formData.years_of_experience)
          : null,
        expected_salary: formData.expected_salary
          ? parseFloat(formData.expected_salary)
          : null,
        availability_date: formData.availability_date || null,
      };

      console.log('Submitting application data:', applicationData);
      console.log('Request headers:', headers);

      const response = await fetch(`${baseUrl}/api/applications/apply/`, {
        method: 'POST',
        headers,
        body: JSON.stringify(applicationData),
      });

      console.log('Response status:', response.status);
      
      // Handle different response types
      let responseData;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        responseData = { message: await response.text() };
      }

      console.log('Response data:', responseData);

      if (!response.ok) {
        // Handle specific error cases
        if (response.status === 401) {
          throw new Error('Authentication required. Please log in to apply for jobs.');
        } else if (response.status === 400) {
          throw new Error(responseData.detail || responseData.message || responseData.error || 'Invalid application data');
        } else if (response.status === 409) {
          throw new Error('You have already applied to this job');
        } else {
          throw new Error(responseData.detail || responseData.message || responseData.error || 'Failed to submit application');
        }
      }

      setSubmitStatus('success');
      setTimeout(() => {
        navigate(`/dashboard`);
      }, 2000);
    } catch (err) {
      console.error('Submission error:', err);
      setSubmitStatus('error');
      
      // Provide more specific error messages
      if (err.message.includes('Authentication') || err.message.includes('401')) {
        setFormErrors({ 
          general: 'You need to be logged in to apply for jobs. Please log in and try again.' 
        });
      } else {
        setFormErrors({ general: err.message });
      }
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
          <p style={{ color: '#FFFFFF' }}>Loading application form...</p>
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
        <div 
          className="rounded-xl p-8 shadow-2xl"
          style={{ backgroundColor: '#FFFFFF' }}
        >
          <div className="flex items-center mb-8">
            <div 
              className="w-12 h-12 rounded-lg flex items-center justify-center mr-4"
              style={{ backgroundColor: '#00FF84' }}
            >
              <BriefcaseIcon className="h-6 w-6" style={{ color: '#000000' }} />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2" style={{ color: '#000000' }}>
                Apply for {job.title}
              </h1>
              <p className="text-xl" style={{ color: '#666666' }}>
                {job.company?.name || 'Unknown Company'}
              </p>
            </div>
          </div>

          {/* Authentication Warning */}
          {!user && (
            <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: '#FFF8E1', color: '#E65100' }}>
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: '#FF9800' }}></div>
                You're applying as a guest. Consider <a href="/login" className="underline font-semibold">logging in</a> for a better experience.
              </div>
            </div>
          )}

          {submitStatus === 'success' && (
            <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: '#E8F5E8', color: '#2D5016' }}>
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: '#00FF84' }}></div>
                Application submitted successfully! Redirecting to your dashboard...
              </div>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: '#FFF0F0', color: '#DC2626' }}>
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: '#FF6B6B' }}></div>
                {formErrors.general || 'An error occurred. Please try again.'}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Cover Letter */}
            <div>
              <label
                htmlFor="cover_letter"
                className="block text-sm font-semibold mb-3"
                style={{ color: '#000000' }}
              >
                Cover Letter
              </label>
              <textarea
                id="cover_letter"
                name="cover_letter"
                value={formData.cover_letter}
                onChange={handleInputChange}
                className="w-full p-4 rounded-lg border-2 transition-all duration-200 focus:outline-none"
                style={{ 
                  backgroundColor: '#F8F9FA',
                  borderColor: '#E5E7EB',
                  color: '#000000'
                }}
                onFocus={(e) => e.target.style.borderColor = '#00FF84'}
                onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                rows="6"
                placeholder="Write your cover letter here..."
              />
            </div>

            {/* Resume URL */}
            <div>
              <label
                htmlFor="resume_url"
                className="block text-sm font-semibold mb-3"
                style={{ color: '#000000' }}
              >
                Resume URL
              </label>
              <input
                type="url"
                id="resume_url"
                name="resume_url"
                value={formData.resume_url}
                onChange={handleInputChange}
                className="w-full p-4 rounded-lg border-2 transition-all duration-200 focus:outline-none"
                style={{ 
                  backgroundColor: '#F8F9FA',
                  borderColor: '#E5E7EB',
                  color: '#000000'
                }}
                onFocus={(e) => e.target.style.borderColor = '#00FF84'}
                onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                placeholder="https://example.com/resume.pdf"
              />
              {formErrors.resume_url && (
                <p className="text-red-500 text-sm mt-2">{formErrors.resume_url}</p>
              )}
            </div>

            {/* Portfolio URL */}
            <div>
              <label
                htmlFor="portfolio_url"
                className="block text-sm font-semibold mb-3"
                style={{ color: '#000000' }}
              >
                Portfolio URL (Optional)
              </label>
              <input
                type="url"
                id="portfolio_url"
                name="portfolio_url"
                value={formData.portfolio_url}
                onChange={handleInputChange}
                className="w-full p-4 rounded-lg border-2 transition-all duration-200 focus:outline-none"
                style={{ 
                  backgroundColor: '#F8F9FA',
                  borderColor: '#E5E7EB',
                  color: '#000000'
                }}
                onFocus={(e) => e.target.style.borderColor = '#00FF84'}
                onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                placeholder="https://example.com/portfolio"
              />
              {formErrors.portfolio_url && (
                <p className="text-red-500 text-sm mt-2">{formErrors.portfolio_url}</p>
              )}
            </div>

            {/* LinkedIn URL */}
            <div>
              <label
                htmlFor="linkedin_url"
                className="block text-sm font-semibold mb-3"
                style={{ color: '#000000' }}
              >
                LinkedIn URL (Optional)
              </label>
              <input
                type="url"
                id="linkedin_url"
                name="linkedin_url"
                value={formData.linkedin_url}
                onChange={handleInputChange}
                className="w-full p-4 rounded-lg border-2 transition-all duration-200 focus:outline-none"
                style={{ 
                  backgroundColor: '#F8F9FA',
                  borderColor: '#E5E7EB',
                  color: '#000000'
                }}
                onFocus={(e) => e.target.style.borderColor = '#00FF84'}
                onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                placeholder="https://linkedin.com/in/username"
              />
              {formErrors.linkedin_url && (
                <p className="text-red-500 text-sm mt-2">{formErrors.linkedin_url}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold mb-3"
                style={{ color: '#000000' }}
              >
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-4 rounded-lg border-2 transition-all duration-200 focus:outline-none"
                style={{ 
                  backgroundColor: '#F8F9FA',
                  borderColor: '#E5E7EB',
                  color: '#000000'
                }}
                onFocus={(e) => e.target.style.borderColor = '#00FF84'}
                onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                placeholder="your.email@example.com"
                required
                disabled={user && user.email} // Disable if user is logged in
              />
              {formErrors.email && (
                <p className="text-red-500 text-sm mt-2">{formErrors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-semibold mb-3"
                style={{ color: '#000000' }}
              >
                Phone (Optional)
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full p-4 rounded-lg border-2 transition-all duration-200 focus:outline-none"
                style={{ 
                  backgroundColor: '#F8F9FA',
                  borderColor: '#E5E7EB',
                  color: '#000000'
                }}
                onFocus={(e) => e.target.style.borderColor = '#00FF84'}
                onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                placeholder="+1234567890"
              />
            </div>

            {/* Years of Experience */}
            <div>
              <label
                htmlFor="years_of_experience"
                className="block text-sm font-semibold mb-3"
                style={{ color: '#000000' }}
              >
                Years of Experience (Optional)
              </label>
              <input
                type="number"
                id="years_of_experience"
                name="years_of_experience"
                value={formData.years_of_experience}
                onChange={handleInputChange}
                className="w-full p-4 rounded-lg border-2 transition-all duration-200 focus:outline-none"
                style={{ 
                  backgroundColor: '#F8F9FA',
                  borderColor: '#E5E7EB',
                  color: '#000000'
                }}
                onFocus={(e) => e.target.style.borderColor = '#00FF84'}
                onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                placeholder="e.g., 5"
                min="0"
              />
              {formErrors.years_of_experience && (
                <p className="text-red-500 text-sm mt-2">{formErrors.years_of_experience}</p>
              )}
            </div>

            {/* Expected Salary */}
            <div>
              <label
                htmlFor="expected_salary"
                className="block text-sm font-semibold mb-3"
                style={{ color: '#000000' }}
              >
                Expected Salary (Optional)
              </label>
              <input
                type="number"
                id="expected_salary"
                name="expected_salary"
                value={formData.expected_salary}
                onChange={handleInputChange}
                className="w-full p-4 rounded-lg border-2 transition-all duration-200 focus:outline-none"
                style={{ 
                  backgroundColor: '#F8F9FA',
                  borderColor: '#E5E7EB',
                  color: '#000000'
                }}
                onFocus={(e) => e.target.style.borderColor = '#00FF84'}
                onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                placeholder="e.g., 50000"
                min="0"
                step="0.01"
              />
              {formErrors.expected_salary && (
                <p className="text-red-500 text-sm mt-2">{formErrors.expected_salary}</p>
              )}
            </div>

            {/* Availability Date */}
            <div>
              <label
                htmlFor="availability_date"
                className="block text-sm font-semibold mb-3"
                style={{ color: '#000000' }}
              >
                Availability Date (Optional)
              </label>
              <input
                type="date"
                id="availability_date"
                name="availability_date"
                value={formData.availability_date}
                onChange={handleInputChange}
                className="w-full p-4 rounded-lg border-2 transition-all duration-200 focus:outline-none"
                style={{ 
                  backgroundColor: '#F8F9FA',
                  borderColor: '#E5E7EB',
                  color: '#000000'
                }}
                onFocus={(e) => e.target.style.borderColor = '#00FF84'}
                onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitStatus === 'submitting'}
              className="w-full py-4 px-6 rounded-lg font-bold text-lg transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
              style={{ 
                backgroundColor: '#00FF84',
                color: '#000000'
              }}
              onMouseEnter={(e) => {
                if (!e.target.disabled) {
                  e.target.style.backgroundColor = '#00E676';
                  e.target.style.boxShadow = '0 10px 25px rgba(0, 255, 132, 0.3)';
                }
              }}
              onMouseLeave={(e) => {
                if (!e.target.disabled) {
                  e.target.style.backgroundColor = '#00FF84';
                  e.target.style.boxShadow = 'none';
                }
              }}
            >
              {submitStatus === 'submitting' ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-3"></div>
                  Submitting Application...
                </div>
              ) : (
                'Submit Application'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JobApplicationForm;