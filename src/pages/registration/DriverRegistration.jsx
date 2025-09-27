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
  Eye,
  EyeOff,
  Car
} from 'lucide-react';
import { Button } from '../../components/ui/button.jsx';
import * as XLSX from "xlsx";

const DriverRegistration = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [drivers, setDrivers] = useState([]);
  const [filteredDrivers, setFilteredDrivers] = useState([]);
  const [selectedDriverId, setSelectedDriverId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    contactNum: '',
    mailId: '',
    status: true,
    age: '',
    licenseNumber: '',
  });
  const [errors, setErrors] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [excelError, setExcelError] = useState(null);

  const formRefs = {
    firstName: useRef(null),
    lastName: useRef(null),
    username: useRef(null),
    password: useRef(null),
    contactNum: useRef(null),
    mailId: useRef(null),
    age: useRef(null),
    licenseNumber: useRef(null),
  };

  const fileInputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Get token from localStorage
  const getToken = () => localStorage.getItem('operatortoken');

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
      firstName: '',
      lastName: '',
      username: '',
      password: '',
      contactNum: '',
      mailId: '',
      status: true,
      age: '',
      licenseNumber: '',
    });
    setErrors({});
    setErrorMessage('');
    setIsSuccess(false);
    setSuccessMessage('');
    setSelectedDriverId('');
    setSearchTerm('');
    setExcelError(null);
  }, []);

  // Handle mode switch
  const handleModeSwitch = useCallback(() => {
    setIsEditMode(!isEditMode);
    resetForm();
    if (!isEditMode) {
      fetchDrivers();
    }
  }, [isEditMode, resetForm]);

  // Fetch all drivers for dropdown
  const fetchDrivers = async () => {
    try {
      const token = getToken();
      if (!token) {
        setErrorMessage('No authentication token found');
        return;
      }

      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL1}/api/drivers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch drivers');
      }

      const data = await response.json();
      setDrivers(data);
      setFilteredDrivers(data);
    } catch (error) {
      console.error('Fetch drivers error:', error);
      setErrorMessage('Failed to load drivers list');
    }
  };

  // Fetch specific driver data
  const fetchDriverData = async (driverId) => {
    setIsLoading(true);
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL1}/api/drivers/${driverId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch driver data');
      }

      const data = await response.json();
      setFormData({
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        username: data.userName || '',
        password: '', // Don't show password in update mode
        contactNum: data.contactNumber || '',
        mailId: data.mailId || '',
        status: data.status !== undefined ? data.status : true,
        age: data.age ? data.age.toString() : '',
        licenseNumber: data.licenseNumber || '',
      });
    } catch (error) {
      console.error('Fetch driver error:', error);
      setErrorMessage('Failed to load driver data');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle dropdown search
  const handleSearch = (value) => {
    setSearchTerm(value);
    const filtered = drivers.filter(driver =>
      driver.stvDriverId?.toLowerCase().includes(value.toLowerCase()) ||
      `${driver.firstName} ${driver.lastName}`.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredDrivers(filtered);
  };

  // Handle dropdown selection
  const handleDriverSelect = (driver) => {
    setSelectedDriverId(driver.stvDriverId);
    setSearchTerm(`${driver.stvDriverId} - ${driver.firstName} ${driver.lastName}`);
    setShowDropdown(false);
    fetchDriverData(driver.stvDriverId);
  };

  // Validation functions
  const validateField = useCallback((name, value) => {
    switch (name) {
      case 'firstName':
      case 'lastName':
        if (!value) return `${name === 'firstName' ? 'First' : 'Last'} name is required`;
        if (!/^[a-zA-Z\s]+$/.test(value)) return 'Only alphabets are allowed';
        if (value.length > 20) return 'Must be 20 characters or less';
        return '';
      case 'username':
        if (!value) return 'Username is required';
        if (value.length > 10) return 'Must be 10 characters or less';
        return '';
      case 'password':
        if (!isEditMode && !value) return 'Password is required';
        if (value && value.length > 10) return 'Must be 10 characters or less';
        return '';
      case 'contactNum':
        if (!value) return 'Contact number is required';
        if (!/^\d{10}$/.test(value)) return 'Must be exactly 10 digits';
        return '';
      case 'mailId':
        if (!value) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Valid email is required';
        return '';
      case 'age':
        if (!value) return 'Age is required';
        const ageNum = parseInt(value);
        if (isNaN(ageNum) || ageNum < 18 || ageNum > 99) return 'Age must be between 18 and 99';
        return '';
      case 'licenseNumber':
        if (!value) return 'License number is required';
        if (value.length > 16) return 'Must be 16 characters or less';
        return '';
      default:
        return '';
    }
  }, [isEditMode]);

  // Validation functions for Excel data
  const validateExcelField = (name, value) => {
    switch (name) {
      case 'firstName':
      case 'lastName':
        if (!value) return `${name === 'firstName' ? 'First' : 'Last'} name is required`;
        if (!/^[a-zA-Z\s]+$/.test(value)) return 'Only alphabets are allowed';
        if (value.length > 20) return 'Must be 20 characters or less';
        return '';
      case 'username':
        if (!value) return 'Username is required';
        if (value.length > 10) return 'Must be 10 characters or less';
        return '';
      case 'password':
        if (!value) return 'Password is required';
        if (value.length > 10) return 'Must be 10 characters or less';
        return '';
      case 'contactNum':
        if (!value) return 'Contact number is required';
        if (!/^\d{10}$/.test(value)) return 'Must be exactly 10 digits';
        return '';
      case 'mailId':
        if (!value) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Valid email is required';
        return '';
      case 'age':
        if (!value) return 'Age is required';
        const ageNum = parseInt(value);
        if (isNaN(ageNum) || ageNum < 18 || ageNum > 99) return 'Age must be between 18 and 99';
        return '';
      case 'licenseNumber':
        if (!value) return 'License number is required';
        if (value.length > 16) return 'Must be 16 characters or less';
        return '';
      case 'status':
        if (value !== 'true' && value !== 'false') return 'Status must be true or false';
        return '';
      default:
        return '';
    }
  };

  // Check for duplicates within Excel data
  const checkExcelDuplicates = (driverDataArray) => {
    const seenUsernames = new Set();
    const seenEmails = new Set();
    const seenContactNums = new Set();
    const seenLicenseNumbers = new Set();

    for (let i = 0; i < driverDataArray.length; i++) {
      const driver = driverDataArray[i];
      if (seenUsernames.has(driver.username)) {
        setExcelError(`Row ${i + 2}: Duplicate username: ${driver.username}`);
        return false;
      }
      if (seenEmails.has(driver.mailId)) {
        setExcelError(`Row ${i + 2}: Duplicate email: ${driver.mailId}`);
        return false;
      }
      if (seenContactNums.has(driver.contactNum)) {
        setExcelError(`Row ${i + 2}: Duplicate contact number: ${driver.contactNum}`);
        return false;
      }
      if (seenLicenseNumbers.has(driver.licenseNumber)) {
        setExcelError(`Row ${i + 2}: Duplicate license number: ${driver.licenseNumber}`);
        return false;
      }
      seenUsernames.add(driver.username);
      seenEmails.add(driver.mailId);
      seenContactNums.add(driver.contactNum);
      seenLicenseNumbers.add(driver.licenseNumber);
    }
    return true;
  };

  // Validate entire form
  const validateForm = useCallback(() => {
    const newErrors = {};

    if (isEditMode && !selectedDriverId) {
      setErrorMessage('Please select a driver to update');
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
  }, [formData, isEditMode, selectedDriverId, validateField]);

  // Handle input changes
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    
    // Handle different input types
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'contactNum' || name === 'age') {
      // Only allow numbers for contact number and age
      if (/^\d*$/.test(value)) {
        const maxLength = name === 'contactNum' ? 10 : 2;
        if (value.length <= maxLength) {
          setFormData(prev => ({ ...prev, [name]: value }));
        }
      }
    } else if (name === 'firstName' || name === 'lastName') {
      // Only allow alphabets for names
      if (/^[a-zA-Z\s]*$/.test(value) && value.length <= 20) {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    } else if (name === 'username' || name === 'password') {
      // Allow alphanumeric for username and password
      if (value.length <= 10) {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    } else if (name === 'licenseNumber') {
      // Limit license number to 16 characters
      if (value.length <= 16) {
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
        firstName: formData.firstName,
        lastName: formData.lastName,
        userName: formData.username,
        contactNumber: formData.contactNum,
        mailId: formData.mailId,
        status: formData.status,
        age: parseInt(formData.age),
        licenseNumber: formData.licenseNumber,
      };
      
      // In registration mode, add password
      if (!isEditMode) {
        payload.password = formData.password;
      }

      const url = isEditMode
        ? `${process.env.REACT_APP_API_BASE_URL1}/api/drivers/${selectedDriverId}`
        : `${process.env.REACT_APP_API_BASE_URL1}/api/drivers`;

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
        throw new Error(responseData.error || responseData.message || (isEditMode ? 'Failed to update driver' : 'Failed to register driver'));
      }

      setIsLoading(false);
      setIsSuccess(true);
      
      if (isEditMode) {
        setSuccessMessage(`Driver updated successfully! Driver ID: ${selectedDriverId}`);
      } else {
        setSuccessMessage(`Registration successful! Driver ID: ${responseData.stvDriverId}`);
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
  }, [formData, validateForm, errors, formRefs, isEditMode, selectedDriverId, resetForm]);

  // Download Excel template
  const downloadTemplate = async () => {
    try {
      const templateData = [
        {
          'First Name': 'John',
          'Last Name': 'Doe',
          'Username': 'johndoe',
          'Password': 'pass123',
          'Contact Number': '9876543210',
          'Email': 'john@example.com',
          'Age': '30',
          'License Number': 'DL1234567890',
          'Status': 'true'
        }
      ];
      
      const worksheet = XLSX.utils.json_to_sheet(templateData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Driver Template");
      XLSX.writeFile(workbook, `driver_registration_template.xlsx`);
      
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
          "First Name",
          "Last Name", 
          "Username",
          "Password",
          "Contact Number",
          "Email",
          "Age",
          "License Number",
          "Status"
        ];
        
        const missingRequiredHeaders = requiredHeaders.filter(
          (header) => !headers.includes(header)
        );
        
        if (missingRequiredHeaders.length > 0) {
          setExcelError(`Missing required headers: ${missingRequiredHeaders.join(", ")}`);
          return;
        }

        const driverDataArray = [];
        for (let i = 1; i < jsonData.length; i++) {
          const row = jsonData[i];
          if (!row || row.length === 0) continue;

          const rowObject = headers.reduce((obj, header, index) => {
            obj[header] = String(row[index] ?? "").trim();
            return obj;
          }, {});

          // Check if all required fields are present
          if (
            !rowObject["First Name"] ||
            !rowObject["Last Name"] ||
            !rowObject["Username"] ||
            !rowObject["Password"] ||
            !rowObject["Contact Number"] ||
            !rowObject["Email"] ||
            !rowObject["Age"] ||
            !rowObject["License Number"] ||
            !rowObject["Status"]
          ) {
            setExcelError(
              `Row ${i + 1}: Missing required fields`
            );
            return;
          }

          // Validate each field
          const validationErrors = [];
          const firstName = validateExcelField('firstName', rowObject["First Name"]);
          if (firstName) validationErrors.push(`First Name: ${firstName}`);
          
          const lastName = validateExcelField('lastName', rowObject["Last Name"]);
          if (lastName) validationErrors.push(`Last Name: ${lastName}`);
          
          const username = validateExcelField('username', rowObject["Username"]);
          if (username) validationErrors.push(`Username: ${username}`);
          
          const password = validateExcelField('password', rowObject["Password"]);
          if (password) validationErrors.push(`Password: ${password}`);
          
          const contactNum = validateExcelField('contactNum', rowObject["Contact Number"]);
          if (contactNum) validationErrors.push(`Contact Number: ${contactNum}`);
          
          const mailId = validateExcelField('mailId', rowObject["Email"]);
          if (mailId) validationErrors.push(`Email: ${mailId}`);
          
          const age = validateExcelField('age', rowObject["Age"]);
          if (age) validationErrors.push(`Age: ${age}`);
          
          const licenseNumber = validateExcelField('licenseNumber', rowObject["License Number"]);
          if (licenseNumber) validationErrors.push(`License Number: ${licenseNumber}`);
          
          const status = validateExcelField('status', rowObject["Status"]);
          if (status) validationErrors.push(`Status: ${status}`);

          if (validationErrors.length > 0) {
            setExcelError(`Row ${i + 1} validation errors: ${validationErrors.join('; ')}`);
            return;
          }

          driverDataArray.push({
            firstName: rowObject["First Name"],
            lastName: rowObject["Last Name"],
            userName: rowObject["Username"],
            password: rowObject["Password"],
            contactNumber: rowObject["Contact Number"],
            mailId: rowObject["Email"].toLowerCase(),
            age: parseInt(rowObject["Age"]),
            licenseNumber: rowObject["License Number"],
            status: rowObject["Status"].toLowerCase() === 'true',
          });
        }

        if (driverDataArray.length === 0) {
          setExcelError("Excel file contains no valid data rows.");
          return;
        }

        if (!checkExcelDuplicates(driverDataArray)) {
          return;
        }

        setIsUploading(true);
        const failedRegistrations = [];
        let successCount = 0;

        for (const driverData of driverDataArray) {
          try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL1}/api/drivers`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
              },
              body: JSON.stringify(driverData),
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
              failedRegistrations.push(`${driverData.userName}: ${errorMessage}`);
            } else {
              successCount++;
            }
          } catch (error) {
            failedRegistrations.push(`${driverData.userName}: Network or unexpected error - ${error.message}`);
          }
        }

        setIsUploading(false);

        if (failedRegistrations.length === 0) {
          setSuccessMessage(`${successCount} drivers registered successfully`);
          setIsSuccess(true);
          setExcelError(null);
          setTimeout(() => {
            setIsSuccess(false);
          }, 3000);
        } else {
          let message = "";
          if (successCount > 0) {
            message += `✅ ${successCount} drivers registered successfully\
\
`;
          }
          message += `❌ Failed to register ${failedRegistrations.length} drivers:\
\
`;
          message += failedRegistrations.map((error, index) => `${index + 1}. ${error}`).join("\
");
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

  // Initialize drivers on edit mode
  useEffect(() => {
    if (isEditMode) {
      fetchDrivers();
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
              <Car className="w-10 h-10 mr-3 text-purple-600" />
              {isEditMode ? 'Update Driver' : 'Driver Registration'}
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              {isEditMode ? 'Update existing driver profile' : 'Register a new driver profile'}
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
                  Select Driver <span className="text-red-500">*</span>
                </label>
                <div className="relative" ref={dropdownRef}>
                  <div className="relative">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => handleSearch(e.target.value)}
                      onFocus={() => setShowDropdown(true)}
                      placeholder="Search driver by ID or name..."
                      className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-200"
                    />
                    <Search className="absolute right-3 top-3.5 h-5 w-5 text-gray-400" />
                  </div>
                  
                  {showDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                      {filteredDrivers.length > 0 ? (
                        filteredDrivers.map((driver) => (
                          <div
                            key={driver.stvDriverId}
                            onClick={() => handleDriverSelect(driver)}
                            className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-200 dark:border-gray-600 last:border-b-0"
                          >
                            <div className="font-medium text-gray-900 dark:text-gray-100">
                              {driver.stvDriverId}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {driver.firstName} {driver.lastName}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-gray-500 dark:text-gray-400">
                          No drivers found
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
                Driver {isEditMode ? "Update" : "Registration"}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    ref={formRefs.firstName}
                    disabled={isEditMode && !selectedDriverId}
                    className={`w-full bg-gray-50 dark:bg-gray-900/50 border ${
                      errors.firstName ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
                    } rounded-xl px-4 py-3 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
                    placeholder="Enter first name (alphabets only)"
                    maxLength={20}
                    required
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
                  )}
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    ref={formRefs.lastName}
                    disabled={isEditMode && !selectedDriverId}
                    className={`w-full bg-gray-50 dark:bg-gray-900/50 border ${
                      errors.lastName ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
                    } rounded-xl px-4 py-3 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
                    placeholder="Enter last name (alphabets only)"
                    maxLength={20}
                    required
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
                  )}
                </div>

                {/* Username */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Username <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    ref={formRefs.username}
                    disabled={isEditMode}
                    className={`w-full bg-gray-50 dark:bg-gray-900/50 border ${
                      errors.username ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
                    } rounded-xl px-4 py-3 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
                    placeholder="Enter username"
                    maxLength={10}
                    required={!isEditMode}
                  />
                  {errors.username && (
                    <p className="mt-1 text-sm text-red-500">{errors.username}</p>
                  )}
                  {isEditMode && (
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Username cannot be edited</p>
                  )}
                </div>

                {/* Password - Hidden in update mode */}
                {!isEditMode && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        ref={formRefs.password}
                        className={`w-full bg-gray-50 dark:bg-gray-900/50 border ${
                          errors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
                        } rounded-xl px-4 py-3 pr-10 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-200`}
                        placeholder="Enter password (max 10 chars)"
                        maxLength={10}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                    )}
                  </div>
                )}

                {/* Contact Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Contact Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="contactNum"
                    value={formData.contactNum}
                    onChange={handleChange}
                    ref={formRefs.contactNum}
                    disabled={isEditMode && !selectedDriverId}
                    className={`w-full bg-gray-50 dark:bg-gray-900/50 border ${
                      errors.contactNum ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
                    } rounded-xl px-4 py-3 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
                    placeholder="Enter 10-digit contact number"
                    maxLength={10}
                    required
                  />
                  {errors.contactNum && (
                    <p className="mt-1 text-sm text-red-500">{errors.contactNum}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="mailId"
                    value={formData.mailId}
                    onChange={handleChange}
                    ref={formRefs.mailId}
                    disabled={isEditMode && !selectedDriverId}
                    className={`w-full bg-gray-50 dark:bg-gray-900/50 border ${
                      errors.mailId ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
                    } rounded-xl px-4 py-3 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
                    placeholder="Enter email address"
                    required
                  />
                  {errors.mailId && (
                    <p className="mt-1 text-sm text-red-500">{errors.mailId}</p>
                  )}
                </div>

                {/* Age */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Age <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    ref={formRefs.age}
                    disabled={isEditMode && !selectedDriverId}
                    className={`w-full bg-gray-50 dark:bg-gray-900/50 border ${
                      errors.age ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
                    } rounded-xl px-4 py-3 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
                    placeholder="Enter age (18-99)"
                    maxLength={2}
                    required
                  />
                  {errors.age && (
                    <p className="mt-1 text-sm text-red-500">{errors.age}</p>
                  )}
                </div>

                {/* License Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    License Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={handleChange}
                    ref={formRefs.licenseNumber}
                    disabled={isEditMode && !selectedDriverId}
                    className={`w-full bg-gray-50 dark:bg-gray-900/50 border ${
                      errors.licenseNumber ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
                    } rounded-xl px-4 py-3 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
                    placeholder="Enter license number"
                    maxLength={16}
                    required
                  />
                  {errors.licenseNumber && (
                    <p className="mt-1 text-sm text-red-500">{errors.licenseNumber}</p>
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
                  disabled={isEditMode && !selectedDriverId}
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
                  disabled={isLoading || (isEditMode && !selectedDriverId)}
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
                          Update Driver
                        </>
                      ) : (
                        <>
                          <UserPlus className="mr-2 h-5 w-5" />
                          Register Driver
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

export default DriverRegistration;