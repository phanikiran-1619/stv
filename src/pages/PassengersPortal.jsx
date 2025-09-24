import React, { useState } from 'react';
import { 
  Search, 
  Users, 
  Ticket, 
  MapPin, 
  Clock,
  Phone,
  Mail,
  MoreHorizontal,
  Filter
} from 'lucide-react';
import { Button } from '../components/ui/button.jsx';
import { Input } from '../components/ui/input.jsx';
import { Card, CardContent } from '../components/ui/card.jsx';
import { Badge } from '../components/ui/badge.jsx';

const PassengersPortal = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const mockPassengers = [
    {
      id: 1,
      name: 'Alice Johnson',
      phone: '+1 555-0123',
      email: 'alice.johnson@email.com',
      ticketId: 'TKT-001234',
      route: 'City Center → Airport',
      seatNumber: 'A12',
      departureTime: '08:30 AM',
      status: 'confirmed',
      bookingDate: '2025-01-15'
    },
    {
      id: 2,
      name: 'Bob Williams',
      phone: '+1 555-0456',
      email: 'bob.williams@email.com',
      ticketId: 'TKT-001235',
      route: 'North District → South Plaza',
      seatNumber: 'B08',
      departureTime: '10:15 AM',
      status: 'pending',
      bookingDate: '2025-01-14'
    },
    {
      id: 3,
      name: 'Carol Davis',
      phone: '+1 555-0789',
      email: 'carol.davis@email.com',
      ticketId: 'TKT-001236',
      route: 'Downtown → University',
      seatNumber: 'C15',
      departureTime: '02:45 PM',
      status: 'completed',
      bookingDate: '2025-01-13'
    },
    {
      id: 4,
      name: 'David Miller',
      phone: '+1 555-0321',
      email: 'david.miller@email.com',
      ticketId: 'TKT-001237',
      route: 'Airport → City Center',
      seatNumber: 'A05',
      departureTime: '06:20 PM',
      status: 'cancelled',
      bookingDate: '2025-01-12'
    }
  ];

  const filteredPassengers = mockPassengers.filter(passenger => {
    const matchesSearch = passenger.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         passenger.ticketId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         passenger.route.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || passenger.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'completed': return 'bg-purple-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const stats = [
    { label: 'Total Passengers', value: '2,847', icon: Users, color: 'text-purple-600' },
    { label: 'Active Bookings', value: '156', icon: Ticket, color: 'text-green-500' },
    { label: 'Completed Trips', value: '2,691', icon: MapPin, color: 'text-blue-500' },
    { label: 'This Month', value: '324', icon: Clock, color: 'text-orange-500' }
  ];

  return (
    <div className="animate-in fade-in-up duration-700">
      {/* Header */}
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
          <span className="bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
            Passenger Management
          </span>
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
          Manage passenger bookings, track journeys, and provide exceptional service
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

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6 animate-in fade-in-up duration-700" style={{ animationDelay: '400ms' }}>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search passengers, tickets, or routes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-card/60 backdrop-blur-sm border-border/30 focus:border-purple-500 focus:bg-card/80 transition-all duration-300"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {['all', 'confirmed', 'pending', 'completed', 'cancelled'].map((status) => (
            <Button
              key={status}
              variant={filterStatus === status ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus(status)}
              className={filterStatus === status ? 
                "bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700" : 
                "border-border/30 text-muted-foreground hover:border-purple-500/50 hover:bg-purple-500/10 bg-card/60 backdrop-blur-sm"
              }
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Passengers List */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 animate-in fade-in-up duration-700" style={{ animationDelay: '600ms' }}>
        {filteredPassengers.map((passenger, index) => (
          <Card key={passenger.id} className="bg-card/60 backdrop-blur-sm border border-border/30 hover:border-purple-500/30 hover:bg-card/80 transition-all duration-300 hover:shadow-lg animate-in fade-in-up" style={{ animationDelay: `${(index + 1) * 100}ms` }}>
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-3">
                    <h3 className="font-semibold text-lg text-foreground">{passenger.name}</h3>
                    <Badge className={`${getStatusColor(passenger.status)} text-white w-fit`}>
                      {passenger.status.charAt(0).toUpperCase() + passenger.status.slice(1)}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Ticket className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Ticket:</span>
                      <span className="font-medium">{passenger.ticketId}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Route:</span>
                      <span className="font-medium truncate">{passenger.route}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Departure:</span>
                      <span className="font-medium">{passenger.departureTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Seat:</span>
                      <span className="font-medium">{passenger.seatNumber}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-2 mt-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{passenger.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground truncate">{passenger.email}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-border/30 hover:border-purple-500/50 hover:bg-purple-500/10 bg-card/60 backdrop-blur-sm"
                  >
                    View Details
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-purple-500 hover:bg-purple-500/10"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPassengers.length === 0 && (
        <div className="text-center py-12 animate-in fade-in duration-500">
          <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">No passengers found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default PassengersPortal;