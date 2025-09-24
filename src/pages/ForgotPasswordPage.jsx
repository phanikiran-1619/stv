import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Bus, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '../components/ui/button.jsx';
import { Input } from '../components/ui/input.jsx';
import { Card, CardContent, CardHeader } from '../components/ui/card.jsx';
import ThemeToggle from '../components/ThemeToggle.jsx';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.querySelector(`input[name="reset-otp-${index + 1}"]`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.querySelector(`input[name="reset-otp-${index - 1}"]`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock password reset - redirect to login
    navigate('/login');
  };

  const handleResendOtp = () => {
    // Mock resend OTP functionality
    setOtp(['', '', '', '', '', '']);
    alert('OTP resent successfully!');
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6 transition-colors duration-300">
      {/* Header */}
      <div className="absolute top-6 left-6 right-6 flex justify-between items-center">
        <Link to="/login">
          <Button
            variant="outline"
            size="sm"
            className="border-border/50 hover:border-purple-500/50 hover:bg-purple-500/10 transition-all duration-300"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </Link>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
              <Bus className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold">EmcomServ</span>
          </div>
          <ThemeToggle />
        </div>
      </div>

      {/* Reset Password Form */}
      <Card className="w-full max-w-md bg-card border border-border/50 shadow-2xl">
        <CardHeader className="text-center pb-8 pt-12">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Bus className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-purple-600 bg-clip-text text-transparent">
            Verify OTP
          </h1>
          <p className="text-muted-foreground mt-2">
            Enter the 6-digit OTP sent to your phone
          </p>
        </CardHeader>
        
        <CardContent className="px-8 pb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-4 text-center">Enter OTP</label>
              <div className="flex justify-center space-x-3 mb-6">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    name={`reset-otp-${index}`}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-14 text-center text-xl font-bold bg-background/50 border border-border/50 rounded-lg focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none transition-all duration-300"
                    maxLength="1"
                    required
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  name="newPassword"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="pl-10 pr-10 h-12 bg-background/50 border-border/50 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all duration-300"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-purple-500 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105"
            >
              Reset Password
            </Button>

            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Didn't receive OTP?{' '}
                <button
                  type="button"
                  onClick={handleResendOtp}
                  className="text-purple-500 hover:text-purple-600 font-medium transition-colors"
                >
                  Resend OTP
                </button>
              </p>
              <p className="text-sm">
                <Link 
                  to="/login" 
                  className="text-purple-500 hover:text-purple-600 font-medium transition-colors"
                >
                  Back to Login
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPasswordPage;