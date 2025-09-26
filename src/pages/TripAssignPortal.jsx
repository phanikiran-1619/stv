import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Bus,
  MapPin,
  User,
  Users,
  Calendar,
  Clock,
  Trash2,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  LogOut
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
        You need to login again to access trip assignment data. Your session may have expired.
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

// Success Message Component
const SuccessMessage = ({ message, onClose }) => (
  <div className="fixed top-4 right-4 z-50">
    <div className="bg-green-500/90 dark:bg-green-600/90 text-white px-6 py-3 rounded-lg shadow-xl flex items-center space-x-2 animate-in slide-in-from-right duration-300 border border-green-400/20">
      <CheckCircle className="w-5 h-5" />
      <span className="font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 text-white/80 hover:text-white">
        ×
      </button>
    </div>
  </div>
);

// Loading Skeleton Component
const SkeletonRow = () => (
  <tr className="border-b border-purple-500/20 animate-pulse">
    <td className="p-4">
      <div className="space-y-2">
        <div className="h-4 bg-purple-200/30 dark:bg-purple-800/30 rounded w-32"></div>
        <div className="h-3 bg-purple-200/20 dark:bg-purple-800/20 rounded w-24"></div>
      </div>
    </td>
    <td className="p-4">
      <div className="h-4 bg-purple-200/30 dark:bg-purple-800/30 rounded w-24"></div>
    </td>
    <td className="p-4">
      <div className="h-4 bg-purple-200/30 dark:bg-purple-800/30 rounded w-28"></div>
    </td>
    <td className="p-4">
      <div className="h-4 bg-purple-200/30 dark:bg-purple-800/30 rounded w-32"></div>
    </td>
    <td className="p-4">
      <div className="h-6 bg-purple-200/30 dark:bg-purple-800/30 rounded-full w-16"></div>
    </td>
    <td className="p-4">
      <div className="space-y-1">
        <div className="h-3 bg-purple-200/30 dark:bg-purple-800/30 rounded w-20"></div>
        <div className="h-3 bg-purple-200/20 dark:bg-purple-800/20 rounded w-16"></div>
      </div>
    </td>
    <td className="p-4">
      <div className="space-y-2">
        <div className="h-4 bg-purple-200/30 dark:bg-purple-800/30 rounded w-24"></div>
        <div className="h-3 bg-purple-200/20 dark:bg-purple-800/20 rounded w-20"></div>
      </div>
    </td>
    <td className="p-4">
      <div className="h-8 bg-purple-200/30 dark:bg-purple-800/30 rounded w-8"></div>
    </td>
  </tr>
);

