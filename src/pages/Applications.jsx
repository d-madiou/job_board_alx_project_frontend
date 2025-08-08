/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
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
  // Mock user data - replace with actual auth context
  const user = { 
    role: 'user', // Can be 'user', 'employer', or 'admin'
    first_name: 'John',
    email: 'john@example.com'
  };

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

  // Mock data for different user roles
  const mockApplicationsData = {
    user: [
      {
        id: 1,
        status: 'pending',
        applied_date: '2024-01-15',
        job: {
          title: 'Frontend Developer',
          company: { name: 'TechCorp Inc.' },
          location: 'San Francisco, CA'
        }
      },
      {
        id: 2,
        status: 'interview',
        applied_date: '2024-01-10',
        job: {
          title: 'React Developer',
          company: { name: 'StartupXYZ' },
          location: 'Remote'
        }
      },
      {
        id: 3,
        status: 'rejected',
        applied_date: '2024-01-05',
        job: {
          title: 'Full Stack Developer',
          company: { name: 'BigTech Corp' },
          location: 'New York, NY'
        }
      }
    ],
    employer: [
      {
        id: 1,
        status: 'pending',
        applied_date: '2024-01-15',
        job: {
          title: 'Senior Developer',
          company: { name: 'My Company' },
          location: 'San Francisco, CA'
        },
        applicant: {
          full_name: 'Alice Johnson',
          email: 'alice@example.com'
        }
      },
      {
        id: 2,
        status: 'interview',
        applied_date: '2024-01-12',
        job: {
          title: 'Product Manager',
          company: { name: 'My Company' },
          location: 'Remote'
        },
        applicant: {
          full_name: 'Bob Smith',
          email: 'bob@example.com'
        }
      }
    ],
    admin: [
      {
        id: 1,
        status: 'pending',
        applied_date: '2024-01-15',
        job: {
          title: 'Frontend Developer',
          company: { name: 'TechCorp Inc.' },
          location: 'San Francisco, CA'
        },
        applicant: {
          full_name: 'John Doe',
          email: 'john@example.com'
        }
      },
      {
        id: 2,
        status: 'accepted',
        applied_date: '2024-01-10',
        job: {
          title: 'Backend Developer',
          company: { name: 'StartupXYZ' },
          location: 'Remote'
        },
        applicant: {
          full_name: 'Jane Smith',
          email: 'jane@example.com'
        }
      }
    ]
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const roleData = mockApplicationsData[user.role] || [];
      setApplications(roleData);
      
      if (user?.role !== 'employer') {
        const totalApplications = roleData.length;
        setStats({
          total: totalApplications,
          pending: roleData.filter(app => app.status === 'pending').length,
          interview: roleData.filter(app => app.status === 'interview').length,
          accepted: roleData.filter(app => app.status === 'accepted').length,
          rejected: roleData.filter(app => app.status === 'rejected').length
        });
      }
      
      setLoading(false);
    }, 1000);
  }, [user?.role]);

  const handleWithdrawApplication = async (applicationId) => {
    if (!window.confirm('Are you sure you want to withdraw this application?')) {
      return;
    }

    try {
      // Simulate API call
      setApplications(prev => prev.filter(app => app.id !== applicationId));
      alert('Application withdrawn successfully');
    } catch (err) {
      alert('Failed to withdraw application');
    }
  };

  const handleUpdateStatus = async (applicationId, newStatus) => {
    try {
      // Simulate API call
      setApplications(prev => 
        prev.map(app => 
          app.id === applicationId ? { ...app, status: newStatus } : app
        )
      );
      alert('Status updated successfully');
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      alert('Failed to update application status');
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
        (user?.role !== 'user' && app.applicant?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesStatus && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.applied_date || b.created_at) - new Date(a.applied_date || a.created_at);
        case 'oldest':
          return new Date(a.applied_date || a.created_at) - new Date(b.applied_date || b.created_at);
        case 'company':
          return (a.job?.company?.name || '').localeCompare(b.job?.company?.name || '');
        case 'position':
          return (a.job?.title || '').localeCompare(b.job?.title || '');
        default:
          return 0;
      }
    });

  const handleNavigation = (path) => {
    // Mock navigation - replace with actual router navigation
    console.log(`Navigating to: ${path}`);
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
              <button
                key={item.id}
                onClick={() => handleNavigation(`/${item.id}`)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                  item.active ? 'bg-white/10' : 'hover:bg-white/5'
                }`}
                style={{ 
                  color: item.active ? '#00FF84' : '#B0B0B0'
                }}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Quick Actions for Job Seekers */}
          {user?.role === 'user' && (
            <div className="mt-8">
              <h3 className="text-sm font-semibold mb-4" style={{ color: '#B0B0B0' }}>
                QUICK ACTIONS
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => handleNavigation('/jobs')}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 hover:bg-white/5"
                  style={{ color: '#B0B0B0' }}
                >
                  <MagnifyingGlassIcon className="h-4 w-4" />
                  <span className="text-sm">Browse Jobs</span>
                </button>
                <button
                  onClick={() => handleNavigation('/profile')}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 hover:bg-white/5"
                  style={{ color: '#B0B0B0' }}
                >
                  <PencilIcon className="h-4 w-4" />
                  <span className="text-sm">Update Profile</span>
                </button>
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
                    color: '#FFFFFF',
                    focusRingColor: '#00FF84'
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
                    color: '#FFFFFF',
                    focusRingColor: '#00FF84'
                  }}
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="interview">Interview</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
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
                    color: '#FFFFFF',
                    focusRingColor: '#00FF84'
                  }}
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="company">Company A-Z</option>
                  <option value="position">Position A-Z</option>
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
                  <button
                    onClick={() => handleNavigation('/jobs')}
                    className="inline-flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200"
                    style={{ backgroundColor: '#00FF84', color: '#000000' }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#00E676'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#00FF84'}
                  >
                    <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
                    Browse Jobs
                  </button>
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
                          {application.job?.title || 'Job Title'}
                        </h3>
                        <p className="mb-2" style={{ color: '#B0B0B0' }}>
                          {application.job?.company?.name || 'Company Name'}
                        </p>
                        <div className="flex items-center space-x-4 text-sm" style={{ color: '#B0B0B0' }}>
                          <div className="flex items-center">
                            <MapPinIcon className="h-4 w-4 mr-1" />
                            {application.job?.location || 'Location not specified'}
                          </div>
                          <div className="flex items-center">
                            <CalendarIcon className="h-4 w-4 mr-1" />
                            Applied {new Date(application.applied_date || application.created_at).toLocaleDateString()}
                          </div>
                          {user?.role !== 'user' && application.applicant && (
                            <div className="flex items-center">
                              <UserIcon className="h-4 w-4 mr-1" />
                              {application.applicant.full_name || application.applicant.email}
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
                            <option value="pending">Pending</option>
                            <option value="interview">Interview</option>
                            <option value="accepted">Accepted</option>
                            <option value="rejected">Rejected</option>
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
                        <button
                          onClick={() => handleNavigation(`/applications/${application.id}`)}
                          className="p-2 rounded-lg transition-colors duration-200 hover:bg-white/10"
                          title="View Details"
                        >
                          <EyeIcon className="h-5 w-5" style={{ color: '#00FF84' }} />
                        </button>
                        
                        {user?.role === 'user' && application.status?.toLowerCase() === 'pending' && (
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