import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Users, 
  Ticket, 
  MapPin, 
  Clock,
  Phone,
  Mail,
  MoreVertical,
  Filter,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  RefreshCw,
  Download,
  Eye,
  Edit,
  Trash2,
  LogOut,
  AlertCircle,
  X,
  User,
  Calendar,
  DollarSign,
  Bus,
  Package
} from 'lucide-react';
import { Button } from '../components/ui/button.jsx';
import { Input } from '../components/ui/input.jsx';
import { Card, CardContent } from '../components/ui/card.jsx';
import { Badge } from '../components/ui/badge.jsx';

// Skeleton Components
const SkeletonRow = () => (
  <tr className="border-b border-purple-500/20 animate-pulse">
    <td className="p-4">
      <div className="space-y-2">
        <div className="h-4 bg-muted-foreground/20 rounded w-32"></div>
        <div className="h-3 bg-muted-foreground/20 rounded w-24"></div>
        <div className="h-3 bg-muted-foreground/20 rounded w-16"></div>
      </div>
    </td>
    <td className="p-4">
      <div className="space-y-2">
        <div className="h-4 bg-muted-foreground/20 rounded w-28"></div>
        <div className="h-4 bg-muted-foreground/20 rounded w-24"></div>
        <div className="h-4 bg-muted-foreground/20 rounded w-16"></div>
      </div>
    </td>
    <td className="p-4">
      <div className="space-y-2">
        <div className="h-4 bg-muted-foreground/20 rounded w-32"></div>
        <div className="h-4 bg-muted-foreground/20 rounded w-28"></div>
        <div className="h-3 bg-muted-foreground/20 rounded w-20"></div>
      </div>
    </td>
    <td className="p-4">
      <div className="h-6 bg-muted-foreground/20 rounded-full w-16"></div>
    </td>
    <td className="p-4">
      <div className="h-6 bg-muted-foreground/20 rounded-full w-20"></div>
    </td>
    <td className="p-4">
      <div className="h-8 bg-muted-foreground/20 rounded w-8"></div>
    </td>
  </tr>
);

const SkeletonStats = () => (
  <Card className="bg-card/60 backdrop-blur-sm border-2 border-purple-200/30 dark:border-purple-800/30 animate-pulse">
    <CardContent className="p-4 sm:p-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-4 bg-muted-foreground/20 rounded w-24 mb-2"></div>
          <div className="h-8 bg-muted-foreground/20 rounded w-16"></div>
        </div>
        <div className="h-8 w-8 bg-muted-foreground/20 rounded"></div>
      </div>
    </CardContent>
  </Card>
);

// Authentication Error Component
const AuthenticationError = ({ onRetryLogin }) => (
  <div className="flex flex-col items-center justify-center py-16 px-4">
    <div className="bg-red-50 dark:bg-red-950/30 border-2 border-red-200 dark:border-red-800 rounded-2xl p-8 max-w-md text-center">
      <LogOut className="h-16 w-16 text-red-500 mx-auto mb-4" />
      <h3 className="text-xl font-bold text-red-800 dark:text-red-200 mb-2">
        Authentication Required
      </h3>
      <p className="text-red-600 dark:text-red-300 mb-6">
        You need to login again to access passenger data. Your session may have expired.
      </p>
      <Button 
        onClick={onRetryLogin}
        className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-sm"
      >
        Login Again
      </Button>
    </div>
  </div>
);

