import axios from "axios";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  register: (userData) => api.post("/auth/register", userData),
  login: (credentials) => api.post("/auth/login", credentials),
  getCurrentUser: () => api.get("/auth/me"),
};

// WhatsApp/Attendance API calls
export const attendanceAPI = {
  sendLoginMessage: () => api.post("/whatsapp/login"),
  sendLogoutMessage: () => api.post("/whatsapp/logout"),
  getTodayStatus: () => api.get("/whatsapp/status"),
};

// Admin API calls
export const adminAPI = {
  // Dashboard stats
  getDashboardStats: () => api.get("/admin/dashboard"),
  getDashboardStatsByRole: () => api.get("/admin/dashboard/by-role"),

  // Staff management
  getAllStaff: () => api.get("/admin/staff"),
  addStaff: (staffData) => api.post("/admin/staff", staffData),
  updateStaff: (staffId, staffData) =>
    api.put(`/admin/staff/${staffId}`, staffData),
  deleteStaff: (staffId) => api.delete(`/admin/staff/${staffId}`),
  getStaffById: (staffId) => api.get(`/admin/staff/${staffId}`),

  // Attendance reports
  getAttendanceReports: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(
      `/admin/attendance-reports${queryString ? `?${queryString}` : ""}`
    );
  },
  downloadAttendanceReport: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(
      `/admin/attendance-reports/download${
        queryString ? `?${queryString}` : ""
      }`,
      {
        responseType: "blob",
      }
    );
  },

  // Individual attendance reports
  getUserAttendance: (userId, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(
      `/admin/attendance-reports/user/${userId}${
        queryString ? `?${queryString}` : ""
      }`
    );
  },
};

export default api;
