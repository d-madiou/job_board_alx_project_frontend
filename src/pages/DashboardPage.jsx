import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/auth';
import api from '../utils/api';
import {
  UserIcon,
  BriefcaseIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  Bars3Icon,
  PencilIcon,
  ArrowUpTrayIcon,
  MagnifyingGlassIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    applications: [],
    stats: { total: 0, pending: 0, interview: 0, accepted: 0, rejected: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: UserIcon, active: true },
    { id: 'profile', label: 'Profile', icon: UserIcon },
    { id: 'applications', label: 'Applications', icon: BriefcaseIcon }
  ];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        let applications = [];
        let stats = { total: 0, pending: 0, interview: 0, accepted: 0, rejected: 0 };

        if (user?.role === 'user') {
          // Job Seeker: Fetch their applications and stats
          const [applicationsResponse, statsResponse] = await Promise.all([
            api.get('/applications/my-applications/'),
            api.get('/applications/stats/')
          ]);
          applications = applicationsResponse.data.results || applicationsResponse.data || [];
          stats = statsResponse.data || stats;
        } else if (user?.role === 'employer') {
          // Employer: Fetch applications for their job postings
          const applicationsResponse = await api.get('/applications/');
          applications = applicationsResponse.data.results || applicationsResponse.data || [];
        } else if (user?.role === 'admin') {
          // Admin: Fetch all applications
          const applicationsResponse = await api.get('/applications/');
          applications = applicationsResponse.data.results || applicationsResponse.data || [];
          // Calculate stats for admin
          stats = {
            total: applications.length,
            pending: applications.filter(app => app.status === 'pending').length,
            interview: applications.filter(app => app.status === 'interview').length,
            accepted: applications.filter(app => app.status === 'accepted').length,
            rejected: applications.filter(app => app.status === 'rejected').length
          };
        }

        setDashboardData({
          applications: Array.isArray(applications) ? applications : [],
          stats
        });
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.detail || 'Failed to fetch dashboard data');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user?.role]);

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

  const profileCompletion = user?.bio && user?.resume_url && user?.profile_pic ? 90 : 50;

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

          {/* Quick Actions for Job Seekers */}
          {user?.role === 'user' && (
            <div className="mt-8">
              <h3 className="text-sm font-semibold mb-4" style={{ color: '#B0B0B0' }}>
                QUICK ACTIONS
              </h3>
              <div className="space-y-2">
                <Link
                  to="/jobs"
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 hover:bg-white/5"
                  style={{ color: '#B0B0B0' }}
                >
                  <MagnifyingGlassIcon className="h-4 w-4" />
                  <span className="text-sm">Browse Jobs</span>
                </Link>
                <Link
                  to="/profile"
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 hover:bg-white/5"
                  style={{ color: '#B0B0B0' }}
                >
                  <PencilIcon className="h-4 w-4" />
                  <span className="text-sm">Update Profile</span>
                </Link>
                <Link
                  to="/resume"
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 hover:bg-white/5"
                  style={{ color: '#B0B0B0' }}
                >
                  <ArrowUpTrayIcon className="h-4 w-4" />
                  <span className="text-sm">Upload Resume</span>
                </Link>
              </div>
            </div>
          )}
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
                  Welcome back, {user?.full_name || user?.first_name}!
                </h1>
                <p style={{ color: '#B0B0B0' }}>
                  {user?.role === 'user' ? "Here's what's happening with your job search" :
                   user?.role === 'employer' ? 'Manage applications for your job postings' :
                   'Overview of all applications in the system'}
                </p>
              </div>
            </div>
          </div>

          {/* Stats Cards - Only for Job Seekers and Admins */}
          {(user?.role === 'user' || user?.role === 'admin') && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              <div 
                className="p-4 rounded-xl"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
              >
                <div className="text-2xl font-bold mb-1" style={{ color: '#FFFFFF' }}>
                  {dashboardData.stats.total}
                </div>
                <div className="text-sm" style={{ color: '#B0B0B0' }}>Total</div>
              </div>
              <div 
                className="p-4 rounded-xl"
                style={{ backgroundColor: 'rgba(255, 165, 0, 0.1)' }}
              >
                <div className="text-2xl font-bold mb-1" style={{ color: '#FFA500' }}>
                  {dashboardData.stats.pending}
                </div>
                <div className="text-sm" style={{ color: '#B0B0B0' }}>Pending</div>
              </div>
              <div 
                className="p-4 rounded-xl"
                style={{ backgroundColor: 'rgba(0, 255, 132, 0.1)' }}
              >
                <div className="text-2xl font-bold mb-1" style={{ color: '#00FF84' }}>
                  {dashboardData.stats.interview}
                </div>
                <div className="text-sm" style={{ color: '#B0B0B0' }}>Interview</div>
              </div>
              <div 
                className="p-4 rounded-xl"
                style={{ backgroundColor: 'rgba(50, 205, 50, 0.1)' }}
              >
                <div className="text-2xl font-bold mb-1" style={{ color: '#32CD32' }}>
                  {dashboardData.stats.accepted}
                </div>
                <div className="text-sm" style={{ color: '#B0B0B0' }}>Accepted</div>
              </div>
              <div 
                className="p-4 rounded-xl"
                style={{ backgroundColor: 'rgba(255, 68, 68, 0.1)' }}
              >
                <div className="text-2xl font-bold mb-1" style={{ color: '#FF4444' }}>
                  {dashboardData.stats.rejected}
                </div>
                <div className="text-sm" style={{ color: '#B0B0B0' }}>Rejected</div>
              </div>
            </div>
          )}

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
                    {user?.role === 'user' ? 'Recent Applications' :
                     user?.role === 'employer' ? 'Job Applications' :
                     'All Applications'}
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
                    <p className="mb-2" style={{ color: '#FFFFFF' }}>
                      {user?.role === 'user' ? 'No applications yet' :
                       user?.role === 'employer' ? 'No applications for your jobs yet' :
                       'No applications in the system'}
                    </p>
                    <p className="text-sm" style={{ color: '#B0B0B0' }}>
                      {user?.role === 'user' ? 'Start applying to jobs to see your applications here' :
                       user?.role === 'employer' ? 'Post a job to receive applications' :
                       'No applications have been submitted yet'}
                    </p>
                    {user?.role === 'user' && (
                      <Link
                        to="/jobs"
                        className="inline-flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200 mt-4"
                        style={{ backgroundColor: '#00FF84', color: '#000000' }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#00E676'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = '#00FF84'}
                      >
                        <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
                        Browse Jobs
                      </Link>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {dashboardData.applications.slice(0, 5).map((application) => (
                      <div
                        key={application.id}
                        className="flex items-center justify-between p-4 rounded-lg transition-colors duration-200 hover:bg-white/5 border-l-4"
                        style={{ borderLeftColor: getStatusColor(application.status) }}
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
                            {(user?.role === 'employer' || user?.role === 'admin') && application.applicant && (
                              <p className="text-sm" style={{ color: '#B0B0B0' }}>
                                Applicant: {application.applicant.full_name || application.applicant.email}
                              </p>
                            )}
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
                          <Link to={`/applications/${application.id}`}>
                            <ChevronRightIcon className="h-5 w-5" style={{ color: '#B0B0B0' }} />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column */}
            {user?.role === 'user' && (
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
            )}
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