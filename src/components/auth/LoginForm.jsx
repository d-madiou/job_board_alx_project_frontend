import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/auth';
import { EyeIcon, EyeSlashIcon, UserIcon } from '@heroicons/react/24/outline';

const LoginForm = ({ onSuccess }) => {
  const { login, loading, error, clearError } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
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
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
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
    
    const result = await login(formData);
    
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
            <UserIcon className="h-8 w-8" style={{ color: '#000000' }} />
          </div>
          <h2 className="text-3xl font-bold" style={{ color: '#FFFFFF' }}>
            Welcome Back
          </h2>
          <p className="mt-3 text-lg" style={{ color: '#B0B0B0' }}>
            Sign in to your account
          </p>
          <p className="mt-2 text-sm" style={{ color: '#B0B0B0' }}>
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-semibold transition-colors duration-200"
              style={{ color: '#00FF84' }}
              onMouseEnter={(e) => e.target.style.color = '#00E676'}
              onMouseLeave={(e) => e.target.style.color = '#00FF84'}
            >
              Create one here
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
                    autoComplete="current-password"
                    className={`w-full px-4 py-4 pr-12 rounded-lg border-2 transition-all duration-200 focus:outline-none ${
                      validationErrors.password ? 'border-red-300' : 'border-gray-200'
                    }`}
                    style={{ 
                      backgroundColor: '#F8F9FA',
                      color: '#000000'
                    }}
                    onFocus={(e) => e.target.style.borderColor = validationErrors.password ? '#FF6B6B' : '#00FF84'}
                    onBlur={(e) => e.target.style.borderColor = validationErrors.password ? '#FF6B6B' : '#E5E7EB'}
                    placeholder="Enter your password"
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
                  Signing In...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
