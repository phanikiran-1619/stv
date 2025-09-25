import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card.jsx';
import { Button } from '../components/ui/button.jsx';
import { Bus, Users, Settings, BarChart3, LogOut, ArrowLeft, Activity, Shield, Database, Bell, TrendingUp, Clock, Star, CheckCircle } from 'lucide-react';
import { removeToken, getUserRole } from '../lib/token.js';
import ThemeToggle from '../components/ThemeToggle.jsx';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const role = getUserRole();

  const handleLogout = () => {
    removeToken();
    navigate('/login');
  };

  const dashboardStats = [
    { 
      title: 'Total Users', 
      count: '1,247', 
      change: '+12%',
      icon: Users, 
      gradient: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950/20',
      textColor: 'text-blue-600 dark:text-blue-400',
      borderColor: 'border-blue-200 dark:border-blue-700'
    },
    { 
      title: 'Active Sessions', 
      count: '89', 
      change: '+5%',
      icon: Activity, 
      gradient: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/20',
      textColor: 'text-emerald-600 dark:text-emerald-400',
      borderColor: 'border-emerald-200 dark:border-emerald-700'
    },
    { 
      title: 'System Health', 
      count: '98.2%', 
      change: '+0.8%',
      icon: Shield, 
      gradient: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-950/20',
      textColor: 'text-purple-600 dark:text-purple-400',
      borderColor: 'border-purple-200 dark:border-purple-700'
    },
    { 
      title: 'Revenue Today', 
      count: '$12.4K', 
      change: '+24%',
      icon: TrendingUp, 
      gradient: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-950/20',
      textColor: 'text-orange-600 dark:text-orange-400',
      borderColor: 'border-orange-200 dark:border-orange-700'
    }
  ];

  const quickActions = [
    {
      title: 'User Management',
      description: 'Manage user accounts, roles, permissions and access controls across the entire platform.',
      icon: Users,
      gradient: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-950/20',
      borderColor: 'border-purple-200 dark:border-purple-700',
      testId: 'manage-users-button'
    },
    {
      title: 'Analytics Dashboard',
      description: 'View comprehensive analytics, reports, and insights about system usage and performance metrics.',
      icon: BarChart3,
      gradient: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950/20',
      borderColor: 'border-blue-200 dark:border-blue-700',
      testId: 'view-analytics-button'
    },
    {
      title: 'System Settings',
      description: 'Configure system settings, integrations, platform preferences, and operational parameters.',
      icon: Settings,
      gradient: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/20',
      borderColor: 'border-emerald-200 dark:border-emerald-700',
      testId: 'system-settings-button'
    },
    {
      title: 'Database Management',
      description: 'Monitor database performance, execute backups, and manage maintenance schedules effectively.',
      icon: Database,
      gradient: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-950/20',
      borderColor: 'border-orange-200 dark:border-orange-700',
      testId: 'database-management-button'
    },
    {
      title: 'Notifications Center',
      description: 'Configure system alerts, user notifications, communication settings, and automated messages.',
      icon: Bell,
      gradient: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50 dark:bg-red-950/20',
      borderColor: 'border-red-200 dark:border-red-700',
      testId: 'notifications-button'
    },
    {
      title: 'Activity Logs',
      description: 'Review detailed system activity, comprehensive audit trails, and security event logs.',
      icon: Activity,
      gradient: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50 dark:bg-indigo-950/20',
      borderColor: 'border-indigo-200 dark:border-indigo-700',
      testId: 'activity-logs-button'
    }
  ];

  const recentActivities = [
    {
      title: 'New user registration',
      description: 'john.doe@example.com joined the platform',
      time: '2 minutes ago',
      icon: Users,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-950/30'
    },
    {
      title: 'System backup completed',
      description: 'All databases backed up successfully',
      time: '1 hour ago',
      icon: CheckCircle,
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-100 dark:bg-emerald-950/30'
    },
    {
      title: 'Database maintenance',
      description: 'Scheduled optimization completed',
      time: '3 hours ago',
      icon: Database,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-950/30'
    },
    {
      title: 'Security alert resolved',
      description: 'Failed login attempts successfully blocked',
      time: '5 hours ago',
      icon: Shield,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-100 dark:bg-orange-950/30'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-foreground transition-colors duration-300">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b-2 border-purple-200 dark:border-purple-700 sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <Link to="/">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-2 border-purple-200 dark:border-purple-700 hover:border-purple-400 dark:hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-950/30 transition-all duration-300 font-medium"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Home
                </Button>
              </Link>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Bus className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-xl font-bold text-gray-800 dark:text-gray-100">EmcomServ</span>
                  <span className="text-sm text-purple-600 dark:text-purple-400 ml-3 font-semibold bg-purple-100 dark:bg-purple-950/30 px-2 py-1 rounded-full">Admin Panel</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block bg-purple-50 dark:bg-purple-950/20 px-4 py-2 rounded-xl border border-purple-200 dark:border-purple-700">
                <p className="text-sm text-gray-600 dark:text-gray-400">Welcome back,</p>
                <p className="font-bold text-purple-600 dark:text-purple-400">{role || 'Administrator'}</p>
              </div>
              <ThemeToggle />
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="border-2 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 hover:border-red-400 dark:hover:border-red-600 transition-all duration-300 font-medium"
                data-testid="logout-button"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-10">
        {/* Welcome Section */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 bg-purple-100 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-700 rounded-full px-4 py-2 mb-6">
            <Star className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">Administrative Control Center</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 bg-clip-text text-transparent">
              Admin Dashboard
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Comprehensive administrative controls for managing your EmcomServ platform with advanced analytics and system monitoring
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {dashboardStats.map((stat, index) => (
            <Card key={index} className={`bg-white dark:bg-gray-800 border-2 ${stat.borderColor} hover:border-purple-400 dark:hover:border-purple-500 transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-xl hover:shadow-purple-500/20 rounded-2xl`}>
              <CardContent className="p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm font-semibold uppercase tracking-wider">{stat.title}</p>
                    <p className="text-3xl font-bold mt-2 text-gray-800 dark:text-gray-100">{stat.count}</p>
                    <p className={`text-sm mt-2 ${stat.textColor} font-semibold flex items-center gap-1`}>
                      <TrendingUp className="w-4 h-4" />
                      {stat.change} from last week
                    </p>
                  </div>
                  <div className={`w-16 h-16 ${stat.bgColor} rounded-2xl flex items-center justify-center shadow-lg`}>
                    <stat.icon className={`w-8 h-8 ${stat.textColor}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions Grid */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-800 dark:text-gray-100">Administrative Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {quickActions.map((action, index) => (
              <Card key={index} className={`group bg-white dark:bg-gray-800 border-2 ${action.borderColor} hover:border-purple-400 dark:hover:border-purple-500 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 shadow-lg hover:shadow-xl hover:shadow-purple-500/20 rounded-3xl overflow-hidden`}>
                {/* Top gradient accent */}
                <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${action.gradient}`}></div>
                
                <CardHeader className="pb-4 pt-8">
                  <CardTitle className="flex items-center space-x-4">
                    <div className={`w-14 h-14 ${action.bgColor} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                      <action.icon className={`w-7 h-7 ${action.gradient.includes('purple') ? 'text-purple-600 dark:text-purple-400' : action.gradient.includes('blue') ? 'text-blue-600 dark:text-blue-400' : action.gradient.includes('emerald') ? 'text-emerald-600 dark:text-emerald-400' : action.gradient.includes('orange') ? 'text-orange-600 dark:text-orange-400' : action.gradient.includes('red') ? 'text-red-600 dark:text-red-400' : 'text-indigo-600 dark:text-indigo-400'}`} />
                    </div>
                    <span className="text-xl font-bold text-gray-800 dark:text-gray-100">{action.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 pb-8">
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {action.description}
                  </p>
                  <Button 
                    className={`w-full bg-gradient-to-r ${action.gradient} hover:opacity-90 text-white transition-all duration-300 transform group-hover:scale-105 shadow-lg hover:shadow-xl rounded-xl py-3 font-semibold`}
                    data-testid={action.testId}
                  >
                    Access {action.title}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Activity & System Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Recent Activity */}
          <Card className="bg-white dark:bg-gray-800 border-2 border-purple-200 dark:border-purple-700 shadow-xl rounded-3xl">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center space-x-3 text-2xl">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-950/30 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="text-gray-800 dark:text-gray-100">Recent Activity</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-750 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                    <div className={`w-12 h-12 ${activity.bgColor} rounded-xl flex items-center justify-center flex-shrink-0 shadow-md`}>
                      <activity.icon className={`w-6 h-6 ${activity.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 dark:text-gray-100">{activity.title}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{activity.description}</p>
                      <span className="text-xs text-gray-500 dark:text-gray-500 mt-2 inline-block">{activity.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* System Overview */}
          <Card className="bg-white dark:bg-gray-800 border-2 border-purple-200 dark:border-purple-700 shadow-xl rounded-3xl">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center space-x-3 text-2xl">
                <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-950/30 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <span className="text-gray-800 dark:text-gray-100">System Overview</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-5">
                <div className="flex items-center justify-between py-3 px-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl">
                  <span className="font-semibold text-gray-800 dark:text-gray-100">Server Status</span>
                  <span className="text-sm text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    Online
                  </span>
                </div>
                <div className="flex items-center justify-between py-3 px-4 bg-blue-50 dark:bg-blue-950/20 rounded-xl">
                  <span className="font-semibold text-gray-800 dark:text-gray-100">Database</span>
                  <span className="text-sm text-blue-600 dark:text-blue-400 font-bold flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    Connected
                  </span>
                </div>
                <div className="flex items-center justify-between py-3 px-4 bg-purple-50 dark:bg-purple-950/20 rounded-xl">
                  <span className="font-semibold text-gray-800 dark:text-gray-100">API Status</span>
                  <span className="text-sm text-purple-600 dark:text-purple-400 font-bold flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    Operational
                  </span>
                </div>
                <div className="flex items-center justify-between py-3 px-4 bg-gray-50 dark:bg-gray-750 rounded-xl">
                  <span className="font-semibold text-gray-800 dark:text-gray-100">Last Backup</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">2 hours ago</span>
                </div>
                <div className="flex items-center justify-between py-3 px-4 bg-orange-50 dark:bg-orange-950/20 rounded-xl">
                  <span className="font-semibold text-gray-800 dark:text-gray-100">Storage Used</span>
                  <span className="text-sm text-orange-600 dark:text-orange-400 font-bold">68% (2.3TB)</span>
                </div>
                <div className="flex items-center justify-between py-3 px-4 bg-indigo-50 dark:bg-indigo-950/20 rounded-xl">
                  <span className="font-semibold text-gray-800 dark:text-gray-100">Active Users</span>
                  <span className="text-sm text-indigo-600 dark:text-indigo-400 font-bold">89 online</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;