import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  RefreshCw,
  Download,
  MoreVertical,
  Users,
  Bus,
  MapPin,
  Phone,
  Calendar,
  Clock,
  AlertCircle,
  LogOut,
  X,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight
} from 'lucide-react';
import { Button } from '../components/ui/button.jsx';
import { Input } from '../components/ui/input.jsx';
import { Card, CardContent } from '../components/ui/card.jsx';
import { Badge } from '../components/ui/badge.jsx';

// Authentication Error Component
const AuthenticationError = ({ onRetryLogin }) => (
  <div className="flex flex-col items-center justify-center py-16 px-4">
    <div className="bg-red-50 dark:bg-red-950/30 border-2 border-red-200 dark:border-red-800 rounded-2xl p-8 max-w-md text-center shadow-xl">
      <LogOut className="h-16 w-16 text-red-500 mx-auto mb-4" />
      <h3 className="text-xl font-bold text-red-800 dark:text-red-200 mb-2">
        Authentication Required
      </h3>
      <p className="text-red-600 dark:text-red-300 mb-6">
        You need to login again to access passenger data. Your session may have expired.
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

// Loading Skeleton Row Component
const SkeletonRow = () => (
  <tr className="border-b border-purple-500/20 animate-pulse">
    <td className="p-6">
      <div className="space-y-2">
        <div className="h-4 bg-purple-200/30 dark:bg-purple-800/30 rounded w-32"></div>
        <div className="h-3 bg-purple-200/20 dark:bg-purple-800/20 rounded w-24"></div>
        <div className="h-3 bg-purple-200/20 dark:bg-purple-800/20 rounded w-16"></div>
      </div>
    </td>
    <td className="p-6">
      <div className="space-y-2">
        <div className="h-4 bg-purple-200/30 dark:bg-purple-800/30 rounded w-24"></div>
        <div className="h-3 bg-purple-200/20 dark:bg-purple-800/20 rounded w-20"></div>
        <div className="h-3 bg-purple-200/20 dark:bg-purple-800/20 rounded w-18"></div>
      </div>
    </td>
    <td className="p-6">
      <div className="space-y-2">
        <div className="h-4 bg-purple-200/30 dark:bg-purple-800/30 rounded w-28"></div>
        <div className="h-3 bg-purple-200/20 dark:bg-purple-800/20 rounded w-24"></div>
        <div className="h-3 bg-purple-200/20 dark:bg-purple-800/20 rounded w-20"></div>
      </div>
    </td>
    <td className="p-6">
      <div className="h-6 bg-purple-200/30 dark:bg-purple-800/30 rounded-full w-16"></div>
    </td>
    <td className="p-6">
      <div className="h-6 bg-purple-200/30 dark:bg-purple-800/30 rounded-full w-20"></div>
    </td>
    <td className="p-6">
      <div className="h-8 bg-purple-200/30 dark:bg-purple-800/30 rounded w-10"></div>
    </td>
  </tr>
);

// Passenger Details Modal Component
const PassengerDetailsModal = ({ passenger, isOpen, onClose }) => {
  if (!isOpen || !passenger) return null;

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

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-gray-800 backdrop-blur-sm rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-purple-200 dark:border-purple-700">
        <div className="sticky top-0 bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Passenger Details</h2>
            <Button 
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 rounded-full p-2"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="p-8 space-y-8">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-purple-600 dark:text-purple-400 flex items-center gap-2">
              <Users className="h-5 w-5" />
              Personal Information
            </h3>
            <div className="bg-gray-50 dark:bg-gray-750 rounded-xl p-6 space-y-4 border border-purple-200 dark:border-purple-700">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400 font-medium">Name:</span>
                <span className="font-semibold text-gray-800 dark:text-gray-100">{passenger.passengerName || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400 font-medium">Phone:</span>
                <span className="font-semibold text-gray-800 dark:text-gray-100">{passenger.phoneNumber || 'N/A'}</span>
              </div>
              {passenger.age && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400 font-medium">Age:</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-100">{passenger.age} years</span>
                </div>
              )}
              {passenger.gender && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400 font-medium">Gender:</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-100">{passenger.gender}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400 font-medium">Status:</span>
                <Badge className={`${getStatusColor(passenger.status || "Confirmed")} font-medium px-3 py-1`}>
                  {passenger.status || 'Confirmed'}
                </Badge>
              </div>
              {passenger.ticketPrice && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400 font-medium">Ticket Price:</span>
                  <span className="font-semibold text-green-600 dark:text-green-400 text-lg">
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
            <div className="bg-gray-50 dark:bg-gray-750 rounded-xl p-6 space-y-4 border border-purple-200 dark:border-purple-700">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400 font-medium">From:</span>
                <span className="font-semibold text-gray-800 dark:text-gray-100">{passenger.boardingPoint || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400 font-medium">To:</span>
                <span className="font-semibold text-gray-800 dark:text-gray-100">{passenger.droppingPoint || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400 font-medium flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-purple-500" />
                  Date:
                </span>
                <span className="font-semibold text-gray-800 dark:text-gray-100">{passenger.date || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400 font-medium flex items-center gap-1">
                  <Clock className="h-4 w-4 text-purple-500" />
                  Time:
                </span>
                <span className="font-semibold text-gray-800 dark:text-gray-100">{passenger.time || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Bus Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-purple-600 dark:text-purple-400 flex items-center gap-2">
              <Bus className="h-5 w-5" />
              Bus Information
            </h3>
            <div className="bg-gray-50 dark:bg-gray-750 rounded-xl p-6 space-y-4 border border-purple-200 dark:border-purple-700">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400 font-medium">Operator:</span>
                <span className="font-semibold text-gray-800 dark:text-gray-100">{passenger.operatorName || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400 font-medium">Bus Type:</span>
                <Badge className={`${getBusTypeColor(passenger.busType)} font-medium px-3 py-1`}>
                  {passenger.busType || 'N/A'}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 p-6 bg-gray-50 dark:bg-gray-750 rounded-b-2xl border-t border-purple-200 dark:border-purple-700">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="border-2 border-purple-200 hover:border-purple-400 dark:border-purple-700 dark:hover:border-purple-500 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950/30 font-medium px-6"
          >
            Close
          </Button>
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

  // API Configuration
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || process.env.REACT_APP_BACKEND_URL;
  
  // Check and get token from localStorage
  const getToken = useCallback(() => {
    const token = localStorage.getItem('operatortoken');
    if (!token) {
      setAuthError(true);
      navigate('/login');
      return null;
    }
    return token;
  }, [navigate]);

  // Handle authentication error
  const handleAuthError = useCallback(() => {
    localStorage.removeItem('operatortoken');
    setAuthError(true);
    navigate('/login');
  }, [navigate]);

  // Retry login
  const handleRetryLogin = useCallback(() => {
    localStorage.removeItem('operatortoken');
    navigate('/login');
  }, [navigate]);

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem('operatortoken');
    if (!token) {
      navigate('/login');
      return;
    }
  }, [navigate]);

  // Fetch Passengers
  const fetchPassengers = useCallback(async (showLoader = true) => {
    if (!API_BASE_URL) {
      setError('API configuration is missing');
      return;
    }

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

  // Generate pagination numbers with proper logic
  const getPaginationNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots.filter((item, index, arr) => arr.indexOf(item) === index);
  };

  // Show authentication error if not logged in
  if (authError) {
    return <AuthenticationError onRetryLogin={handleRetryLogin} />;
  }

  return (
    <div className="animate-in fade-in-up duration-700">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
            <span className="bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 bg-clip-text text-transparent">
              Passenger Management Portal
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Manage passenger bookings, track journeys, and provide exceptional service with our comprehensive system
          </p>
        </div>

        {/* Controls Bar */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8 animate-in fade-in-up duration-700" style={{ animationDelay: '200ms' }}>
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-500" />
            <Input
              placeholder="Search by name, ticket, PNR, phone, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 bg-white border-2 border-purple-200 hover:border-purple-400 focus:border-purple-500 dark:bg-gray-700 dark:border-purple-600 dark:hover:border-purple-500 dark:focus:border-purple-400 transition-all duration-300 text-gray-800 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 rounded-lg shadow-sm focus:shadow-md py-3"
              data-testid="search-input"
            />
          </div>

          {/* Date Filter */}
          <div className="flex gap-3">
            <select
              value={dateFilter}
              onChange={(e) => {
                setDateFilter(e.target.value);
                if (e.target.value !== 'specific') {
                  setSelectedDate('');
                }
              }}
              className="bg-white border-2 border-purple-200 hover:border-purple-400 focus:border-purple-500 dark:bg-gray-700 dark:border-purple-600 dark:hover:border-purple-500 dark:focus:border-purple-400 text-gray-800 dark:text-gray-100 rounded-lg px-4 py-3 text-sm transition-all duration-300 shadow-sm focus:shadow-md font-medium"
            >
              <option value="all">All Dates</option>
              <option value="specific">Specific Date</option>
            </select>

            {dateFilter === 'specific' && (
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-white border-2 border-purple-200 hover:border-purple-400 focus:border-purple-500 dark:bg-gray-700 dark:border-purple-600 dark:hover:border-purple-500 dark:focus:border-purple-400 transition-all duration-300 text-gray-800 dark:text-gray-100 rounded-lg shadow-sm focus:shadow-md"
              />
            )}

            <Button
              onClick={handleRefresh}
              disabled={refreshing || loading}
              variant="outline"
              size="sm"
              className="border-2 border-purple-200 hover:border-purple-400 dark:border-purple-600 dark:hover:border-purple-500 text-purple-700 dark:text-purple-300 hover:text-purple-800 hover:bg-purple-50 dark:hover:bg-purple-950/30 bg-white dark:bg-gray-700 transition-all duration-300 font-medium px-4 rounded-lg shadow-sm hover:shadow-md"
              data-testid="refresh-button"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>

            <Button
              onClick={exportToCSV}
              variant="outline"
              size="sm"
              className="border-2 border-purple-200 hover:border-purple-400 dark:border-purple-600 dark:hover:border-purple-500 text-purple-700 dark:text-purple-300 hover:text-purple-800 hover:bg-purple-50 dark:hover:bg-purple-950/30 bg-white dark:bg-gray-700 transition-all duration-300 font-medium px-4 rounded-lg shadow-sm hover:shadow-md"
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-12 animate-in fade-in duration-500 mb-8">
            <div className="bg-red-50 dark:bg-red-950/40 border-2 border-red-200 dark:border-red-800/50 rounded-xl p-8 max-w-md mx-auto shadow-lg">
              <AlertCircle className="h-12 w-12 text-red-600 dark:text-red-400 mx-auto mb-4" />
              <div className="text-red-600 dark:text-red-400 mb-2 font-semibold text-lg">Error Loading Data</div>
              <p className="text-red-800 dark:text-red-200 mb-6">{error}</p>
              <Button onClick={handleRefresh} className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg" variant="default">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </div>
          </div>
        )}

        {/* Passengers Table */}
        <Card className="bg-white dark:bg-gray-800 border-2 border-purple-200 dark:border-purple-700 rounded-2xl overflow-hidden shadow-xl animate-in fade-in-up duration-700 transition-all duration-300 hover:shadow-2xl" style={{ animationDelay: '400ms' }}>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-750">
                  <tr className="border-b-2 border-purple-200 dark:border-purple-600">
                    <th className="text-left p-6 font-bold text-gray-700 dark:text-gray-200 text-sm uppercase tracking-wider">Passenger</th>
                    <th className="text-left p-6 font-bold text-gray-700 dark:text-gray-200 text-sm uppercase tracking-wider">Ticket Details</th>
                    <th className="text-left p-6 font-bold text-gray-700 dark:text-gray-200 text-sm uppercase tracking-wider">Journey</th>
                    <th className="text-left p-6 font-bold text-gray-700 dark:text-gray-200 text-sm uppercase tracking-wider">Bus Type</th>
                    <th className="text-left p-6 font-bold text-gray-700 dark:text-gray-200 text-sm uppercase tracking-wider">Status</th>
                    <th className="text-left p-6 font-bold text-gray-700 dark:text-gray-200 text-sm uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800">
                  {loading ? (
                    [...Array(pageSize)].map((_, i) => <SkeletonRow key={i} />)
                  ) : currentPassengers.length > 0 ? (
                    currentPassengers.map((passenger, index) => (
                      <tr
                        key={`${passenger.ticketNumber}-${index}`}
                        className={`border-b border-gray-100 dark:border-gray-700 hover:bg-purple-50 dark:hover:bg-purple-950/20 transition-colors duration-200 ${
                          index % 2 === 0 ? "bg-gray-50/30 dark:bg-gray-750/30" : "bg-white dark:bg-gray-800"
                        }`}
                        data-testid={`passenger-row-${index}`}
                      >
                        <td className="p-6">
                          <div>
                            <div className="font-semibold text-gray-800 dark:text-gray-100 text-base">{passenger.passengerName || "N/A"}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {passenger.phoneNumber || "N/A"}
                            </div>
                            {passenger.age && passenger.gender && (
                              <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                {passenger.age}yrs • {passenger.gender}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-6">
                          <div className="space-y-1">
                            <div className="text-gray-800 dark:text-gray-100">
                              <span className="text-gray-600 dark:text-gray-400 font-medium text-xs uppercase tracking-wide">Ticket:</span>
                              <div className="font-semibold">{passenger.ticketNumber || "N/A"}</div>
                            </div>
                            <div className="text-gray-800 dark:text-gray-100">
                              <span className="text-gray-600 dark:text-gray-400 font-medium text-xs uppercase tracking-wide">PNR:</span>
                              <div className="font-semibold">{passenger.pnr || "N/A"}</div>
                            </div>
                            <div className="text-gray-800 dark:text-gray-100">
                              <span className="text-gray-600 dark:text-gray-400 font-medium text-xs uppercase tracking-wide">Seat:</span>
                              <div className="font-semibold">{passenger.seatNumber || "N/A"}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-6">
                          <div className="space-y-2">
                            <div className="text-gray-800 dark:text-gray-100">
                              <span className="text-gray-600 dark:text-gray-400 font-medium text-xs uppercase tracking-wide">From:</span>
                              <div className="font-semibold">{passenger.boardingPoint || "N/A"}</div>
                            </div>
                            <div className="text-gray-800 dark:text-gray-100">
                              <span className="text-gray-600 dark:text-gray-400 font-medium text-xs uppercase tracking-wide">To:</span>
                              <div className="font-semibold">{passenger.droppingPoint || "N/A"}</div>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3 text-purple-500" />
                                <span className="font-medium">{passenger.date || "N/A"}</span>
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3 text-purple-500" />
                                <span className="font-medium">{passenger.time || "N/A"}</span>
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="p-6">
                          <Badge className={`${getBusTypeColor(passenger.busType)} font-medium px-3 py-1 rounded-full`}>
                            {passenger.busType || "N/A"}
                          </Badge>
                        </td>
                        <td className="p-6">
                          <Badge className={`${getStatusColor(passenger.status || "Confirmed")} font-medium px-3 py-1 rounded-full`}>
                            {passenger.status || "Confirmed"}
                          </Badge>
                        </td>
                        <td className="p-6">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-2 border-purple-200 hover:border-purple-400 dark:border-purple-600 dark:hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-950/30 bg-white dark:bg-gray-700 transition-all duration-300 text-purple-700 dark:text-purple-300 hover:text-purple-800 rounded-lg shadow-sm hover:shadow-md"
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
                      <td colSpan="6" className="p-12 text-center">
                        <Users className="h-20 w-20 text-gray-400 dark:text-gray-500 mx-auto mb-6" />
                        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-3">No passengers found</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-lg">
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
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">
              Showing {currentPassengers.length > 0 ? startIndex + 1 : 0} to {Math.min(endIndex, filteredPassengers.length)} of {filteredPassengers.length} passengers
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={goToFirstPage}
                disabled={currentPage === 1}
                className="border-2 border-purple-200 hover:border-purple-400 dark:border-purple-700 dark:hover:border-purple-500 disabled:opacity-50 disabled:cursor-not-allowed bg-white dark:bg-gray-700 transition-all duration-300 rounded-lg"
                data-testid="pagination-first"
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className="border-2 border-purple-200 hover:border-purple-400 dark:border-purple-700 dark:hover:border-purple-500 disabled:opacity-50 disabled:cursor-not-allowed bg-white dark:bg-gray-700 transition-all duration-300 rounded-lg"
                data-testid="pagination-prev"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <div className="flex items-center gap-1">
                {totalPages <= 7 ? (
                  [...Array(totalPages)].map((_, i) => {
                    const pageNum = i + 1;
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => goToPage(pageNum)}
                        className={currentPage === pageNum ? 
                          "bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700 shadow-md rounded-lg" : 
                          "border-2 border-purple-200 hover:border-purple-400 dark:border-purple-700 dark:hover:border-purple-500 bg-white dark:bg-gray-700 transition-all duration-300 rounded-lg"
                        }
                        data-testid={`pagination-${pageNum}`}
                      >
                        {pageNum}
                      </Button>
                    );
                  })
                ) : (
                  getPaginationNumbers().map((pageNum, index) => {
                    if (pageNum === '...') {
                      return (
                        <span key={`dots-${index}`} className="px-2 py-1 text-gray-500 dark:text-gray-400">
                          ...
                        </span>
                      );
                    }
                    
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => goToPage(pageNum)}
                        className={currentPage === pageNum ? 
                          "bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700 shadow-md rounded-lg" : 
                          "border-2 border-purple-200 hover:border-purple-400 dark:border-purple-700 dark:hover:border-purple-500 bg-white dark:bg-gray-700 transition-all duration-300 rounded-lg"
                        }
                        data-testid={`pagination-${pageNum}`}
                      >
                        {pageNum}
                      </Button>
                    );
                  })
                )}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="border-2 border-purple-200 hover:border-purple-400 dark:border-purple-700 dark:hover:border-purple-500 disabled:opacity-50 disabled:cursor-not-allowed bg-white dark:bg-gray-700 transition-all duration-300 rounded-lg"
                data-testid="pagination-next"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={goToLastPage}
                disabled={currentPage === totalPages}
                className="border-2 border-purple-200 hover:border-purple-400 dark:border-purple-700 dark:hover:border-purple-500 disabled:opacity-50 disabled:cursor-not-allowed bg-white dark:bg-gray-700 transition-all duration-300 rounded-lg"
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
    </div>
  );
};

export default PassengersPortal;