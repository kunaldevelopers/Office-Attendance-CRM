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

  // Break management
  startLunchBreak: () => api.post("/whatsapp/lunch-break/start"),
  stopLunchBreak: () => api.post("/whatsapp/lunch-break/stop"),
  startMiscBreak: () => api.post("/whatsapp/misc-break/start"),
  stopMiscBreak: () => api.post("/whatsapp/misc-break/stop"),
};

// Employee API calls
export const employeeAPI = {
  getMyAttendance: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(
      `/employee/attendance${queryString ? `?${queryString}` : ""}`
    );
  },
};

// Admin API calls
export const adminAPI = {
  // Dashboard stats
  getDashboardStats: () => api.get("/admin/dashboard"),
  getDashboardStatsByRole: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(
      `/admin/dashboard/by-role${queryString ? `?${queryString}` : ""}`
    );
  },

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

  // WhatsApp management
  getWhatsAppStatus: () => api.get("/admin/whatsapp/status"),
  startWhatsAppService: () => api.post("/admin/whatsapp/start"),
  stopWhatsAppService: () => api.post("/admin/whatsapp/stop"),
  restartWhatsAppService: () => api.post("/admin/whatsapp/restart"),
  forceRestartWhatsAppService: () => api.post("/admin/whatsapp/force-restart"),
  disconnectWhatsApp: () => api.post("/admin/whatsapp/disconnect"),
  getWhatsAppQR: () => api.get("/admin/whatsapp/qr"),
  testWhatsAppMessage: (data) => api.post("/admin/whatsapp/test", data),
};

export default api;
