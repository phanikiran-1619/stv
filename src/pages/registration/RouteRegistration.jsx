import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft,
  MapPin, 
  CheckCircle, 
  AlertCircle, 
  Save, 
  Upload, 
  Download,
  Search,
  X,
  Plus,
  Trash2
} from 'lucide-react';
import { Button } from '../../components/ui/button.jsx';
import * as XLSX from "xlsx";

const RouteRegistration = () => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [routes, setRoutes] = useState([]);
  const [filteredRoutes, setFilteredRoutes] = useState([]);
  const [selectedRouteId, setSelectedRouteId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [formData, setFormData] = useState({
    stv_route_id: '',
    Name_of_the_route: '',
    city_code: '',
    Source: '',
    Destination: '',
    Status: true,
    title: '',
    content: '',
    reserve: false,
    description: ''
  });
  const [routePoints, setRoutePoints] = useState([{
    stvRoutePointId: '',
    routePoint: '',
    latitude: '',
    longitude: '',
    routePointAlias: ''
  }]);
  const [errors, setErrors] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [excelError, setExcelError] = useState(null);

  const formRefs = {
    stv_route_id: useRef(null),
    Name_of_the_route: useRef(null),
    city_code: useRef(null),
    Source: useRef(null),
    Destination: useRef(null),
    title: useRef(null),
    content: useRef(null),
    description: useRef(null)
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
      stv_route_id: '',
      Name_of_the_route: '',
      city_code: '',
      Source: '',
      Destination: '',
      Status: true,
      title: '',
      content: '',
      reserve: false,
      description: ''
    });
    setRoutePoints([{
      stvRoutePointId: '',
      routePoint: '',
      latitude: '',
      longitude: '',
      routePointAlias: ''
    }]);
    setErrors({});
    setErrorMessage('');
    setIsSuccess(false);
    setSuccessMessage('');
    setSelectedRouteId('');
    setSearchTerm('');
    setExcelError(null);
  }, []);

  // Handle mode switch
  const handleModeSwitch = useCallback(() => {
    setIsEditMode(!isEditMode);
    resetForm();
    if (!isEditMode) {
      fetchRoutes();
    }
  }, [isEditMode, resetForm]);

  // Fetch all routes for dropdown
  const fetchRoutes = async () => {
    try {
      const token = getToken();
      if (!token) {
        setErrorMessage('No authentication token found');
        return;
      }

      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL1}/api/routes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch routes');
      }

      const data = await response.json();
      setRoutes(data);
      setFilteredRoutes(data);
    } catch (error) {
      console.error('Fetch routes error:', error);
      setErrorMessage('Failed to load routes list');
    }
  };

  // Fetch specific route data
  const fetchRouteData = async (routeId) => {
    setIsLoading(true);
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL1}/api/routes/${routeId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch route data');
      }

      const data = await response.json();
      setFormData({
        stv_route_id: data.stvRouteId || routeId || '',
        Name_of_the_route: data.routeName || '',
        city_code: data.cityCode || '',
        Source: data.source || '',
        Destination: data.destination || '',
        Status: data.status !== undefined ? data.status : true,
        title: data.title || '',
        content: data.content || '',
        reserve: data.reserve || false,
        description: data.description || ''
      });
      setRoutePoints(data.routePoints?.map((point) => ({
        stvRoutePointId: point.stvRoutePointId || '',
        routePoint: point.routePoint || '',
        latitude: point.latitude || '',
        longitude: point.longitude || '',
        routePointAlias: point.routePointAlias || ''
      })) || [{
        stvRoutePointId: '',
        routePoint: '',
        latitude: '',
        longitude: '',
        routePointAlias: ''
      }]);
    } catch (error) {
      console.error('Fetch route error:', error);
      setErrorMessage('Failed to load route data');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle dropdown search
  const handleSearch = (value) => {
    setSearchTerm(value);
    const filtered = routes.filter(route =>
      route.stvRouteId?.toLowerCase().includes(value.toLowerCase()) ||
      route.routeName?.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredRoutes(filtered);
  };

  // Handle dropdown selection
  const handleRouteSelect = (route) => {
    setSelectedRouteId(route.stvRouteId);
    setSearchTerm(`${route.stvRouteId} - ${route.routeName}`);
    setShowDropdown(false);
    fetchRouteData(route.stvRouteId);
  };

  // Validation functions
  const validateField = useCallback((name, value) => {
    switch (name) {
      case 'stv_route_id':
        if (!isEditMode && !value) return 'Route ID is required';
        if (value && value.length > 8) return 'Must be 8 characters or less';
        return '';
      case 'Name_of_the_route':
        if (!value) return 'Route Name is required';
        if (value.length > 100) return 'Must be 100 characters or less';
        if (!/^[a-zA-Z\s]+$/.test(value)) return 'Only alphabets and spaces are allowed';
        return '';
      case 'city_code':
        if (!value) return 'City Code is required';
        if (value.length !== 3) return 'Must be exactly 3 characters';
        if (!/^[a-zA-Z]{3}$/.test(value)) return 'Must contain only alphabets';
        return '';
      case 'Source':
        if (!value) return 'Source is required';
        if (value.length > 100) return 'Must be 100 characters or less';
        if (!/^[a-zA-Z\s]+$/.test(value)) return 'Only alphabets and spaces are allowed';
        return '';
      case 'Destination':
        if (!value) return 'Destination is required';
        if (value.length > 100) return 'Must be 100 characters or less';
        return '';
      case 'title':
        if (!value) return 'Title is required';
        if (value.length > 100) return 'Must be 100 characters or less';
        return '';
      case 'content':
        if (!value) return 'Content is required';
        if (value.length > 500) return 'Must be 500 characters or less';
        return '';
      case 'description':
        if (!value) return 'Description is required';
        if (value.length > 500) return 'Must be 500 characters or less';
        return '';
      default:
        return '';
    }
  }, [isEditMode]);

  // Validate route point
  const validateRoutePoint = useCallback((point, index) => {
    const newErrors = {
      stvRoutePointId: !point.stvRoutePointId || point.stvRoutePointId.length !== 8
        ? 'Route Point ID is required and must be exactly 8 characters'
        : '',
      routePoint: !point.routePoint ? 'Route Point is required' : '',
      latitude: !point.latitude || !/^-?\d+(\.\d+)?$/.test(point.latitude)
        ? 'Valid latitude is required' : '',
      longitude: !point.longitude || !/^-?\d+(\.\d+)?$/.test(point.longitude)
        ? 'Valid longitude is required' : '',
      routePointAlias: !point.routePointAlias ? 'Route Point Alias is required' : ''
    };
    return newErrors;
  }, []);

  // Validate entire form
  const validateForm = useCallback(() => {
    const newErrors = {};

    if (isEditMode && !selectedRouteId) {
      setErrorMessage('Please select a route to update');
      return false;
    }

    Object.entries(formData).forEach(([key, value]) => {
      if (key !== 'Status' && key !== 'reserve') {
        const error = validateField(key, value);
        if (error) {
          newErrors[key] = error;
        }
      }
    });

    // Validate route points
    const routePointErrors = routePoints.map((point, index) => validateRoutePoint(point, index));
    const hasRoutePointErrors = routePointErrors.some(pointError =>
      Object.values(pointError).some(error => error !== '')
    );

    if (hasRoutePointErrors) {
      newErrors.routePoints = routePointErrors;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, routePoints, isEditMode, selectedRouteId, validateField, validateRoutePoint]);

  // Handle input changes
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    
    // Handle different input types
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'stv_route_id') {
      // Limit route ID to 8 characters
      if (value.length <= 8) {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    } else if (name === 'Name_of_the_route' || name === 'Source') {
      // Only allow alphabets and spaces for route name and source
      if (/^[a-zA-Z\s]*$/.test(value) && value.length <= 100) {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    } else if (name === 'city_code') {
      // Only allow alphabets for city code, max 3 characters
      if (/^[a-zA-Z]*$/.test(value) && value.length <= 3) {
        setFormData(prev => ({ ...prev, [name]: value.toUpperCase() }));
      }
    } else if (name === 'Destination') {
      // Limit destination to 100 characters
      if (value.length <= 100) {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    } else if (name === 'title') {
      // Limit title to 100 characters
      if (value.length <= 100) {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    } else if (name === 'content' || name === 'description') {
      // Limit content and description to 500 characters
      if (value.length <= 500) {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error for this field
    setErrors(prev => ({ ...prev, [name]: undefined }));
  }, []);

  // Handle route point changes
  const handleRoutePointChange = useCallback((index, field, value) => {
    const updatedPoints = [...routePoints];
    
    if (field === 'stvRoutePointId' && value.length > 8) return;
    if (field === 'latitude' || field === 'longitude') {
      // Allow decimal numbers for coordinates
      if (value && !/^-?\d*\.?\d*$/.test(value)) return;
    }
    
    updatedPoints[index] = { ...updatedPoints[index], [field]: value };
    setRoutePoints(updatedPoints);

    // Clear error for this field
    const pointErrors = validateRoutePoint(updatedPoints[index], index);
    setErrors(prev => {
      const updatedRoutePointErrors = [...(prev.routePoints || [])];
      updatedRoutePointErrors[index] = pointErrors;
      return { ...prev, routePoints: updatedRoutePointErrors };
    });
  }, [routePoints, validateRoutePoint]);

  // Add route point
  const addRoutePoint = useCallback(() => {
    setRoutePoints(prev => [...prev, {
      stvRoutePointId: '',
      routePoint: '',
      latitude: '',
      longitude: '',
      routePointAlias: ''
    }]);
  }, []);

  // Remove route point
  const removeRoutePoint = useCallback((index) => {
    if (routePoints.length <= 1) return;
    const updatedPoints = [...routePoints];
    updatedPoints.splice(index, 1);
    setRoutePoints(updatedPoints);

    const updatedErrors = [...(errors.routePoints || [])];
    updatedErrors.splice(index, 1);
    setErrors(prev => ({ ...prev, routePoints: updatedErrors }));
  }, [routePoints, errors.routePoints]);

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
        stvRouteId: formData.stv_route_id,
        routeName: formData.Name_of_the_route,
        cityCode: formData.city_code,
        source: formData.Source,
        destination: formData.Destination,
        status: formData.Status,
        title: formData.title,
        reserve: formData.reserve,
        content: formData.content,
        description: formData.description,
        routePoints: routePoints.map(point => ({
          stvRoutePointId: point.stvRoutePointId,
          routePoint: point.routePoint,
          latitude: point.latitude,
          longitude: point.longitude,
          routePointAlias: point.routePointAlias
        }))
      };

      const url = isEditMode
        ? `${process.env.REACT_APP_API_BASE_URL1}/api/routes/${selectedRouteId}`
        : `${process.env.REACT_APP_API_BASE_URL1}/api/routes`;

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
        throw new Error(responseData.message || (isEditMode ? 'Failed to update route' : 'Failed to register route'));
      }

      setIsLoading(false);
      setIsSuccess(true);
      
      if (isEditMode) {
        setSuccessMessage('Route updated successfully!');
      } else {
        setSuccessMessage(`Registration successful! Route ID: ${responseData.stvRouteId}`);
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
  }, [formData, routePoints, validateForm, errors, formRefs, isEditMode, selectedRouteId, resetForm]);

  // Download Excel template
  const downloadTemplate = async () => {
    try {
      const templateData = [
        {
          'Route ID': 'RT001',
          'Route Name': 'Downtown Express',
          'City Code': 'NYC',
          'Source': 'Central Station',
          'Destination': 'Harbor Terminal',
          'Status': 'true',
          'Title': 'Express Route to Harbor',
          'Content': 'This route offers fast travel between downtown and the harbor.',
          'Reserve': 'false',
          'Description': 'A high-frequency route with limited stops.',
          'Route Point ID 1': 'RP001001',
          'Route Point 1': 'Central Station',
          'Latitude 1': '40.7128',
          'Longitude 1': '-74.0060',
          'Route Point Alias 1': 'Main Hub'
        }
      ];
      
      const worksheet = XLSX.utils.json_to_sheet(templateData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Route Template");
      XLSX.writeFile(workbook, `route_registration_template.xlsx`);
      
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

  // Validation functions for Excel data
  const validateExcelField = (name, value) => {
    switch (name) {
      case 'routeId':
        if (!value) return 'Route ID is required';
        if (value.length > 8) return 'Must be 8 characters or less';
        return '';
      case 'routeName':
        if (!value) return 'Route Name is required';
        if (value.length > 100) return 'Must be 100 characters or less';
        if (!/^[a-zA-Z\s]+$/.test(value)) return 'Only alphabets and spaces are allowed';
        return '';
      case 'cityCode':
        if (!value) return 'City Code is required';
        if (value.length !== 3) return 'Must be exactly 3 characters';
        if (!/^[a-zA-Z]{3}$/.test(value)) return 'Must contain only alphabets';
        return '';
      case 'source':
        if (!value) return 'Source is required';
        if (value.length > 100) return 'Must be 100 characters or less';
        if (!/^[a-zA-Z\s]+$/.test(value)) return 'Only alphabets and spaces are allowed';
        return '';
      case 'destination':
        if (!value) return 'Destination is required';
        if (value.length > 100) return 'Must be 100 characters or less';
        return '';
      case 'title':
        if (!value) return 'Title is required';
        if (value.length > 100) return 'Must be 100 characters or less';
        return '';
      case 'content':
        if (!value) return 'Content is required';
        if (value.length > 500) return 'Must be 500 characters or less';
        return '';
      case 'description':
        if (!value) return 'Description is required';
        if (value.length > 500) return 'Must be 500 characters or less';
        return '';
      case 'status':
      case 'reserve':
        if (value !== 'true' && value !== 'false') return 'Must be true or false';
        return '';
      default:
        return '';
    }
  };

  // Check for duplicates within Excel data
  const checkExcelDuplicates = (routeDataArray) => {
    const seenRouteIds = new Set();

    for (let i = 0; i < routeDataArray.length; i++) {
      const route = routeDataArray[i];
      if (seenRouteIds.has(route.stv_route_id)) {
        setExcelError(`Row ${i + 2}: Duplicate route ID: ${route.stv_route_id}`);
        return false;
      }
      seenRouteIds.add(route.stv_route_id);
    }
    return true;
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
          "Route ID",
          "Route Name", 
          "City Code",
          "Source",
          "Destination",
          "Status",
          "Title",
          "Content",
          "Reserve",
          "Description"
        ];
        
        const missingRequiredHeaders = requiredHeaders.filter(
          (header) => !headers.includes(header)
        );
        
        if (missingRequiredHeaders.length > 0) {
          setExcelError(`Missing required headers: ${missingRequiredHeaders.join(", ")}`);
          return;
        }

        const routeDataArray = [];
        for (let i = 1; i < jsonData.length; i++) {
          const row = jsonData[i];
          if (!row || row.length === 0) continue;

          const rowObject = headers.reduce((obj, header, index) => {
            obj[header] = String(row[index] ?? "").trim();
            return obj;
          }, {});

          // Check if all required fields are present
          if (
            !rowObject["Route ID"] ||
            !rowObject["Route Name"] ||
            !rowObject["City Code"] ||
            !rowObject["Source"] ||
            !rowObject["Destination"] ||
            !rowObject["Status"] ||
            !rowObject["Title"] ||
            !rowObject["Content"] ||
            !rowObject["Reserve"] ||
            !rowObject["Description"]
          ) {
            setExcelError(
              `Row ${i + 1}: Missing required fields (Route ID, Route Name, City Code, Source, Destination, Status, Title, Content, Reserve, Description)`
            );
            return;
          }

          // Validate each field
          const validationErrors = [];
          const routeId = validateExcelField('routeId', rowObject["Route ID"]);
          if (routeId) validationErrors.push(`Route ID: ${routeId}`);
          
          const routeName = validateExcelField('routeName', rowObject["Route Name"]);
          if (routeName) validationErrors.push(`Route Name: ${routeName}`);
          
          const cityCode = validateExcelField('cityCode', rowObject["City Code"]);
          if (cityCode) validationErrors.push(`City Code: ${cityCode}`);
          
          const source = validateExcelField('source', rowObject["Source"]);
          if (source) validationErrors.push(`Source: ${source}`);
          
          const destination = validateExcelField('destination', rowObject["Destination"]);
          if (destination) validationErrors.push(`Destination: ${destination}`);
          
          const title = validateExcelField('title', rowObject["Title"]);
          if (title) validationErrors.push(`Title: ${title}`);
          
          const content = validateExcelField('content', rowObject["Content"]);
          if (content) validationErrors.push(`Content: ${content}`);
          
          const description = validateExcelField('description', rowObject["Description"]);
          if (description) validationErrors.push(`Description: ${description}`);
          
          const status = validateExcelField('status', rowObject["Status"]);
          if (status) validationErrors.push(`Status: ${status}`);
          
          const reserve = validateExcelField('reserve', rowObject["Reserve"]);
          if (reserve) validationErrors.push(`Reserve: ${reserve}`);

          if (validationErrors.length > 0) {
            setExcelError(`Row ${i + 1} validation errors: ${validationErrors.join('; ')}`);
            return;
          }

          routeDataArray.push({
            stv_route_id: rowObject["Route ID"],
            Name_of_the_route: rowObject["Route Name"],
            city_code: rowObject["City Code"],
            Source: rowObject["Source"],
            Destination: rowObject["Destination"],
            Status: rowObject["Status"].toLowerCase() === 'true',
            title: rowObject["Title"],
            content: rowObject["Content"],
            reserve: rowObject["Reserve"].toLowerCase() === 'true',
            description: rowObject["Description"]
          });
        }

        if (routeDataArray.length === 0) {
          setExcelError("Excel file contains no valid data rows.");
          return;
        }

        if (!checkExcelDuplicates(routeDataArray)) {
          return;
        }

        setIsUploading(true);
        const failedRegistrations = [];
        let successCount = 0;

        for (const routeData of routeDataArray) {
          try {
            const payload = {
              stvRouteId: routeData.stv_route_id,
              routeName: routeData.Name_of_the_route,
              cityCode: routeData.city_code,
              source: routeData.Source,
              destination: routeData.Destination,
              status: routeData.Status,
              title: routeData.title,
              reserve: routeData.reserve,
              content: routeData.content,
              description: routeData.description,
              routePoints: []
            };

            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL1}/api/routes`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
              },
              body: JSON.stringify(payload),
            });

            let responseData = {};
            try {
              responseData = await response.json();
            } catch (parseError) {
              // If response is not JSON, use response text
              const responseText = await response.text();
              responseData = { error: responseText || "Invalid response format" };
            }
            
            if (!response.ok) {
              // Check for both 'error' and 'message' fields in API response
              const errorMessage = responseData.error || responseData.message || `HTTP ${response.status}: Registration failed`;
              failedRegistrations.push(`${routeData.stv_route_id}: ${errorMessage}`);
            } else {
              successCount++;
            }
          } catch (error) {
            failedRegistrations.push(`${routeData.stv_route_id}: Network or unexpected error - ${error.message}`);
          }
        }

        setIsUploading(false);

        if (failedRegistrations.length === 0) {
          setSuccessMessage(`${successCount} routes registered successfully`);
          setIsSuccess(true);
          setExcelError(null);
          setTimeout(() => {
            setIsSuccess(false);
          }, 3000);
        } else {
          let message = "";
          if (successCount > 0) {
            message += `✅ ${successCount} routes registered successfully\n\n`;
          }
          message += `❌ Failed to register ${failedRegistrations.length} routes:\n\n`;
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

  // Initialize routes on edit mode
  useEffect(() => {
    if (isEditMode) {
      fetchRoutes();
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
                  <MapPin className="mr-2 h-5 w-5" />
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
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 bg-clip-text text-transparent mb-2">
              {isEditMode ? 'Update Route' : 'Route Registration'}
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              {isEditMode ? 'Update existing route profile' : 'Register a new route profile'}
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
                  Select Route <span className="text-red-500">*</span>
                </label>
                <div className="relative" ref={dropdownRef}>
                  <div className="relative">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => handleSearch(e.target.value)}
                      onFocus={() => setShowDropdown(true)}
                      placeholder="Search route by ID or name..."
                      className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-200"
                    />
                    <Search className="absolute right-3 top-3.5 h-5 w-5 text-gray-400" />
                  </div>
                  
                  {showDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                      {filteredRoutes.length > 0 ? (
                        filteredRoutes.map((route) => (
                          <div
                            key={route.id}
                            onClick={() => handleRouteSelect(route)}
                            className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-200 dark:border-gray-600 last:border-b-0"
                          >
                            <div className="font-medium text-gray-900 dark:text-gray-100">
                              {route.stvRouteId}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {route.routeName}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-gray-500 dark:text-gray-400">
                          No routes found
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Route ID - Hidden in update mode */}
                {!isEditMode && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Route ID <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="stv_route_id"
                      value={formData.stv_route_id}
                      onChange={handleChange}
                      ref={formRefs.stv_route_id}
                      className={`w-full bg-gray-50 dark:bg-gray-900/50 border ${
                        errors.stv_route_id ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
                      } rounded-xl px-4 py-3 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-200`}
                      placeholder="Enter route ID (max 8 chars)"
                      maxLength={8}
                      required
                    />
                    {errors.stv_route_id && (
                      <p className="mt-1 text-sm text-red-500">{errors.stv_route_id}</p>
                    )}
                  </div>
                )}

                {/* Route Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Route Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="Name_of_the_route"
                    value={formData.Name_of_the_route}
                    onChange={handleChange}
                    ref={formRefs.Name_of_the_route}
                    disabled={isEditMode && !selectedRouteId}
                    className={`w-full bg-gray-50 dark:bg-gray-900/50 border ${
                      errors.Name_of_the_route ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
                    } rounded-xl px-4 py-3 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
                    placeholder="Enter route name (alphabets only)"
                    maxLength={100}
                    required
                  />
                  {errors.Name_of_the_route && (
                    <p className="mt-1 text-sm text-red-500">{errors.Name_of_the_route}</p>
                  )}
                </div>

                {/* City Code */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    City Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="city_code"
                    value={formData.city_code}
                    onChange={handleChange}
                    ref={formRefs.city_code}
                    disabled={isEditMode && !selectedRouteId}
                    className={`w-full bg-gray-50 dark:bg-gray-900/50 border ${
                      errors.city_code ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
                    } rounded-xl px-4 py-3 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
                    placeholder="Enter city code (3 letters)"
                    maxLength={3}
                    required
                  />
                  {errors.city_code && (
                    <p className="mt-1 text-sm text-red-500">{errors.city_code}</p>
                  )}
                </div>

                {/* Source */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Source <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="Source"
                    value={formData.Source}
                    onChange={handleChange}
                    ref={formRefs.Source}
                    disabled={isEditMode && !selectedRouteId}
                    className={`w-full bg-gray-50 dark:bg-gray-900/50 border ${
                      errors.Source ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
                    } rounded-xl px-4 py-3 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
                    placeholder="Enter source location (alphabets only)"
                    maxLength={100}
                    required
                  />
                  {errors.Source && (
                    <p className="mt-1 text-sm text-red-500">{errors.Source}</p>
                  )}
                </div>

                {/* Destination */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Destination <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="Destination"
                    value={formData.Destination}
                    onChange={handleChange}
                    ref={formRefs.Destination}
                    disabled={isEditMode && !selectedRouteId}
                    className={`w-full bg-gray-50 dark:bg-gray-900/50 border ${
                      errors.Destination ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
                    } rounded-xl px-4 py-3 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
                    placeholder="Enter destination location"
                    maxLength={100}
                    required
                  />
                  {errors.Destination && (
                    <p className="mt-1 text-sm text-red-500">{errors.Destination}</p>
                  )}
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    ref={formRefs.title}
                    disabled={isEditMode && !selectedRouteId}
                    className={`w-full bg-gray-50 dark:bg-gray-900/50 border ${
                      errors.title ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
                    } rounded-xl px-4 py-3 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
                    placeholder="Enter route title"
                    maxLength={100}
                    required
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-500">{errors.title}</p>
                  )}
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Content <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    ref={formRefs.content}
                    disabled={isEditMode && !selectedRouteId}
                    className={`w-full bg-gray-50 dark:bg-gray-900/50 border ${
                      errors.content ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
                    } rounded-xl px-4 py-3 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
                    placeholder="Enter route content"
                    maxLength={500}
                    required
                  />
                  {errors.content && (
                    <p className="mt-1 text-sm text-red-500">{errors.content}</p>
                  )}
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    ref={formRefs.description}
                    disabled={isEditMode && !selectedRouteId}
                    rows={3}
                    className={`w-full bg-gray-50 dark:bg-gray-900/50 border ${
                      errors.description ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
                    } rounded-xl px-4 py-3 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed resize-none`}
                    placeholder="Enter route description"
                    maxLength={500}
                    required
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-500">{errors.description}</p>
                  )}
                </div>
              </div>

              {/* Route Points Section */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">Route Points</h3>
                  <Button
                    type="button"
                    onClick={addRoutePoint}
                    disabled={isEditMode && !selectedRouteId}
                    className="bg-purple-500 hover:bg-purple-600 text-white rounded-xl px-3 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Point
                  </Button>
                </div>
                {routePoints.map((point, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Route Point ID <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={point.stvRoutePointId}
                          onChange={(e) => handleRoutePointChange(index, 'stvRoutePointId', e.target.value)}
                          disabled={isEditMode && !selectedRouteId}
                          maxLength={8}
                          className={`w-full bg-white dark:bg-gray-800/50 border ${
                            errors.routePoints?.[index]?.stvRoutePointId ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
                          } rounded-lg px-3 py-2 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed`}
                          placeholder="8 characters"
                          required
                        />
                        {errors.routePoints?.[index]?.stvRoutePointId && (
                          <p className="mt-1 text-sm text-red-500">{errors.routePoints[index].stvRoutePointId}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Point Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={point.routePoint}
                          onChange={(e) => handleRoutePointChange(index, 'routePoint', e.target.value)}
                          disabled={isEditMode && !selectedRouteId}
                          className={`w-full bg-white dark:bg-gray-800/50 border ${
                            errors.routePoints?.[index]?.routePoint ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
                          } rounded-lg px-3 py-2 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed`}
                          placeholder="Point name"
                          required
                        />
                        {errors.routePoints?.[index]?.routePoint && (
                          <p className="mt-1 text-sm text-red-500">{errors.routePoints[index].routePoint}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Latitude <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={point.latitude}
                          onChange={(e) => handleRoutePointChange(index, 'latitude', e.target.value)}
                          disabled={isEditMode && !selectedRouteId}
                          className={`w-full bg-white dark:bg-gray-800/50 border ${
                            errors.routePoints?.[index]?.latitude ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
                          } rounded-lg px-3 py-2 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed`}
                          placeholder="Latitude"
                          required
                        />
                        {errors.routePoints?.[index]?.latitude && (
                          <p className="mt-1 text-sm text-red-500">{errors.routePoints[index].latitude}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Longitude <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={point.longitude}
                          onChange={(e) => handleRoutePointChange(index, 'longitude', e.target.value)}
                          disabled={isEditMode && !selectedRouteId}
                          className={`w-full bg-white dark:bg-gray-800/50 border ${
                            errors.routePoints?.[index]?.longitude ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
                          } rounded-lg px-3 py-2 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed`}
                          placeholder="Longitude"
                          required
                        />
                        {errors.routePoints?.[index]?.longitude && (
                          <p className="mt-1 text-sm text-red-500">{errors.routePoints[index].longitude}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Point Alias <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={point.routePointAlias}
                          onChange={(e) => handleRoutePointChange(index, 'routePointAlias', e.target.value)}
                          disabled={isEditMode && !selectedRouteId}
                          className={`w-full bg-white dark:bg-gray-800/50 border ${
                            errors.routePoints?.[index]?.routePointAlias ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
                          } rounded-lg px-3 py-2 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed`}
                          placeholder="Point alias"
                          required
                        />
                        {errors.routePoints?.[index]?.routePointAlias && (
                          <p className="mt-1 text-sm text-red-500">{errors.routePoints[index].routePointAlias}</p>
                        )}
                      </div>
                    </div>
                    {routePoints.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => removeRoutePoint(index)}
                        disabled={isEditMode && !selectedRouteId}
                        className="bg-red-500/20 hover:bg-red-600/30 text-red-500 rounded-lg px-3 py-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Remove
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              {/* Status and Reserve Checkboxes */}
              <div className="flex space-x-6">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="Status"
                    id="Status"
                    checked={formData.Status}
                    onChange={handleChange}
                    disabled={isEditMode && !selectedRouteId}
                    className="h-5 w-5 text-purple-500 bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700 rounded focus:ring-purple-500/50 disabled:opacity-50"
                  />
                  <label htmlFor="Status" className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Active Status
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="reserve"
                    id="reserve"
                    checked={formData.reserve}
                    onChange={handleChange}
                    disabled={isEditMode && !selectedRouteId}
                    className="h-5 w-5 text-purple-500 bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700 rounded focus:ring-purple-500/50 disabled:opacity-50"
                  />
                  <label htmlFor="reserve" className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Reserve Route
                  </label>
                </div>
              </div>

              {/* Buttons */}
              <div className="space-y-4">
                {/* Form Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading || (isEditMode && !selectedRouteId)}
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
                          Update Route
                        </>
                      ) : (
                        <>
                          <MapPin className="mr-2 h-5 w-5" />
                          Register Route
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

export default RouteRegistration;