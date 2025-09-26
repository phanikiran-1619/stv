import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Phone, Calendar, CreditCard, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card.jsx';
import { Button } from '../../components/ui/button.jsx';
import useLogoutConfirmation from '../../hooks/useLogoutConfirmation.js';
import LogoutConfirmationDialog from '../../components/LogoutConfirmationDialog.jsx';

const DriverRegistration = () => {
  const navigate = useNavigate();
  const { 
    showLogoutDialog, 
    handleLogoutConfirm, 
    handleLogoutCancel, 
    handleBrowserBack 
  } = useLogoutConfirmation();

  const [formData, setFormData] = useState({
    driverId: '',
    fullName: '',
    phoneNumber: '',
    emergencyContact: '',
    address: '',
    dateOfBirth: '',
    licenseNumber: '',
    licenseType: '',
    licenseExpiryDate: '',
    experience: '',
    previousEmployer: '',
    medicalCertificate: false,
    backgroundCheck: false,
    trainingCertificate: false,
    bloodGroup: '',
    aadharNumber: '',
    panNumber: '',
    bankAccountNumber: '',
    ifscCode: '',
    salary: '',
    joiningDate: '',
    shift: 'morning'
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
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Show success notification
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 z-50 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-right duration-500';
    notification.innerHTML = `
      <div class="font-semibold">Driver Registration Successful!</div>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 3000);

    console.log('Driver Registration Data:', formData);
    
    // Reset form
    setFormData({
      driverId: '',
      fullName: '',
      phoneNumber: '',
      emergencyContact: '',
      address: '',
      dateOfBirth: '',
      licenseNumber: '',
      licenseType: '',
      licenseExpiryDate: '',
      experience: '',
      previousEmployer: '',
      medicalCertificate: false,
      backgroundCheck: false,
      trainingCertificate: false,
      bloodGroup: '',
      aadharNumber: '',
      panNumber: '',
      bankAccountNumber: '',
      ifscCode: '',
      salary: '',
      joiningDate: '',
      shift: 'morning'
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
            className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 border-emerald-200 hover:border-emerald-400"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Registration Portal
          </Button>
        </div>

        {/* Registration Form */}
        <Card className="max-w-5xl mx-auto bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border-2 border-emerald-200/70 dark:border-emerald-700/70 shadow-2xl rounded-3xl">
          <CardHeader className="text-center pb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <User className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-800 bg-clip-text text-transparent">
              Driver Registration
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Register a new bus driver with licenses and certifications
            </p>
          </CardHeader>

          <CardContent className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Driver ID
                    </label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-500 w-5 h-5" />
                      <input
                        type="text"
                        name="driverId"
                        value={formData.driverId}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-emerald-200 dark:border-emerald-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all"
                        placeholder="Enter driver ID"
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
                      className="w-full px-4 py-3 border border-emerald-200 dark:border-emerald-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all"
                      placeholder="Enter full name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-500 w-5 h-5" />
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-emerald-200 dark:border-emerald-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all"
                        placeholder="Enter phone number"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Emergency Contact
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-500 w-5 h-5" />
                      <input
                        type="tel"
                        name="emergencyContact"
                        value={formData.emergencyContact}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-emerald-200 dark:border-emerald-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all"
                        placeholder="Enter emergency contact"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Date of Birth
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-500 w-5 h-5" />
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-emerald-200 dark:border-emerald-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Blood Group
                    </label>
                    <select
                      name="bloodGroup"
                      value={formData.bloodGroup}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-emerald-200 dark:border-emerald-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all"
                      required
                    >
                      <option value="">Select Blood Group</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-emerald-200 dark:border-emerald-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all resize-none"
                    placeholder="Enter complete address"
                    required
                  />
                </div>
              </div>

              {/* License Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                  License Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      License Number
                    </label>
                    <div className="relative">
                      <Award className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-500 w-5 h-5" />
                      <input
                        type="text"
                        name="licenseNumber"
                        value={formData.licenseNumber}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-emerald-200 dark:border-emerald-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all"
                        placeholder="Enter license number"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      License Type
                    </label>
                    <select
                      name="licenseType"
                      value={formData.licenseType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-emerald-200 dark:border-emerald-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all"
                      required
                    >
                      <option value="">Select License Type</option>
                      <option value="commercial">Commercial</option>
                      <option value="heavy-vehicle">Heavy Vehicle</option>
                      <option value="public-transport">Public Transport</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      License Expiry Date
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-500 w-5 h-5" />
                      <input
                        type="date"
                        name="licenseExpiryDate"
                        value={formData.licenseExpiryDate}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-emerald-200 dark:border-emerald-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Experience (Years)
                    </label>
                    <select
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-emerald-200 dark:border-emerald-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all"
                      required
                    >
                      <option value="">Select Experience</option>
                      <option value="0-1">0-1 Years</option>
                      <option value="1-3">1-3 Years</option>
                      <option value="3-5">3-5 Years</option>
                      <option value="5-10">5-10 Years</option>
                      <option value="10+">10+ Years</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Shift Preference
                    </label>
                    <select
                      name="shift"
                      value={formData.shift}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-emerald-200 dark:border-emerald-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all"
                      required
                    >
                      <option value="morning">Morning (6 AM - 2 PM)</option>
                      <option value="afternoon">Afternoon (2 PM - 10 PM)</option>
                      <option value="night">Night (10 PM - 6 AM)</option>
                      <option value="flexible">Flexible</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Joining Date
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-500 w-5 h-5" />
                      <input
                        type="date"
                        name="joiningDate"
                        value={formData.joiningDate}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-emerald-200 dark:border-emerald-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Document Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                  Document Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Aadhar Number
                    </label>
                    <input
                      type="text"
                      name="aadharNumber"
                      value={formData.aadharNumber}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-emerald-200 dark:border-emerald-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all"
                      placeholder="Enter Aadhar number"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      PAN Number
                    </label>
                    <input
                      type="text"
                      name="panNumber"
                      value={formData.panNumber}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-emerald-200 dark:border-emerald-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all"
                      placeholder="Enter PAN number"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Monthly Salary
                    </label>
                    <input
                      type="number"
                      name="salary"
                      value={formData.salary}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-emerald-200 dark:border-emerald-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all"
                      placeholder="Enter monthly salary"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Bank Account Number
                    </label>
                    <input
                      type="text"
                      name="bankAccountNumber"
                      value={formData.bankAccountNumber}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-emerald-200 dark:border-emerald-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all"
                      placeholder="Enter bank account number"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      IFSC Code
                    </label>
                    <input
                      type="text"
                      name="ifscCode"
                      value={formData.ifscCode}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-emerald-200 dark:border-emerald-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all"
                      placeholder="Enter IFSC code"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Previous Employment */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                  Previous Employment (if any)
                </h3>
                <textarea
                  name="previousEmployer"
                  value={formData.previousEmployer}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-emerald-200 dark:border-emerald-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all resize-none"
                  placeholder="Enter previous employer details (optional)"
                />
              </div>

              {/* Certifications */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                  Certifications & Verification
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      name="medicalCertificate"
                      checked={formData.medicalCertificate}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-emerald-600 border-emerald-300 rounded focus:ring-emerald-500"
                    />
                    <label className="text-sm text-gray-700 dark:text-gray-300">
                      Medical Certificate
                    </label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      name="backgroundCheck"
                      checked={formData.backgroundCheck}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-emerald-600 border-emerald-300 rounded focus:ring-emerald-500"
                    />
                    <label className="text-sm text-gray-700 dark:text-gray-300">
                      Background Check
                    </label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      name="trainingCertificate"
                      checked={formData.trainingCertificate}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-emerald-600 border-emerald-300 rounded focus:ring-emerald-500"
                    />
                    <label className="text-sm text-gray-700 dark:text-gray-300">
                      Training Certificate
                    </label>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4 pt-6">
                <Button
                  type="button"
                  onClick={handleBack}
                  variant="outline"
                  className="px-8 py-3 border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  Register Driver
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DriverRegistration;