import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Plus, Minus, Route } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card.jsx';
import { Button } from '../../components/ui/button.jsx';
import useLogoutConfirmation from '../../hooks/useLogoutConfirmation.js';
import LogoutConfirmationDialog from '../../components/LogoutConfirmationDialog.jsx';

const RouteRegistration = () => {
  const navigate = useNavigate();
  const { 
    showLogoutDialog, 
    handleLogoutConfirm, 
    handleLogoutCancel, 
    handleBrowserBack 
  } = useLogoutConfirmation();

  const [formData, setFormData] = useState({
    routeId: '',
    routeName: '',
    startPoint: '',
    endPoint: '',
    distance: '',
    estimatedDuration: '',
    fare: '',
    routeType: 'urban',
    operatingHours: {
      start: '',
      end: ''
    },
    frequency: '',
    status: 'active',
    description: '',
    stops: [
      { name: '', latitude: '', longitude: '', order: 1, estimatedTime: '' }
    ],
    operatingDays: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: true
    }
  });

  // Browser back button detection
  useEffect(() => {
    window.addEventListener('popstate', handleBrowserBack);
    window.history.pushState(null, "", window.location.href);
    
    return () => {
      window.removeEventListener('popstate', handleBrowserBack);
    };
  }, [handleBrowserBack]);

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem('operatortoken');
    if (!token) {
      navigate('/login');
      return;
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('operatingHours.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        operatingHours: {
          ...prev.operatingHours,
          [field]: value
        }
      }));
    } else if (name.startsWith('operatingDays.')) {
      const day = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        operatingDays: {
          ...prev.operatingDays,
          [day]: checked
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleStopChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      stops: prev.stops.map((stop, i) => 
        i === index ? { ...stop, [field]: value } : stop
      )
    }));
  };

  const addStop = () => {
    setFormData(prev => ({
      ...prev,
      stops: [...prev.stops, { 
        name: '', 
        latitude: '', 
        longitude: '', 
        order: prev.stops.length + 1, 
        estimatedTime: '' 
      }]
    }));
  };

  const removeStop = (index) => {
    if (formData.stops.length > 1) {
      setFormData(prev => ({
        ...prev,
        stops: prev.stops.filter((_, i) => i !== index).map((stop, i) => ({
          ...stop,
          order: i + 1
        }))
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Show success notification
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 z-50 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-right duration-500';
    notification.innerHTML = `
      <div class="font-semibold">Route Registration Successful!</div>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 3000);

    console.log('Route Registration Data:', formData);
    
    // Reset form
    setFormData({
      routeId: '',
      routeName: '',
      startPoint: '',
      endPoint: '',
      distance: '',
      estimatedDuration: '',
      fare: '',
      routeType: 'urban',
      operatingHours: {
        start: '',
        end: ''
      },
      frequency: '',
      status: 'active',
      description: '',
      stops: [
        { name: '', latitude: '', longitude: '', order: 1, estimatedTime: '' }
      ],
      operatingDays: {
        monday: true,
        tuesday: true,
        wednesday: true,
        thursday: true,
        friday: true,
        saturday: true,
        sunday: true
      }
    });
  };

  const handleBack = () => {
    navigate('/dashboard/registration');
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-foreground transition-colors duration-300 pt-20">
      {/* Logout Confirmation Dialog */}
      <LogoutConfirmationDialog
        showDialog={showLogoutDialog}
        onConfirm={handleLogoutConfirm}
        onCancel={handleLogoutCancel}
      />
      
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            onClick={handleBack}
            variant="outline"
            className="flex items-center gap-2 text-cyan-600 hover:text-cyan-700 border-cyan-200 hover:border-cyan-400"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Registration Portal
          </Button>
        </div>

        {/* Registration Form */}
        <Card className="max-w-5xl mx-auto bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border-2 border-cyan-200/70 dark:border-cyan-700/70 shadow-2xl rounded-3xl">
          <CardHeader className="text-center pb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Route className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-cyan-600 via-cyan-700 to-cyan-800 bg-clip-text text-transparent">
              Route Registration
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Create new bus routes and schedules
            </p>
          </CardHeader>

          <CardContent className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Route ID
                    </label>
                    <div className="relative">
                      <Route className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-500 w-5 h-5" />
                      <input
                        type="text"
                        name="routeId"
                        value={formData.routeId}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-cyan-200 dark:border-cyan-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20 transition-all"
                        placeholder="Enter route ID"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Route Name
                    </label>
                    <input
                      type="text"
                      name="routeName"
                      value={formData.routeName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-cyan-200 dark:border-cyan-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20 transition-all"
                      placeholder="Enter route name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Route Type
                    </label>
                    <select
                      name="routeType"
                      value={formData.routeType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-cyan-200 dark:border-cyan-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20 transition-all"
                      required
                    >
                      <option value="urban">Urban</option>
                      <option value="suburban">Suburban</option>
                      <option value="intercity">Intercity</option>
                      <option value="express">Express</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Start Point
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-500 w-5 h-5" />
                      <input
                        type="text"
                        name="startPoint"
                        value={formData.startPoint}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-cyan-200 dark:border-cyan-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20 transition-all"
                        placeholder="Enter start point"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      End Point
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-500 w-5 h-5" />
                      <input
                        type="text"
                        name="endPoint"
                        value={formData.endPoint}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-cyan-200 dark:border-cyan-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20 transition-all"
                        placeholder="Enter end point"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-cyan-200 dark:border-cyan-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20 transition-all"
                      required
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="maintenance">Under Maintenance</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Route Details */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                  Route Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Distance (km)
                    </label>
                    <input
                      type="number"
                      name="distance"
                      value={formData.distance}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-cyan-200 dark:border-cyan-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20 transition-all"
                      placeholder="Enter distance"
                      step="0.1"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Estimated Duration (minutes)
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-500 w-5 h-5" />
                      <input
                        type="number"
                        name="estimatedDuration"
                        value={formData.estimatedDuration}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-cyan-200 dark:border-cyan-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20 transition-all"
                        placeholder="Enter duration"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Fare (₹)
                    </label>
                    <input
                      type="number"
                      name="fare"
                      value={formData.fare}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-cyan-200 dark:border-cyan-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20 transition-all"
                      placeholder="Enter fare"
                      step="0.01"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Frequency (minutes)
                    </label>
                    <input
                      type="number"
                      name="frequency"
                      value={formData.frequency}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-cyan-200 dark:border-cyan-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20 transition-all"
                      placeholder="Bus frequency"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Operating Hours */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                  Operating Hours
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Start Time
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-500 w-5 h-5" />
                      <input
                        type="time"
                        name="operatingHours.start"
                        value={formData.operatingHours.start}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-cyan-200 dark:border-cyan-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20 transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      End Time
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-500 w-5 h-5" />
                      <input
                        type="time"
                        name="operatingHours.end"
                        value={formData.operatingHours.end}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-cyan-200 dark:border-cyan-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20 transition-all"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Operating Days */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                  Operating Days
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-7 gap-4">
                  {Object.entries({
                    monday: 'Mon',
                    tuesday: 'Tue',
                    wednesday: 'Wed',
                    thursday: 'Thu',
                    friday: 'Fri',
                    saturday: 'Sat',
                    sunday: 'Sun'
                  }).map(([key, label]) => (
                    <div key={key} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name={`operatingDays.${key}`}
                        checked={formData.operatingDays[key]}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-cyan-600 border-cyan-300 rounded focus:ring-cyan-500"
                      />
                      <label className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                        {label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Route Stops */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                    Route Stops
                  </h3>
                  <Button
                    type="button"
                    onClick={addStop}
                    className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white px-4 py-2 rounded-lg text-sm"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Stop
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {formData.stops.map((stop, index) => (
                    <div key={index} className="p-4 border border-cyan-200 dark:border-cyan-700 rounded-xl bg-cyan-50/50 dark:bg-cyan-950/20">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-800 dark:text-gray-200">
                          Stop {index + 1}
                        </h4>
                        {formData.stops.length > 1 && (
                          <Button
                            type="button"
                            onClick={() => removeStop(index)}
                            variant="outline"
                            className="text-red-600 border-red-200 hover:bg-red-50 px-2 py-1 text-sm"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Stop Name
                          </label>
                          <input
                            type="text"
                            value={stop.name}
                            onChange={(e) => handleStopChange(index, 'name', e.target.value)}
                            className="w-full px-3 py-2 border border-cyan-200 dark:border-cyan-700 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all text-sm"
                            placeholder="Enter stop name"
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Latitude
                          </label>
                          <input
                            type="number"
                            step="0.000001"
                            value={stop.latitude}
                            onChange={(e) => handleStopChange(index, 'latitude', e.target.value)}
                            className="w-full px-3 py-2 border border-cyan-200 dark:border-cyan-700 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all text-sm"
                            placeholder="Enter latitude"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Longitude
                          </label>
                          <input
                            type="number"
                            step="0.000001"
                            value={stop.longitude}
                            onChange={(e) => handleStopChange(index, 'longitude', e.target.value)}
                            className="w-full px-3 py-2 border border-cyan-200 dark:border-cyan-700 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all text-sm"
                            placeholder="Enter longitude"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Est. Time (min)
                          </label>
                          <input
                            type="number"
                            value={stop.estimatedTime}
                            onChange={(e) => handleStopChange(index, 'estimatedTime', e.target.value)}
                            className="w-full px-3 py-2 border border-cyan-200 dark:border-cyan-700 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all text-sm"
                            placeholder="Minutes from start"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                  Route Description
                </h3>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-cyan-200 dark:border-cyan-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20 transition-all resize-none"
                  placeholder="Enter route description, special instructions, or notes (optional)"
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4 pt-6">
                <Button
                  type="button"
                  onClick={handleBack}
                  variant="outline"
                  className="px-8 py-3 border-cyan-200 text-cyan-600 hover:bg-cyan-50"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  Register Route
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RouteRegistration;