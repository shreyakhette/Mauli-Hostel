import api from './axiosClient';

export const authApi = {
  login: (data) => api.post('/auth/login', data).then(r => r.data),
  register: (data) => api.post('/auth/register', data).then(r => r.data),
};

export const studentApi = {
  getProfile: () => api.get('/students/me').then(r => r.data),
  updateProfile: (data) => api.put('/students/me', data).then(r => r.data),
  getDashboard: () => api.get('/students/dashboard').then(r => r.data),
  getById: (id) => api.get(`/students/${id}`).then(r => r.data),
  getAll: (query) => api.get('/students', { params: { query } }).then(r => r.data),
};

export const wardenApi = {
  getProfile: () => api.get('/warden/me').then(r => r.data),
  updateProfile: (data) => api.put('/warden/me', data).then(r => r.data),
  getDashboard: () => api.get('/warden/dashboard').then(r => r.data),
};

export const roomApi = {
  getAll: (params) => api.get('/rooms', { params }).then(r => r.data),
  getById: (id) => api.get(`/rooms/${id}`).then(r => r.data),
  getByNumber: (roomNumber) => api.get(`/rooms/number/${roomNumber}`).then(r => r.data),
  create: (data) => api.post('/rooms', data).then(r => r.data),
  getBeds: (roomId) => api.get(`/rooms/${roomId}/beds`).then(r => r.data),
  assignBed: (data) => api.post('/rooms/beds/assign', data).then(r => r.data),
  unassignBed: (bedId) => api.post(`/rooms/beds/${bedId}/unassign`).then(r => r.data),
};

export const noticeApi = {
  getActive: (category) => api.get('/notices', { params: { category } }).then(r => r.data),
  getAll: () => api.get('/notices/all').then(r => r.data),
  getById: (id) => api.get(`/notices/${id}`).then(r => r.data),
  create: (data) => api.post('/notices', data).then(r => r.data),
  update: (id, data) => api.put(`/notices/${id}`, data).then(r => r.data),
  delete: (id) => api.delete(`/notices/${id}`).then(r => r.data),
};

export const complaintApi = {
  getMy: () => api.get('/complaints/my').then(r => r.data),
  getAll: (params) => api.get('/complaints', { params }).then(r => r.data),
  getById: (id) => api.get(`/complaints/${id}`).then(r => r.data),
  create: (data) => api.post('/complaints', data).then(r => r.data),
  updateStatus: (id, data) => api.patch(`/complaints/${id}/status`, data).then(r => r.data),
  addComment: (id, data) => api.post(`/complaints/${id}/comments`, data).then(r => r.data),
};

export const attendanceApi = {
  getMyStats: () => api.get('/attendance/my-stats').then(r => r.data),
  getStudentStats: (studentId) => api.get(`/attendance/student/${studentId}/stats`).then(r => r.data),
  getByDate: (date) => api.get('/attendance/by-date', { params: { date } }).then(r => r.data),
  mark: (data) => api.post('/attendance/mark', data).then(r => r.data),
  bulkMark: (data) => api.post('/attendance/bulk-mark', data).then(r => r.data),
};

export const leaveApi = {
  getMy: () => api.get('/leave/my').then(r => r.data),
  getAll: (status) => api.get('/leave', { params: { status } }).then(r => r.data),
  getById: (id) => api.get(`/leave/${id}`).then(r => r.data),
  apply: (data) => api.post('/leave/apply', data).then(r => r.data),
  review: (id, data) => api.patch(`/leave/${id}/review`, data).then(r => r.data),
};

export const busApi = {
  getAllSchedules: () => api.get('/bus/schedules').then(r => r.data),
  getByDay: (day) => api.get(`/bus/schedules/day/${day}`).then(r => r.data),
  getBuses: () => api.get('/bus').then(r => r.data),
  createSchedule: (data) => api.post('/bus/schedules', data).then(r => r.data),
  updateSchedule: (id, data) => api.put(`/bus/schedules/${id}`, data).then(r => r.data),
  deleteSchedule: (id) => api.delete(`/bus/schedules/${id}`).then(r => r.data),
};

export const messApi = {
  getWeeklyMenu: () => api.get('/mess/weekly-menu').then(r => r.data),
  getByDay: (day) => api.get(`/mess/menu/${day}`).then(r => r.data),
  updateMenu: (day, data) => api.put(`/mess/menu/${day}`, data).then(r => r.data),
  submitFeedback: (data) => api.post('/mess/feedback', data).then(r => r.data),
  getFeedback: (day) => api.get(`/mess/feedback/${day}`).then(r => r.data),
};

export const visitorApi = {
  getMy: () => api.get('/visitors/my').then(r => r.data),
  getAll: (status) => api.get('/visitors', { params: { status } }).then(r => r.data),
  getToday: () => api.get('/visitors/today').then(r => r.data),
  request: (data) => api.post('/visitors/request', data).then(r => r.data),
  review: (id, data) => api.patch(`/visitors/${id}/review`, data).then(r => r.data),
};

export const emergencyApi = {
  getActive: () => api.get('/emergency').then(r => r.data),
  getAll: () => api.get('/emergency/all').then(r => r.data),
  create: (data) => api.post('/emergency', data).then(r => r.data),
  update: (id, data) => api.put(`/emergency/${id}`, data).then(r => r.data),
  delete: (id) => api.delete(`/emergency/${id}`).then(r => r.data),
};

export const notificationApi = {
  getAll: () => api.get('/notifications').then(r => r.data),
  getUnread: () => api.get('/notifications/unread').then(r => r.data),
  getUnreadCount: () => api.get('/notifications/unread-count').then(r => r.data),
  markAsRead: (id) => api.patch(`/notifications/${id}/read`).then(r => r.data),
  markAllAsRead: () => api.post('/notifications/mark-all-read').then(r => r.data),
};

export const reportApi = {
  getSummary: () => api.get('/reports/summary').then(r => r.data),
};

export const settingsApi = {
  getHostelConfig: () => api.get('/settings/hostel').then(r => r.data),
  updateHostelConfig: (data) => api.put('/settings/hostel', data).then(r => r.data),
  changePassword: (data) => api.post('/settings/change-password', data).then(r => r.data),
};
