import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import useLogoutConfirmation from '../hooks/useLogoutConfirmation.js';
import LogoutConfirmationDialog from '../components/LogoutConfirmationDialog.jsx';

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    showLogoutDialog, 
    handleLogoutConfirm, 
    handleLogoutCancel, 
    handleBrowserBack 
  } = useLogoutConfirmation();
  
  // Determine active tab from URL
  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes('passengers')) return 'passengers';
    if (path.includes('trip-assign')) return 'trip-assign';
    return 'registration';
  };

  const [activeTab, setActiveTab] = useState(getActiveTab());

  // Browser back button detection
  useEffect(() => {
    // Add event listener for browser back button
    window.addEventListener('popstate', handleBrowserBack);
    
    // Push initial state to handle back button
    window.history.pushState(null, "", window.location.href);
    
    // Cleanup
    return () => {
      window.removeEventListener('popstate', handleBrowserBack);
    };
  }, [handleBrowserBack]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    navigate(`/dashboard/${tab}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-foreground transition-all duration-300">
      <Navbar isAdmin={true} showBackButton={false} />
      
      {/* Logout Confirmation Dialog */}
      <LogoutConfirmationDialog
        showDialog={showLogoutDialog}
        onConfirm={handleLogoutConfirm}
        onCancel={handleLogoutCancel}
      />
      
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