// Passenger Details Modal
const PassengerDetailsModal = ({ passenger, isOpen, onClose }) => {
  if (!isOpen || !passenger) return null;

  const getStatusColor = (status) => {
    if (!status) return "bg-gray-500/20 text-gray-400 border-gray-500/50";
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-500 text-white";
      case "completed":
        return "bg-blue-500 text-white";
      case "pending":
        return "bg-yellow-500 text-white";
      case "cancelled":
        return "bg-red-500 text-white";
      case "confirmed":
        return "bg-purple-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getBusTypeColor = (busType) => {
    if (!busType) return "bg-gray-500/20 text-gray-400 border-gray-500/50";
    switch (busType.toLowerCase()) {
      case "ac":
        return "bg-blue-500 text-white";
      case "non ac":
        return "bg-green-500 text-white";
      case "ac sleeper":
        return "bg-purple-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card/95 backdrop-blur-md border-2 border-purple-200/30 dark:border-purple-800/30 rounded-2xl max-w-4xl w-full max-h-[85vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
              Passenger Details
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground hover:bg-purple-500/10"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Passenger Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-purple-600 dark:text-purple-400 flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </h3>
              <div className="bg-card/50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Name:</span>
                  <span className="font-medium">{passenger.passengerName || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phone:</span>
                  <span className="font-medium">{passenger.phoneNumber || 'N/A'}</span>
                </div>
                {passenger.age && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Age:</span>
                    <span className="font-medium">{passenger.age} years</span>
                  </div>
                )}
                {passenger.gender && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Gender:</span>
                    <span className="font-medium">{passenger.gender}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Ticket Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-purple-600 dark:text-purple-400 flex items-center gap-2">
                <Ticket className="h-5 w-5" />
                Ticket Information
              </h3>
              <div className="bg-card/50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ticket Number:</span>
                  <span className="font-medium">{passenger.ticketNumber || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">PNR:</span>
                  <span className="font-medium">{passenger.pnr || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Seat Number:</span>
                  <span className="font-medium">{passenger.seatNumber || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge className={`${getStatusColor(passenger.status || "Confirmed")}`}>
                    {passenger.status || 'Confirmed'}
                  </Badge>
                </div>
                {passenger.ticketPrice && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ticket Price:</span>
                    <span className="font-medium text-green-600 dark:text-green-400">
                      ₹{passenger.ticketPrice}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Journey Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-purple-600 dark:text-purple-400 flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Journey Information
              </h3>
              <div className="bg-card/50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">From:</span>
                  <span className="font-medium">{passenger.boardingPoint || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">To:</span>
                  <span className="font-medium">{passenger.droppingPoint || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date:</span>
                  <span className="font-medium">{passenger.date || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time:</span>
                  <span className="font-medium">{passenger.time || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Bus Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-purple-600 dark:text-purple-400 flex items-center gap-2">
                <Bus className="h-5 w-5" />
                Bus Information
              </h3>
              <div className="bg-card/50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Operator:</span>
                  <span className="font-medium">{passenger.operatorName || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Bus Type:</span>
                  <Badge className={`${getBusTypeColor(passenger.busType)}`}>
                    {passenger.busType || 'N/A'}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 mt-6 pt-6 border-t border-border/30">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="border-2 border-purple-200/30 hover:border-purple-400/60 dark:border-purple-800/30 dark:hover:border-purple-600/60"
            >
              Close
            </Button>
            <Button className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white">
              <Edit className="h-4 w-4 mr-2" />
              Edit Details
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const PassengersPortal = () => {
  const navigate = useNavigate();
  
  // State Management
  const [passengers, setPassengers] = useState([]);
  const [filteredPassengers, setFilteredPassengers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authError, setAuthError] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedDate, setSelectedDate] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  
  // Modal State
  const [selectedPassenger, setSelectedPassenger] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  
  // Stats
  const [stats, setStats] = useState({
    totalPassengers: 0,
    activeBookings: 0,
    completedTrips: 0,
    thisMonth: 0
  });

  // API Configuration
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  
  // Check and get token from localStorage
  const getToken = useCallback(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setAuthError(true);
      return null;
    }
    return token;
  }, []);

  // Handle authentication error
  const handleAuthError = useCallback(() => {
    localStorage.removeItem('token');
    setAuthError(true);
  }, []);

  // Retry login
  const handleRetryLogin = useCallback(() => {
    localStorage.removeItem('token');
    navigate('/login');
  }, [navigate]);

  // Fetch Passengers
  const fetchPassengers = useCallback(async (showLoader = true) => {
    try {
      if (showLoader) setLoading(true);
      setError(null);

      const token = getToken();
      if (!token) {
        return;
      }

      const response = await fetch(`${API_BASE_URL}/passenger`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          handleAuthError();
          return;
        }
        throw new Error('Failed to fetch passengers');
      }

      const data = await response.json();
      
      // Handle the response - based on your Next.js code, it's a direct array
      if (Array.isArray(data)) {
        setPassengers(data);
        setFilteredPassengers(data);
        
        // Calculate stats
        setStats({
          totalPassengers: data.length,
          activeBookings: data.filter(p => p.status?.toLowerCase() === 'active' || p.status?.toLowerCase() === 'confirmed').length,
          completedTrips: data.filter(p => p.status?.toLowerCase() === 'completed').length,
          thisMonth: data.filter(p => {
            const passengerDate = new Date(p.date);
            const now = new Date();
            return passengerDate.getMonth() === now.getMonth() && passengerDate.getFullYear() === now.getFullYear();
          }).length
        });
      } else {
        throw new Error('Invalid response format');
      }
      
    } catch (error) {
      console.error('Error fetching passengers:', error);
      
      if (authError) {
        return;
      }
      
      setError(error.message || 'Failed to fetch passengers. Please check your connection and try again.');
      setPassengers([]);
      setFilteredPassengers([]);
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL, getToken, handleAuthError, authError]);

  // Filter passengers
  useEffect(() => {
    if (!passengers.length) return;

    const filtered = passengers.filter((passenger) => {
      const matchesSearch = !searchTerm || (
        passenger.passengerName?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
        passenger.ticketNumber?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
        passenger.boardingPoint?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
        passenger.droppingPoint?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
        passenger.phoneNumber?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
        passenger.pnr?.toLowerCase()?.includes(searchTerm.toLowerCase())
      );

      const matchesDate = dateFilter === 'all' || 
        (dateFilter === 'specific' && selectedDate && passenger.date === selectedDate);

      return matchesSearch && matchesDate;
    });

    setFilteredPassengers(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  }, [searchTerm, dateFilter, selectedDate, passengers]);

  // Pagination
  const totalPages = Math.ceil(filteredPassengers.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentPassengers = filteredPassengers.slice(startIndex, endIndex);

  // Pagination Handlers
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setCurrentPage(page);
    }
  };

  const goToFirstPage = () => goToPage(1);
  const goToLastPage = () => goToPage(totalPages);
  const goToPreviousPage = () => goToPage(currentPage - 1);
  const goToNextPage = () => goToPage(currentPage + 1);

  // Modal Handlers
  const handleViewDetails = (passenger) => {
    setSelectedPassenger(passenger);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPassenger(null);
  };

  // Refresh Data
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchPassengers(false);
    setRefreshing(false);
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = [
      'Ticket Number',
      'Passenger Name',
      'Seat Number',
      'Boarding Point',
      'Dropping Point',
      'Date',
      'Time',
      'Operator',
      'Bus Type',
      'Phone',
      'PNR',
    ].join(',');

    const rows = filteredPassengers
      .map((passenger) =>
        [
          passenger.ticketNumber || 'N/A',
          passenger.passengerName || 'N/A',
          passenger.seatNumber || 'N/A',
          passenger.boardingPoint || 'N/A',
          passenger.droppingPoint || 'N/A',
          passenger.date || 'N/A',
          passenger.time || 'N/A',
          passenger.operatorName || 'N/A',
          passenger.busType || 'N/A',
          passenger.phoneNumber || 'N/A',
          passenger.pnr || 'N/A',
        ].join(',')
      )
      .join('\
');

    const csvContent = `${headers}\
${rows}`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `passengers_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Initial Data Load
  useEffect(() => {
    const token = getToken();
    if (!token) {
      setAuthError(true);
      setLoading(false);
      return;
    }

    fetchPassengers();
  }, [fetchPassengers, getToken]);

  // Helper Functions
  const getStatusColor = (status) => {
    if (!status) return "bg-gray-500 text-white";
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-500 text-white";
      case "completed":
        return "bg-blue-500 text-white";
      case "pending":
        return "bg-yellow-500 text-white";
      case "cancelled":
        return "bg-red-500 text-white";
      case "confirmed":
        return "bg-purple-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getBusTypeColor = (busType) => {
    if (!busType) return "bg-gray-500 text-white";
    switch (busType.toLowerCase()) {
      case "ac":
        return "bg-blue-500 text-white";
      case "non ac":
        return "bg-green-500 text-white";
      case "ac sleeper":
        return "bg-purple-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const statsConfig = [
    { 
      label: 'Total Passengers', 
      value: stats.totalPassengers?.toLocaleString() || '0', 
      icon: Users, 
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-950'
    },
    { 
      label: 'Active Bookings', 
      value: stats.activeBookings?.toLocaleString() || '0', 
      icon: Ticket, 
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-950'
    },
    { 
      label: 'Completed Trips', 
      value: stats.completedTrips?.toLocaleString() || '0', 
      icon: MapPin, 
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-950'
    },
    { 
      label: 'This Month', 
      value: stats.thisMonth?.toLocaleString() || '0', 
      icon: Clock, 
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-100 dark:bg-orange-950'
    }
  ];

  // Show authentication error if not logged in
  if (authError) {
    return <AuthenticationError onRetryLogin={handleRetryLogin} />;
  }

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
        {loading ? (
          [...Array(4)].map((_, i) => <SkeletonStats key={i} />)
        ) : (
          statsConfig.map((stat, index) => (
            <Card key={index} className="group bg-card/60 backdrop-blur-sm border-2 border-purple-200/30 hover:border-purple-400/60 dark:border-purple-800/30 dark:hover:border-purple-600/60 hover:bg-card/80 transition-all duration-300 hover:scale-105 shadow-sm hover:shadow-md hover:shadow-purple-500/10" data-testid={`stat-card-${index}`}>
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300">{stat.label}</p>
                    <p className="text-2xl sm:text-3xl font-bold text-foreground">{stat.value}</p>
                  </div>
                  <div className={`p-2 rounded-lg ${stat.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className={`h-6 w-6 sm:h-8 sm:w-8 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6 animate-in fade-in-up duration-700" style={{ animationDelay: '400ms' }}>
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, ticket, PNR, phone, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-card/60 backdrop-blur-sm border-2 border-purple-200/30 focus:border-purple-400/60 dark:border-purple-800/30 dark:focus:border-purple-600/60 focus:bg-card/80 transition-all duration-300"
            data-testid="search-input"
          />
        </div>

        {/* Date Filter */}
        <div className="flex gap-2">
          <select
            value={dateFilter}
            onChange={(e) => {
              setDateFilter(e.target.value);
              if (e.target.value !== 'specific') {
                setSelectedDate('');
              }
            }}
            className="bg-card/60 backdrop-blur-sm border-2 border-purple-200/30 hover:border-purple-400/60 dark:border-purple-800/30 dark:hover:border-purple-600/60 text-foreground rounded-md px-3 py-2 text-sm transition-all duration-300"
          >
            <option value="all">All Dates</option>
            <option value="specific">Specific Date</option>
          </select>

          {dateFilter === 'specific' && (
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-card/60 backdrop-blur-sm border-2 border-purple-200/30 hover:border-purple-400/60 dark:border-purple-800/30 dark:hover:border-purple-600/60 transition-all duration-300"
            />
          )}

          <Button
            onClick={handleRefresh}
            disabled={refreshing || loading}
            variant="outline"
            size="sm"
            className="border-2 border-purple-200/30 hover:border-purple-400/60 dark:border-purple-800/30 dark:hover:border-purple-600/60 text-muted-foreground hover:text-foreground hover:bg-purple-50/50 dark:hover:bg-purple-950/30 bg-card/60 backdrop-blur-sm transition-all duration-300"
            data-testid="refresh-button"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>

          <Button
            onClick={exportToCSV}
            variant="outline"
            size="sm"
            className="border-2 border-purple-200/30 hover:border-purple-400/60 dark:border-purple-800/30 dark:hover:border-purple-600/60 text-muted-foreground hover:text-foreground hover:bg-purple-50/50 dark:hover:bg-purple-950/30 bg-card/60 backdrop-blur-sm transition-all duration-300"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Error State */}
      {error && !loading && (
        <div className="text-center py-12 animate-in fade-in duration-500">
          <div className="bg-red-50 dark:bg-red-950/30 border-2 border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md mx-auto">
            <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400 mx-auto mb-2" />
            <div className="text-red-600 dark:text-red-400 mb-2 font-semibold">Error</div>
            <p className="text-red-800 dark:text-red-200 mb-4">{error}</p>
            <Button onClick={handleRefresh} className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white" variant="default">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      )}

      {/* Passengers Table */}
      <Card className="bg-card/60 backdrop-blur-sm border-2 border-purple-200/30 dark:border-purple-800/30 rounded-xl overflow-hidden animate-in fade-in-up duration-700" style={{ animationDelay: '600ms' }}>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-purple-500/30">
                  <th className="text-left p-4 font-semibold text-foreground">Passenger</th>
                  <th className="text-left p-4 font-semibold text-foreground">Ticket Details</th>
                  <th className="text-left p-4 font-semibold text-foreground">Journey</th>
                  <th className="text-left p-4 font-semibold text-foreground">Bus Type</th>
                  <th className="text-left p-4 font-semibold text-foreground">Status</th>
                  <th className="text-left p-4 font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  [...Array(pageSize)].map((_, i) => <SkeletonRow key={i} />)
                ) : currentPassengers.length > 0 ? (
                  currentPassengers.map((passenger, index) => (
                    <tr
                      key={`${passenger.ticketNumber}-${index}`}
                      className={`border-b border-purple-500/20 hover:bg-purple-50/50 dark:hover:bg-purple-950/30 transition-colors ${
                        index % 2 === 0 ? "bg-card/20" : "bg-transparent"
                      }`}
                      data-testid={`passenger-row-${index}`}
                    >
                      <td className="p-4">
                        <div>
                          <div className="font-medium text-foreground">{passenger.passengerName || "N/A"}</div>
                          <div className="text-sm text-muted-foreground">{passenger.phoneNumber || "N/A"}</div>
                          {passenger.age && passenger.gender && (
                            <div className="text-xs text-muted-foreground">
                              {passenger.age}yrs • {passenger.gender}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          <div className="text-foreground">
                            <span className="text-muted-foreground">Ticket: </span>
                            {passenger.ticketNumber || "N/A"}
                          </div>
                          <div className="text-foreground">
                            <span className="text-muted-foreground">PNR: </span>
                            {passenger.pnr || "N/A"}
                          </div>
                          <div className="text-foreground">
                            <span className="text-muted-foreground">Seat: </span>
                            {passenger.seatNumber || "N/A"}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          <div className="text-foreground">
                            <span className="text-muted-foreground">From: </span>
                            {passenger.boardingPoint || "N/A"}
                          </div>
                          <div className="text-foreground">
                            <span className="text-muted-foreground">To: </span>
                            {passenger.droppingPoint || "N/A"}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {passenger.date || "N/A"} • {passenger.time || "N/A"}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge className={`${getBusTypeColor(passenger.busType)}`}>
                          {passenger.busType || "N/A"}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Badge className={`${getStatusColor(passenger.status || "Confirmed")}`}>
                          {passenger.status || "Confirmed"}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-2 border-purple-200/30 hover:border-purple-400/60 dark:border-purple-800/30 dark:hover:border-purple-600/60 hover:bg-purple-50/50 dark:hover:bg-purple-950/30 bg-card/60 backdrop-blur-sm transition-all duration-300"
                          onClick={() => handleViewDetails(passenger)}
                          data-testid={`view-details-${index}`}
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="p-8 text-center">
                      <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-foreground mb-2">No passengers found</h3>
                      <p className="text-muted-foreground">
                        {searchTerm || dateFilter !== 'all' 
                          ? 'Try adjusting your search or filter criteria'
                          : 'No passenger data available at the moment'
                        }
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {!loading && !error && totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-border/30">
          <div className="text-sm text-muted-foreground">
            Showing {currentPassengers.length > 0 ? startIndex + 1 : 0} to {Math.min(endIndex, filteredPassengers.length)} of {filteredPassengers.length} passengers
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={goToFirstPage}
              disabled={currentPage === 1}
              className="border-2 border-purple-200/30 hover:border-purple-400/60 dark:border-purple-800/30 dark:hover:border-purple-600/60 disabled:opacity-50 disabled:cursor-not-allowed bg-card/60 backdrop-blur-sm transition-all duration-300"
              data-testid="pagination-first"
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className="border-2 border-purple-200/30 hover:border-purple-400/60 dark:border-purple-800/30 dark:hover:border-purple-600/60 disabled:opacity-50 disabled:cursor-not-allowed bg-card/60 backdrop-blur-sm transition-all duration-300"
              data-testid="pagination-prev"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="flex items-center gap-1">
              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                const pageNum = Math.max(1, Math.min(currentPage - 2 + i, totalPages - 4 + i));
                if (pageNum > totalPages || pageNum < 1) return null;
                
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => goToPage(pageNum)}
                    className={currentPage === pageNum ? 
                      "bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700 shadow-sm" : 
                      "border-2 border-purple-200/30 hover:border-purple-400/60 dark:border-purple-800/30 dark:hover:border-purple-600/60 bg-card/60 backdrop-blur-sm transition-all duration-300"
                    }
                    data-testid={`pagination-${pageNum}`}
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="border-2 border-purple-200/30 hover:border-purple-400/60 dark:border-purple-800/30 dark:hover:border-purple-600/60 disabled:opacity-50 disabled:cursor-not-allowed bg-card/60 backdrop-blur-sm transition-all duration-300"
              data-testid="pagination-next"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={goToLastPage}
              disabled={currentPage === totalPages}
              className="border-2 border-purple-200/30 hover:border-purple-400/60 dark:border-purple-800/30 dark:hover:border-purple-600/60 disabled:opacity-50 disabled:cursor-not-allowed bg-card/60 backdrop-blur-sm transition-all duration-300"
              data-testid="pagination-last"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Passenger Details Modal */}
      <PassengerDetailsModal 
        passenger={selectedPassenger}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default PassengersPortal;