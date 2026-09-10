import { API_BASE_URL } from './constants';

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  // Attach user ID header if present in localStorage
  const storedUser = localStorage.getItem('saksham_user');
  if (storedUser) {
    try {
      const user = JSON.parse(storedUser);
      if (user?.id) {
        headers['X-User-Id'] = user.id;
      }
    } catch (e) {
      console.error("Error parsing stored user", e);
    }
  }

  const response = await fetch(url, {
    ...options,
    headers
  });

  if (!response.ok) {
    let errorMsg = `HTTP Error ${response.status}`;
    try {
      const errorData = await response.json();
      errorMsg = errorData.error || errorMsg;
    } catch (e) {
      // fallback
    }
    throw new Error(errorMsg);
  }

  return response.json();
}

export const api = {
  // Auth
  register: (data) => request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  login: (data) => request('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  getMe: (userId) => request(`/auth/me${userId ? `?user_id=${userId}` : ''}`),
  updateProfile: (data) => request('/auth/profile', { method: 'PUT', body: JSON.stringify(data) }),
  switchDemoRole: (role) => request('/auth/demo-switch', { method: 'POST', body: JSON.stringify({ role }) }),

  // Jobs
  getJobs: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/jobs${query ? `?${query}` : ''}`);
  },
  getJob: (id) => request(`/jobs/${id}`),
  createJob: (data) => request('/jobs', { method: 'POST', body: JSON.stringify(data) }),
  applyJob: (jobId, data) => request(`/jobs/${jobId}/apply`, { method: 'POST', body: JSON.stringify(data) }),
  getJobApplicants: (jobId) => request(`/jobs/${jobId}/applicants`),
  getMyApplications: () => request('/jobs/my-applications'),
  getJobRecommendations: () => request('/jobs/recommendations'),

  // Skills / Courses
  getCourses: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/courses${query ? `?${query}` : ''}`);
  },
  getCourse: (id) => request(`/courses/${id}`),
  createCourse: (data) => request('/courses', { method: 'POST', body: JSON.stringify(data) }),

  // Government Schemes
  getSchemes: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/schemes${query ? `?${query}` : ''}`);
  },
  getScheme: (id) => request(`/schemes/${id}`),

  // Legal Rights
  getLegalResources: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/legal${query ? `?${query}` : ''}`);
  },
  getLegalResource: (id) => request(`/legal/${id}`),

  // Support Map Locations
  getLocations: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/locations${query ? `?${query}` : ''}`);
  },
  getLocation: (id) => request(`/locations/${id}`),
  createLocation: (data) => request('/locations', { method: 'POST', body: JSON.stringify(data) }),

  // Community
  getPosts: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/community/posts${query ? `?${query}` : ''}`);
  },
  getPostDetail: (id) => request(`/community/posts/${id}`),
  createPost: (data) => request('/community/posts', { method: 'POST', body: JSON.stringify(data) }),
  addComment: (postId, data) => request(`/community/posts/${postId}/comments`, { method: 'POST', body: JSON.stringify(data) }),
  likePost: (postId) => request(`/community/posts/${postId}/like`, { method: 'POST' }),
  reportPost: (postId, data) => request(`/community/posts/${postId}/report`, { method: 'POST', body: JSON.stringify(data) }),

  // Mentorship
  getMentors: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/mentors${query ? `?${query}` : ''}`);
  },
  getMentor: (id) => request(`/mentors/${id}`),
  requestMentorship: (data) => request('/mentors/request', { method: 'POST', body: JSON.stringify(data) }),
  getMyMentorRequests: () => request('/mentors/my-requests'),
  becomeMentor: (data) => request('/mentors/profile', { method: 'POST', body: JSON.stringify(data) }),

  // AI Assistant & Business Plan
  sendChatMessage: (message, history = [], userContext = {}) =>
    request('/ai/chat', { method: 'POST', body: JSON.stringify({ message, history, user_context: userContext }) }),
  generateBusinessPlan: (data) =>
    request('/ai/business-plan', { method: 'POST', body: JSON.stringify(data) }),

  // Admin
  getAdminStats: () => request('/admin/stats'),
  getAdminReports: () => request('/admin/reports'),
  resolveReport: (reportId, action) =>
    request(`/admin/reports/${reportId}/resolve`, { method: 'POST', body: JSON.stringify({ action }) }),

  // System
  resetDemoData: () => request('/system/reset-demo-data', { method: 'POST' }),
  getNotifications: () => request('/system/notifications'),
  markNotificationRead: (id) => request(`/system/notifications/${id}/read`, { method: 'POST' }),
  globalSearch: (q) => request(`/system/global-search?q=${encodeURIComponent(q)}`)
};
