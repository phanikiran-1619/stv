import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  
  // Determine active tab from URL
  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes('passengers')) return 'passengers';
    if (path.includes('trip-assign')) return 'trip-assign';
    return 'registration';
  };

  const [activeTab, setActiveTab] = useState(getActiveTab());

  // Clear all data function
  const clearAllData = () => {
    try {
      // Clear localStorage
      localStorage.clear();
      
      // Clear sessionStorage  
      sessionStorage.clear();
      
      // Clear all cookies
      document.cookie.split(";").forEach((cookie) => {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = `${name.trim()}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
        document.cookie = `${name.trim()}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
        document.cookie = `${name.trim()}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.${window.location.hostname}`;
      });
      
      // Clear console
      console.clear();
      
      // Clear any cached data in memory
      if (window.caches) {
        window.caches.keys().then(names => {
          names.forEach(name => {
            window.caches.delete(name);
          });
        });
      }
      
      // Clear indexedDB if exists
      if (window.indexedDB) {
        try {
          indexedDB.deleteDatabase('app-db');
        } catch (e) {
          console.log('IndexedDB clear failed:', e);
        }
      }
    } catch (error) {
      console.log('Data clearing error:', error);
    }
  };

  // Handle logout confirmation
  const handleLogoutConfirm = () => {
    clearAllData();
    setShowLogoutDialog(false);
    
    // Prevent back navigation by pushing multiple history states
    window.history.pushState(null, "", window.location.href);
    window.history.pushState(null, "", window.location.href);
    
    // Navigate to login
    navigate("/login", { replace: true });
    
    // Prevent future back navigation
    window.onpopstate = () => {
      navigate("/login", { replace: true });
    };
  };

  // Handle logout cancel
  const handleLogoutCancel = () => {
    setShowLogoutDialog(false);
    // Push state to prevent actual navigation
    window.history.pushState(null, "", window.location.href);
  };

  // Browser back button detection
  useEffect(() => {
    const handlePopState = (event) => {
      // Prevent the default back navigation
      event.preventDefault();
      
      // Check if user is authenticated
      const token = localStorage.getItem('operatortoken');
      if (token) {
        // Show logout confirmation dialog
        setShowLogoutDialog(true);
        // Push state to maintain current location
        window.history.pushState(null, "", window.location.href);
      } else {
        // If no token, just navigate to login
        navigate("/login", { replace: true });
      }
    };

    // Add event listener for browser back button
    window.addEventListener('popstate', handlePopState);
    
    // Push initial state to handle back button
    window.history.pushState(null, "", window.location.href);
    
    // Cleanup
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [navigate]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    navigate(`/dashboard/${tab}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-foreground transition-all duration-300">
      <Navbar isAdmin={true} showBackButton={false} />
      
      {/* Logout Confirmation Dialog */}
      {showLogoutDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border-2 border-red-200 dark:border-red-800 max-w-md w-full p-6 animate-in fade-in-0 zoom-in-95 duration-200">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                Logout Confirmation
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                You are about to logout and clear all data. All your session data will be cleared. Do you want to continue?
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={handleLogoutCancel}
                  className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-500"
                  data-testid="logout-cancel-button"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogoutConfirm}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                  data-testid="logout-confirm-button"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <div className="pt-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Enhanced Navigation Tabs - Centered with Purple Border */}
          <div className="flex justify-center mb-8 sm:mb-12">
            <div className="relative flex space-x-1 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl p-3 border-2 border-purple-500/30 hover:border-purple-500/50 transition-all duration-500 shadow-lg hover:shadow-purple-500/10">
              {/* Purple gradient background glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-purple-600/10 to-purple-500/5 rounded-2xl blur-xl opacity-50"></div>
              
              <button
                onClick={() => handleTabChange('registration')}
                className={`relative z-10 px-6 sm:px-8 py-3.5 rounded-xl font-semibold transition-all duration-300 text-sm sm:text-base min-w-[130px] group ${
                  activeTab === 'registration'
                    ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/25 transform scale-105 border border-purple-400/50'
                    : 'text-gray-700 dark:text-gray-300 hover:text-purple-700 dark:hover:text-purple-300 hover:bg-purple-50/70 dark:hover:bg-purple-950/30 hover:border-purple-300/30 border border-transparent hover:scale-102 hover:shadow-md'
                }`}
                data-testid="registration-tab-button"
              >
                <span className="relative z-10">Registrations</span>
                {activeTab === 'registration' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-purple-600/20 rounded-xl blur-sm"></div>
                )}
              </button>
              
              <button
                onClick={() => handleTabChange('passengers')}
                className={`relative z-10 px-6 sm:px-8 py-3.5 rounded-xl font-semibold transition-all duration-300 text-sm sm:text-base min-w-[130px] group ${
                  activeTab === 'passengers'
                    ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/25 transform scale-105 border border-purple-400/50'
                    : 'text-gray-700 dark:text-gray-300 hover:text-purple-700 dark:hover:text-purple-300 hover:bg-purple-50/70 dark:hover:bg-purple-950/30 hover:border-purple-300/30 border border-transparent hover:scale-102 hover:shadow-md'
                }`}
                data-testid="passengers-tab-button"
              >
                <span className="relative z-10">Passengers</span>
                {activeTab === 'passengers' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-purple-600/20 rounded-xl blur-sm"></div>
                )}
              </button>
              
              <button
                onClick={() => handleTabChange('trip-assign')}
                className={`relative z-10 px-6 sm:px-8 py-3.5 rounded-xl font-semibold transition-all duration-300 text-sm sm:text-base min-w-[130px] group ${
                  activeTab === 'trip-assign'
                    ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/25 transform scale-105 border border-purple-400/50'
                    : 'text-gray-700 dark:text-gray-300 hover:text-purple-700 dark:hover:text-purple-300 hover:bg-purple-50/70 dark:hover:bg-purple-950/30 hover:border-purple-300/30 border border-transparent hover:scale-102 hover:shadow-md'
                }`}
                data-testid="trip-assign-tab-button"
              >
                <span className="relative z-10">Trip-Assign</span>
                {activeTab === 'trip-assign' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-purple-600/20 rounded-xl blur-sm"></div>
                )}
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="animate-in fade-in duration-500">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;

