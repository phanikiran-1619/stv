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
      description: 'Register new bus drivers with licenses and certifications'
    },
    {
      id: 'attender',
      title: 'Attender Registration',
      icon: <UserCheck className="h-8 w-8" />,
      color: 'from-blue-500 to-blue-600',
      description: 'Register bus attendants and support staff'
    },
    {
      id: 'bus',
      title: 'Bus Registration',
      icon: <Bus className="h-8 w-8" />,
      color: 'from-cyan-500 to-cyan-600',
      description: 'Add new buses to the fleet with specifications'
    },
    {
      id: 'route',
      title: 'Route Registration',
      icon: <MapPin className="h-8 w-8" />,
      color: 'from-orange-500 to-orange-600',
      description: 'Create new bus routes and schedules'
    },
    {
      id: 'admin',
      title: 'Admin Registration',
      icon: <Shield className="h-8 w-8" />,
      color: 'from-green-500 to-green-600',
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

      {/* Registration Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto">
        {registrationTypes.map((type, index) => (
          <Card 
            key={type.id}
            className="group bg-card/60 backdrop-blur-sm hover:bg-card/80 transition-all duration-500 transform hover:scale-105 border border-border/30 hover:border-purple-500/50 cursor-pointer shadow-lg hover:shadow-2xl animate-in fade-in-up"
            style={{ animationDelay: `${index * 100}ms` }}
            onClick={() => handleRegistrationClick(type.title)}
          >
            <CardContent className="p-6 sm:p-8 text-center">
              <div className={`w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r ${type.color} rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 text-white shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500`}>
                {type.icon}
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-foreground group-hover:text-purple-600 transition-colors duration-300">
                {type.title}
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed group-hover:text-muted-foreground/80 transition-colors duration-300">
                {type.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Stats Section */}
      <div className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 max-w-4xl mx-auto animate-in fade-in-up duration-700" style={{ animationDelay: '600ms' }}>
        <div className="text-center p-6 sm:p-8 bg-card/40 backdrop-blur-sm rounded-2xl border border-border/30 hover:bg-card/60 transition-all duration-300">
          <div className="text-3xl sm:text-4xl font-bold text-purple-600 mb-2">1,247</div>
          <div className="text-sm sm:text-base text-muted-foreground">Total Registrations</div>
        </div>
        <div className="text-center p-6 sm:p-8 bg-card/40 backdrop-blur-sm rounded-2xl border border-border/30 hover:bg-card/60 transition-all duration-300">
          <div className="text-3xl sm:text-4xl font-bold text-purple-600 mb-2">89</div>
          <div className="text-sm sm:text-base text-muted-foreground">Active Routes</div>
        </div>
        <div className="text-center p-6 sm:p-8 bg-card/40 backdrop-blur-sm rounded-2xl border border-border/30 hover:bg-card/60 transition-all duration-300">
          <div className="text-3xl sm:text-4xl font-bold text-purple-600 mb-2">156</div>
          <div className="text-sm sm:text-base text-muted-foreground">Fleet Vehicles</div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationsPortal;