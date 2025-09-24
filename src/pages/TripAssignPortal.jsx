import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Bus, 
  Route,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  AlertCircle,
  Navigation
} from 'lucide-react';
import { Button } from '../components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card.jsx';
import { Badge } from '../components/ui/badge.jsx';

const TripAssignPortal = () => {
  const [activeView, setActiveView] = useState('assignments');

  const mockTrips = [
    {
      id: 1,
      routeName: 'City Center → Airport',
      busNumber: 'BUS-001',
      driverName: 'John Driver',
      attendant: 'Mike Assistant',
      departureTime: '08:30 AM',
      arrivalTime: '09:15 AM',
      date: '2025-01-15',
      status: 'scheduled',
      passengers: 42,
      capacity: 50
    },
    {
      id: 2,
      routeName: 'North District → South Plaza',
      busNumber: 'BUS-002',
      driverName: 'Jane Smith',
      attendant: 'Sarah Helper',
      departureTime: '10:15 AM',
      arrivalTime: '10:50 AM',
      date: '2025-01-15',
      status: 'in_progress',
      passengers: 38,
      capacity: 45
    },
    {
      id: 3,
      routeName: 'Downtown → University',
      busNumber: 'BUS-003',
      driverName: 'Bob Wilson',
      attendant: 'Tom Support',
      departureTime: '02:45 PM',
      arrivalTime: '03:20 PM',
      date: '2025-01-15',
      status: 'completed',
      passengers: 35,
      capacity: 40
    },
    {
      id: 4,
      routeName: 'Airport → City Center',
      busNumber: 'BUS-004',
      driverName: 'Alice Brown',
      attendant: 'Lisa Care',
      departureTime: '06:20 PM',
      arrivalTime: '07:05 PM',
      date: '2025-01-15',
      status: 'delayed',
      passengers: 28,
      capacity: 50
    }
  ];

  const availableResources = {
    drivers: [
      { id: 1, name: 'John Driver', status: 'available', experience: '5 years' },
      { id: 2, name: 'Jane Smith', status: 'assigned', experience: '3 years' },
      { id: 3, name: 'Bob Wilson', status: 'on_break', experience: '7 years' },
      { id: 4, name: 'Alice Brown', status: 'assigned', experience: '4 years' }
    ],
    buses: [
      { id: 1, number: 'BUS-001', status: 'assigned', capacity: 50, condition: 'excellent' },
      { id: 2, number: 'BUS-002', status: 'assigned', capacity: 45, condition: 'good' },
      { id: 3, number: 'BUS-003', status: 'maintenance', capacity: 40, condition: 'fair' },
      { id: 4, number: 'BUS-004', status: 'assigned', capacity: 50, condition: 'excellent' }
    ],
    routes: [
      { id: 1, name: 'City Center → Airport', distance: '25 km', duration: '45 min' },
      { id: 2, name: 'North District → South Plaza', distance: '18 km', duration: '35 min' },
      { id: 3, name: 'Downtown → University', distance: '12 km', duration: '30 min' },
      { id: 4, name: 'Airport → City Center', distance: '25 km', duration: '45 min' }
    ]
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-500';
      case 'in_progress': return 'bg-green-500';
      case 'completed': return 'bg-purple-500';
      case 'delayed': return 'bg-red-500';
      case 'cancelled': return 'bg-gray-500';
      case 'available': return 'bg-green-500';
      case 'assigned': return 'bg-blue-500';
      case 'on_break': return 'bg-yellow-500';
      case 'maintenance': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'scheduled': return <Clock className="h-4 w-4" />;
      case 'in_progress': return <Navigation className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'delayed': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const stats = [
    { label: 'Active Trips', value: '24', icon: Bus, color: 'text-purple-600' },
    { label: 'Scheduled Today', value: '18', icon: Calendar, color: 'text-blue-500' },
    { label: 'Available Drivers', value: '12', icon: User, color: 'text-green-500' },
    { label: 'Routes Active', value: '8', icon: Route, color: 'text-orange-500' }
  ];

  return (
    <div className="animate-in fade-in-up duration-700">
      {/* Header */}
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
          <span className="bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
            Trip Assignment
          </span>
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
          Efficiently assign trips, manage schedules, and coordinate your fleet operations
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 animate-in fade-in-up duration-700" style={{ animationDelay: '200ms' }}>
        {stats.map((stat, index) => (
          <Card key={index} className="bg-card/60 backdrop-blur-sm border border-border/30 hover:border-purple-500/30 hover:bg-card/80 transition-all duration-300 hover:scale-105">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl sm:text-3xl font-bold text-foreground">{stat.value}</p>
                </div>
                <stat.icon className={`h-6 w-6 sm:h-8 sm:w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* View Toggle */}
      <div className="flex justify-center mb-8 animate-in fade-in-up duration-700" style={{ animationDelay: '400ms' }}>
        <div className="flex space-x-1 bg-card/50 backdrop-blur-sm rounded-2xl p-2 border border-border/30">
          {['assignments', 'resources'].map((view) => (
            <button
              key={view}
              onClick={() => setActiveView(view)}
              className={`px-6 sm:px-8 py-3 rounded-xl font-semibold transition-all duration-300 text-sm sm:text-base min-w-[140px] ${
                activeView === view
                  ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
              }`}
            >
              {view === 'assignments' ? 'Trip Assignments' : 'Available Resources'}
            </button>
          ))}
        </div>
      </div>

      {/* Trip Assignments View */}
      {activeView === 'assignments' && (
        <div className="animate-in fade-in-up duration-700" style={{ animationDelay: '600ms' }}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-foreground">Today's Trip Assignments</h2>
            <Button className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg">
              <Plus className="h-4 w-4 mr-2" />
              New Assignment
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:gap-6">
            {mockTrips.map((trip, index) => (
              <Card key={trip.id} className="bg-card/60 backdrop-blur-sm border border-border/30 hover:border-purple-500/30 hover:bg-card/80 transition-all duration-300 hover:shadow-lg animate-in fade-in-up" style={{ animationDelay: `${(index + 1) * 100}ms` }}>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-4">
                        <h3 className="font-semibold text-lg text-foreground">{trip.routeName}</h3>
                        <Badge className={`${getStatusColor(trip.status)} text-white w-fit flex items-center gap-1`}>
                          {getStatusIcon(trip.status)}
                          {trip.status.replace('_', ' ').charAt(0).toUpperCase() + trip.status.replace('_', ' ').slice(1)}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                        <div className="flex items-center gap-2">
                          <Bus className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Bus:</span>
                          <span className="font-medium">{trip.busNumber}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Driver:</span>
                          <span className="font-medium">{trip.driverName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Attendant:</span>
                          <span className="font-medium">{trip.attendant}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Departure:</span>
                          <span className="font-medium">{trip.departureTime}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Arrival:</span>
                          <span className="font-medium">{trip.arrivalTime}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Date:</span>
                          <span className="font-medium">{trip.date}</span>
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-muted-foreground">Passengers:</span>
                          <span className="font-medium">{trip.passengers}/{trip.capacity}</span>
                          <div className="flex-1 bg-muted/50 rounded-full h-2 ml-2">
                            <div 
                              className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-500" 
                              style={{ width: `${(trip.passengers / trip.capacity) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-border/30 hover:border-purple-500/50 hover:bg-purple-500/10 bg-card/60 backdrop-blur-sm"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Resources View */}
      {activeView === 'resources' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 animate-in fade-in-up duration-700" style={{ animationDelay: '600ms' }}>
          {/* Drivers */}
          <Card className="bg-card/60 backdrop-blur-sm border border-border/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <User className="h-5 w-5 text-purple-500" />
                Available Drivers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {availableResources.drivers.map((driver, index) => (
                <div key={driver.id} className="flex items-center justify-between p-3 bg-background/50 rounded-lg border border-border/30 hover:bg-background/70 transition-all duration-300 animate-in fade-in-up" style={{ animationDelay: `${(index + 1) * 50}ms` }}>
                  <div>
                    <p className="font-medium text-foreground">{driver.name}</p>
                    <p className="text-sm text-muted-foreground">{driver.experience}</p>
                  </div>
                  <Badge className={`${getStatusColor(driver.status)} text-white text-xs`}>
                    {driver.status.replace('_', ' ')}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Buses */}
          <Card className="bg-card/60 backdrop-blur-sm border border-border/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Bus className="h-5 w-5 text-purple-500" />
                Fleet Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {availableResources.buses.map((bus, index) => (
                <div key={bus.id} className="flex items-center justify-between p-3 bg-background/50 rounded-lg border border-border/30 hover:bg-background/70 transition-all duration-300 animate-in fade-in-up" style={{ animationDelay: `${(index + 1) * 50}ms` }}>
                  <div>
                    <p className="font-medium text-foreground">{bus.number}</p>
                    <p className="text-sm text-muted-foreground">Capacity: {bus.capacity} | {bus.condition}</p>
                  </div>
                  <Badge className={`${getStatusColor(bus.status)} text-white text-xs`}>
                    {bus.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Routes */}
          <Card className="bg-card/60 backdrop-blur-sm border border-border/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <MapPin className="h-5 w-5 text-purple-500" />
                Active Routes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {availableResources.routes.map((route, index) => (
                <div key={route.id} className="p-3 bg-background/50 rounded-lg border border-border/30 hover:bg-background/70 transition-all duration-300 animate-in fade-in-up" style={{ animationDelay: `${(index + 1) * 50}ms` }}>
                  <p className="font-medium text-foreground">{route.name}</p>
                  <p className="text-sm text-muted-foreground">{route.distance} • {route.duration}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default TripAssignPortal;