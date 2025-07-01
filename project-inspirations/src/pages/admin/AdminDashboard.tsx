import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Activity,
  UserPlus,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { demoData } from '../../data/demoData';

export default function AdminDashboard() {
  const { dashboard } = demoData;
  const { totalRevenue, totalUsers, activeProjects, systemUptime, newCustomers, completedTasks, pendingApprovals, monthlyGrowth } = dashboard.admin;

  const stats = [
    {
      title: 'Total Revenue',
      value: `$${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      change: `+${monthlyGrowth}%`,
      changeType: 'positive'
    },
    {
      title: 'Total Users',
      value: totalUsers,
      icon: Users,
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Active Projects',
      value: activeProjects,
      icon: Activity,
      change: '+5%',
      changeType: 'positive'
    },
    {
      title: 'System Uptime',
      value: `${systemUptime}%`,
      icon: TrendingUp,
      change: '+0.1%',
      changeType: 'positive'
    }
  ];

  const quickStats = [
    { title: 'New Customers', value: newCustomers, icon: UserPlus, color: 'bg-blue-500' },
    { title: 'Completed Tasks', value: completedTasks, icon: CheckCircle, color: 'bg-green-500' },
    { title: 'Pending Approvals', value: pendingApprovals, icon: Clock, color: 'bg-yellow-500' },
    { title: 'System Alerts', value: 2, icon: AlertCircle, color: 'bg-red-500' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Welcome back! Here's what's happening with your business today.
        </p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                  <p className={`text-sm ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change} from last month
                  </p>
                </div>
                <div className="p-3 bg-primary-100 dark:bg-primary-900/20 rounded-lg">
                  <stat.icon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <stat.icon className="h-5 w-5 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.title}
                  </p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {demoData.interactions.slice(0, 5).map((interaction) => (
                <div key={interaction.id} className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center">
                      <Activity className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {interaction.type} with {interaction.customer}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(interaction.time).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Performing Departments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {demoData.departments.map((dept) => (
                <div key={dept.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {dept.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {dept.employees} employees
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {dept.performance}%
                    </p>
                    <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full"
                        style={{ width: `${dept.performance}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}