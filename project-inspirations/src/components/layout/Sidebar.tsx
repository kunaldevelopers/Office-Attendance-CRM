import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  Settings, 
  FileText, 
  UserCircle, 
  CheckSquare, 
  Clock,
  Briefcase,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar() {
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const adminMenuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
    { name: 'Users', icon: Users, path: '/admin/users' },
    { name: 'Departments', icon: Building2, path: '/admin/departments' },
    { name: 'Reports', icon: FileText, path: '/admin/reports' },
    { name: 'Settings', icon: Settings, path: '/admin/settings' },
  ];

  const employeeMenuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/employee/dashboard' },
    { name: 'Customers', icon: Briefcase, path: '/employee/customers' },
    { name: 'Tasks', icon: CheckSquare, path: '/employee/tasks' },
    { name: 'Timesheet', icon: Clock, path: '/employee/timesheet' },
    { name: 'Profile', icon: UserCircle, path: '/employee/profile' },
  ];

  const menuItems = user?.role === 'Admin' ? adminMenuItems : employeeMenuItems;

  return (
    <div className={`bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}>
      <div className="p-4">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="mb-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 w-full flex justify-end"
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          ) : (
            <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          )}
        </button>

        <nav className="space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`
              }
            >
              <item.icon className="h-5 w-5 mr-3 flex-shrink-0" />
              {!collapsed && <span>{item.name}</span>}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}