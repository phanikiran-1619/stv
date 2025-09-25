import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button.jsx';
import { Input } from '../components/ui/input.jsx';
import { Label } from '../components/ui/label.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card.jsx';
import { Bus, Eye, EyeOff, Lock, User, ArrowLeft, Shield, CheckCircle, AlertCircle } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle.jsx';
import { setToken } from '../lib/token.js';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const LoginPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [showForgotPasswordForm, setShowForgotPasswordForm] = useState(false);
  const [showForgotPasswordOtpForm, setShowForgotPasswordOtpForm] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [forgotPasswordOtp, setForgotPasswordOtp] = useState(['', '', '', '', '', '']);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [forgotPasswordData, setForgotPasswordData] = useState({
    username: '',
    newPassword: '',
  });
  
  const otpInputs = useRef([]);
  const forgotPasswordOtpInputs = useRef([]);

  // Initialize forgot password with username from login form
  const handleForgotPasswordClick = () => {
    setForgotPasswordData({
      username: formData.username,
      newPassword: ''
    });
    setShowForgotPasswordForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Clean the input data exactly like Swagger
    const loginData = {
      username: formData.username.trim(),
      password: formData.password
    };

    console.log('🔐 Attempting login with:', { username: loginData.username, password: '[HIDDEN]' });

    try {
      const response = await axios({
        method: 'POST',
        url: `${process.env.REACT_APP_API_BASE_URL}/login`,
        data: loginData,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: 15000,
        validateStatus: function (status) {
          return status < 500; // Accept anything less than 500 as valid
        }
      });

      console.log('📡 API Response:', response.status, response.data);

      if (response.status === 200) {
        const data = response.data;
        
        if (data.otpRequired === true) {
          toast.success(data.message || 'OTP sent to your phone', {
            duration: 4000,
            position: 'top-center',
          });
          setShowOtpForm(true);
        } else if (data.token && data.role) {
          setToken(data.token, data.role);
          toast.success('Login successful!', {
            duration: 2000,
            position: 'top-center',
          });
          navigateBasedOnRole(data.role);
        } else {
          // Unexpected success response format
          console.warn('Unexpected response format:', data);
          toast.error('Unexpected server response. Please try again.', {
            duration: 4000,
            position: 'top-center',
          });
        }
      } else if (response.status === 401) {
        toast.error('Invalid username or password. Please check your credentials.', {
          duration: 5000,
          position: 'top-center',
        });
      } else if (response.status === 403) {
        toast.error('Account access denied. Please contact support.', {
          duration: 5000,
          position: 'top-center',
        });
      } else {
        const errorMsg = response.data?.message || response.data?.error || `Server error (${response.status})`;
        toast.error(errorMsg, {
          duration: 5000,
          position: 'top-center',
        });
      }
    } catch (error) {
      console.error('🚨 Login error:', error);
      
      let errorMessage = 'Login failed. Please try again.';
      
      if (error.code === 'ECONNABORTED') {
        errorMessage = 'Request timeout. Please check your connection and try again.';
      } else if (error.code === 'ERR_NETWORK') {
        errorMessage = 'Network error. Please check your internet connection.';
      } else if (error.response) {
        const status = error.response.status;
        const serverMessage = error.response.data?.message || error.response.data?.error;
        
        switch (status) {
          case 401:
            errorMessage = 'Invalid username or password. Please check your credentials.';
            break;
          case 403:
            errorMessage = 'Account access denied. Please contact support.';
            break;
          case 404:
            errorMessage = 'Login service not available. Please contact support.';
            break;
          case 500:
          case 502:
          case 503:
            errorMessage = 'Server error. Please try again later.';
            break;
          default:
            errorMessage = serverMessage || `Server error (${status}). Please try again.`;
        }
      } else if (error.request) {
        errorMessage = 'Cannot connect to server. Please check your connection.';
      }

      toast.error(errorMessage, {
        duration: 6000,
        position: 'top-center',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      toast.error('Please enter a 6-digit OTP', {
        duration: 4000,
        position: 'top-center',
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios({
        method: 'POST',
        url: `${process.env.REACT_APP_API_BASE_URL}/otp/verify`,
        data: {
          otp: otpValue,
          username: formData.username.trim(),
        },
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: 15000,
        validateStatus: function (status) {
          return status < 500;
        }
      });

      if (response.status === 200) {
        const data = response.data;
        if (data.token && data.role) {
          setToken(data.token, data.role);
          toast.success('OTP verified successfully!', {
            duration: 2000,
            position: 'top-center',
          });
          navigateBasedOnRole(data.role);
        } else {
          throw new Error('Invalid response format');
        }
      } else {
        const errorMsg = response.data?.message || 'OTP verification failed';
        toast.error(errorMsg, {
          duration: 4000,
          position: 'top-center',
        });
        setIsLoading(false);
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      toast.error('OTP verification failed. Please try again.', {
        duration: 4000,
        position: 'top-center',
      });
      setIsLoading(false);
    }
  };

  const handleForgotPasswordRequestOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios({
        method: 'POST',
        url: `${process.env.REACT_APP_API_BASE_URL}/users/forgot-password/request-otp`,
        data: { username: forgotPasswordData.username.trim() },
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: 15000,
        validateStatus: function (status) {
          return status < 500;
        }
      });

      if (response.status === 200) {
        toast.success(response.data?.message || 'OTP sent to your registered phone number', {
          duration: 4000,
          position: 'top-center',
        });
        setShowForgotPasswordForm(false);
        setShowForgotPasswordOtpForm(true);
        setForgotPasswordOtp(['', '', '', '', '', '']);
      } else {
        const errorMsg = response.data?.message || 'Failed to send OTP';
        toast.error(errorMsg, {
          duration: 4000,
          position: 'top-center',
        });
      }
    } catch (error) {
      console.error('Forgot password OTP request error:', error);
      toast.error('Failed to send OTP. Please try again.', {
        duration: 4000,
        position: 'top-center',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const otpValue = forgotPasswordOtp.join('');
    if (otpValue.length !== 6) {
      toast.error('Please enter a 6-digit OTP', {
        duration: 4000,
        position: 'top-center',
      });
      setIsLoading(false);
      return;
    }

    if (forgotPasswordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long', {
        duration: 4000,
        position: 'top-center',
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios({
        method: 'POST',
        url: `${process.env.REACT_APP_API_BASE_URL}/users/forgot-password/reset`,
        data: {
          username: forgotPasswordData.username.trim(),
          newPassword: forgotPasswordData.newPassword,
          otp: otpValue,
        },
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: 15000,
        validateStatus: function (status) {
          return status < 500;
        }
      });

      if (response.status === 200) {
        toast.success(response.data?.message || 'Password reset successful', {
          duration: 4000,
          position: 'top-center',
        });
        
        setShowForgotPasswordOtpForm(false);
        setShowForgotPasswordForm(false);
        setForgotPasswordData({ username: '', newPassword: '' });
        setForgotPasswordOtp(['', '', '', '', '', '']);
      } else {
        const errorMsg = response.data?.message || 'Password reset failed';
        toast.error(errorMsg, {
          duration: 4000,
          position: 'top-center',
        });
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      toast.error('Password reset failed. Please try again.', {
        duration: 4000,
        position: 'top-center',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    try {
      const response = await axios({
        method: 'POST',
        url: `${process.env.REACT_APP_API_BASE_URL}/login`,
        data: {
          username: formData.username.trim(),
          password: formData.password
        },
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: 15000
      });

      toast.success(response.data?.message || 'OTP resent to your phone', {
        duration: 4000,
        position: 'top-center',
      });
      setOtp(['', '', '', '', '', '']);
      otpInputs.current[0]?.focus();
    } catch (error) {
      console.error('Resend OTP error:', error);
      toast.error('Failed to resend OTP. Please try again.', {
        duration: 4000,
        position: 'top-center',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendForgotPasswordOtp = async () => {
    setIsLoading(true);
    try {
      const response = await axios({
        method: 'POST',
        url: `${process.env.REACT_APP_API_BASE_URL}/users/forgot-password/request-otp`,
        data: { username: forgotPasswordData.username.trim() },
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: 15000
      });

      toast.success(response.data?.message || 'OTP resent to your phone', {
        duration: 4000,
        position: 'top-center',
      });
      setForgotPasswordOtp(['', '', '', '', '', '']);
      forgotPasswordOtpInputs.current[0]?.focus();
    } catch (error) {
      console.error('Resend forgot password OTP error:', error);
      toast.error('Failed to resend OTP. Please try again.', {
        duration: 4000,
        position: 'top-center',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const navigateBasedOnRole = (role) => {
    setTimeout(() => {
      if (role === 'ADMIN') {
        navigate('/admin');
      } else if (role === 'OPERATOR') {
        navigate('/dashboard/registration');
      } else {
        toast.error('This is not a web login role', {
          duration: 4000,
          position: 'top-center',
        });
        setIsLoading(false);
      }
    }, 1000);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleForgotPasswordInputChange = (e) => {
    setForgotPasswordData({
      ...forgotPasswordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1 || isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      otpInputs.current[index + 1]?.focus();
    }
  };

  const handleForgotPasswordOtpChange = (index, value) => {
    if (value.length > 1 || isNaN(Number(value))) return;

    const newOtp = [...forgotPasswordOtp];
    newOtp[index] = value;
    setForgotPasswordOtp(newOtp);

    if (value && index < 5) {
      forgotPasswordOtpInputs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputs.current[index - 1]?.focus();
    }
  };

  const handleForgotPasswordOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !forgotPasswordOtp[index] && index > 0) {
      forgotPasswordOtpInputs.current[index - 1]?.focus();
    }
  };

  useEffect(() => {
    if (showOtpForm) {
      otpInputs.current[0]?.focus();
    }
  }, [showOtpForm]);

  useEffect(() => {
    if (showForgotPasswordOtpForm) {
      forgotPasswordOtpInputs.current[0]?.focus();
    }
  }, [showForgotPasswordOtpForm]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-foreground flex items-center justify-center px-4 transition-colors duration-300 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/3 via-transparent to-blue-500/3"></div>
      <div className="absolute top-20 left-10 w-32 h-32 bg-purple-500/5 dark:bg-purple-500/3 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-blue-500/5 dark:bg-blue-500/3 rounded-full blur-xl"></div>
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-purple-400/3 dark:bg-purple-400/2 rounded-full blur-lg"></div>
      
      <Toaster 
        toastOptions={{
          style: {
            background: 'hsl(var(--card))',
            color: 'hsl(var(--card-foreground))',
            border: '1px solid hsl(var(--border))',
          },
        }}
      />
      
      {/* Back to Home Button */}
      <div className="absolute top-6 left-6 z-10">
        <Link to="/">
          <Button
            variant="outline"
            className="border-2 border-purple-200 dark:border-purple-700 hover:border-purple-400 dark:hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-950/30 transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg font-medium"
          >
            <ArrowLeft className="mr-2 w-4 h-4" />
            Back to Home
          </Button>
        </Link>
      </div>

      {/* Brand Logo in Top Right */}
      <div className="absolute top-6 right-6 z-10">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-4 py-2 rounded-2xl border-2 border-purple-200 dark:border-purple-700 shadow-lg">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-md">
              <Bus className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-800 dark:text-gray-100">EmcomServ</span>
          </div>
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-2 rounded-xl border-2 border-purple-200 dark:border-purple-700 shadow-lg">
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Form Section with Enhanced Visual Appeal */}
      <div className="w-full max-w-lg flex items-center justify-center relative z-10">
        <div className="relative w-full">
          {/* Enhanced Decorative Background Glow */}
          <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/5 via-purple-600/8 dark:via-purple-600/4 to-purple-500/5 rounded-3xl blur-lg"></div>
          <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/3 via-purple-600/5 dark:via-purple-600/3 to-pink-500/3 rounded-3xl blur-md"></div>
          
          <Card className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border-2 border-purple-200/70 dark:border-purple-700/70 shadow-2xl w-full 
                         hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-700 
                         before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-br before:from-purple-500/5 before:to-blue-500/5 before:pointer-events-none
                         transform hover:scale-[1.02] rounded-3xl">
            <CardHeader className="text-center pb-6 pt-8 relative z-10">
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 rounded-3xl flex items-center justify-center shadow-2xl shadow-purple-500/25 rotate-3 hover:rotate-6 transition-transform duration-500">
                    <Bus className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
              
              <CardTitle className="text-3xl sm:text-4xl font-bold mb-4">
                <span className="bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 bg-clip-text text-transparent">
                  {showForgotPasswordOtpForm ? 'Verify Reset OTP' : showForgotPasswordForm ? 'Reset Password' : showOtpForm ? 'Enter Verification Code' : 'Login Portal'}
                </span>
              </CardTitle>
              
              <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed max-w-md mx-auto">
                {showForgotPasswordOtpForm
                  ? 'Enter the 6-digit verification code sent to your registered phone number'
                  : showForgotPasswordForm
                  ? 'Enter your username to receive a password reset code'
                  : showOtpForm
                  ? 'Please enter the 6-digit code we sent to your phone for secure access'
                  : 'Access your dashboard with secure authentication'}
              </p>
            </CardHeader>

            <CardContent className="space-y-6 px-8 pb-8 relative z-10">
              {showForgotPasswordOtpForm ? (
                <form onSubmit={handleForgotPasswordSubmit} className="space-y-6">
                  {/* OTP Input Fields */}
                  <div className="space-y-4">
                    <Label className="text-lg font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      Enter Verification Code
                    </Label>
                    <div className="flex space-x-3 justify-center">
                      {forgotPasswordOtp.map((digit, index) => (
                        <Input
                          key={index}
                          type="text"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleForgotPasswordOtpChange(index, e.target.value)}
                          onKeyDown={(e) => handleForgotPasswordOtpKeyDown(index, e)}
                          ref={(el) => {
                            forgotPasswordOtpInputs.current[index] = el;
                          }}
                          className={`w-10 h-5 text-center text-xl font-bold bg-white dark:bg-gray-700 border-2 border-purple-200 dark:border-purple-700 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-300 rounded-2xl shadow-md ${
                            digit ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/30 shadow-lg scale-105' : 'hover:border-purple-300 dark:hover:border-purple-600'
                          }`}
                          autoComplete="off"
                        />
                      ))}
                    </div>
                  </div>

                  {/* New Password Field */}
                  <div className="space-y-3">
                    <Label htmlFor="new-password" className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                      New Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-5 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
                      <Input
                        id="new-password"
                        name="newPassword"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={forgotPasswordData.newPassword}
                        onChange={handleForgotPasswordInputChange}
                        className="pl-16 pr-16 h-12 text-base bg-white dark:bg-gray-700 border-2 border-purple-200 dark:border-purple-700 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-300 rounded-2xl shadow-md hover:shadow-lg"
                        placeholder="Enter your new secure password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-500 transition-colors p-1"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:from-purple-600 hover:via-purple-700 hover:to-purple-800 text-white rounded-2xl text-lg font-bold transition-all duration-500 transform hover:scale-105 shadow-lg hover:shadow-xl dark:hover:shadow-purple-500/20"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center space-x-3">
                        <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Updating Password...</span>
                      </div>
                    ) : (
                      <span className="flex items-center justify-center gap-3">
                        <Shield className="w-6 h-6" />
                        Reset Password
                      </span>
                    )}
                  </Button>

                  {/* Action Links */}
                  <div className="flex justify-between items-center text-sm">
                    <button
                      type="button"
                      onClick={handleResendForgotPasswordOtp}
                      disabled={isLoading}
                      className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors disabled:opacity-50 font-semibold flex items-center gap-2"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Resend Code
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowForgotPasswordOtpForm(false);
                        setShowForgotPasswordForm(false);
                      }}
                      className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors font-semibold"
                    >
                      ← Back to Login
                    </button>
                  </div>
                </form>
              ) : showForgotPasswordForm ? (
                <form onSubmit={handleForgotPasswordRequestOtp} className="space-y-6">
                  {/* Username Field */}
                  <div className="space-y-3">
                    <Label htmlFor="forgot-username" className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                      Username or Email
                    </Label>
                    <div className="relative">
                      <User className="absolute left-5 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
                      <Input
                        id="forgot-username"
                        name="username"
                        type="text"
                        required
                        value={forgotPasswordData.username}
                        onChange={handleForgotPasswordInputChange}
                        className="pl-16 h-12 text-base bg-white dark:bg-gray-700 border-2 border-purple-200 dark:border-purple-700 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-300 rounded-2xl shadow-md hover:shadow-lg"
                        placeholder="Enter your username or email"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:from-purple-600 hover:via-purple-700 hover:to-purple-800 text-white rounded-2xl text-lg font-bold transition-all duration-500 transform hover:scale-105 shadow-lg hover:shadow-xl dark:hover:shadow-purple-500/20"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center space-x-3">
                        <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Sending Reset Code...</span>
                      </div>
                    ) : (
                      'Send Reset Code'
                    )}
                  </Button>

                  {/* Back to Login */}
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => setShowForgotPasswordForm(false)}
                      className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors font-semibold"
                    >
                      ← Back to Login
                    </button>
                  </div>
                </form>
              ) : showOtpForm ? (
                <form onSubmit={handleOtpSubmit} className="space-y-6">
                  {/* OTP Input Fields */}
                  <div className="space-y-4">
                    <Label className="text-lg font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      Verification Code
                    </Label>
                    <div className="flex space-x-3 justify-center">
                      {otp.map((digit, index) => (
                        <Input
                          key={index}
                          type="text"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(index, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(index, e)}
                          ref={(el) => {
                            otpInputs.current[index] = el;
                          }}
                          className={`w-12 h-12 text-center text-xl font-bold bg-white dark:bg-gray-700 border-2 border-purple-200 dark:border-purple-700 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-300 rounded-2xl shadow-md ${
                            digit ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/30 shadow-lg scale-105' : 'hover:border-purple-300 dark:hover:border-purple-600'
                          }`}
                          autoComplete="off"
                        />
                      ))}
                    </div>
                  </div>

                  {/* OTP Submit Button */}
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:from-purple-600 hover:via-purple-700 hover:to-purple-800 text-white rounded-2xl text-lg font-bold transition-all duration-500 transform hover:scale-105 shadow-lg hover:shadow-xl dark:hover:shadow-purple-500/20"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center space-x-3">
                        <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Verifying Code...</span>
                      </div>
                    ) : (
                      <span className="flex items-center justify-center gap-3">
                        <CheckCircle className="w-6 h-6" />
                        Verify & Access
                      </span>
                    )}
                  </Button>

                  {/* Resend OTP */}
                  <div className="text-center">
                    <p className="text-gray-600 dark:text-gray-400 mb-2">Didn't receive the code?</p>
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={isLoading}
                      className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors disabled:opacity-50 font-semibold"
                    >
                      Resend Verification Code
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Username Field */}
                  <div className="space-y-3">
                    <Label htmlFor="username" className="text-lg font-semibold text-gray-700 dark:text-gray-200">Username</Label>
                    <div className="relative">
                      <User className="absolute left-5 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
                      <Input
                        id="username"
                        name="username"
                        type="text"
                        required
                        value={formData.username}
                        onChange={handleInputChange}
                        className="pl-16 h-12 text-base bg-white dark:bg-gray-700 border-2 border-purple-200 dark:border-purple-700 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-300 rounded-2xl shadow-md hover:shadow-lg"
                        placeholder="Enter your username"
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="space-y-3">
                    <Label htmlFor="password" className="text-lg font-semibold text-gray-700 dark:text-gray-200">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-5 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={formData.password}
                        onChange={handleInputChange}
                        className="pl-16 pr-16 h-12 text-base bg-white dark:bg-gray-700 border-2 border-purple-200 dark:border-purple-700 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-300 rounded-2xl shadow-md hover:shadow-lg"
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-500 transition-colors p-1"
                      >
                        {showPassword ? <EyeOff className="h-6 w-6" /> : <Eye className="h-6 w-6" />}
                      </button>
                    </div>
                  </div>

                  {/* Forgot Password */}
                  <div className="text-right">
                    <button
                      type="button"
                      onClick={handleForgotPasswordClick}
                      className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors font-semibold"
                    >
                      Forgot password?
                    </button>
                  </div>

                  {/* Login Button */}
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:from-purple-600 hover:via-purple-700 hover:to-purple-800 text-white rounded-2xl text-lg font-bold transition-all duration-500 transform hover:scale-105 shadow-lg hover:shadow-xl dark:hover:shadow-purple-500/20"
                    data-testid="login-submit-button"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center space-x-3">
                        <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Signing in...</span>
                      </div>
                    ) : (
                      <span className="flex items-center justify-center gap-3">
                        <Shield className="w-6 h-6" />
                        Access Dashboard
                      </span>
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;