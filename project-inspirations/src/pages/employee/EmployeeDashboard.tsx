import { 
  CheckCircle, 
  Clock, 
  Users, 
  Calendar,
  TrendingUp,
  Target
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { demoData } from '../../data/demoData';

export default function EmployeeDashboard() {
  const { dashboard } = demoData;
  const { tasksCompleted, totalTasks, meetings, hoursLogged, customerInteractions, pendingFollowUps } = dashboard.employee;

  const stats = [
    {
      title: 'Tasks Completed',
      value: `${tasksCompleted}/${totalTasks}`,
      icon: CheckCircle,
      color: 'bg-green-500',
      percentage: Math.round((tasksCompleted / totalTasks) * 100)
    },
    {
      title: 'Hours Logged',
      value: hoursLogged,
      icon: Clock,
      color: 'bg-blue-500',
      subtitle: 'This week'
    },
    {
      title: 'Customer Interactions',
      value: customerInteractions,
      icon: Users,
      color: 'bg-purple-500',
      subtitle: 'This month'
    },
    {
      title: 'Meetings',
      value: meetings,
      icon: Calendar,
      color: 'bg-orange-500',
      subtitle: 'This week'
    }
  ];

  const recentTasks = demoData.tasks.slice(0, 5);
  const upcomingFollowUps = demoData.customers.slice(0, 3);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          My Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Welcome back! Here's your personal productivity overview.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                  {stat.subtitle && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {stat.subtitle}
                    </p>
                  )}
                  {stat.percentage && (
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${stat.percentage}%` }}
                        />
                      </div>
                    </div>
                  )}
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
            <CardTitle>Recent Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTasks.map((task) => (
                <div key={task.id} className="flex items-center space-x-3">
                  <div className={`h-2 w-2 rounded-full ${
                    task.priority === 'High' ? 'bg-red-500' :
                    task.priority === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {task.title}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {task.priority} priority • {task.progress}% complete
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full"
                        style={{ width: `${task.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending Follow-ups</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingFollowUps.map((customer) => (
                <div key={customer.id} className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center">
                      <Users className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {customer.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Last contact: {new Date(customer.lastContact).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      customer.status === 'Active' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                    }`}>
                      {customer.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button className="p-4 text-left rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <Target className="h-6 w-6 text-primary-600 dark:text-primary-400 mb-2" />
              <p className="font-medium text-gray-900 dark:text-white">Create Task</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Add a new task</p>
            </button>
            <button className="p-4 text-left rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <Users className="h-6 w-6 text-primary-600 dark:text-primary-400 mb-2" />
              <p className="font-medium text-gray-900 dark:text-white">Add Customer</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">New customer entry</p>
            </button>
            <button className="p-4 text-left rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <Clock className="h-6 w-6 text-primary-600 dark:text-primary-400 mb-2" />
              <p className="font-medium text-gray-900 dark:text-white">Log Time</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Record work hours</p>
            </button>
            <button className="p-4 text-left rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <TrendingUp className="h-6 w-6 text-primary-600 dark:text-primary-400 mb-2" />
              <p className="font-medium text-gray-900 dark:text-white">View Reports</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Performance metrics</p>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}