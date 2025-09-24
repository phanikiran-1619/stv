import React from 'react';
import { 
  User, 
  UserCheck, 
  Bus, 
  MapPin, 
  Shield
} from 'lucide-react';
import { Card, CardContent } from '../components/ui/card.jsx';

const RegistrationsPortal = () => {
  const registrationTypes = [
    {
      id: 'driver',
      title: 'Driver Registration',
      icon: <User className="h-8 w-8" />,
      color: 'from-red-500 to-red-600',
      hoverColor: 'from-red-400 to-red-500',
      description: 'Register new bus drivers with licenses and certifications'
    },
    {
      id: 'attender',
      title: 'Attender Registration',
      icon: <UserCheck className="h-8 w-8" />,
      color: 'from-blue-500 to-blue-600',
      hoverColor: 'from-blue-400 to-blue-500',
      description: 'Register bus attendants and support staff'
    },
    {
      id: 'bus',
      title: 'Bus Registration',
      icon: <Bus className="h-8 w-8" />,
      color: 'from-cyan-500 to-cyan-600',
      hoverColor: 'from-cyan-400 to-cyan-500',
      description: 'Add new buses to the fleet with specifications'
    },
    {
      id: 'route',
      title: 'Route Registration',
      icon: <MapPin className="h-8 w-8" />,
      color: 'from-orange-500 to-orange-600',
      hoverColor: 'from-orange-400 to-orange-500',
      description: 'Create new bus routes and schedules'
    },
    {
      id: 'admin',
      title: 'Admin Registration',
      icon: <Shield className="h-8 w-8" />,
      color: 'from-green-500 to-green-600',
      hoverColor: 'from-green-400 to-green-500',
      description: 'Register system administrators and managers'
    }
  ];

  const handleRegistrationClick = (type) => {
    alert(`Opening ${type} registration form...`);
  };

  return (
    <div className="animate-in fade-in-up duration-700">
      {/* Header */}
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
          <span className="bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
            Registration Portal
          </span>
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
          Choose the type of registration you want to perform and manage your fleet efficiently
        </p>
      </div>

      {/* Enhanced Registration Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto">
        {registrationTypes.map((type, index) => (
          <Card 
            key={type.id}
            className="group relative bg-card/70 backdrop-blur-sm hover:bg-card/90 transition-all duration-500 transform hover:scale-105 border-2 border-purple-200/30 hover:border-purple-400/60 dark:border-purple-800/30 dark:hover:border-purple-600/60 cursor-pointer shadow-sm hover:shadow-md hover:shadow-purple-500/10 animate-in fade-in-up overflow-hidden"
            style={{ animationDelay: `${index * 100}ms` }}
            onClick={() => handleRegistrationClick(type.title)}
            data-testid={`${type.id}-registration-card`}
          >
            {/* Subtle background glow on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            {/* Top accent border */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400/50 via-purple-500/70 to-purple-600/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <CardContent className="relative z-10 p-6 sm:p-8 text-center">
              <div className={`w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r ${type.color} group-hover:bg-gradient-to-r group-hover:${type.hoverColor} rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 text-white shadow-sm group-hover:shadow-md group-hover:shadow-purple-500/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 border border-white/20`}>
                <div className="transition-transform duration-500 group-hover:scale-110">
                  {type.icon}
                </div>
              </div>
              
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-foreground group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
                {type.title}
              </h3>
              
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed group-hover:text-muted-foreground/90 transition-colors duration-300">
                {type.description}
              </p>
              
              {/* Subtle bottom accent */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 group-hover:w-20 h-0.5 bg-gradient-to-r from-transparent via-purple-500 to-transparent transition-all duration-500"></div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Enhanced Stats Section */}
      <div className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 max-w-4xl mx-auto animate-in fade-in-up duration-700" style={{ animationDelay: '600ms' }}>
        <div className="group text-center p-6 sm:p-8 bg-card/50 backdrop-blur-sm rounded-2xl border-2 border-purple-200/20 hover:border-purple-400/40 dark:border-purple-800/20 dark:hover:border-purple-600/40 hover:bg-card/70 transition-all duration-300 shadow-sm hover:shadow-md hover:shadow-purple-500/10 hover:scale-105" data-testid="total-registrations-stat">
          <div className="text-3xl sm:text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2 transition-colors duration-300 group-hover:text-purple-500 dark:group-hover:text-purple-300">1,247</div>
          <div className="text-sm sm:text-base text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300">Total Registrations</div>
        </div>
        
        <div className="group text-center p-6 sm:p-8 bg-card/50 backdrop-blur-sm rounded-2xl border-2 border-purple-200/20 hover:border-purple-400/40 dark:border-purple-800/20 dark:hover:border-purple-600/40 hover:bg-card/70 transition-all duration-300 shadow-sm hover:shadow-md hover:shadow-purple-500/10 hover:scale-105" data-testid="active-routes-stat">
          <div className="text-3xl sm:text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2 transition-colors duration-300 group-hover:text-purple-500 dark:group-hover:text-purple-300">89</div>
          <div className="text-sm sm:text-base text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300">Active Routes</div>
        </div>
        
        <div className="group text-center p-6 sm:p-8 bg-card/50 backdrop-blur-sm rounded-2xl border-2 border-purple-200/20 hover:border-purple-400/40 dark:border-purple-800/20 dark:hover:border-purple-600/40 hover:bg-card/70 transition-all duration-300 shadow-sm hover:shadow-md hover:shadow-purple-500/10 hover:scale-105" data-testid="fleet-vehicles-stat">
          <div className="text-3xl sm:text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2 transition-colors duration-300 group-hover:text-purple-500 dark:group-hover:text-purple-300">156</div>
          <div className="text-sm sm:text-base text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300">Fleet Vehicles</div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationsPortal;