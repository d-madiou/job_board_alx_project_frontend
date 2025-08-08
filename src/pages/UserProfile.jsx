import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/auth';
import api from '../utils/api';
import {
  UserIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  EyeIcon,
  EyeSlashIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  DocumentTextIcon,
  LinkIcon,
  GlobeAltIcon,
  BriefcaseIcon,
  CameraIcon,
  CloudArrowUpIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const UserProfile = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  
  const [profileData, setProfileData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    bio: '',
    location: '',
    profile_pic: '',
    resume_url: '',
    linkedin_url: '',
    github_url: '',
    website_url: ''
  });

  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone: user.phone || '',
        bio: user.bio || '',
        location: user.location || '',
        profile_pic: user.profile_pic || '',
        resume_url: user.resume_url || '',
        linkedin_url: user.linkedin_url || '',
        github_url: user.github_url || '',
        website_url: user.website_url || ''
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError(null);
    if (success) setSuccess(false);
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.put('/auth/profile/', profileData);
      
      if (response.data) {
        updateUser(response.data);
        setSuccess(true);
        setIsEditing(false);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    try {
      if (passwordData.new_password !== passwordData.confirm_password) {
        setError('New passwords do not match');
        return;
      }

      setLoading(true);
      setError(null);

      await api.post('/auth/change-password/', {
        current_password: passwordData.current_password,
        new_password: passwordData.new_password
      });

      setSuccess(true);
      setShowChangePassword(false);
      setPasswordData({
        current_password: '',
        new_password: '',
        confirm_password: ''
      });
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const calculateProfileCompletion = () => {
    const fields = [
      'first_name', 'last_name', 'phone', 'bio', 'location', 
      'profile_pic', 'resume_url'
    ];
    const completed = fields.filter(field => profileData[field]?.trim()).length;
    return Math.round((completed / fields.length) * 100);
  };

  const profileCompletion = calculateProfileCompletion();

  return (
    <div 
      className="min-h-screen"
      style={{ backgroundColor: '#0C1B33', fontFamily: 'Poppins, sans-serif' }}
    >
      {/* Hero Section */}
      <div className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0C1B33 0%, #1a2744 100%)' }}>
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-40 h-40 rounded-full" style={{ background: 'radial-gradient(circle, #00FF84 0%, transparent 70%)' }}></div>
          <div className="absolute bottom-20 right-20 w-60 h-60 rounded-full" style={{ background: 'radial-gradient(circle, #00FF84 0%, transparent 70%)' }}></div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4" style={{ color: '#FFFFFF' }}>
              My Profile
            </h1>
            <p className="text-xl max-w-2xl mx-auto" style={{ color: '#B0B0B0' }}>
              Manage your personal information and account settings
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 p-4 rounded-2xl border-l-4 flex items-center" 
               style={{ backgroundColor: 'rgba(0, 255, 132, 0.1)', borderColor: '#00FF84' }}>
            <CheckIcon className="h-6 w-6 mr-3" style={{ color: '#00FF84' }} />
            <span style={{ color: '#00FF84' }} className="font-semibold">
              Profile updated successfully!
            </span>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 rounded-2xl border-l-4 flex items-center" 
               style={{ backgroundColor: 'rgba(255, 107, 107, 0.1)', borderColor: '#FF6B6B' }}>
            <ExclamationTriangleIcon className="h-6 w-6 mr-3" style={{ color: '#FF6B6B' }} />
            <span style={{ color: '#FF6B6B' }} className="font-semibold">
              {error}
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1">
            <div className="rounded-3xl p-8 border-2" 
                 style={{ backgroundColor: '#FFFFFF', borderColor: 'transparent' }}>
              
              {/* Profile Picture */}
              <div className="text-center mb-8">
                <div className="relative inline-block">
                  {profileData.profile_pic ? (
                    <img
                      src={profileData.profile_pic}
                      alt="Profile"
                      className="w-32 h-32 rounded-full object-cover shadow-xl mx-auto"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full flex items-center justify-center mx-auto shadow-xl"
                         style={{ backgroundColor: 'rgba(0, 255, 132, 0.1)' }}>
                      <UserIcon className="h-16 w-16" style={{ color: '#00FF84' }} />
                    </div>
                  )}
                  
                  {isEditing && (
                    <button
                      className="absolute bottom-2 right-2 p-2 rounded-full shadow-lg transition-transform duration-200 hover:scale-110"
                      style={{ backgroundColor: '#00FF84', color: '#000000' }}
                    >
                      <CameraIcon className="h-4 w-4" />
                    </button>
                  )}
                </div>
                
                <h2 className="text-2xl font-bold mt-4 mb-2" style={{ color: '#000000' }}>
                  {profileData.first_name} {profileData.last_name}
                </h2>
                
                <div className="flex items-center justify-center text-sm mb-4" style={{ color: '#666666' }}>
                  <ShieldCheckIcon className="h-4 w-4 mr-2" />
                  <span className="capitalize">{user?.role || 'Job Seeker'}</span>
                </div>
                
                {profileData.location && (
                  <div className="flex items-center justify-center text-sm" style={{ color: '#666666' }}>
                    <MapPinIcon className="h-4 w-4 mr-2" />
                    <span>{profileData.location}</span>
                  </div>
                )}
              </div>

              {/* Profile Completion */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-semibold" style={{ color: '#000000' }}>
                    Profile Completion
                  </span>
                  <span className="text-sm font-bold" style={{ color: '#00FF84' }}>
                    {profileCompletion}%
                  </span>
                </div>
                <div className="w-full rounded-full h-3" style={{ backgroundColor: '#E5E5E5' }}>
                  <div 
                    className="h-3 rounded-full transition-all duration-500"
                    style={{ 
                      backgroundColor: '#00FF84',
                      width: `${profileCompletion}%`
                    }}
                  ></div>
                </div>
                <p className="text-xs mt-2" style={{ color: '#666666' }}>
                  Complete your profile to attract more employers
                </p>
              </div>

              {/* Quick Actions */}
              <div className="space-y-3">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="w-full flex items-center justify-center px-4 py-3 rounded-2xl font-semibold transition-all duration-300 hover:scale-105"
                  style={{ 
                    backgroundColor: isEditing ? '#FF6B6B' : '#00FF84',
                    color: '#000000'
                  }}
                >
                  {isEditing ? (
                    <>
                      <XMarkIcon className="h-5 w-5 mr-2" />
                      Cancel Editing
                    </>
                  ) : (
                    <>
                      <PencilIcon className="h-5 w-5 mr-2" />
                      Edit Profile
                    </>
                  )}
                </button>

                <button
                  onClick={() => setShowChangePassword(!showChangePassword)}
                  className="w-full flex items-center justify-center px-4 py-3 rounded-2xl font-semibold transition-all duration-300 hover:scale-105"
                  style={{ 
                    backgroundColor: 'rgba(0, 255, 132, 0.1)',
                    color: '#00FF84',
                    border: '2px solid #00FF84'
                  }}
                >
                  <ShieldCheckIcon className="h-5 w-5 mr-2" />
                  Change Password
                </button>
              </div>
            </div>
          </div>

          {/* Main Profile Content */}
          <div className="lg:col-span-2">
            <div className="rounded-3xl p-8 border-2" 
                 style={{ backgroundColor: '#FFFFFF', borderColor: 'transparent' }}>
              
              {/* Personal Information */}
              <div className="mb-10">
                <h3 className="text-2xl font-bold mb-6 flex items-center" style={{ color: '#000000' }}>
                  <UserIcon className="h-6 w-6 mr-3" style={{ color: '#00FF84' }} />
                  Personal Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* First Name */}
                  <div>
                    <label className="block text-sm font-bold mb-2" style={{ color: '#000000' }}>
                      First Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="first_name"
                        value={profileData.first_name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-2xl border-2 transition-all duration-200 focus:outline-none"
                        style={{ 
                          backgroundColor: '#F8F9FA',
                          borderColor: '#E5E7EB',
                          color: '#000000'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#00FF84'}
                        onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                      />
                    ) : (
                      <p className="px-4 py-3 rounded-2xl" style={{ backgroundColor: '#F8F9FA', color: '#000000' }}>
                        {profileData.first_name || 'Not provided'}
                      </p>
                    )}
                  </div>

                  {/* Last Name */}
                  <div>
                    <label className="block text-sm font-bold mb-2" style={{ color: '#000000' }}>
                      Last Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="last_name"
                        value={profileData.last_name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-2xl border-2 transition-all duration-200 focus:outline-none"
                        style={{ 
                          backgroundColor: '#F8F9FA',
                          borderColor: '#E5E7EB',
                          color: '#000000'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#00FF84'}
                        onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                      />
                    ) : (
                      <p className="px-4 py-3 rounded-2xl" style={{ backgroundColor: '#F8F9FA', color: '#000000' }}>
                        {profileData.last_name || 'Not provided'}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-bold mb-2" style={{ color: '#000000' }}>
                      Email Address
                    </label>
                    <div className="flex items-center px-4 py-3 rounded-2xl" style={{ backgroundColor: '#F8F9FA' }}>
                      <EnvelopeIcon className="h-5 w-5 mr-3" style={{ color: '#666666' }} />
                      <span style={{ color: '#000000' }}>{profileData.email}</span>
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-bold mb-2" style={{ color: '#000000' }}>
                      Phone Number
                    </label>
                    {isEditing ? (
                      <div className="relative">
                        <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5" style={{ color: '#666666' }} />
                        <input
                          type="tel"
                          name="phone"
                          value={profileData.phone}
                          onChange={handleInputChange}
                          placeholder="+1234567890"
                          className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 transition-all duration-200 focus:outline-none"
                          style={{ 
                            backgroundColor: '#F8F9FA',
                            borderColor: '#E5E7EB',
                            color: '#000000'
                          }}
                          onFocus={(e) => e.target.style.borderColor = '#00FF84'}
                          onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                        />
                      </div>
                    ) : (
                      <div className="flex items-center px-4 py-3 rounded-2xl" style={{ backgroundColor: '#F8F9FA' }}>
                        <PhoneIcon className="h-5 w-5 mr-3" style={{ color: '#666666' }} />
                        <span style={{ color: '#000000' }}>{profileData.phone || 'Not provided'}</span>
                      </div>
                    )}
                  </div>

                  {/* Location */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold mb-2" style={{ color: '#000000' }}>
                      Location
                    </label>
                    {isEditing ? (
                      <div className="relative">
                        <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5" style={{ color: '#666666' }} />
                        <input
                          type="text"
                          name="location"
                          value={profileData.location}
                          onChange={handleInputChange}
                          placeholder="City, Country"
                          className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 transition-all duration-200 focus:outline-none"
                          style={{ 
                            backgroundColor: '#F8F9FA',
                            borderColor: '#E5E7EB',
                            color: '#000000'
                          }}
                          onFocus={(e) => e.target.style.borderColor = '#00FF84'}
                          onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                        />
                      </div>
                    ) : (
                      <div className="flex items-center px-4 py-3 rounded-2xl" style={{ backgroundColor: '#F8F9FA' }}>
                        <MapPinIcon className="h-5 w-5 mr-3" style={{ color: '#666666' }} />
                        <span style={{ color: '#000000' }}>{profileData.location || 'Not provided'}</span>
                      </div>
                    )}
                  </div>

                  {/* Bio */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold mb-2" style={{ color: '#000000' }}>
                      Bio
                    </label>
                    {isEditing ? (
                      <textarea
                        name="bio"
                        value={profileData.bio}
                        onChange={handleInputChange}
                        rows={4}
                        placeholder="Tell us about yourself..."
                        className="w-full px-4 py-3 rounded-2xl border-2 transition-all duration-200 focus:outline-none resize-none"
                        style={{ 
                          backgroundColor: '#F8F9FA',
                          borderColor: '#E5E7EB',
                          color: '#000000'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#00FF84'}
                        onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                      />
                    ) : (
                      <p className="px-4 py-3 rounded-2xl min-h-[100px]" style={{ backgroundColor: '#F8F9FA', color: '#000000' }}>
                        {profileData.bio || 'No bio provided'}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div className="mb-10">
                <h3 className="text-2xl font-bold mb-6 flex items-center" style={{ color: '#000000' }}>
                  <BriefcaseIcon className="h-6 w-6 mr-3" style={{ color: '#00FF84' }} />
                  Professional Information
                </h3>
                
                <div className="space-y-6">
                  {/* Resume URL */}
                  <div>
                    <label className="block text-sm font-bold mb-2" style={{ color: '#000000' }}>
                      Resume URL
                    </label>
                    {isEditing ? (
                      <div className="relative">
                        <DocumentTextIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5" style={{ color: '#666666' }} />
                        <input
                          type="url"
                          name="resume_url"
                          value={profileData.resume_url}
                          onChange={handleInputChange}
                          placeholder="https://example.com/resume.pdf"
                          className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 transition-all duration-200 focus:outline-none"
                          style={{ 
                            backgroundColor: '#F8F9FA',
                            borderColor: '#E5E7EB',
                            color: '#000000'
                          }}
                          onFocus={(e) => e.target.style.borderColor = '#00FF84'}
                          onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                        />
                      </div>
                    ) : (
                      <div className="flex items-center justify-between px-4 py-3 rounded-2xl" style={{ backgroundColor: '#F8F9FA' }}>
                        <div className="flex items-center">
                          <DocumentTextIcon className="h-5 w-5 mr-3" style={{ color: '#666666' }} />
                          <span style={{ color: '#000000' }}>
                            {profileData.resume_url ? 'Resume uploaded' : 'No resume uploaded'}
                          </span>
                        </div>
                        {profileData.resume_url && (
                          <a
                            href={profileData.resume_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-semibold hover:underline"
                            style={{ color: '#00FF84' }}
                          >
                            View Resume
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="mb-10">
                <h3 className="text-2xl font-bold mb-6 flex items-center" style={{ color: '#000000' }}>
                  <LinkIcon className="h-6 w-6 mr-3" style={{ color: '#00FF84' }} />
                  Social Links
                </h3>
                
                <div className="grid grid-cols-1 gap-6">
                  {/* LinkedIn */}
                  <div>
                    <label className="block text-sm font-bold mb-2" style={{ color: '#000000' }}>
                      LinkedIn Profile
                    </label>
                    {isEditing ? (
                      <input
                        type="url"
                        name="linkedin_url"
                        value={profileData.linkedin_url}
                        onChange={handleInputChange}
                        placeholder="https://linkedin.com/in/username"
                        className="w-full px-4 py-3 rounded-2xl border-2 transition-all duration-200 focus:outline-none"
                        style={{ 
                          backgroundColor: '#F8F9FA',
                          borderColor: '#E5E7EB',
                          color: '#000000'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#00FF84'}
                        onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                      />
                    ) : (
                      <div className="flex items-center justify-between px-4 py-3 rounded-2xl" style={{ backgroundColor: '#F8F9FA' }}>
                        <span style={{ color: '#000000' }}>
                          {profileData.linkedin_url || 'Not provided'}
                        </span>
                        {profileData.linkedin_url && (
                          <a
                            href={profileData.linkedin_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-semibold hover:underline"
                            style={{ color: '#00FF84' }}
                          >
                            Visit
                          </a>
                        )}
                      </div>
                    )}
                  </div>

                  {/* GitHub */}
                  <div>
                    <label className="block text-sm font-bold mb-2" style={{ color: '#000000' }}>
                      GitHub Profile
                    </label>
                    {isEditing ? (
                      <input
                        type="url"
                        name="github_url"
                        value={profileData.github_url}
                        onChange={handleInputChange}
                        placeholder="https://github.com/username"
                        className="w-full px-4 py-3 rounded-2xl border-2 transition-all duration-200 focus:outline-none"
                        style={{ 
                          backgroundColor: '#F8F9FA',
                          borderColor: '#E5E7EB',
                          color: '#000000'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#00FF84'}
                        onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                      />
                    ) : (
                      <div className="flex items-center justify-between px-4 py-3 rounded-2xl" style={{ backgroundColor: '#F8F9FA' }}>
                        <span style={{ color: '#000000' }}>
                          {profileData.github_url || 'Not provided'}
                        </span>
                        {profileData.github_url && (
                          <a
                            href={profileData.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-semibold hover:underline"
                            style={{ color: '#00FF84' }}
                          >
                            Visit
                          </a>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Website */}
                  <div>
                    <label className="block text-sm font-bold mb-2" style={{ color: '#000000' }}>
                      Personal Website
                    </label>
                    {isEditing ? (
                      <div className="relative">
                        <GlobeAltIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5" style={{ color: '#666666' }} />
                        <input
                          type="url"
                          name="website_url"
                          value={profileData.website_url}
                          onChange={handleInputChange}
                          placeholder="https://yourwebsite.com"
                          className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 transition-all duration-200 focus:outline-none"
                          style={{ 
                            backgroundColor: '#F8F9FA',
                            borderColor: '#E5E7EB',
                            color: '#000000'
                          }}
                          onFocus={(e) => e.target.style.borderColor = '#00FF84'}
                          onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                        />
                      </div>
                    ) : (
                      <div className="flex items-center justify-between px-4 py-3 rounded-2xl" style={{ backgroundColor: '#F8F9FA' }}>
                        <div className="flex items-center">
                          <GlobeAltIcon className="h-5 w-5 mr-3" style={{ color: '#666666' }} />
                          <span style={{ color: '#000000' }}>
                            {profileData.website_url || 'Not provided'}
                          </span>
                        </div>
                        {profileData.website_url && (
                          <a
                            href={profileData.website_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-semibold hover:underline"
                            style={{ color: '#00FF84' }}
                          >
                            Visit
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Save Button */}
              {isEditing && (
                <div className="flex space-x-4">
                  <button
                    onClick={handleSaveProfile}
                    disabled={loading}
                    className="flex-1 flex items-center justify-center px-6 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: '#00FF84', color: '#000000' }}
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-3"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <CheckIcon className="h-5 w-5 mr-2" />
                        Save Changes
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105"
                    style={{ 
                      backgroundColor: 'rgba(255, 107, 107, 0.1)',
                      color: '#FF6B6B',
                      border: '2px solid #FF6B6B'
                    }}
                  >
                    <XMarkIcon className="h-5 w-5 mr-2" />
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {/* Change Password Section */}
            {showChangePassword && (
              <div className="mt-8 rounded-3xl p-8 border-2" 
                   style={{ backgroundColor: '#FFFFFF', borderColor: 'transparent' }}>
                <h3 className="text-2xl font-bold mb-6 flex items-center" style={{ color: '#000000' }}>
                  <ShieldCheckIcon className="h-6 w-6 mr-3" style={{ color: '#00FF84' }} />
                  Change Password
                </h3>

                <div className="space-y-6">
                  {/* Current Password */}
                  <div>
                    <label className="block text-sm font-bold mb-2" style={{ color: '#000000' }}>
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.current ? 'text' : 'password'}
                        name="current_password"
                        value={passwordData.current_password}
                        onChange={handlePasswordChange}
                        placeholder="Enter your current password"
                        className="w-full px-4 py-3 pr-12 rounded-2xl border-2 transition-all duration-200 focus:outline-none"
                        style={{ 
                          backgroundColor: '#F8F9FA',
                          borderColor: '#E5E7EB',
                          color: '#000000'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#00FF84'}
                        onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('current')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1"
                        style={{ color: '#666666' }}
                      >
                        {showPasswords.current ? (
                          <EyeSlashIcon className="h-5 w-5" />
                        ) : (
                          <EyeIcon className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="block text-sm font-bold mb-2" style={{ color: '#000000' }}>
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.new ? 'text' : 'password'}
                        name="new_password"
                        value={passwordData.new_password}
                        onChange={handlePasswordChange}
                        placeholder="Enter your new password"
                        className="w-full px-4 py-3 pr-12 rounded-2xl border-2 transition-all duration-200 focus:outline-none"
                        style={{ 
                          backgroundColor: '#F8F9FA',
                          borderColor: '#E5E7EB',
                          color: '#000000'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#00FF84'}
                        onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('new')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1"
                        style={{ color: '#666666' }}
                      >
                        {showPasswords.new ? (
                          <EyeSlashIcon className="h-5 w-5" />
                        ) : (
                          <EyeIcon className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Confirm New Password */}
                  <div>
                    <label className="block text-sm font-bold mb-2" style={{ color: '#000000' }}>
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.confirm ? 'text' : 'password'}
                        name="confirm_password"
                        value={passwordData.confirm_password}
                        onChange={handlePasswordChange}
                        placeholder="Confirm your new password"
                        className="w-full px-4 py-3 pr-12 rounded-2xl border-2 transition-all duration-200 focus:outline-none"
                        style={{ 
                          backgroundColor: '#F8F9FA',
                          borderColor: '#E5E7EB',
                          color: '#000000'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#00FF84'}
                        onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('confirm')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1"
                        style={{ color: '#666666' }}
                      >
                        {showPasswords.confirm ? (
                          <EyeSlashIcon className="h-5 w-5" />
                        ) : (
                          <EyeIcon className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Password Requirements */}
                  <div className="p-4 rounded-2xl" style={{ backgroundColor: 'rgba(0, 255, 132, 0.05)' }}>
                    <h4 className="font-semibold mb-3" style={{ color: '#000000' }}>Password Requirements:</h4>
                    <ul className="text-sm space-y-1" style={{ color: '#666666' }}>
                      <li>• At least 8 characters long</li>
                      <li>• Contains at least one uppercase letter</li>
                      <li>• Contains at least one lowercase letter</li>
                      <li>• Contains at least one number</li>
                      <li>• Contains at least one special character</li>
                    </ul>
                  </div>

                  {/* Change Password Buttons */}
                  <div className="flex space-x-4">
                    <button
                      onClick={handleChangePassword}
                      disabled={loading || !passwordData.current_password || !passwordData.new_password || !passwordData.confirm_password}
                      className="flex-1 flex items-center justify-center px-6 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ backgroundColor: '#00FF84', color: '#000000' }}
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-3"></div>
                          Changing...
                        </>
                      ) : (
                        <>
                          <CheckIcon className="h-5 w-5 mr-2" />
                          Change Password
                        </>
                      )}
                    </button>
                    
                    <button
                      onClick={() => {
                        setShowChangePassword(false);
                        setPasswordData({
                          current_password: '',
                          new_password: '',
                          confirm_password: ''
                        });
                      }}
                      className="px-6 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105"
                      style={{ 
                        backgroundColor: 'rgba(255, 107, 107, 0.1)',
                        color: '#FF6B6B',
                        border: '2px solid #FF6B6B'
                      }}
                    >
                      <XMarkIcon className="h-5 w-5 mr-2" />
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;