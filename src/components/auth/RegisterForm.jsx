import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/auth';
import { EyeIcon, EyeSlashIcon, UserPlusIcon } from '@heroicons/react/24/outline';

const RegisterForm = ({ onSuccess }) => {
  const { register, loading, error, clearError } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password_confirm: '',
    first_name: '',
    last_name: '',
    role: 'user',
    phone: '',
    location: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Clear global error
    if (error) clearError();
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.username.trim()) {
      errors.username = 'Username is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }
    
    if (!formData.password_confirm) {
      errors.password_confirm = 'Password confirmation is required';
    } else if (formData.password !== formData.password_confirm) {
      errors.password_confirm = 'Passwords do not match';
    }
    
    if (!formData.first_name.trim()) {
      errors.first_name = 'First name is required';
    }
    
    if (!formData.last_name.trim()) {
      errors.last_name = 'Last name is required';
    }
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    
    const result = await register(formData);
    
    if (result.success && onSuccess) {
      onSuccess();
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: '#0C1B33', fontFamily: 'Poppins, sans-serif' }}
    >
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div 
            className="w-16 h-16 rounded-xl mx-auto mb-6 flex items-center justify-center shadow-lg"
            style={{ backgroundColor: '#00FF84' }}
          >
            <UserPlusIcon className="h-8 w-8" style={{ color: '#000000' }} />
          </div>
          <h2 className="text-3xl font-bold" style={{ color: '#FFFFFF' }}>
            Join Our Community
          </h2>
          <p className="mt-3 text-lg" style={{ color: '#B0B0B0' }}>
            Create your account to get started
          </p>
          <p className="mt-2 text-sm" style={{ color: '#B0B0B0' }}>
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-semibold transition-colors duration-200"
              style={{ color: '#00FF84' }}
              onMouseEnter={(e) => e.target.style.color = '#00E676'}
              onMouseLeave={(e) => e.target.style.color = '#00FF84'}
            >
              Sign in here
            </Link>
          </p>
        </div>

        {/* Form */}
        <div 
          className="rounded-xl p-8 shadow-2xl"
          style={{ backgroundColor: '#FFFFFF' }}
        >
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div 
                className="p-4 rounded-lg border-l-4"
                style={{ 
                  backgroundColor: '#FFF0F0',
                  borderColor: '#FF6B6B',
                  color: '#DC2626'
                }}
              >
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: '#FF6B6B' }}></div>
                  {error}
                </div>
              </div>
            )}

            <div className="space-y-5">
              {/* Username */}
              <div>
                <label htmlFor="username" className="block text-sm font-bold mb-3" style={{ color: '#000000' }}>
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  className={`w-full px-4 py-4 rounded-lg border-2 transition-all duration-200 focus:outline-none ${
                    validationErrors.username ? 'border-red-300' : 'border-gray-200'
                  }`}
                  style={{ 
                    backgroundColor: '#F8F9FA',
                    color: '#000000'
                  }}
                  onFocus={(e) => e.target.style.borderColor = validationErrors.username ? '#FF6B6B' : '#00FF84'}
                  onBlur={(e) => e.target.style.borderColor = validationErrors.username ? '#FF6B6B' : '#E5E7EB'}
                  placeholder="Choose a username"
                  value={formData.username}
                  onChange={handleChange}
                />
                {validationErrors.username && (
                  <p className="mt-2 text-sm text-red-600">{validationErrors.username}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-bold mb-3" style={{ color: '#000000' }}>
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className={`w-full px-4 py-4 rounded-lg border-2 transition-all duration-200 focus:outline-none ${
                    validationErrors.email ? 'border-red-300' : 'border-gray-200'
                  }`}
                  style={{ 
                    backgroundColor: '#F8F9FA',
                    color: '#000000'
                  }}
                  onFocus={(e) => e.target.style.borderColor = validationErrors.email ? '#FF6B6B' : '#00FF84'}
                  onBlur={(e) => e.target.style.borderColor = validationErrors.email ? '#FF6B6B' : '#E5E7EB'}
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleChange}
                />
                {validationErrors.email && (
                  <p className="mt-2 text-sm text-red-600">{validationErrors.email}</p>
                )}
              </div>

              {/* First and Last Name */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="first_name" className="block text-sm font-bold mb-3" style={{ color: '#000000' }}>
                    First Name
                  </label>
                  <input
                    id="first_name"
                    name="first_name"
                    type="text"
                    autoComplete="given-name"
                    className={`w-full px-4 py-4 rounded-lg border-2 transition-all duration-200 focus:outline-none ${
                      validationErrors.first_name ? 'border-red-300' : 'border-gray-200'
                    }`}
                    style={{ 
                      backgroundColor: '#F8F9FA',
                      color: '#000000'
                    }}
                    onFocus={(e) => e.target.style.borderColor = validationErrors.first_name ? '#FF6B6B' : '#00FF84'}
                    onBlur={(e) => e.target.style.borderColor = validationErrors.first_name ? '#FF6B6B' : '#E5E7EB'}
                    placeholder="First Name"
                    value={formData.first_name}
                    onChange={handleChange}
                  />
                  {validationErrors.first_name && (
                    <p className="mt-2 text-sm text-red-600">{validationErrors.first_name}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="last_name" className="block text-sm font-bold mb-3" style={{ color: '#000000' }}>
                    Last Name
                  </label>
                  <input
                    id="last_name"
                    name="last_name"
                    type="text"
                    autoComplete="family-name"
                    className={`w-full px-4 py-4 rounded-lg border-2 transition-all duration-200 focus:outline-none ${
                      validationErrors.last_name ? 'border-red-300' : 'border-gray-200'
                    }`}
                    style={{ 
                      backgroundColor: '#F8F9FA',
                      color: '#000000'
                    }}
                    onFocus={(e) => e.target.style.borderColor = validationErrors.last_name ? '#FF6B6B' : '#00FF84'}
                    onBlur={(e) => e.target.style.borderColor = validationErrors.last_name ? '#FF6B6B' : '#E5E7EB'}
                    placeholder="Last Name"
                    value={formData.last_name}
                    onChange={handleChange}
                  />
                  {validationErrors.last_name && (
                    <p className="mt-2 text-sm text-red-600">{validationErrors.last_name}</p>
                  )}
                </div>
              </div>

              {/* Role */}
              <div>
                <label htmlFor="role" className="block text-sm font-bold mb-3" style={{ color: '#000000' }}>
                  I am a
                </label>
                <select
                  id="role"
                  name="role"
                  className="w-full px-4 py-4 rounded-lg border-2 transition-all duration-200 focus:outline-none cursor-pointer"
                  style={{ 
                    backgroundColor: '#F8F9FA',
                    color: '#000000',
                    borderColor: '#E5E7EB'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#00FF84'}
                  onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="user">Job Seeker</option>
                  <option value="employer">Employer</option>
                </select>
              </div>

              {/* Phone (Optional) */}
              <div>
                <label htmlFor="phone" className="block text-sm font-bold mb-3" style={{ color: '#000000' }}>
                  Phone Number (Optional)
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  className="w-full px-4 py-4 rounded-lg border-2 transition-all duration-200 focus:outline-none"
                  style={{ 
                    backgroundColor: '#F8F9FA',
                    color: '#000000',
                    borderColor: '#E5E7EB'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#00FF84'}
                  onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              {/* Location (Optional) */}
              <div>
                <label htmlFor="location" className="block text-sm font-bold mb-3" style={{ color: '#000000' }}>
                  Location (Optional)
                </label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  className="w-full px-4 py-4 rounded-lg border-2 transition-all duration-200 focus:outline-none"
                  style={{ 
                    backgroundColor: '#F8F9FA',
                    color: '#000000',
                    borderColor: '#E5E7EB'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#00FF84'}
                  onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                  placeholder="City, Country"
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-bold mb-3" style={{ color: '#000000' }}>
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    className={`w-full px-4 py-4 pr-12 rounded-lg border-2 transition-all duration-200 focus:outline-none ${
                      validationErrors.password ? 'border-red-300' : 'border-gray-200'
                    }`}
                    style={{ 
                      backgroundColor: '#F8F9FA',
                      color: '#000000'
                    }}
                    onFocus={(e) => e.target.style.borderColor = validationErrors.password ? '#FF6B6B' : '#00FF84'}
                    onBlur={(e) => e.target.style.borderColor = validationErrors.password ? '#FF6B6B' : '#E5E7EB'}
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center transition-colors duration-200"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ color: '#666666' }}
                    onMouseEnter={(e) => e.target.style.color = '#00FF84'}
                    onMouseLeave={(e) => e.target.style.color = '#666666'}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {validationErrors.password && (
                  <p className="mt-2 text-sm text-red-600">{validationErrors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="password_confirm" className="block text-sm font-bold mb-3" style={{ color: '#000000' }}>
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="password_confirm"
                    name="password_confirm"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    className={`w-full px-4 py-4 pr-12 rounded-lg border-2 transition-all duration-200 focus:outline-none ${
                      validationErrors.password_confirm ? 'border-red-300' : 'border-gray-200'
                    }`}
                    style={{ 
                      backgroundColor: '#F8F9FA',
                      color: '#000000'
                    }}
                    onFocus={(e) => e.target.style.borderColor = validationErrors.password_confirm ? '#FF6B6B' : '#00FF84'}
                    onBlur={(e) => e.target.style.borderColor = validationErrors.password_confirm ? '#FF6B6B' : '#E5E7EB'}
                    placeholder="Confirm your password"
                    value={formData.password_confirm}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center transition-colors duration-200"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{ color: '#666666' }}
                    onMouseEnter={(e) => e.target.style.color = '#00FF84'}
                    onMouseLeave={(e) => e.target.style.color = '#666666'}
                  >
                    {showConfirmPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {validationErrors.password_confirm && (
                  <p className="mt-2 text-sm text-red-600">{validationErrors.password_confirm}</p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
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
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-3"></div>
                  Creating Account...
                </div>
              ) : (
                'Create Account'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
