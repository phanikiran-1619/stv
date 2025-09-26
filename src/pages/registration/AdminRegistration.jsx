import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Phone, Shield, Eye, EyeOff } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card.jsx';
import { Button } from '../../components/ui/button.jsx';
import useLogoutConfirmation from '../../hooks/useLogoutConfirmation.js';
import LogoutConfirmationDialog from '../../components/LogoutConfirmationDialog.jsx';

const AdminRegistration = () => {
  const navigate = useNavigate();
  const { 
    showLogoutDialog, 
    handleLogoutConfirm, 
    handleLogoutCancel, 
    handleBrowserBack 
  } = useLogoutConfirmation();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    adminId: '',
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    role: 'admin',
    department: '',
    permissions: {
      manageUsers: false,
      manageRoutes: false,
      manageBuses: false,
      viewReports: false,
      systemSettings: false
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
    
    if (name.startsWith('permissions.')) {
      const permission = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        permissions: {
          ...prev.permissions,
          [permission]: checked
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
    
    // Validation
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    // Show success notification
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 z-50 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-right duration-500';
    notification.innerHTML = `
      <div class="font-semibold">Admin Registration Successful!</div>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 3000);

    console.log('Admin Registration Data:', formData);
    
    // Reset form
    setFormData({
      adminId: '',
      fullName: '',
      email: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
      role: 'admin',
      department: '',
      permissions: {
        manageUsers: false,
        manageRoutes: false,
        manageBuses: false,
        viewReports: false,
        systemSettings: false
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
            className="flex items-center gap-2 text-purple-600 hover:text-purple-700 border-purple-200 hover:border-purple-400"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Registration Portal
          </Button>
        </div>

        {/* Registration Form */}
        <Card className="max-w-4xl mx-auto bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border-2 border-purple-200/70 dark:border-purple-700/70 shadow-2xl rounded-3xl">
          <CardHeader className="text-center pb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 bg-clip-text text-transparent">
              Admin Registration
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Register a new system administrator
            </p>
          </CardHeader>

          <CardContent className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Admin ID
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-500 w-5 h-5" />
                    <input
                      type="text"
                      name="adminId"
                      value={formData.adminId}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-purple-200 dark:border-purple-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all"
                      placeholder="Enter admin ID"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-purple-200 dark:border-purple-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all"
                    placeholder="Enter full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-500 w-5 h-5" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-purple-200 dark:border-purple-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all"
                      placeholder="Enter email address"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-500 w-5 h-5" />
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-purple-200 dark:border-purple-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all"
                      placeholder="Enter phone number"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Department
                  </label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-purple-200 dark:border-purple-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all"
                    required
                  >
                    <option value="">Select Department</option>
                    <option value="operations">Operations</option>
                    <option value="management">Management</option>
                    <option value="hr">Human Resources</option>
                    <option value="finance">Finance</option>
                    <option value="it">Information Technology</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Role
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-purple-200 dark:border-purple-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all"
                    required
                  >
                    <option value="admin">System Admin</option>
                    <option value="superadmin">Super Admin</option>
                    <option value="manager">Manager</option>
                  </select>
                </div>
              </div>

              {/* Password Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 pr-10 border border-purple-200 dark:border-purple-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all"
                      placeholder="Enter password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-500 hover:text-purple-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 pr-10 border border-purple-200 dark:border-purple-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all"
                      placeholder="Confirm password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-500 hover:text-purple-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Permissions */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                  Permissions
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries({
                    manageUsers: 'Manage Users',
                    manageRoutes: 'Manage Routes',
                    manageBuses: 'Manage Buses',
                    viewReports: 'View Reports',
                    systemSettings: 'System Settings'
                  }).map(([key, label]) => (
                    <div key={key} className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        name={`permissions.${key}`}
                        checked={formData.permissions[key]}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-purple-600 border-purple-300 rounded focus:ring-purple-500"
                      />
                      <label className="text-sm text-gray-700 dark:text-gray-300">
                        {label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4 pt-6">
                <Button
                  type="button"
                  onClick={handleBack}
                  variant="outline"
                  className="px-8 py-3 border-purple-200 text-purple-600 hover:bg-purple-50"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="px-8 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  Register Admin
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminRegistration;