import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card.jsx';
import { Button } from '../components/ui/button.jsx';
import { Bus, Users, Settings, BarChart3, LogOut, ArrowLeft, Activity, Shield, Database, Bell, TrendingUp, Clock } from 'lucide-react';
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
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-500/10',
      textColor: 'text-blue-500'
    },
    { 
      title: 'Active Sessions', 
      count: '89', 
      change: '+5%',
      icon: Activity, 
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-500/10',
      textColor: 'text-green-500'
    },
    { 
      title: 'System Health', 
      count: '98.2%', 
      change: '+0.8%',
      icon: Shield, 
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-500/10',
      textColor: 'text-purple-500'
    },
    { 
      title: 'Revenue Today', 
      count: '$12.4K', 
      change: '+24%',
      icon: TrendingUp, 
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-500/10',
      textColor: 'text-orange-500'
    }
  ];

  const quickActions = [
    {
      title: 'User Management',
      description: 'Manage user accounts, roles, and permissions across the platform.',
      icon: Users,
      color: 'purple',
      gradient: 'from-purple-500 to-purple-600',
      testId: 'manage-users-button'
    },
    {
      title: 'Analytics Dashboard',
      description: 'View detailed analytics and reports about system usage and performance.',
      icon: BarChart3,
      color: 'blue',
      gradient: 'from-blue-500 to-blue-600',
      testId: 'view-analytics-button'
    },
    {
      title: 'System Settings',
      description: 'Configure system settings, integrations, and platform preferences.',
      icon: Settings,
      color: 'green',
      gradient: 'from-green-500 to-green-600',
      testId: 'system-settings-button'
    },
    {
      title: 'Database Management',
      description: 'Monitor database performance, backups, and maintenance schedules.',
      icon: Database,
      color: 'orange',
      gradient: 'from-orange-500 to-orange-600',
      testId: 'database-management-button'
    },
    {
      title: 'Notifications',
      description: 'Configure system alerts, user notifications, and communication settings.',
      icon: Bell,
      color: 'red',
      gradient: 'from-red-500 to-red-600',
      testId: 'notifications-button'
    },
    {
      title: 'Activity Logs',
      description: 'Review system activity, audit trails, and security logs.',
      icon: Activity,
      color: 'indigo',
      gradient: 'from-indigo-500 to-indigo-600',
      testId: 'activity-logs-button'
    }
  ];

  const recentActivities = [
    {
      title: 'New user registration',
      description: 'john.doe@example.com',
      time: '2 minutes ago',
      icon: Users,
      color: 'text-blue-500'
    },
    {
      title: 'System backup completed',
      description: 'All data backed up successfully',
      time: '1 hour ago',
      icon: Shield,
      color: 'text-green-500'
    },
    {
      title: 'Database maintenance',
      description: 'Scheduled maintenance completed',
      time: '3 hours ago',
      icon: Database,
      color: 'text-purple-500'
    },
    {
      title: 'Security alert resolved',
      description: 'Failed login attempts blocked',
      time: '5 hours ago',
      icon: Shield,
      color: 'text-orange-500'
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Header */}
      <div className="bg-card/50 backdrop-blur-sm border-b border-border/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-border/50 hover:border-purple-500/50 hover:bg-purple-500/10 transition-all duration-300"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Home
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Bus className="w-4 h-4 text-white" />
                </div>
                <div>
                  <span className="text-lg font-bold">EmcomServ</span>
                  <span className="text-sm text-purple-500 ml-2 font-medium">Admin</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm text-muted-foreground">Welcome back,</p>
                <p className="font-semibold text-purple-500">{role || 'Administrator'}</p>
              </div>
              <ThemeToggle />
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="border-destructive/50 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-all duration-300"
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
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            <span className="bg-gradient-to-r from-purple-500 to-purple-600 bg-clip-text text-transparent">
              Admin Dashboard
            </span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage your EmcomServ platform with comprehensive administrative controls
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardStats.map((stat, index) => (
            <Card key={index} className="bg-card border border-border/50 hover:bg-accent/20 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm font-medium">{stat.title}</p>
                    <p className="text-2xl font-bold mt-1">{stat.count}</p>
                    <p className={`text-xs mt-1 ${stat.textColor} font-medium`}>
                      {stat.change} from last week
                    </p>
                  </div>
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 text-foreground">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <Card key={index} className="bg-card border border-border/50 hover:bg-accent/20 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl group">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center space-x-3">
                    <div className={`w-10 h-10 bg-${action.color}-500/10 rounded-lg flex items-center justify-center`}>
                      <action.icon className={`w-5 h-5 text-${action.color}-500`} />
                    </div>
                    <span className="text-lg">{action.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {action.description}
                  </p>
                  <Button 
                    className={`w-full bg-gradient-to-r ${action.gradient} hover:opacity-90 text-white transition-all duration-300 transform group-hover:scale-105`}
                    data-testid={action.testId}
                  >
                    Open {action.title}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Activity & System Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <Card className="bg-card border border-border/50 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-xl">
                <Clock className="w-5 h-5 text-purple-500" />
                <span>Recent Activity</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3 py-3 border-b border-border/30 last:border-b-0">
                    <div className="w-8 h-8 bg-accent/50 rounded-full flex items-center justify-center flex-shrink-0">
                      <activity.icon className={`w-4 h-4 ${activity.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{activity.title}</p>
                      <p className="text-sm text-muted-foreground">{activity.description}</p>
                    </div>
                    <span className="text-xs text-muted-foreground flex-shrink-0">{activity.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* System Overview */}
          <Card className="bg-card border border-border/50 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-xl">
                <Shield className="w-5 h-5 text-purple-500" />
                <span>System Overview</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm font-medium">Server Status</span>
                  <span className="text-sm text-green-500 font-medium">Online</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm font-medium">Database</span>
                  <span className="text-sm text-green-500 font-medium">Connected</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm font-medium">API Status</span>
                  <span className="text-sm text-green-500 font-medium">Operational</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm font-medium">Last Backup</span>
                  <span className="text-sm text-muted-foreground">2 hours ago</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm font-medium">Storage Used</span>
                  <span className="text-sm text-orange-500 font-medium">68% (2.3TB)</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm font-medium">Active Users</span>
                  <span className="text-sm text-blue-500 font-medium">89 online</span>
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