import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bus, Calendar, Gauge, Settings, Fuel } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card.jsx';
import { Button } from '../../components/ui/button.jsx';
import useLogoutConfirmation from '../../hooks/useLogoutConfirmation.js';
import LogoutConfirmationDialog from '../../components/LogoutConfirmationDialog.jsx';

const BusRegistration = () => {
  const navigate = useNavigate();
  const { 
    showLogoutDialog, 
    handleLogoutConfirm, 
    handleLogoutCancel, 
    handleBrowserBack 
  } = useLogoutConfirmation();

  const [formData, setFormData] = useState({
    busId: '',
    registrationNumber: '',
    model: '',
    manufacturer: '',
    yearOfManufacture: '',
    capacity: '',
    fuelType: '',
    engineNumber: '',
    chassisNumber: '',
    color: '',
    insuranceNumber: '',
    insuranceExpiryDate: '',
    fitnessExpiryDate: '',
    pollutionExpiryDate: '',
    roadTaxExpiryDate: '',
    purchaseDate: '',
    purchasePrice: '',
    currentValue: '',
    features: {
      airConditioning: false,
      wifi: false,
      gps: false,
      cctv: false,
      musicSystem: false,
      chargingPorts: false,
      emergencyExit: false,
      fireExtinguisher: false
    },
    maintenanceSchedule: 'monthly',
    status: 'active',
    depot: '',
    insuranceProvider: '',
    lastServiceDate: '',
    nextServiceDate: ''
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
    
    if (name.startsWith('features.')) {
      const feature = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        features: {
          ...prev.features,
          [feature]: checked
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Show success notification
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 z-50 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-right duration-500';
    notification.innerHTML = `
      <div class="font-semibold">Bus Registration Successful!</div>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 3000);

    console.log('Bus Registration Data:', formData);
    
    // Reset form
    setFormData({
      busId: '',
      registrationNumber: '',
      model: '',
      manufacturer: '',
      yearOfManufacture: '',
      capacity: '',
      fuelType: '',
      engineNumber: '',
      chassisNumber: '',
      color: '',
      insuranceNumber: '',
      insuranceExpiryDate: '',
      fitnessExpiryDate: '',
      pollutionExpiryDate: '',
      roadTaxExpiryDate: '',
      purchaseDate: '',
      purchasePrice: '',
      currentValue: '',
      features: {
        airConditioning: false,
        wifi: false,
        gps: false,
        cctv: false,
        musicSystem: false,
        chargingPorts: false,
        emergencyExit: false,
        fireExtinguisher: false
      },
      maintenanceSchedule: 'monthly',
      status: 'active',
      depot: '',
      insuranceProvider: '',
      lastServiceDate: '',
      nextServiceDate: ''
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
            className="flex items-center gap-2 text-orange-600 hover:text-orange-700 border-orange-200 hover:border-orange-400"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Registration Portal
          </Button>
        </div>

        {/* Registration Form */}
        <Card className="max-w-6xl mx-auto bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border-2 border-orange-200/70 dark:border-orange-700/70 shadow-2xl rounded-3xl">
          <CardHeader className="text-center pb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Bus className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-orange-600 via-orange-700 to-orange-800 bg-clip-text text-transparent">
              Bus Registration
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Add new buses to the fleet with complete specifications
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
                      Bus ID
                    </label>
                    <div className="relative">
                      <Bus className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-500 w-5 h-5" />
                      <input
                        type="text"
                        name="busId"
                        value={formData.busId}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-orange-200 dark:border-orange-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all"
                        placeholder="Enter bus ID"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Registration Number
                    </label>
                    <input
                      type="text"
                      name="registrationNumber"
                      value={formData.registrationNumber}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-orange-200 dark:border-orange-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all"
                      placeholder="Enter registration number"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Manufacturer
                    </label>
                    <input
                      type="text"
                      name="manufacturer"
                      value={formData.manufacturer}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-orange-200 dark:border-orange-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all"
                      placeholder="Enter manufacturer"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Model
                    </label>
                    <input
                      type="text"
                      name="model"
                      value={formData.model}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-orange-200 dark:border-orange-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all"
                      placeholder="Enter model"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Year of Manufacture
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-500 w-5 h-5" />
                      <input
                        type="number"
                        name="yearOfManufacture"
                        value={formData.yearOfManufacture}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-orange-200 dark:border-orange-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all"
                        placeholder="Enter year"
                        min="1990"
                        max="2030"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Capacity (Passengers)
                    </label>
                    <div className="relative">
                      <Gauge className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-500 w-5 h-5" />
                      <input
                        type="number"
                        name="capacity"
                        value={formData.capacity}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-orange-200 dark:border-orange-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all"
                        placeholder="Enter capacity"
                        min="1"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Fuel Type
                    </label>
                    <div className="relative">
                      <Fuel className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-500 w-5 h-5" />
                      <select
                        name="fuelType"
                        value={formData.fuelType}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-orange-200 dark:border-orange-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all"
                        required
                      >
                        <option value="">Select Fuel Type</option>
                        <option value="diesel">Diesel</option>
                        <option value="petrol">Petrol</option>
                        <option value="cng">CNG</option>
                        <option value="electric">Electric</option>
                        <option value="hybrid">Hybrid</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Color
                    </label>
                    <input
                      type="text"
                      name="color"
                      value={formData.color}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-orange-200 dark:border-orange-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all"
                      placeholder="Enter color"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-orange-200 dark:border-orange-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all"
                      required
                    >
                      <option value="active">Active</option>
                      <option value="maintenance">Under Maintenance</option>
                      <option value="inactive">Inactive</option>
                      <option value="retired">Retired</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Technical Details */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                  Technical Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Engine Number
                    </label>
                    <div className="relative">
                      <Settings className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-500 w-5 h-5" />
                      <input
                        type="text"
                        name="engineNumber"
                        value={formData.engineNumber}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-orange-200 dark:border-orange-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all"
                        placeholder="Enter engine number"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Chassis Number
                    </label>
                    <input
                      type="text"
                      name="chassisNumber"
                      value={formData.chassisNumber}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-orange-200 dark:border-orange-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all"
                      placeholder="Enter chassis number"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Legal Documents */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                  Legal Documents & Certificates
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Insurance Number
                    </label>
                    <input
                      type="text"
                      name="insuranceNumber"
                      value={formData.insuranceNumber}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-orange-200 dark:border-orange-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all"
                      placeholder="Enter insurance number"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Insurance Provider
                    </label>
                    <input
                      type="text"
                      name="insuranceProvider"
                      value={formData.insuranceProvider}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-orange-200 dark:border-orange-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all"
                      placeholder="Enter insurance provider"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Insurance Expiry Date
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-500 w-5 h-5" />
                      <input
                        type="date"
                        name="insuranceExpiryDate"
                        value={formData.insuranceExpiryDate}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-orange-200 dark:border-orange-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Fitness Certificate Expiry
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-500 w-5 h-5" />
                      <input
                        type="date"
                        name="fitnessExpiryDate"
                        value={formData.fitnessExpiryDate}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-orange-200 dark:border-orange-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Pollution Certificate Expiry
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-500 w-5 h-5" />
                      <input
                        type="date"
                        name="pollutionExpiryDate"
                        value={formData.pollutionExpiryDate}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-orange-200 dark:border-orange-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Road Tax Expiry Date
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-500 w-5 h-5" />
                      <input
                        type="date"
                        name="roadTaxExpiryDate"
                        value={formData.roadTaxExpiryDate}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-orange-200 dark:border-orange-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Financial Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                  Financial Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Purchase Date
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-500 w-5 h-5" />
                      <input
                        type="date"
                        name="purchaseDate"
                        value={formData.purchaseDate}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-orange-200 dark:border-orange-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Purchase Price (₹)
                    </label>
                    <input
                      type="number"
                      name="purchasePrice"
                      value={formData.purchasePrice}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-orange-200 dark:border-orange-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all"
                      placeholder="Enter purchase price"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Current Value (₹)
                    </label>
                    <input
                      type="number"
                      name="currentValue"
                      value={formData.currentValue}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-orange-200 dark:border-orange-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all"
                      placeholder="Enter current value"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Depot Location
                    </label>
                    <input
                      type="text"
                      name="depot"
                      value={formData.depot}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-orange-200 dark:border-orange-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all"
                      placeholder="Enter depot location"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Features */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                  Bus Features & Amenities
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries({
                    airConditioning: 'Air Conditioning',
                    wifi: 'Wi-Fi',
                    gps: 'GPS Tracking',
                    cctv: 'CCTV Camera',
                    musicSystem: 'Music System',
                    chargingPorts: 'Charging Ports',
                    emergencyExit: 'Emergency Exit',
                    fireExtinguisher: 'Fire Extinguisher'
                  }).map(([key, label]) => (
                    <div key={key} className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        name={`features.${key}`}
                        checked={formData.features[key]}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-orange-600 border-orange-300 rounded focus:ring-orange-500"
                      />
                      <label className="text-sm text-gray-700 dark:text-gray-300">
                        {label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Maintenance Schedule */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                  Maintenance Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Maintenance Schedule
                    </label>
                    <select
                      name="maintenanceSchedule"
                      value={formData.maintenanceSchedule}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-orange-200 dark:border-orange-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all"
                      required
                    >
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                      <option value="bi-annual">Bi-Annual</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Last Service Date
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-500 w-5 h-5" />
                      <input
                        type="date"
                        name="lastServiceDate"
                        value={formData.lastServiceDate}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-orange-200 dark:border-orange-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Next Service Date
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-500 w-5 h-5" />
                      <input
                        type="date"
                        name="nextServiceDate"
                        value={formData.nextServiceDate}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-orange-200 dark:border-orange-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4 pt-6">
                <Button
                  type="button"
                  onClick={handleBack}
                  variant="outline"
                  className="px-8 py-3 border-orange-200 text-orange-600 hover:bg-orange-50"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  Register Bus
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BusRegistration;