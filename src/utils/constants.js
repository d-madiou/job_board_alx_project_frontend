// src/utils/constants.js
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  EMPLOYER: 'employer',
};

export const JOB_TYPES = {
  FULL_TIME: 'full_time',
  PART_TIME: 'part_time',
  CONTRACT: 'contract',
  FREELANCE: 'freelance',
  INTERNSHIP: 'internship',
};

export const EXPERIENCE_LEVELS = {
  ENTRY_LEVEL: 'entry_level',
  MID_LEVEL: 'mid_level',
  SENIOR_LEVEL: 'senior_level',
  EXECUTIVE: 'executive',
};

export const APPLICATION_STATUS = {
  PENDING: 'pending',
  REVIEWED: 'reviewed',
  SHORTLISTED: 'shortlisted',
  INTERVIEWED: 'interviewed',
  REJECTED: 'rejected',
  ACCEPTED: 'accepted',
};


// src/utils/helpers.js
export const formatDate = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatDateTime = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const timeAgo = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60
  };
  
  for (const [unit, seconds] of Object.entries(intervals)) {
    const interval = Math.floor(diffInSeconds / seconds);
    if (interval >= 1) {
      return interval === 1 ? `1 ${unit} ago` : `${interval} ${unit}s ago`;
    }
  }
  
  return 'Just now';
};

export const formatSalary = (min, max, currency = 'USD', type = 'yearly') => {
  if (!min && !max) return 'Salary not specified';
  
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  
  let result = '';
  if (min && max) {
    result = `${formatter.format(min)} - ${formatter.format(max)}`;
  } else if (min) {
    result = `From ${formatter.format(min)}`;
  } else if (max) {
    result = `Up to ${formatter.format(max)}`;
  }
  
  const typeMap = {
    hourly: '/hour',
    monthly: '/month',
    yearly: '/year'
  };
  
  return `${result} ${typeMap[type] || ''}`;
};

export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhone = (phone) => {
  const re = /^\+?[\d\s\-()]{10,}$/;
  return re.test(phone);
};

export const capitalizeFirst = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const formatJobType = (jobType) => {
  return jobType.split('_').map(word => capitalizeFirst(word)).join(' ');
};

export const getInitials = (firstName, lastName) => {
  const first = firstName ? firstName.charAt(0).toUpperCase() : '';
  const last = lastName ? lastName.charAt(0).toUpperCase() : '';
  return `${first}${last}`;
};