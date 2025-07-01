import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Auth Pages
import Login from './pages/auth/Login';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import Users from './pages/admin/Users';
import Departments from './pages/admin/Departments';

// Employee Pages
import EmployeeDashboard from './pages/employee/EmployeeDashboard';
import Tasks from './pages/employee/Tasks';

// Other Pages
import NotFound from './pages/NotFound';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
              <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                
                {/* Protected Admin Routes */}
                <Route path="/admin/*" element={
                  <ProtectedRoute requiredRole="Admin">
                    <Layout>
                      <Routes>
                        <Route path="dashboard" element={<AdminDashboard />} />
                        <Route path="users" element={<Users />} />
                        <Route path="departments" element={<Departments />} />
                        <Route path="reports" element={<div className="p-6"><h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reports - Coming Soon</h1></div>} />
                        <Route path="settings" element={<div className="p-6"><h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings - Coming Soon</h1></div>} />
                      </Routes>
                    </Layout>
                  </ProtectedRoute>
                } />

                {/* Protected Employee Routes */}
                <Route path="/employee/*" element={
                  <ProtectedRoute requiredRole="Employee">
                    <Layout>
                      <Routes>
                        <Route path="dashboard" element={<EmployeeDashboard />} />
                        <Route path="customers" element={<div className="p-6"><h1 className="text-2xl font-bold text-gray-900 dark:text-white">Customers - Coming Soon</h1></div>} />
                        <Route path="tasks" element={<Tasks />} />
                        <Route path="timesheet" element={<div className="p-6"><h1 className="text-2xl font-bold text-gray-900 dark:text-white">Timesheet - Coming Soon</h1></div>} />
                        <Route path="profile" element={<div className="p-6"><h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile - Coming Soon</h1></div>} />
                      </Routes>
                    </Layout>
                  </ProtectedRoute>
                } />

                {/* Redirect root to appropriate dashboard */}
                <Route path="/" element={<Navigate to="/login" replace />} />
                
                {/* 404 Page */}
                <Route path="*" element={<NotFound />} />
              </Routes>

              <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
              />
            </div>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;