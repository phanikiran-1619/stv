import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft,
  UserPlus, 
  CheckCircle, 
  AlertCircle, 
  Save, 
  Upload, 
  Download,
  Search,
  X,
  Bus
} from 'lucide-react';
import { Button } from '../../components/ui/button.jsx';
import * as XLSX from "xlsx";

const BusRegistration = () => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [buses, setBuses] = useState([]);
  const [filteredBuses, setFilteredBuses] = useState([]);
  const [selectedBusId, setSelectedBusId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [formData, setFormData] = useState({
    busNumber: '',
    serviceNumber: '',
    busModel: '',
    busType: '',
    busSeating: '',
    status: true,
  });
  const [errors, setErrors] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [excelError, setExcelError] = useState(null);
  const [availableBusTypes, setAvailableBusTypes] = useState([]);

  // Default bus type options
  const defaultBusTypeOptions = [
    "A/C Seater",
    "A/C Sleeper", 
    "Non A/C Seater",
    "Non A/c Sleeper",
    "A/C Seater+Sleeper",
    "Non A/C Seater+Sleeper",
  ];

  const formRefs = {
    busNumber: useRef(null),
    serviceNumber: useRef(null),
    busModel: useRef(null),
    busType: useRef(null),
    busSeating: useRef(null),
  };

  const fileInputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Get token from localStorage
  const getToken = () => localStorage.getItem('operatortoken');

  // Initialize bus types
  useEffect(() => {
    setAvailableBusTypes([...defaultBusTypeOptions]);
  }, []);

  // Browser back button detection
  useEffect(() => {
    const handlePopState = (event) => {
      // Prevent default browser back behavior
      event.preventDefault();
      // Navigate to registration portal
      navigate('/dashboard/registration');
    };
    
    // Add event listener for browser back button
    window.addEventListener('popstate', handlePopState);
    
    // Push current state to prevent immediate back navigation
    window.history.pushState(null, "", window.location.href);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [navigate]);

  // Reset form
  const resetForm = useCallback(() => {
    setFormData({
      busNumber: '',
      serviceNumber: '',
      busModel: '',
      busType: '',
      busSeating: '',
      status: true,
    });
    setErrors({});
    setErrorMessage('');
    setIsSuccess(false);
    setSuccessMessage('');
    setSelectedBusId('');
    setSearchTerm('');
    setExcelError(null);
    setAvailableBusTypes([...defaultBusTypeOptions]);
  }, []);

  // Handle mode switch
  const handleModeSwitch = useCallback(() => {
    setIsEditMode(!isEditMode);
    resetForm();
    if (!isEditMode) {
      fetchBuses();
    }
  }, [isEditMode, resetForm]);

  // Fetch all buses for dropdown
  const fetchBuses = async () => {
    try {
      const token = getToken();
      if (!token) {
        setErrorMessage('No authentication token found');
        return;
      }

      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL1}/api/buses`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch buses');
      }

      const data = await response.json();
      setBuses(data);
      setFilteredBuses(data);
    } catch (error) {
      console.error('Fetch buses error:', error);
      setErrorMessage('Failed to load buses list');
    }
  };

  // Fetch specific bus data
  const fetchBusData = async (busId) => {
    setIsLoading(true);
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL1}/api/buses/${busId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch bus data');
      }

      const data = await response.json();
      
      // Check if the bus type from API exists in our options, if not add it
      let updatedBusTypes = [...defaultBusTypeOptions];
      if (data.busType && !updatedBusTypes.includes(data.busType)) {
        updatedBusTypes.push(data.busType);
        setAvailableBusTypes(updatedBusTypes);
      }

      setFormData({
        busNumber: data.busNumber || '',
        serviceNumber: data.serviceNumber || '',
        busModel: data.busModel || '',
        busType: data.busType || '',
        busSeating: data.busSeating ? data.busSeating.toString() : '',
        status: data.status !== undefined ? data.status : true,
      });
    } catch (error) {
      console.error('Fetch bus error:', error);
      setErrorMessage('Failed to load bus data');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle dropdown search
  const handleSearch = (value) => {
    setSearchTerm(value);
    const filtered = buses.filter(bus =>
      bus.stvBusId?.toLowerCase().includes(value.toLowerCase()) ||
      bus.busNumber?.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredBuses(filtered);
  };

  // Handle dropdown selection
  const handleBusSelect = (bus) => {
    setSelectedBusId(bus.stvBusId);
    setSearchTerm(`${bus.stvBusId} - ${bus.busNumber}`);
    setShowDropdown(false);
    fetchBusData(bus.stvBusId);
  };

  // Validation functions
  const validateField = useCallback((name, value) => {
    switch (name) {
      case 'busNumber':
        if (!value) return 'Bus number is required';
        if (value.length > 20) return 'Must be 20 characters or less';
        return '';
      case 'serviceNumber':
        if (!value) return 'Service number is required';
        if (value.length > 20) return 'Must be 20 characters or less';
        return '';
      case 'busModel':
        if (!value) return 'Bus model is required';
        if (value.length > 50) return 'Must be 50 characters or less';
        return '';
      case 'busType':
        if (!value) return 'Bus type is required';
        if (!availableBusTypes.includes(value)) return 'Must be a valid bus type';
        return '';
      case 'busSeating':
        if (!value) return 'Bus seating is required';
        const seatingNum = parseInt(value);
        if (isNaN(seatingNum) || seatingNum <= 0) return 'Must be a positive number';
        return '';
      default:
        return '';
    }
  }, [availableBusTypes]);

  // Validation functions for Excel data
  const validateExcelField = (name, value) => {
    switch (name) {
      case 'busNumber':
        if (!value) return 'Bus number is required';
        if (value.length > 20) return 'Must be 20 characters or less';
        return '';
      case 'serviceNumber':
        if (!value) return 'Service number is required';
        if (value.length > 20) return 'Must be 20 characters or less';
        return '';
      case 'busModel':
        if (!value) return 'Bus model is required';
        if (value.length > 50) return 'Must be 50 characters or less';
        return '';
      case 'busType':
        if (!value) return 'Bus type is required';
        return '';
      case 'busSeating':
        if (!value) return 'Bus seating is required';
        const seatingNum = parseInt(value);
        if (isNaN(seatingNum) || seatingNum <= 0) return 'Must be a positive number';
        return '';
      case 'status':
        if (value !== 'true' && value !== 'false') return 'Status must be true or false';
        return '';
      default:
        return '';
    }
  };

  // Check for duplicates within Excel data
  const checkExcelDuplicates = (busDataArray) => {
    const seenBusNumbers = new Set();
    const seenServiceNumbers = new Set();

    for (let i = 0; i < busDataArray.length; i++) {
      const bus = busDataArray[i];
      if (seenBusNumbers.has(bus.busNumber)) {
        setExcelError(`Row ${i + 2}: Duplicate bus number: ${bus.busNumber}`);
        return false;
      }
      if (seenServiceNumbers.has(bus.serviceNumber)) {
        setExcelError(`Row ${i + 2}: Duplicate service number: ${bus.serviceNumber}`);
        return false;
      }
      seenBusNumbers.add(bus.busNumber);
      seenServiceNumbers.add(bus.serviceNumber);
    }
    return true;
  };

  // Validate entire form
  const validateForm = useCallback(() => {
    const newErrors = {};

    if (isEditMode && !selectedBusId) {
      setErrorMessage('Please select a bus to update');
      return false;
    }

    Object.entries(formData).forEach(([key, value]) => {
      if (key !== 'status') {
        const error = validateField(key, value);
        if (error) {
          newErrors[key] = error;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, isEditMode, selectedBusId, validateField]);

  // Handle input changes
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    
    // Handle different input types
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'busSeating') {
      // Only allow numbers for bus seating
      if (/^\d*$/.test(value)) {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error for this field
    setErrors(prev => ({ ...prev, [name]: undefined }));
  }, []);

  // Handle form submission
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      const firstErrorField = Object.keys(errors).find(key => errors[key]);
      if (firstErrorField && formRefs[firstErrorField]?.current) {
        formRefs[firstErrorField].current.focus();
      }
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const payload = {
        busNumber: formData.busNumber,
        serviceNumber: formData.serviceNumber,
        busModel: formData.busModel,
        busType: formData.busType,
        busSeating: parseInt(formData.busSeating),
        status: formData.status,
      };

      const url = isEditMode
        ? `${process.env.REACT_APP_API_BASE_URL1}/api/buses/${selectedBusId}`
        : `${process.env.REACT_APP_API_BASE_URL1}/api/buses`;

      const response = await fetch(url, {
        method: isEditMode ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || responseData.message || (isEditMode ? 'Failed to update bus' : 'Failed to register bus'));
      }

      setIsLoading(false);
      setIsSuccess(true);
      
      if (isEditMode) {
        setSuccessMessage(`Bus updated successfully! Bus ID: ${selectedBusId}`);
      } else {
        setSuccessMessage(`Registration successful! Bus ID: ${responseData.stvBusId}`);
      }

      setTimeout(() => {
        setIsSuccess(false);
        resetForm();
      }, 3000);

    } catch (error) {
      console.error('API error:', error);
      setIsLoading(false);
      setErrorMessage(error.message || 'An error occurred');
    }
  }, [formData, validateForm, errors, formRefs, isEditMode, selectedBusId, resetForm]);

  // Download Excel template
  const downloadTemplate = async () => {
    try {
      const templateData = [
        {
          'Bus Number': 'MH12AB3456',
          'Service Number': 'SVC456',
          'Bus Model': 'Tata Starbus',
          'Bus Type': 'A/C Seater',
          'Bus Seating': '32',
          'Status': 'true'
        }
      ];
      
      const worksheet = XLSX.utils.json_to_sheet(templateData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Bus Template");
      XLSX.writeFile(workbook, `bus_registration_template.xlsx`);
      
      setSuccessMessage("Excel template downloaded successfully!");
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
      }, 2000);
    } catch (error) {
      console.error('Download failed:', error);
      setErrorMessage("Failed to download template");
    }
  };

  // Handle Excel upload
  const handleExcelUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const token = getToken();
    if (!token) {
      setErrorMessage("Please log in again.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target?.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        const headers = jsonData[0];
        
        const requiredHeaders = [
          "Bus Number",
          "Service Number", 
          "Bus Model",
          "Bus Type",
          "Bus Seating",
          "Status"
        ];
        
        const missingRequiredHeaders = requiredHeaders.filter(
          (header) => !headers.includes(header)
        );
        
        if (missingRequiredHeaders.length > 0) {
          setExcelError(`Missing required headers: ${missingRequiredHeaders.join(", ")}`);
          return;
        }

        const busDataArray = [];
        for (let i = 1; i < jsonData.length; i++) {
          const row = jsonData[i];
          if (!row || row.length === 0) continue;

          const rowObject = headers.reduce((obj, header, index) => {
            obj[header] = String(row[index] ?? "").trim();
            return obj;
          }, {});

          // Check if all required fields are present
          if (
            !rowObject["Bus Number"] ||
            !rowObject["Service Number"] ||
            !rowObject["Bus Model"] ||
            !rowObject["Bus Type"] ||
            !rowObject["Bus Seating"] ||
            !rowObject["Status"]
          ) {
            setExcelError(
              `Row ${i + 1}: Missing required fields`
            );
            return;
          }

          // Validate each field
          const validationErrors = [];
          const busNumber = validateExcelField('busNumber', rowObject["Bus Number"]);
          if (busNumber) validationErrors.push(`Bus Number: ${busNumber}`);
          
          const serviceNumber = validateExcelField('serviceNumber', rowObject["Service Number"]);
          if (serviceNumber) validationErrors.push(`Service Number: ${serviceNumber}`);
          
          const busModel = validateExcelField('busModel', rowObject["Bus Model"]);
          if (busModel) validationErrors.push(`Bus Model: ${busModel}`);
          
          const busType = validateExcelField('busType', rowObject["Bus Type"]);
          if (busType) validationErrors.push(`Bus Type: ${busType}`);
          
          const busSeating = validateExcelField('busSeating', rowObject["Bus Seating"]);
          if (busSeating) validationErrors.push(`Bus Seating: ${busSeating}`);
          
          const status = validateExcelField('status', rowObject["Status"]);
          if (status) validationErrors.push(`Status: ${status}`);

          if (validationErrors.length > 0) {
            setExcelError(`Row ${i + 1} validation errors: ${validationErrors.join('; ')}`);
            return;
          }

          busDataArray.push({
            busNumber: rowObject["Bus Number"],
            serviceNumber: rowObject["Service Number"],
            busModel: rowObject["Bus Model"],
            busType: rowObject["Bus Type"],
            busSeating: parseInt(rowObject["Bus Seating"]),
            status: rowObject["Status"].toLowerCase() === 'true',
          });
        }

        if (busDataArray.length === 0) {
          setExcelError("Excel file contains no valid data rows.");
          return;
        }

        if (!checkExcelDuplicates(busDataArray)) {
          return;
        }

        setIsUploading(true);
        const failedRegistrations = [];
        let successCount = 0;

        for (const busData of busDataArray) {
          try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL1}/api/buses`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
              },
              body: JSON.stringify(busData),
            });

            let responseData = {};
            try {
              responseData = await response.json();
            } catch (parseError) {
              const responseText = await response.text();
              responseData = { error: responseText || "Invalid response format" };
            }
            
            if (!response.ok) {
              const errorMessage = responseData.error || responseData.message || `HTTP ${response.status}: Registration failed`;
              failedRegistrations.push(`${busData.busNumber}: ${errorMessage}`);
            } else {
              successCount++;
            }
          } catch (error) {
            failedRegistrations.push(`${busData.busNumber}: Network or unexpected error - ${error.message}`);
          }
        }

        setIsUploading(false);

        if (failedRegistrations.length === 0) {
          setSuccessMessage(`${successCount} buses registered successfully`);
          setIsSuccess(true);
          setExcelError(null);
          setTimeout(() => {
            setIsSuccess(false);
          }, 3000);
        } else {
          let message = "";
          if (successCount > 0) {
            message += `✅ ${successCount} buses registered successfully\n\n`;
          }
          message += `❌ Failed to register ${failedRegistrations.length} buses:\n\n`;
          message += failedRegistrations.map((error, index) => `${index + 1}. ${error}`).join("\n");
          setExcelError(message);
        }
      } catch (error) {
        console.error("Error parsing Excel file:", error);
        setExcelError("Failed to parse Excel file. Ensure it is a valid Excel file.");
        setIsUploading(false);
      }
    };
    reader.readAsArrayBuffer(file);
    
    // Clear the file input
    e.target.value = '';
  };

  // Click outside dropdown handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Initialize buses on edit mode
  useEffect(() => {
    if (isEditMode) {
      fetchBuses();
    }
  }, [isEditMode]);

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem('operatortoken');
    if (!token) {
      navigate('/login');
      return;
    }
  }, [navigate]);

  // Handle back navigation
  const handleBack = () => {
    navigate('/dashboard/registration');
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <div className="mb-6">
            <Button
              onClick={handleBack}
              variant="outline"
              className="flex items-center gap-2 text-purple-600 hover:text-purple-700 border-purple-200 hover:border-purple-400 dark:text-purple-400 dark:border-purple-600 dark:hover:border-purple-500"
              data-testid="back-button"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Registration Portal
            </Button>
          </div>

          {/* Toggle Button */}
          <div className="flex items-center justify-end mb-8">
            <Button
              onClick={handleModeSwitch}
              className="flex items-center bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              data-testid="mode-toggle-button"
            >
              {isEditMode ? (
                <>
                  <UserPlus className="mr-2 h-5 w-5" />
                  Switch to Register
                </>
              ) : (
                <>
                  <Save className="mr-2 h-5 w-5" />
                  Switch to Update
                </>
              )}
            </Button>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 bg-clip-text text-transparent mb-2 flex items-center justify-center">
              <Bus className="w-10 h-10 mr-3 text-purple-600" />
              {isEditMode ? 'Update Bus' : 'Bus Registration'}
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              {isEditMode ? 'Update existing bus details' : 'Register a new bus'}
            </p>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
              <span className="text-red-700 dark:text-red-300">{errorMessage}</span>
            </div>
          )}

          {/* Main Form Container */}
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-8 border-2 border-purple-200/70 dark:border-purple-700/70 shadow-2xl">
            
            {/* Dropdown for Update Mode */}
            {isEditMode && (
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select Bus <span className="text-red-500">*</span>
                </label>
                <div className="relative" ref={dropdownRef}>
                  <div className="relative">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => handleSearch(e.target.value)}
                      onFocus={() => setShowDropdown(true)}
                      placeholder="Search bus by ID or number..."
                      className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-200"
                    />
                    <Search className="absolute right-3 top-3.5 h-5 w-5 text-gray-400" />
                  </div>
                  
                  {showDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                      {filteredBuses.length > 0 ? (
                        filteredBuses.map((bus) => (
                          <div
                            key={bus.stvBusId}
                            onClick={() => handleBusSelect(bus)}
                            className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-200 dark:border-gray-600 last:border-b-0"
                          >
                            <div className="font-medium text-gray-900 dark:text-gray-100">
                              {bus.stvBusId}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {bus.busNumber} - {bus.busModel}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-gray-500 dark:text-gray-400">
                          No buses found
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-4">
                Bus {isEditMode ? "Update" : "Registration"}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Bus Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Bus Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="busNumber"
                    value={formData.busNumber}
                    onChange={handleChange}
                    ref={formRefs.busNumber}
                    disabled={isEditMode && !selectedBusId}
                    className={`w-full bg-gray-50 dark:bg-gray-900/50 border ${
                      errors.busNumber ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
                    } rounded-xl px-4 py-3 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
                    placeholder="Enter bus number (e.g. MH12AB3456)"
                    maxLength={20}
                    required
                  />
                  {errors.busNumber && (
                    <p className="mt-1 text-sm text-red-500">{errors.busNumber}</p>
                  )}
                </div>

                {/* Service Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Service Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="serviceNumber"
                    value={formData.serviceNumber}
                    onChange={handleChange}
                    ref={formRefs.serviceNumber}
                    disabled={isEditMode && !selectedBusId}
                    className={`w-full bg-gray-50 dark:bg-gray-900/50 border ${
                      errors.serviceNumber ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
                    } rounded-xl px-4 py-3 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
                    placeholder="Enter service number (e.g. SVC456)"
                    maxLength={20}
                    required
                  />
                  {errors.serviceNumber && (
                    <p className="mt-1 text-sm text-red-500">{errors.serviceNumber}</p>
                  )}
                </div>

                {/* Bus Model */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Bus Model <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="busModel"
                    value={formData.busModel}
                    onChange={handleChange}
                    ref={formRefs.busModel}
                    disabled={isEditMode && !selectedBusId}
                    className={`w-full bg-gray-50 dark:bg-gray-900/50 border ${
                      errors.busModel ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
                    } rounded-xl px-4 py-3 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
                    placeholder="Enter bus model (e.g. Tata Starbus)"
                    maxLength={50}
                    required
                  />
                  {errors.busModel && (
                    <p className="mt-1 text-sm text-red-500">{errors.busModel}</p>
                  )}
                </div>

                {/* Bus Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Bus Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="busType"
                    value={formData.busType}
                    onChange={handleChange}
                    ref={formRefs.busType}
                    disabled={isEditMode && !selectedBusId}
                    className={`w-full bg-gray-50 dark:bg-gray-900/50 border ${
                      errors.busType ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
                    } rounded-xl px-4 py-3 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
                    required
                  >
                    <option value="">Select Bus Type</option>
                    {availableBusTypes.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  {errors.busType && (
                    <p className="mt-1 text-sm text-red-500">{errors.busType}</p>
                  )}
                </div>

                {/* Bus Seating */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Bus Seating <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="busSeating"
                    value={formData.busSeating}
                    onChange={handleChange}
                    ref={formRefs.busSeating}
                    disabled={isEditMode && !selectedBusId}
                    className={`w-full bg-gray-50 dark:bg-gray-900/50 border ${
                      errors.busSeating ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
                    } rounded-xl px-4 py-3 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
                    placeholder="Enter seating capacity (numbers only)"
                    required
                  />
                  {errors.busSeating && (
                    <p className="mt-1 text-sm text-red-500">{errors.busSeating}</p>
                  )}
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="status"
                  id="status"
                  checked={formData.status}
                  onChange={handleChange}
                  disabled={isEditMode && !selectedBusId}
                  className="h-5 w-5 text-purple-500 bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700 rounded focus:ring-purple-500/50 disabled:opacity-50"
                />
                <label htmlFor="status" className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Active Status
                </label>
              </div>

              {/* Buttons */}
              <div className="space-y-4">
                {/* Form Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading || (isEditMode && !selectedBusId)}
                  className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl px-6 py-4 font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  data-testid="submit-button"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      {isEditMode ? 'Updating...' : 'Registering...'}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      {isEditMode ? (
                        <>
                          <Save className="mr-2 h-5 w-5" />
                          Update Bus
                        </>
                      ) : (
                        <>
                          <UserPlus className="mr-2 h-5 w-5" />
                          Register Bus
                        </>
                      )}
                    </div>
                  )}
                </Button>

                {/* Excel Buttons - Only in Registration Mode */}
                {!isEditMode && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Download Template */}
                    <Button
                      type="button"
                      onClick={downloadTemplate}
                      className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl px-6 py-4 font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-green-500/30"
                      data-testid="download-template-button"
                    >
                      <Download className="mr-2 h-5 w-5" />
                      Download Excel Template
                    </Button>

                    {/* Upload Excel */}
                    <div className="relative">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleExcelUpload}
                        accept=".xlsx,.xls"
                        className="hidden"
                        disabled={isUploading}
                      />
                      <Button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl px-6 py-4 font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        data-testid="upload-excel-button"
                      >
                        {isUploading ? (
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Uploading...
                          </div>
                        ) : (
                          <>
                            <Upload className="mr-2 h-5 w-5" />
                            Upload Excel File
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Excel Error Display */}
              {excelError && (
                <div className="mt-4 p-4 bg-red-50 dark:bg-red-950/30 border border-red-300 dark:border-red-800 rounded-xl whitespace-pre-wrap">
                  <p className="font-bold text-red-700 dark:text-red-300">Excel Processing Error:</p>
                  <p className="text-sm text-red-600 dark:text-red-400">{excelError}</p>
                  <button
                    onClick={() => setExcelError(null)}
                    className="mt-2 text-sm text-red-600 dark:text-red-400 hover:text-red-500 dark:hover:text-red-300 underline"
                  >
                    Dismiss
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {isSuccess && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border-2 border-green-200 dark:border-green-800 shadow-2xl transform transition-all duration-300 animate-in fade-in-0 zoom-in-95 max-w-md mx-4">
            <div className="text-center">
              <CheckCircle className="mx-auto text-green-500 w-16 h-16 mb-4 animate-pulse" />
              <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent mb-4">
                Success!
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {successMessage}
              </p>
              <Button
                onClick={() => setIsSuccess(false)}
                className="mt-6 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl px-6 py-2 font-semibold transition-all duration-300"
              >
                <X className="mr-2 h-4 w-4" />
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusRegistration;