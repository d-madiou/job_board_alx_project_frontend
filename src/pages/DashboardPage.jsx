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
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    applications: [],
    savedJobs: [],
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
        const applicationsResponse = await api.get('/applications/');
        const applications = applicationsResponse.data.results || applicationsResponse.data || [];
        
        // Fetch saved jobs
        const savedJobsResponse = await api.get('/saved-jobs/');
        const savedJobs = savedJobsResponse.data.results || savedJobsResponse.data || [];
        
        // Fetch recommended jobs
        const jobsResponse = await api.get('/jobs/?limit=6');
        const recommendedJobs = jobsResponse.data.results || jobsResponse.data || [];
        
        setDashboardData({
          applications: Array.isArray(applications) ? applications : [],
          savedJobs: Array.isArray(savedJobs) ? savedJobs : [],
          profileViews: Math.floor(Math.random() * 50) + 10, // Mock data
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
        return '#D98C3F';
      case 'interview':
        return '#54990b';
      case 'accepted':
        return '#6AA84F';
      case 'rejected':
        return '#DC2626';
      default:
        return '#A0A0A0';
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
    { id: 'applications', label: 'Applications', icon: BriefcaseIcon },
    { id: 'saved-jobs', label: 'Saved Jobs', icon: HeartIcon }
  ];

  if (loading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: '#282828', fontFamily: 'Poppins, sans-serif' }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: '#54990b' }}></div>
          <p style={{ color: '#F0F0F0' }}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: '#282828', fontFamily: 'Poppins, sans-serif' }}
      >
        <div className="text-center">
          <p style={{ color: '#D98C3F' }} className="text-lg">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen flex"
      style={{ backgroundColor: '#282828', fontFamily: 'Poppins, sans-serif' }}
    >
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 transition-transform duration-300 ease-in-out`}>
        <div 
          className="h-full p-6 overflow-y-auto"
          style={{ backgroundColor: '#282828', borderRight: '1px solid #3F7A8C' }}
        >
          <div className="mb-8">
            <h2 className="text-xl font-bold" style={{ color: '#54990b' }}>Dashboard</h2>
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
                  color: item.active ? '#54990b' : '#A0A0A0'
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
          {/* Welcome Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-gray-600 flex items-center justify-center">
                <UserIcon className="h-8 w-8" style={{ color: '#F0F0F0' }} />
              </div>
              <div>
                <h1 className="text-2xl font-medium" style={{ color: '#F0F0F0' }}>
                  Welcome back, {user?.first_name}!
                </h1>
                <p style={{ color: '#A0A0A0' }}>
                  Here's what's happening with your job search
                </p>
              </div>
            </div>
          </div>

          {/* Dashboard Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Applications Sent */}
            <div 
              className="p-6 rounded-xl transition-all duration-300 hover:transform hover:scale-105"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
            >
              <div className="flex items-center justify-between mb-4">
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(84, 153, 11, 0.2)' }}
                >
                  <BriefcaseIcon className="h-6 w-6" style={{ color: '#54990b' }} />
                </div>
                <span className="text-2xl font-bold" style={{ color: '#54990b' }}>
                  {dashboardData.applications.length}
                </span>
              </div>
              <h3 className="font-semibold mb-1" style={{ color: '#F0F0F0' }}>Applications Sent</h3>
              <p className="text-sm" style={{ color: '#A0A0A0' }}>Total applications submitted</p>
            </div>

            {/* Profile Views */}
            <div 
              className="p-6 rounded-xl transition-all duration-300 hover:transform hover:scale-105"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
            >
              <div className="flex items-center justify-between mb-4">
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(217, 140, 63, 0.2)' }}
                >
                  <EyeIcon className="h-6 w-6" style={{ color: '#D98C3F' }} />
                </div>
                <span className="text-2xl font-bold" style={{ color: '#D98C3F' }}>
                  {dashboardData.profileViews}
                </span>
              </div>
              <h3 className="font-semibold mb-1" style={{ color: '#F0F0F0' }}>Profile Views</h3>
              <p className="text-sm" style={{ color: '#A0A0A0' }}>This month</p>
            </div>

            {/* Saved Jobs */}
            <div 
              className="p-6 rounded-xl transition-all duration-300 hover:transform hover:scale-105"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
            >
              <div className="flex items-center justify-between mb-4">
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(63, 122, 140, 0.2)' }}
                >
                  <HeartIcon className="h-6 w-6" style={{ color: '#3F7A8C' }} />
                </div>
                <span className="text-2xl font-bold" style={{ color: '#3F7A8C' }}>
                  {dashboardData.savedJobs.length}
                </span>
              </div>
              <h3 className="font-semibold mb-1" style={{ color: '#F0F0F0' }}>Saved Jobs</h3>
              <p className="text-sm" style={{ color: '#A0A0A0' }}>Jobs you're interested in</p>
            </div>

            {/* Interview Invites */}
            <div 
              className="p-6 rounded-xl transition-all duration-300 hover:transform hover:scale-105"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
            >
              <div className="flex items-center justify-between mb-4">
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(106, 168, 79, 0.2)' }}
                >
                  <CalendarIcon className="h-6 w-6" style={{ color: '#6AA84F' }} />
                </div>
                <span className="text-2xl font-bold" style={{ color: '#6AA84F' }}>
                  {dashboardData.interviewInvites}
                </span>
              </div>
              <h3 className="font-semibold mb-1" style={{ color: '#F0F0F0' }}>Interview Invites</h3>
              <p className="text-sm" style={{ color: '#A0A0A0' }}>Pending interviews</p>
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
                  <h2 className="text-xl font-semibold" style={{ color: '#F0F0F0' }}>
                    Recent Applications
                  </h2>
                  <Link
                    to="/applications"
                    className="text-sm font-medium transition-colors duration-200"
                    style={{ color: '#54990b' }}
                    onMouseEnter={(e) => e.target.style.color = '#6AA84F'}
                    onMouseLeave={(e) => e.target.style.color = '#54990b'}
                  >
                    View All
                  </Link>
                </div>

                {dashboardData.applications.length === 0 ? (
                  <div className="text-center py-8">
                    <BriefcaseIcon className="h-12 w-12 mx-auto mb-4" style={{ color: '#A0A0A0' }} />
                    <p className="mb-2" style={{ color: '#F0F0F0' }}>No applications yet</p>
                    <p className="text-sm" style={{ color: '#A0A0A0' }}>Start applying to jobs to see your applications here</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {dashboardData.applications.slice(0, 5).map((application) => (
                      <div
                        key={application.id}
                        className="flex items-center justify-between p-4 rounded-lg transition-colors duration-200 hover:bg-white/5"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 rounded-lg bg-gray-600 flex items-center justify-center">
                            <BriefcaseIcon className="h-6 w-6" style={{ color: '#F0F0F0' }} />
                          </div>
                          <div>
                            <h3 className="font-medium" style={{ color: '#F0F0F0' }}>
                              {application.job?.title || 'Job Title'}
                            </h3>
                            <p className="text-sm" style={{ color: '#A0A0A0' }}>
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
                          <ChevronRightIcon className="h-5 w-5" style={{ color: '#A0A0A0' }} />
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
                  <h2 className="text-xl font-semibold" style={{ color: '#F0F0F0' }}>
                    Recommended Jobs
                  </h2>
                  <Link
                    to="/jobs"
                    className="text-sm font-medium transition-colors duration-200"
                    style={{ color: '#54990b' }}
                    onMouseEnter={(e) => e.target.style.color = '#6AA84F'}
                    onMouseLeave={(e) => e.target.style.color = '#54990b'}
                  >
                    View All
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {dashboardData.recommendedJobs.map((job) => (
                    <div
                      key={job.id}
                      className="p-4 rounded-lg transition-all duration-300 hover:transform hover:scale-105"
                      style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                    >
                      <h3 className="font-medium mb-2" style={{ color: '#F0F0F0' }}>
                        {job.title}
                      </h3>
                      <p className="text-sm mb-2" style={{ color: '#A0A0A0' }}>
                        {job.company?.name || 'Company Name'}
                      </p>
                      <div className="flex items-center text-xs mb-3" style={{ color: '#A0A0A0' }}>
                        <MapPinIcon className="h-3 w-3 mr-1" />
                        {job.location || 'Location not specified'}
                      </div>
                      {job.salary && (
                        <div className="flex items-center text-xs mb-3 font-semibold" style={{ color: '#54990b' }}>
                          <CurrencyDollarIcon className="h-3 w-3 mr-1" />
                          {job.salary}
                        </div>
                      )}
                      <Link
                        to={`/jobs/${job.id}`}
                        className="text-xs font-medium transition-colors duration-200"
                        style={{ color: '#54990b' }}
                        onMouseEnter={(e) => e.target.style.color = '#6AA84F'}
                        onMouseLeave={(e) => e.target.style.color = '#54990b'}
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
                <h3 className="text-lg font-semibold mb-4" style={{ color: '#F0F0F0' }}>
                  Profile Completion
                </h3>
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span style={{ color: '#A0A0A0' }}>Progress</span>
                    <span style={{ color: '#54990b' }} className="font-semibold">{profileCompletion}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-300"
                      style={{ 
                        backgroundColor: '#54990b',
                        width: `${profileCompletion}%`
                      }}
                    ></div>
                  </div>
                </div>
                <p className="text-sm mb-4" style={{ color: '#A0A0A0' }}>
                  Complete your profile to get better job recommendations
                </p>
                <Link
                  to="/profile"
                  className="block w-full py-2 px-4 rounded-lg font-medium text-white text-center transition-all duration-200 hover:shadow-lg"
                  style={{ backgroundColor: '#54990b' }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#6AA84F'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#54990b'}
                >
                  Complete Profile
                </Link>
              </div>

              {/* Quick Actions */}
              <div 
                className="rounded-xl p-6"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
              >
                <h3 className="text-lg font-semibold mb-4" style={{ color: '#F0F0F0' }}>
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <Link
                    to="/profile"
                    className="flex items-center space-x-3 p-3 rounded-lg transition-colors duration-200 hover:bg-white/5"
                  >
                    <PencilIcon className="h-5 w-5" style={{ color: '#54990b' }} />
                    <span style={{ color: '#F0F0F0' }}>Update Profile</span>
                  </Link>
                  <Link
                    to="/jobs"
                    className="flex items-center space-x-3 p-3 rounded-lg transition-colors duration-200 hover:bg-white/5"
                  >
                    <MagnifyingGlassIcon className="h-5 w-5" style={{ color: '#54990b' }} />
                    <span style={{ color: '#F0F0F0' }}>Browse Jobs</span>
                  </Link>
                  <Link
                    to="/resume"
                    className="flex items-center space-x-3 p-3 rounded-lg transition-colors duration-200 hover:bg-white/5"
                  >
                    <ArrowUpTrayIcon className="h-5 w-5" style={{ color: '#54990b' }} />
                    <span style={{ color: '#F0F0F0' }}>Upload Resume</span>
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