const TripAssignPortal = () => {
  const navigate = useNavigate();
  
  // State Management
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Form States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoute, setSelectedRoute] = useState('');
  const [selectedDriver, setSelectedDriver] = useState('');
  const [selectedBus, setSelectedBus] = useState('');
  const [selectedAttender, setSelectedAttender] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState('12:00');
  
  // Data States
  const [routes, setRoutes] = useState([]);
  const [buses, setBuses] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [attenders, setAttenders] = useState([]);
  const [assignments, setAssignments] = useState([]);
  
  // Filtered Available Resources
  const [availableDrivers, setAvailableDrivers] = useState([]);
  const [availableBuses, setAvailableBuses] = useState([]);
  const [availableAttenders, setAvailableAttenders] = useState([]);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  // API Configuration
  const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || process.env.REACT_APP_API_BASE_URL1;
  
  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  // Authentication functions
  const getToken = useCallback(() => {
    const token = localStorage.getItem('operatortoken');
    if (!token) {
      setAuthError(true);
      navigate('/login');
      return null;
    }
    return token;
  }, [navigate]);

  const handleAuthError = useCallback(() => {
    localStorage.removeItem('operatortoken');
    setAuthError(true);
    navigate('/login');
  }, [navigate]);

  const handleRetryLogin = useCallback(() => {
    localStorage.removeItem('operatortoken');
    navigate('/login');
  }, [navigate]);

  // Show success message
  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 4000);
  };

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem('operatortoken');
    if (!token) {
      navigate('/login');
      return;
    }
  }, [navigate]);

  // Fetch all dropdown data
  const fetchDropdownData = useCallback(async () => {
    if (!API_BASE_URL) {
      setError('API configuration is missing');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const token = getToken();
      if (!token) return;

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      };

      const [routesRes, busesRes, driversRes, attendersRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/routes`, { headers }),
        fetch(`${API_BASE_URL}/api/buses`, { headers }),
        fetch(`${API_BASE_URL}/api/drivers`, { headers }),
        fetch(`${API_BASE_URL}/api/attenders`, { headers }),
      ]);

      // Check for authentication errors
      if (routesRes.status === 401 || routesRes.status === 403) {
        handleAuthError();
        return;
      }

      if (!routesRes.ok || !busesRes.ok || !driversRes.ok || !attendersRes.ok) {
        throw new Error('Failed to fetch dropdown data');
      }

      const [routesData, busesData, driversData, attendersData] = await Promise.all([
        routesRes.json(),
        busesRes.json(),
        driversRes.json(),
        attendersRes.json(),
      ]);

      setRoutes(routesData || []);
      setBuses(busesData || []);
      setDrivers(driversData || []);
      setAttenders(attendersData || []);

    } catch (error) {
      console.error('Error fetching dropdown data:', error);
      setError('Failed to load dropdown data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [API_BASE_URL, getToken, handleAuthError]);

  // Fetch assignments
  const fetchAssignments = useCallback(async () => {
    if (!API_BASE_URL) {
      setError('API configuration is missing');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const token = getToken();
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/api/assignments`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 401 || response.status === 403) {
        handleAuthError();
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch assignments');
      }

      const data = await response.json();
      setAssignments(Array.isArray(data) ? data : []);

    } catch (error) {
      console.error('Error fetching assignments:', error);
      setError('Failed to load assignments. Please try again.');
      setAssignments([]);
    } finally {
      setIsLoading(false);
    }
  }, [API_BASE_URL, getToken, handleAuthError]);

  // Filter available resources based on date and time
  useEffect(() => {
    if (selectedDate && selectedTime) {
      const selectedDateTime = new Date(`${selectedDate}T${selectedTime}`).getTime();
      
      // Filter drivers
      const filteredDrivers = drivers.filter(driver => {
        const driverAssignments = assignments.filter(a => 
          a.driverId === driver.stvDriverId && 
          a.bookingDate === selectedDate
        );
        
        if (driverAssignments.length === 0) return true;
        
        return !driverAssignments.some(assignment => {
          const assignmentTime = new Date(`${assignment.bookingDate}T${assignment.time}`).getTime();
          return Math.abs(selectedDateTime - assignmentTime) < (14 * 60 * 60 * 1000); // 14 hours
        });
      });

      // Filter buses
      const filteredBuses = buses.filter(bus => {
        const busAssignments = assignments.filter(a => 
          a.busId === bus.stvBusId && 
          a.bookingDate === selectedDate
        );
        
        if (busAssignments.length === 0) return true;
        
        return !busAssignments.some(assignment => {
          const assignmentTime = new Date(`${assignment.bookingDate}T${assignment.time}`).getTime();
          return Math.abs(selectedDateTime - assignmentTime) < (14 * 60 * 60 * 1000);
        });
      });

      // Filter attenders
      const filteredAttenders = attenders.filter(attender => {
        const attenderAssignments = assignments.filter(a => 
          a.attenderId === attender.stvAttenderId && 
          a.bookingDate === selectedDate
        );
        
        if (attenderAssignments.length === 0) return true;
        
        return !attenderAssignments.some(assignment => {
          const assignmentTime = new Date(`${assignment.bookingDate}T${assignment.time}`).getTime();
          return Math.abs(selectedDateTime - assignmentTime) < (14 * 60 * 60 * 1000);
        });
      });

      setAvailableDrivers(filteredDrivers);
      setAvailableBuses(filteredBuses);
      setAvailableAttenders(filteredAttenders);
    }
  }, [selectedDate, selectedTime, assignments, drivers, buses, attenders]);

  // Handle assignment creation
  const handleAssign = async () => {
    if (!selectedRoute || !selectedDriver || !selectedBus || !selectedAttender || !selectedDate) {
      setError('Please fill all required fields');
      return;
    }

    if (!API_BASE_URL) {
      setError('API configuration is missing');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const token = getToken();
      if (!token) return;

      const formattedTime = `${selectedTime}:00`;

      const [selectedDriverObj, selectedBusObj, selectedRouteObj, selectedAttenderObj] = [
        drivers.find((d) => d.stvDriverId === selectedDriver),
        buses.find((b) => b.stvBusId === selectedBus),
        routes.find((r) => r.stvRouteId === selectedRoute),
        attenders.find((a) => a.stvAttenderId === selectedAttender),
      ];

      const response = await fetch(`${API_BASE_URL}/api/assignments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          driverId: selectedDriver,
          busId: selectedBus,
          routeId: selectedRoute,
          attenderId: selectedAttender,
          bookingDate: selectedDate,
          time: formattedTime,
          status: 'Active',
          driverName: selectedDriverObj?.userName || '',
          driverNumber: selectedDriverObj?.contactNumber || 'N/A',
          busNumber: selectedBusObj?.busNumber || '',
          busmodel: selectedBusObj?.busmodel || '',
          routeName: selectedRouteObj?.routeName || '',
          attenderName: selectedAttenderObj?.username || '',
          attenderNumber: selectedAttenderObj?.contactNum || 'N/A',
        }),
      });

      if (response.status === 401 || response.status === 403) {
        handleAuthError();
        return;
      }

      if (response.ok) {
        showSuccess('Driver assigned successfully!');
        await fetchAssignments();
        
        // Reset form
        setSelectedRoute('');
        setSelectedDriver('');
        setSelectedBus('');
        setSelectedAttender('');
        setSelectedDate(new Date().toISOString().split('T')[0]);
        setSelectedTime('12:00');
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        setError(`Failed to create assignment: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error creating assignment:', error);
      setError('Error creating assignment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle assignment deletion - Fixed to use driverId instead of assignmentId
  const handleDeleteAssignment = async (assignment) => {
    if (!assignment || !assignment.driverId) {
      setError('Invalid assignment or missing driver ID');
      return;
    }

    if (!API_BASE_URL) {
      setError('API configuration is missing');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const token = getToken();
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/api/assignments/${assignment.driverId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 401 || response.status === 403) {
        handleAuthError();
        return;
      }

      if (response.ok) {
        showSuccess('Assignment deleted successfully!');
        await fetchAssignments();
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Failed to delete assignment' }));
        setError(errorData.message || 'Failed to delete assignment');
      }
    } catch (error) {
      console.error('Error deleting assignment:', error);
      setError('Error deleting assignment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh all data
  const handleRefresh = async () => {
    await Promise.all([fetchDropdownData(), fetchAssignments()]);
  };

  // Filter assignments based on search term
  const filteredAssignments = assignments.filter((assignment) =>
    assignment.driverName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assignment.busId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assignment.routeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assignment.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assignment.attenderName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assignment.busmodel?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredAssignments.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentAssignments = filteredAssignments.slice(startIndex, endIndex);

  // Pagination handlers
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setCurrentPage(page);
    }
  };

  const goToFirstPage = () => goToPage(1);
  const goToLastPage = () => goToPage(totalPages);
  const goToPreviousPage = () => goToPage(currentPage - 1);
  const goToNextPage = () => goToPage(currentPage + 1);

  // Get status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-500 text-white';
      case 'on break':
        return 'bg-yellow-500 text-white';
      case 'unassigned':
        return 'bg-red-500 text-white';
      case 'maintenance':
        return 'bg-orange-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  // Generate pagination numbers
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

  // Initial data load
  useEffect(() => {
    const token = getToken();
    if (!token) {
      setAuthError(true);
      return;
    }

    fetchDropdownData();
    fetchAssignments();
  }, [fetchDropdownData, fetchAssignments, getToken]);

  // Reset current page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Show authentication error if not logged in
  if (authError) {
    return <AuthenticationError onRetryLogin={handleRetryLogin} />;
  }

  return (
    <div className="animate-in fade-in-up duration-700">
      <div className="container mx-auto px-4 py-8">
        {/* Success Message */}
        {successMessage && (
          <SuccessMessage 
            message={successMessage} 
            onClose={() => setSuccessMessage('')} 
          />
        )}

        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
            <span className="bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 bg-clip-text text-transparent">
              Trip Assignment Portal
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Assign drivers, buses, and attenders to routes efficiently with our professional management system
          </p>
        </div>

        {/* Assignment Form */}
        <Card className="bg-gray-50/80 dark:bg-gray-800/80 border-2 border-purple-200 dark:border-purple-700 rounded-2xl overflow-hidden shadow-xl mb-8 transition-all duration-300 hover:shadow-2xl hover:border-purple-300 dark:hover:border-purple-600">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              Create New Assignment
            </h2>
            
            {/* Form Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {/* Date Picker */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  Trip Date
                </label>
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={today}
                  className="bg-gray-50 dark:bg-gray-700 border-2 border-purple-200 hover:border-purple-400 focus:border-purple-500 dark:border-purple-600 dark:hover:border-purple-500 dark:focus:border-purple-400 transition-all duration-300 rounded-lg shadow-sm focus:shadow-md text-gray-800 dark:text-gray-100"
                />
              </div>

              {/* Time Picker */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  Departure Time
                </label>
                <Input
                  type="time"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="bg-gray-50 dark:bg-gray-700 border-2 border-purple-200 hover:border-purple-400 focus:border-purple-500 dark:border-purple-600 dark:hover:border-purple-500 dark:focus:border-purple-400 transition-all duration-300 rounded-lg shadow-sm focus:shadow-md text-gray-800 dark:text-gray-100"
                />
              </div>

              {/* Route Dropdown */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  Route Selection
                </label>
                <select
                  value={selectedRoute}
                  onChange={(e) => setSelectedRoute(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-700 border-2 border-purple-200 hover:border-purple-400 focus:border-purple-500 dark:border-purple-600 dark:hover:border-purple-500 dark:focus:border-purple-400 text-gray-800 dark:text-gray-100 rounded-lg px-4 py-3 text-sm transition-all duration-300 shadow-sm focus:shadow-md"
                >
                  <option value="">Select Route</option>
                  {routes.map((route) => (
                    <option key={route.stvRouteId} value={route.stvRouteId}>
                      {route.routeName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Bus Dropdown */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                  <Bus className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  Bus ({availableBuses.length} available)
                </label>
                <select
                  value={selectedBus}
                  onChange={(e) => setSelectedBus(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-700 border-2 border-purple-200 hover:border-purple-400 focus:border-purple-500 dark:border-purple-600 dark:hover:border-purple-500 dark:focus:border-purple-400 text-gray-800 dark:text-gray-100 rounded-lg px-4 py-3 text-sm transition-all duration-300 shadow-sm focus:shadow-md"
                >
                  <option value="">Select Bus</option>
                  {availableBuses.map((bus) => (
                    <option key={bus.stvBusId} value={bus.stvBusId}>
                      {bus.busNumber} ({bus.busmodel})
                    </option>
                  ))}
                </select>
              </div>

              {/* Driver Dropdown */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                  <User className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  Driver ({availableDrivers.length} available)
                </label>
                <select
                  value={selectedDriver}
                  onChange={(e) => setSelectedDriver(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-700 border-2 border-purple-200 hover:border-purple-400 focus:border-purple-500 dark:border-purple-600 dark:hover:border-purple-500 dark:focus:border-purple-400 text-gray-800 dark:text-gray-100 rounded-lg px-4 py-3 text-sm transition-all duration-300 shadow-sm focus:shadow-md"
                >
                  <option value="">Select Driver</option>
                  {availableDrivers.map((driver) => (
                    <option key={driver.stvDriverId} value={driver.stvDriverId}>
                      {driver.userName} {driver.contactNumber ? `(${driver.contactNumber})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Attender Dropdown */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                  <Users className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  Attender ({availableAttenders.length} available)
                </label>
                <select
                  value={selectedAttender}
                  onChange={(e) => setSelectedAttender(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-700 border-2 border-purple-200 hover:border-purple-400 focus:border-purple-500 dark:border-purple-600 dark:hover:border-purple-500 dark:focus:border-purple-400 text-gray-800 dark:text-gray-100 rounded-lg px-4 py-3 text-sm transition-all duration-300 shadow-sm focus:shadow-md"
                >
                  <option value="">Select Attender</option>
                  {availableAttenders.map((attender) => (
                    <option key={attender.stvAttenderId} value={attender.stvAttenderId}>
                      {attender.username} {attender.contactNum ? `(${attender.contactNum})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Assign Button */}
              <div className="space-y-3 md:col-span-2 lg:col-span-1">
                <label className="text-sm font-medium text-transparent">Action</label>
                <Button
                  onClick={handleAssign}
                  disabled={!selectedRoute || !selectedDriver || !selectedBus || !selectedAttender || !selectedDate || isLoading}
                  className="w-full bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:from-purple-600 hover:via-purple-700 hover:to-purple-800 text-white shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold py-3 rounded-lg"
                >
                  {isLoading ? 'Assigning...' : 'Assign Trip'}
                </Button>
              </div>

              {/* Refresh Button */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-transparent">Refresh</label>
                <Button
                  onClick={handleRefresh}
                  disabled={isLoading}
                  variant="outline"
                  className="w-full border-2 border-purple-200 hover:border-purple-400 dark:border-purple-600 dark:hover:border-purple-500 text-purple-700 dark:text-purple-300 hover:text-purple-800 hover:bg-purple-50 dark:hover:bg-purple-950/30 bg-gray-50 dark:bg-gray-700 transition-all duration-300 font-semibold py-3 rounded-lg shadow-sm hover:shadow-md"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh Data
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Error Display */}
        {error && (
          <div className="mb-8 p-6 bg-red-50 dark:bg-red-950/40 border-2 border-red-200 dark:border-red-800/50 rounded-xl shadow-lg">
            <div className="flex items-center">
              <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400 mr-3" />
              <div className="text-red-800 dark:text-red-200 font-medium">{error}</div>
            </div>
          </div>
        )}

        {/* Search and Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-500" />
            <Input
              placeholder="Search assignments by driver, bus, route, or status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 bg-gray-50 border-2 border-purple-200 hover:border-purple-400 focus:border-purple-500 dark:bg-gray-800 dark:border-purple-600 dark:hover:border-purple-500 dark:focus:border-purple-400 transition-all duration-300 text-gray-800 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 rounded-lg shadow-sm focus:shadow-md py-3"
            />
          </div>
        </div>

        {/* Assignments Table */}
        <Card className="bg-gray-50/80 dark:bg-gray-800/80 border-2 border-purple-200 dark:border-purple-700 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 hover:shadow-2xl">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-purple-600 to-purple-700 dark:from-purple-800 dark:to-purple-900">
                  <tr className="border-b-2 border-purple-300 dark:border-purple-600">
                    <th className="text-left p-6 font-bold text-white text-sm uppercase tracking-wider">Driver</th>
                    <th className="text-left p-6 font-bold text-white text-sm uppercase tracking-wider">Bus</th>
                    <th className="text-left p-6 font-bold text-white text-sm uppercase tracking-wider">Bus Model</th>
                    <th className="text-left p-6 font-bold text-white text-sm uppercase tracking-wider">Route</th>
                    <th className="text-left p-6 font-bold text-white text-sm uppercase tracking-wider">Status</th>
                    <th className="text-left p-6 font-bold text-white text-sm uppercase tracking-wider">Date & Time</th>
                    <th className="text-left p-6 font-bold text-white text-sm uppercase tracking-wider">Attender</th>
                    <th className="text-left p-6 font-bold text-white text-sm uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-gray-50 dark:bg-gray-800">
                  {isLoading ? (
                    [...Array(pageSize)].map((_, i) => <SkeletonRow key={i} />)
                  ) : currentAssignments.length > 0 ? (
                    currentAssignments.map((assignment, index) => (
                      <tr
                        key={assignment.id}
                        className="border-b border-gray-200 dark:border-gray-700 hover:bg-purple-50 dark:hover:bg-purple-950/20 transition-colors duration-200"
                      >
                        <td className="p-6">
                          <div>
                            <div className="font-semibold text-gray-800 dark:text-gray-100 text-base">{assignment.driverName || 'N/A'}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">{assignment.driverNumber || 'N/A'}</div>
                          </div>
                        </td>
                        <td className="p-6">
                          <div className="font-medium text-gray-800 dark:text-gray-100">{assignment.busId || 'N/A'}</div>
                        </td>
                        <td className="p-6">
                          <div className="text-gray-700 dark:text-gray-200">{assignment.busmodel || 'N/A'}</div>
                        </td>
                        <td className="p-6">
                          <div className="text-gray-700 dark:text-gray-200">{assignment.routeName || 'N/A'}</div>
                        </td>
                        <td className="p-6">
                          <Badge className={`${getStatusColor(assignment.status)} font-medium px-3 py-1 rounded-full`}>
                            {assignment.status || 'Unknown'}
                          </Badge>
                        </td>
                        <td className="p-6">
                          <div className="text-gray-700 dark:text-gray-200 font-medium">{assignment.bookingDate || 'N/A'}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">{assignment.time || 'N/A'}</div>
                        </td>
                        <td className="p-6">
                          <div>
                            <div className="font-medium text-gray-800 dark:text-gray-100">{assignment.attenderName || 'N/A'}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">{assignment.attenderNumber || 'N/A'}</div>
                          </div>
                        </td>
                        <td className="p-6">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteAssignment(assignment)}
                            className="border-2 border-red-200 hover:border-red-400 dark:border-red-800/50 dark:hover:border-red-600 text-red-600 hover:text-white hover:bg-red-600 dark:text-red-400 dark:hover:text-white transition-all duration-300 rounded-lg shadow-sm hover:shadow-md"
                            disabled={isLoading}
                            data-testid={`delete-assignment-${assignment.id}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="p-12 text-center">
                        <Bus className="h-20 w-20 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">No assignments found</h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          {searchTerm 
                            ? 'Try adjusting your search criteria'
                            : 'No trip assignments available at the moment'
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
        {!isLoading && !error && totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Showing {currentAssignments.length > 0 ? startIndex + 1 : 0} to {Math.min(endIndex, filteredAssignments.length)} of {filteredAssignments.length} assignments
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={goToFirstPage}
                disabled={currentPage === 1}
                className="border-2 border-purple-200 hover:border-purple-400 dark:border-purple-700 dark:hover:border-purple-500 disabled:opacity-50 disabled:cursor-not-allowed bg-gray-50 dark:bg-gray-700 transition-all duration-300 rounded-lg"
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className="border-2 border-purple-200 hover:border-purple-400 dark:border-purple-700 dark:hover:border-purple-500 disabled:opacity-50 disabled:cursor-not-allowed bg-gray-50 dark:bg-gray-700 transition-all duration-300 rounded-lg"
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
                          "border-2 border-purple-200 hover:border-purple-400 dark:border-purple-700 dark:hover:border-purple-500 bg-gray-50 dark:bg-gray-700 transition-all duration-300 rounded-lg"
                        }
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
                          "border-2 border-purple-200 hover:border-purple-400 dark:border-purple-700 dark:hover:border-purple-500 bg-gray-50 dark:bg-gray-700 transition-all duration-300 rounded-lg"
                        }
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
                className="border-2 border-purple-200 hover:border-purple-400 dark:border-purple-700 dark:hover:border-purple-500 disabled:opacity-50 disabled:cursor-not-allowed bg-gray-50 dark:bg-gray-700 transition-all duration-300 rounded-lg"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={goToLastPage}
                disabled={currentPage === totalPages}
                className="border-2 border-purple-200 hover:border-purple-400 dark:border-purple-700 dark:hover:border-purple-500 disabled:opacity-50 disabled:cursor-not-allowed bg-gray-50 dark:bg-gray-700 transition-all duration-300 rounded-lg"
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TripAssignPortal;