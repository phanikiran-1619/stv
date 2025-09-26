import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  UserCheck, 
  Bus, 
  MapPin, 
  Shield,
  LogOut
} from 'lucide-react';
import { Card, CardContent } from '../components/ui/card.jsx';
import { Button } from '../components/ui/button.jsx';

// Authentication Error Component
const AuthenticationError = ({ onRetryLogin }) => (
  <div className="flex flex-col items-center justify-center py-16 px-4">
    <div className="bg-red-50 dark:bg-red-950/30 border-2 border-red-200 dark:border-red-800 rounded-2xl p-8 max-w-md text-center shadow-xl">
      <LogOut className="h-16 w-16 text-red-500 mx-auto mb-4" />
      <h3 className="text-xl font-bold text-red-800 dark:text-red-200 mb-2">
        Authentication Required
      </h3>
      <p className="text-red-600 dark:text-red-300 mb-6">
        You need to login again to access registration portal. Your session may have expired.
      </p>
      <Button 
        onClick={onRetryLogin}
        className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg"
      >
        Login Again
      </Button>
    </div>
  </div>
);

const RegistrationsPortal = () => {
  const navigate = useNavigate();
  
  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem('operatortoken');
    if (!token) {
      navigate('/login');
      return;
    }
  }, [navigate]);

  const handleRetryLogin = () => {
    localStorage.removeItem('operatortoken');
    navigate('/login');
  };

  // Check if user is authenticated
  const isAuthenticated = localStorage.getItem('operatortoken');
  
  if (!isAuthenticated) {
    return <AuthenticationError onRetryLogin={handleRetryLogin} />;
  }

  const registrationTypes = [
    {
      id: 'driver',
      title: 'Driver Registration',
      icon: <User className="h-12 w-12" />,
      gradientFrom: 'from-emerald-500',
      gradientTo: 'to-emerald-600',
      hoverFrom: 'from-emerald-400',
      hoverTo: 'to-emerald-500',
      description: 'Register new bus drivers with licenses and certifications'
    },
    {
      id: 'attender',
      title: 'Attender Registration',
      icon: <UserCheck className="h-12 w-12" />,
      gradientFrom: 'from-blue-500',
      gradientTo: 'to-blue-600',
      hoverFrom: 'from-blue-400',
      hoverTo: 'to-blue-500',
      description: 'Register bus attendants and support staff'
    },
    {
      id: 'bus',
      title: 'Bus Registration',
      icon: <Bus className="h-12 w-12" />,
      gradientFrom: 'from-orange-500',
      gradientTo: 'to-orange-600',
      hoverFrom: 'from-orange-400',
      hoverTo: 'to-orange-500',
      description: 'Add new buses to the fleet with specifications'
    },
    {
      id: 'route',
      title: 'Route Registration',
      icon: <MapPin className="h-12 w-12" />,
      gradientFrom: 'from-cyan-500',
      gradientTo: 'to-cyan-600',
      hoverFrom: 'from-cyan-400',
      hoverTo: 'to-cyan-500',
      description: 'Create new bus routes and schedules'
    },
    {
      id: 'admin',
      title: 'Admin Registration',
      icon: <Shield className="h-12 w-12" />,
      gradientFrom: 'from-purple-500',
      gradientTo: 'to-purple-600',
      hoverFrom: 'from-purple-400',
      hoverTo: 'to-purple-500',
      description: 'Register system administrators and managers'
    }
  ];

  const handleRegistrationClick = (type) => {
    // Navigate to specific registration forms
    switch (type.id) {
      case 'driver':
        navigate('/dashboard/registration/driver');
        break;
      case 'attender':
        navigate('/dashboard/registration/attender');
        break;
      case 'bus':
        navigate('/dashboard/registration/bus');
        break;
      case 'route':
        navigate('/dashboard/registration/route');
        break;
      case 'admin':
        navigate('/dashboard/registration/admin');
        break;
      default:
        // Show a notification for now
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 z-50 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-right duration-500 border border-purple-400/20';
        notification.innerHTML = `
          <div class="font-semibold">Opening ${type.title}</div>
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
          if (document.body.contains(notification)) {
            document.body.removeChild(notification);
          }
        }, 3000);
    }
  };

  return (
    <div className="animate-in fade-in-up duration-700">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 bg-clip-text text-transparent">
              Registration Portal
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Choose the type of registration you want to perform and manage your fleet efficiently
          </p>
        </div>

        {/* Registration Type Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {registrationTypes.map((type, index) => (
            <Card 
              key={type.id}
              className="group relative bg-gray-50/80 dark:bg-gray-800/80 hover:bg-gray-50 dark:hover:bg-gray-750 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 border-2 border-purple-200 dark:border-purple-700 hover:border-purple-400 dark:hover:border-purple-500 cursor-pointer shadow-lg hover:shadow-xl hover:shadow-purple-500/20 dark:hover:shadow-purple-500/10 rounded-2xl overflow-hidden animate-in fade-in-up"
              style={{ animationDelay: `${index * 150}ms` }}
              onClick={() => handleRegistrationClick(type)}
              data-testid={`${type.id}-registration-card`}
            >
              {/* Top gradient accent */}
              <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${type.gradientFrom} ${type.gradientTo} opacity-70 group-hover:opacity-100 transition-opacity duration-500`}></div>
              
              <CardContent className="relative z-10 p-8 text-center">
                {/* Icon Container */}
                <div className={`w-24 h-24 bg-gradient-to-r ${type.gradientFrom} ${type.gradientTo} group-hover:bg-gradient-to-r group-hover:${type.hoverFrom} group-hover:${type.hoverTo} rounded-2xl flex items-center justify-center mx-auto mb-6 text-white shadow-lg group-hover:shadow-xl group-hover:shadow-purple-500/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 border border-white/20`}>
                  <div className="transition-transform duration-500 group-hover:scale-110">
                    {type.icon}
                  </div>
                </div>
                
                {/* Title */}
                <h3 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100 group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors duration-500">
                  {type.title}
                </h3>
                
                {/* Description */}
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-500">
                  {type.description}
                </p>
                
                {/* Bottom accent line */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 group-hover:w-32 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent transition-all duration-500 rounded-t-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RegistrationsPortal;