import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/auth';
import api from '../utils/api';
import {
  UserIcon,
  BriefcaseIcon,
  EyeIcon,
  CalendarIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  ChevronRightIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  Bars3Icon,
  FunnelIcon,
  ChevronDownIcon,
  DocumentTextIcon,
  TrashIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const Applications = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    interview: 0,
    accepted: 0,
    rejected: 0
  });

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: UserIcon },
    { id: 'profile', label: 'Profile', icon: UserIcon },
    { id: 'applications', label: 'Applications', icon: BriefcaseIcon, active: true }
  ];

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchApplications();
  }, [isAuthenticated, navigate]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let endpoint = '/applications/';
      
      // Different endpoints based on user role
      if (user?.role === 'employer') {
        // Fetch applications for jobs posted by this employer
        endpoint = '/applications/employer/';
      } else if (user?.role === 'admin') {
        // Fetch all applications (admin view)
        endpoint = '/applications/admin/';
      } else {
        // Default: fetch user's own applications
        endpoint = '/applications/my-applications/';
      }

      const response = await api.get(endpoint);
      const applicationsData = response.data.results || response.data || [];
      
      setApplications(applicationsData);
      calculateStats(applicationsData);
      
    } catch (err) {
      console.error('Error fetching applications:', err);
      if (err.response?.status === 404) {
        // If specific endpoints don't exist, try the general endpoint
        try {
          const response = await api.get('/applications/');
          const applicationsData = response.data.results || response.data || [];
          setApplications(applicationsData);
          calculateStats(applicationsData);
        } catch (fallbackErr) {
          setError('Unable to load applications. Please try again later.');
        }
      } else {
        setError(err.response?.data?.detail || 'Failed to load applications');
      }
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (applicationsData) => {
    if (user?.role === 'employer') {
      // For employers, don't show stats or show different stats
      return;
    }

    const total = applicationsData.length;
    const pending = applicationsData.filter(app => app.status?.toLowerCase() === 'pending').length;
    const interview = applicationsData.filter(app => app.status?.toLowerCase() === 'interview').length;
    const accepted = applicationsData.filter(app => app.status?.toLowerCase() === 'accepted').length;
    const rejected = applicationsData.filter(app => app.status?.toLowerCase() === 'rejected').length;

    setStats({
      total,
      pending,
      interview,
      accepted,
      rejected
    });
  };

  const handleWithdrawApplication = async (applicationId) => {
    if (!window.confirm('Are you sure you want to withdraw this application?')) {
      return;
    }

    try {
      await api.delete(`/applications/${applicationId}/`);
      setApplications(prev => prev.filter(app => app.id !== applicationId));
      // Recalculate stats
      const updatedApplications = applications.filter(app => app.id !== applicationId);
      calculateStats(updatedApplications);
      alert('Application withdrawn successfully');
    } catch (err) {
      console.error('Error withdrawing application:', err);
      alert(err.response?.data?.detail || 'Failed to withdraw application');
    }
  };

  const handleUpdateStatus = async (applicationId, newStatus) => {
    try {
      await api.patch(`/applications/${applicationId}/`, { status: newStatus });
      
      setApplications(prev => 
        prev.map(app => 
          app.id === applicationId ? { ...app, status: newStatus } : app
        )
      );
      
      // Recalculate stats after status update
      const updatedApplications = applications.map(app => 
        app.id === applicationId ? { ...app, status: newStatus } : app
      );
      calculateStats(updatedApplications);
      
      alert('Status updated successfully');
    } catch (err) {
      console.error('Error updating status:', err);
      alert(err.response?.data?.detail || 'Failed to update application status');
    }
  };

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

  // Filter and sort applications
  const filteredApplications = applications
    .filter(app => {
      const matchesStatus = filterStatus === 'all' || app.status?.toLowerCase() === filterStatus;
      const matchesSearch = searchTerm === '' || 
        app.job?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.job?.company?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user?.role !== 'user' && (
          app.applicant?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.applicant?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.applicant?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.user?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.user?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
        ));
      return matchesStatus && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.applied_date || b.created_at || b.date_applied) - new Date(a.applied_date || a.created_at || a.date_applied);
        case 'oldest':
          return new Date(a.applied_date || a.created_at || a.date_applied) - new Date(b.applied_date || b.created_at || b.date_applied);
        case 'company':
          return (a.job?.company?.name || a.company_name || '').localeCompare(b.job?.company?.name || b.company_name || '');
        case 'position':
          return (a.job?.title || a.job_title || '').localeCompare(b.job?.title || b.job_title || '');
        default:
          return 0;
      }
    });

  const formatDate = (dateString) => {
    if (!dateString) return 'Date not available';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return 'Invalid date';
    }
  };

  const getApplicantName = (application) => {
    if (application.applicant) {
      return `${application.applicant.first_name || ''} ${application.applicant.last_name || ''}`.trim() || 
             application.applicant.email || 'Unknown Applicant';
    }
    if (application.user) {
      return `${application.user.first_name || ''} ${application.user.last_name || ''}`.trim() || 
             application.user.email || 'Unknown Applicant';
    }
    return 'Unknown Applicant';
  };

  if (loading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: '#0C1B33', fontFamily: 'Poppins, sans-serif' }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: '#00FF84' }}></div>
          <p style={{ color: '#FFFFFF' }}>Loading applications...</p>
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
          <p style={{ color: '#FF4444' }} className="text-lg mb-4">{error}</p>
          <button
            onClick={fetchApplications}
            className="px-6 py-3 rounded-lg font-medium transition-all duration-200"
            style={{ backgroundColor: '#00FF84', color: '#000000' }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#00E676'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#00FF84'}
          >
            Try Again
          </button>
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
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 hover:bg-white/5"
                  style={{ color: '#B0B0B0' }}
                >
                  <MagnifyingGlassIcon className="h-4 w-4" />
                  <span className="text-sm">Browse Jobs</span>
                </Link>
                <Link
                  to="/profile"
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 hover:bg-white/5"
                  style={{ color: '#B0B0B0' }}
                >
                  <PencilIcon className="h-4 w-4" />
                  <span className="text-sm">Update Profile</span>
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

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2" style={{ color: '#FFFFFF' }}>
              {user?.role === 'user' ? 'My Applications' : 
               user?.role === 'employer' ? 'Job Applications' : 
               'All Applications'}
            </h1>
            <p style={{ color: '#B0B0B0' }}>
              {user?.role === 'user' ? 'Track your job applications and their status' : 
               user?.role === 'employer' ? 'Manage applications for your job posts' : 
               'Overview of all applications in the system'}
            </p>
          </div>

          {/* Stats Cards - Only for Job Seekers and Admins */}
          {user?.role !== 'employer' && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              <div 
                className="p-4 rounded-xl"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
              >
                <div className="text-2xl font-bold mb-1" style={{ color: '#FFFFFF' }}>
                  {stats.total}
                </div>
                <div className="text-sm" style={{ color: '#B0B0B0' }}>Total</div>
              </div>
              <div 
                className="p-4 rounded-xl"
                style={{ backgroundColor: 'rgba(255, 165, 0, 0.1)' }}
              >
                <div className="text-2xl font-bold mb-1" style={{ color: '#FFA500' }}>
                  {stats.pending}
                </div>
                <div className="text-sm" style={{ color: '#B0B0B0' }}>Pending</div>
              </div>
              <div 
                className="p-4 rounded-xl"
                style={{ backgroundColor: 'rgba(0, 255, 132, 0.1)' }}
              >
                <div className="text-2xl font-bold mb-1" style={{ color: '#00FF84' }}>
                  {stats.interview}
                </div>
                <div className="text-sm" style={{ color: '#B0B0B0' }}>Interview</div>
              </div>
              <div 
                className="p-4 rounded-xl"
                style={{ backgroundColor: 'rgba(50, 205, 50, 0.1)' }}
              >
                <div className="text-2xl font-bold mb-1" style={{ color: '#32CD32' }}>
                  {stats.accepted}
                </div>
                <div className="text-sm" style={{ color: '#B0B0B0' }}>Accepted</div>
              </div>
              <div 
                className="p-4 rounded-xl"
                style={{ backgroundColor: 'rgba(255, 68, 68, 0.1)' }}
              >
                <div className="text-2xl font-bold mb-1" style={{ color: '#FF4444' }}>
                  {stats.rejected}
                </div>
                <div className="text-sm" style={{ color: '#B0B0B0' }}>Rejected</div>
              </div>
            </div>
          )}

          {/* Filters and Search */}
          <div 
            className="p-6 rounded-xl mb-6"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
          >
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5" style={{ color: '#B0B0B0' }} />
                <input
                  type="text"
                  placeholder={user?.role === 'user' ? "Search by job title or company..." : "Search by job title, company, or applicant..."}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border-0 focus:outline-none focus:ring-2"
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                    color: '#FFFFFF'
                  }}
                />
              </div>

              {/* Status Filter */}
              <div className="relative">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="appearance-none px-4 py-3 pr-10 rounded-lg border-0 focus:outline-none focus:ring-2"
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                    color: '#FFFFFF'
                  }}
                >
                  <option value="all" style={{ color: '#000000' }}>All Status</option>
                  <option value="pending" style={{ color: '#000000' }}>Pending</option>
                  <option value="interview" style={{ color: '#000000' }}>Interview</option>
                  <option value="accepted" style={{ color: '#000000' }}>Accepted</option>
                  <option value="rejected" style={{ color: '#000000' }}>Rejected</option>
                </select>
                <ChevronDownIcon className="absolute right-3 top-3 h-5 w-5 pointer-events-none" style={{ color: '#B0B0B0' }} />
              </div>

              {/* Sort */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none px-4 py-3 pr-10 rounded-lg border-0 focus:outline-none focus:ring-2"
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                    color: '#FFFFFF'
                  }}
                >
                  <option value="newest" style={{ color: '#000000' }}>Newest First</option>
                  <option value="oldest" style={{ color: '#000000' }}>Oldest First</option>
                  <option value="company" style={{ color: '#000000' }}>Company A-Z</option>
                  <option value="position" style={{ color: '#000000' }}>Position A-Z</option>
                </select>
                <ChevronDownIcon className="absolute right-3 top-3 h-5 w-5 pointer-events-none" style={{ color: '#B0B0B0' }} />
              </div>
            </div>
          </div>

          {/* Applications List */}
          <div 
            className="rounded-xl p-6"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
          >
            {filteredApplications.length === 0 ? (
              <div className="text-center py-12">
                <BriefcaseIcon className="h-16 w-16 mx-auto mb-4" style={{ color: '#B0B0B0' }} />
                <h3 className="text-lg font-medium mb-2" style={{ color: '#FFFFFF' }}>
                  {applications.length === 0 ? 'No applications yet' : 'No applications match your filters'}
                </h3>
                <p className="mb-6" style={{ color: '#B0B0B0' }}>
                  {applications.length === 0 
                    ? (user?.role === 'user' 
                      ? 'Start applying to jobs to see your applications here' 
                      : 'No applications have been submitted yet')
                    : 'Try adjusting your search or filter criteria'
                  }
                </p>
                {user?.role === 'user' && applications.length === 0 && (
                  <Link
                    to="/jobs"
                    className="inline-flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200"
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
                {filteredApplications.map((application) => (
                  <div
                    key={application.id}
                    className="flex items-center justify-between p-6 rounded-lg transition-all duration-200 hover:bg-white/5 border-l-4"
                    style={{ borderLeftColor: getStatusColor(application.status) }}
                  >
                    <div className="flex items-center space-x-4 flex-1">
                      <div 
                        className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: 'rgba(0, 255, 132, 0.1)' }}
                      >
                        <BriefcaseIcon className="h-6 w-6" style={{ color: '#00FF84' }} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1" style={{ color: '#FFFFFF' }}>
                          {application.job?.title || application.job_title || 'Job Title'}
                        </h3>
                        <p className="mb-2" style={{ color: '#B0B0B0' }}>
                          {application.job?.company?.name || application.company_name || 'Company Name'}
                        </p>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm" style={{ color: '#B0B0B0' }}>
                          <div className="flex items-center">
                            <MapPinIcon className="h-4 w-4 mr-1" />
                            {application.job?.location || application.location || 'Location not specified'}
                          </div>
                          <div className="flex items-center">
                            <CalendarIcon className="h-4 w-4 mr-1" />
                            Applied {formatDate(application.applied_date || application.created_at || application.date_applied)}
                          </div>
                          {user?.role !== 'user' && (
                            <div className="flex items-center">
                              <UserIcon className="h-4 w-4 mr-1" />
                              {getApplicantName(application)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      {/* Status */}
                      <div className="flex items-center space-x-2">
                        {(user?.role === 'employer' || user?.role === 'admin') ? (
                          <select
                            value={application.status || 'pending'}
                            onChange={(e) => handleUpdateStatus(application.id, e.target.value)}
                            className="px-3 py-2 rounded-lg border-0 text-sm font-medium"
                            style={{ 
                              backgroundColor: `${getStatusColor(application.status)}20`,
                              color: getStatusColor(application.status)
                            }}
                          >
                            <option value="pending" style={{ color: '#000000' }}>Pending</option>
                            <option value="interview" style={{ color: '#000000' }}>Interview</option>
                            <option value="accepted" style={{ color: '#000000' }}>Accepted</option>
                            <option value="rejected" style={{ color: '#000000' }}>Rejected</option>
                          </select>
                        ) : (
                          <div 
                            className="flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium"
                            style={{ 
                              backgroundColor: `${getStatusColor(application.status)}20`,
                              color: getStatusColor(application.status)
                            }}
                          >
                            {getStatusIcon(application.status)}
                            <span className="capitalize">{application.status || 'Pending'}</span>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2">
                        <Link
                          to={`/applications/${application.id}`}
                          className="p-2 rounded-lg transition-colors duration-200 hover:bg-white/10"
                          title="View Details"
                        >
                          <EyeIcon className="h-5 w-5" style={{ color: '#00FF84' }} />
                        </Link>
                        
                        {user?.role === 'user' && (application.status?.toLowerCase() === 'pending' || !application.status) && (
                          <button
                            onClick={() => handleWithdrawApplication(application.id)}
                            className="p-2 rounded-lg transition-colors duration-200 hover:bg-white/10"
                            title="Withdraw Application"
                          >
                            <XMarkIcon className="h-5 w-5" style={{ color: '#FF4444' }} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Results Count */}
          {filteredApplications.length > 0 && (
            <div className="mt-4 text-center">
              <p style={{ color: '#B0B0B0' }}>
                Showing {filteredApplications.length} of {applications.length} applications
              </p>
            </div>
          )}
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

export default Applications;