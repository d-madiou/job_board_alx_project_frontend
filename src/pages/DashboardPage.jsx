import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/auth';
import api from '../utils/api';
import {
  UserIcon,
  BriefcaseIcon,
  EyeIcon,
  HeartIcon,
  CalendarIcon,
  DocumentTextIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  ArrowUpTrayIcon,
  ChevronRightIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  Bars3Icon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState({
  applications: [],
  profileViews: 0,
  interviewInvites: 0,
  recommendedJobs: []
});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch user applications
        const applicationsResponse = await api.get('/applications/my-applications/');
        const applications = applicationsResponse.data.results || applicationsResponse.data || [];
        
        // Fetch saved jobs
        // const savedJobsResponse = await api.get('/saved-jobs/');
        // const savedJobs = savedJobsResponse.data.results || savedJobsResponse.data || [];
        
        // Fetch recommended jobs
        const jobsResponse = await api.get('/jobs/?limit=6');
        const recommendedJobs = jobsResponse.data.results || jobsResponse.data || [];
        
        setDashboardData({
          applications: Array.isArray(applications) ? applications : [],
          profileViews: Math.floor(Math.random() * 50) + 10,
          interviewInvites: applications.filter(app => app.status === 'interview').length,
          recommendedJobs: Array.isArray(recommendedJobs) ? recommendedJobs.slice(0, 6) : []
        });
        
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.detail || 'Failed to fetch dashboard data');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return '#FFA500';
      case 'interview':
        return '#00FF84';
      case 'accepted':
        return '#32CD32';
      case 'rejected':
        return '#FF4444';
      default:
        return '#B0B0B0';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return <ClockIcon className="h-4 w-4" />;
      case 'interview':
        return <CalendarIcon className="h-4 w-4" />;
      case 'accepted':
        return <CheckCircleIcon className="h-4 w-4" />;
      case 'rejected':
        return <XCircleIcon className="h-4 w-4" />;
      default:
        return <ClockIcon className="h-4 w-4" />;
    }
  };

  const profileCompletion = 75; // Mock data - calculate based on user profile fields

  const sidebarItems = [
  { id: 'dashboard', label: 'Dashboard', icon: UserIcon, active: true },
  { id: 'profile', label: 'Profile', icon: UserIcon },
  { id: 'applications', label: 'Applications', icon: BriefcaseIcon }
];

  if (loading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: '#0C1B33', fontFamily: 'Poppins, sans-serif' }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: '#00FF84' }}></div>
          <p style={{ color: '#FFFFFF' }}>Loading dashboard...</p>
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
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                  item.active ? 'bg-white/10' : 'hover:bg-white/5'
                }`}
                style={{ 
                  color: item.active ? '#00FF84' : '#B0B0B0'
                }}
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

          {/* Welcome Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-4">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ backgroundColor: 'rgba(0, 255, 132, 0.1)' }}
              >
                <UserIcon className="h-8 w-8" style={{ color: '#00FF84' }} />
              </div>
              <div>
                <h1 className="text-2xl font-medium" style={{ color: '#FFFFFF' }}>
                  Welcome back, {user?.first_name}!
                </h1>
                <p style={{ color: '#B0B0B0' }}>
                  Here's what's happening with your job search
                </p>
              </div>
            </div>
          </div>

          {/* Dashboard Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Applications Sent */}
            <div 
              className="p-6 rounded-xl transition-all duration-300 hover:transform hover:scale-105 border-2 border-transparent"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
              onMouseEnter={(e) => e.target.style.borderColor = '#00FF84'}
              onMouseLeave={(e) => e.target.style.borderColor = 'transparent'}
            >
              <div className="flex items-center justify-between mb-4">
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(0, 255, 132, 0.2)' }}
                >
                  <BriefcaseIcon className="h-6 w-6" style={{ color: '#00FF84' }} />
                </div>
                <span className="text-2xl font-bold" style={{ color: '#00FF84' }}>
                  {dashboardData.applications.length}
                </span>
              </div>
              <h3 className="font-semibold mb-1" style={{ color: '#FFFFFF' }}>Applications Sent</h3>
              <p className="text-sm" style={{ color: '#B0B0B0' }}>Total applications submitted</p>
            </div>

            {/* Profile Views */}
            <div 
              className="p-6 rounded-xl transition-all duration-300 hover:transform hover:scale-105 border-2 border-transparent"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
              onMouseEnter={(e) => e.target.style.borderColor = '#FFA500'}
              onMouseLeave={(e) => e.target.style.borderColor = 'transparent'}
            >
              <div className="flex items-center justify-between mb-4">
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(255, 165, 0, 0.2)' }}
                >
                  <EyeIcon className="h-6 w-6" style={{ color: '#FFA500' }} />
                </div>
                <span className="text-2xl font-bold" style={{ color: '#FFA500' }}>
                  {dashboardData.profileViews}
                </span>
              </div>
              <h3 className="font-semibold mb-1" style={{ color: '#FFFFFF' }}>Profile Views</h3>
              <p className="text-sm" style={{ color: '#B0B0B0' }}>This month</p>
            </div>

            {/* Saved Jobs */}
            <div 
              className="p-6 rounded-xl transition-all duration-300 hover:transform hover:scale-105 border-2 border-transparent"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
              onMouseEnter={(e) => e.target.style.borderColor = '#FF69B4'}
              onMouseLeave={(e) => e.target.style.borderColor = 'transparent'}
            >
              <div className="flex items-center justify-between mb-4">
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(255, 105, 180, 0.2)' }}
                >
                  <HeartIcon className="h-6 w-6" style={{ color: '#FF69B4' }} />
                </div>
                {/* <span className="text-2xl font-bold" style={{ color: '#FF69B4' }}>
                  {dashboardData.savedJobs.length}
                </span> */}
              </div>
              <h3 className="font-semibold mb-1" style={{ color: '#FFFFFF' }}>Saved Jobs</h3>
              <p className="text-sm" style={{ color: '#B0B0B0' }}>Jobs you're interested in</p>
            </div>

            {/* Interview Invites */}
            <div 
              className="p-6 rounded-xl transition-all duration-300 hover:transform hover:scale-105 border-2 border-transparent"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
              onMouseEnter={(e) => e.target.style.borderColor = '#32CD32'}
              onMouseLeave={(e) => e.target.style.borderColor = 'transparent'}
            >
              <div className="flex items-center justify-between mb-4">
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(50, 205, 50, 0.2)' }}
                >
                  <CalendarIcon className="h-6 w-6" style={{ color: '#32CD32' }} />
                </div>
                <span className="text-2xl font-bold" style={{ color: '#32CD32' }}>
                  {dashboardData.interviewInvites}
                </span>
              </div>
              <h3 className="font-semibold mb-1" style={{ color: '#FFFFFF' }}>Interview Invites</h3>
              <p className="text-sm" style={{ color: '#B0B0B0' }}>Pending interviews</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Recent Applications */}
              <div 
                className="rounded-xl p-6"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold" style={{ color: '#FFFFFF' }}>
                    Recent Applications
                  </h2>
                  <Link
                    to="/applications"
                    className="text-sm font-medium transition-colors duration-200"
                    style={{ color: '#00FF84' }}
                    onMouseEnter={(e) => e.target.style.color = '#00E676'}
                    onMouseLeave={(e) => e.target.style.color = '#00FF84'}
                  >
                    View All
                  </Link>
                </div>

                {dashboardData.applications.length === 0 ? (
                  <div className="text-center py-8">
                    <BriefcaseIcon className="h-12 w-12 mx-auto mb-4" style={{ color: '#B0B0B0' }} />
                    <p className="mb-2" style={{ color: '#FFFFFF' }}>No applications yet</p>
                    <p className="text-sm" style={{ color: '#B0B0B0' }}>Start applying to jobs to see your applications here</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {dashboardData.applications.slice(0, 5).map((application) => (
                      <div
                        key={application.id}
                        className="flex items-center justify-between p-4 rounded-lg transition-colors duration-200 hover:bg-white/5"
                      >
                        <div className="flex items-center space-x-4">
                          <div 
                            className="w-12 h-12 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: 'rgba(0, 255, 132, 0.1)' }}
                          >
                            <BriefcaseIcon className="h-6 w-6" style={{ color: '#00FF84' }} />
                          </div>
                          <div>
                            <h3 className="font-medium" style={{ color: '#FFFFFF' }}>
                              {application.job?.title || 'Job Title'}
                            </h3>
                            <p className="text-sm" style={{ color: '#B0B0B0' }}>
                              {application.job?.company?.name || 'Company Name'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div 
                            className="flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium"
                            style={{ 
                              backgroundColor: `${getStatusColor(application.status)}20`,
                              color: getStatusColor(application.status)
                            }}
                          >
                            {getStatusIcon(application.status)}
                            <span className="capitalize">{application.status || 'Pending'}</span>
                          </div>
                          <ChevronRightIcon className="h-5 w-5" style={{ color: '#B0B0B0' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recommended Jobs */}
              <div 
                className="rounded-xl p-6"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold" style={{ color: '#FFFFFF' }}>
                    Recommended Jobs
                  </h2>
                  <Link
                    to="/jobs"
                    className="text-sm font-medium transition-colors duration-200"
                    style={{ color: '#00FF84' }}
                    onMouseEnter={(e) => e.target.style.color = '#00E676'}
                    onMouseLeave={(e) => e.target.style.color = '#00FF84'}
                  >
                    View All
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {dashboardData.recommendedJobs.map((job) => (
                    <div
                      key={job.id}
                      className="p-4 rounded-lg transition-all duration-300 hover:transform hover:scale-105 border-2 border-transparent"
                      style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                      onMouseEnter={(e) => e.target.style.borderColor = '#00FF84'}
                      onMouseLeave={(e) => e.target.style.borderColor = 'transparent'}
                    >
                      <h3 className="font-medium mb-2" style={{ color: '#FFFFFF' }}>
                        {job.title}
                      </h3>
                      <p className="text-sm mb-2" style={{ color: '#B0B0B0' }}>
                        {job.company?.name || 'Company Name'}
                      </p>
                      <div className="flex items-center text-xs mb-3" style={{ color: '#B0B0B0' }}>
                        <MapPinIcon className="h-3 w-3 mr-1" />
                        {job.location || 'Location not specified'}
                      </div>
                      {job.salary && (
                        <div className="flex items-center text-xs mb-3 font-semibold" style={{ color: '#00FF84' }}>
                          <CurrencyDollarIcon className="h-3 w-3 mr-1" />
                          {job.salary}
                        </div>
                      )}
                      <Link
                        to={`/jobs/${job.id}`}
                        className="text-xs font-medium transition-colors duration-200"
                        style={{ color: '#00FF84' }}
                        onMouseEnter={(e) => e.target.style.color = '#00E676'}
                        onMouseLeave={(e) => e.target.style.color = '#00FF84'}
                      >
                        View Details →
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Profile Completion */}
              <div 
                className="rounded-xl p-6"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
              >
                <h3 className="text-lg font-semibold mb-4" style={{ color: '#FFFFFF' }}>
                  Profile Completion
                </h3>
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span style={{ color: '#B0B0B0' }}>Progress</span>
                    <span style={{ color: '#00FF84' }} className="font-semibold">{profileCompletion}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-300"
                      style={{ 
                        backgroundColor: '#00FF84',
                        width: `${profileCompletion}%`
                      }}
                    ></div>
                  </div>
                </div>
                <p className="text-sm mb-4" style={{ color: '#B0B0B0' }}>
                  Complete your profile to get better job recommendations
                </p>
                <Link
                  to="/profile"
                  className="block w-full py-2 px-4 rounded-lg font-medium text-center transition-all duration-200 hover:shadow-lg"
                  style={{ backgroundColor: '#00FF84', color: '#000000' }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#00E676'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#00FF84'}
                >
                  Complete Profile
                </Link>
              </div>

              {/* Quick Actions */}
              <div 
                className="rounded-xl p-6"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
              >
                <h3 className="text-lg font-semibold mb-4" style={{ color: '#FFFFFF' }}>
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <Link
                    to="/profile"
                    className="flex items-center space-x-3 p-3 rounded-lg transition-colors duration-200 hover:bg-white/5"
                  >
                    <PencilIcon className="h-5 w-5" style={{ color: '#00FF84' }} />
                    <span style={{ color: '#FFFFFF' }}>Update Profile</span>
                  </Link>
                  <Link
                    to="/jobs"
                    className="flex items-center space-x-3 p-3 rounded-lg transition-colors duration-200 hover:bg-white/5"
                  >
                    <MagnifyingGlassIcon className="h-5 w-5" style={{ color: '#00FF84' }} />
                    <span style={{ color: '#FFFFFF' }}>Browse Jobs</span>
                  </Link>
                  <Link
                    to="/resume"
                    className="flex items-center space-x-3 p-3 rounded-lg transition-colors duration-200 hover:bg-white/5"
                  >
                    <ArrowUpTrayIcon className="h-5 w-5" style={{ color: '#00FF84' }} />
                    <span style={{ color: '#FFFFFF' }}>Upload Resume</span>
                  </Link>
                </div>
              </div>
            </div>
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

export default Dashboard;
