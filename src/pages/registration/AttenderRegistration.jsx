import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, UserCheck, Phone, MapPin, Calendar, IdCard } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card.jsx';
import { Button } from '../../components/ui/button.jsx';
import useLogoutConfirmation from '../../hooks/useLogoutConfirmation.js';
import LogoutConfirmationDialog from '../../components/LogoutConfirmationDialog.jsx';

const AttenderRegistration = () => {
  const navigate = useNavigate();
  const { 
    showLogoutDialog, 
    handleLogoutConfirm, 
    handleLogoutCancel, 
    handleBrowserBack 
  } = useLogoutConfirmation();

  const [formData, setFormData] = useState({
    attenderId: '',
    fullName: '',
    phoneNumber: '',
    emergencyContact: '',
    address: '',
    dateOfBirth: '',
    experience: '',
    previousEmployer: '',
    languagesSpoken: [],
    medicalCertificate: false,
    backgroundCheck: false,
    trainingCompleted: false,
    shift: 'morning',
    salary: '',
    joiningDate: ''
  });

  const languages = ['English', 'Hindi', 'Tamil', 'Telugu', 'Kannada', 'Malayalam', 'Marathi', 'Bengali'];

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

  const handleLanguageChange = (language) => {
    setFormData(prev => ({
      ...prev,
      languagesSpoken: prev.languagesSpoken.includes(language)
        ? prev.languagesSpoken.filter(lang => lang !== language)
        : [...prev.languagesSpoken, language]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Show success notification
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 z-50 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-right duration-500';
    notification.innerHTML = `
      <div class="font-semibold">Attender Registration Successful!</div>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 3000);

    console.log('Attender Registration Data:', formData);
    
    // Reset form
    setFormData({
      attenderId: '',
      fullName: '',
      phoneNumber: '',
      emergencyContact: '',
      address: '',
      dateOfBirth: '',
      experience: '',
      previousEmployer: '',
      languagesSpoken: [],
      medicalCertificate: false,
      backgroundCheck: false,
      trainingCompleted: false,
      shift: 'morning',
      salary: '',
      joiningDate: ''
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
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 border-blue-200 hover:border-blue-400"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Registration Portal
          </Button>
        </div>

        {/* Registration Form */}
        <Card className="max-w-4xl mx-auto bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border-2 border-blue-200/70 dark:border-blue-700/70 shadow-2xl rounded-3xl">
          <CardHeader className="text-center pb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <UserCheck className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent">
              Attender Registration
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Register a new bus attender
            </p>
          </CardHeader>

          <CardContent className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Attender ID
                  </label>
                  <div className="relative">
                    <IdCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 w-5 h-5" />
                    <input
                      type="text"
                      name="attenderId"
                      value={formData.attenderId}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-blue-200 dark:border-blue-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all"
                      placeholder="Enter attender ID"
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
                    className="w-full px-4 py-3 border border-blue-200 dark:border-blue-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all"
                    placeholder="Enter full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 w-5 h-5" />
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-blue-200 dark:border-blue-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all"
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
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 w-5 h-5" />
                    <input
                      type="tel"
                      name="emergencyContact"
                      value={formData.emergencyContact}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-blue-200 dark:border-blue-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all"
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
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 w-5 h-5" />
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-blue-200 dark:border-blue-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all"
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
                    className="w-full px-4 py-3 border border-blue-200 dark:border-blue-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all"
                    required
                  >
                    <option value="">Select Experience</option>
                    <option value="0-1">0-1 Years</option>
                    <option value="1-3">1-3 Years</option>
                    <option value="3-5">3-5 Years</option>
                    <option value="5+">5+ Years</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Shift
                  </label>
                  <select
                    name="shift"
                    value={formData.shift}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-blue-200 dark:border-blue-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all"
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
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 w-5 h-5" />
                    <input
                      type="date"
                      name="joiningDate"
                      value={formData.joiningDate}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-blue-200 dark:border-blue-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Address and Previous Employment */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Address
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 text-blue-500 w-5 h-5" />
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full pl-10 pr-4 py-3 border border-blue-200 dark:border-blue-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all resize-none"
                      placeholder="Enter complete address"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Previous Employer (if any)
                  </label>
                  <textarea
                    name="previousEmployer"
                    value={formData.previousEmployer}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-blue-200 dark:border-blue-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all resize-none"
                    placeholder="Enter previous employer details"
                  />
                </div>
              </div>

              {/* Languages Spoken */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                  Languages Spoken
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {languages.map((language) => (
                    <div key={language} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.languagesSpoken.includes(language)}
                        onChange={() => handleLanguageChange(language)}
                        className="w-4 h-4 text-blue-600 border-blue-300 rounded focus:ring-blue-500"
                      />
                      <label className="text-sm text-gray-700 dark:text-gray-300">
                        {language}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Certifications and Verification */}
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
                      className="w-4 h-4 text-blue-600 border-blue-300 rounded focus:ring-blue-500"
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
                      className="w-4 h-4 text-blue-600 border-blue-300 rounded focus:ring-blue-500"
                    />
                    <label className="text-sm text-gray-700 dark:text-gray-300">
                      Background Check
                    </label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      name="trainingCompleted"
                      checked={formData.trainingCompleted}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600 border-blue-300 rounded focus:ring-blue-500"
                    />
                    <label className="text-sm text-gray-700 dark:text-gray-300">
                      Training Completed
                    </label>
                  </div>
                </div>
              </div>

              {/* Salary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Monthly Salary
                  </label>
                  <input
                    type="number"
                    name="salary"
                    value={formData.salary}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-blue-200 dark:border-blue-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all"
                    placeholder="Enter monthly salary"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4 pt-6">
                <Button
                  type="button"
                  onClick={handleBack}
                  variant="outline"
                  className="px-8 py-3 border-blue-200 text-blue-600 hover:bg-blue-50"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  Register Attender
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AttenderRegistration;