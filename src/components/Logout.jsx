import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';

const Logout = ({ 
  children, 
  className = "", 
  showIcon = true, 
  buttonText = "Logout",
  variant = "button", // "button" or "icon"
  "data-testid": dataTestId = "logout-button"
}) => {
  const navigate = useNavigate();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  // Comprehensive data clearing function
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
      
      // Clear any global variables if needed
      if (window.appData) {
        delete window.appData;
      }
      
      // Clear any timers/intervals
      for (let i = 1; i < 99999; i++) {
        clearTimeout(i);
        clearInterval(i);
      }
    } catch (error) {
      console.log('Data clearing error:', error);
    }
  };

  // Handle logout confirmation
  const handleLogoutConfirm = () => {
    try {
      // Perform comprehensive logout cleanup
      clearAllData();
      setShowLogoutDialog(false);
      
      // Show logout notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 z-[999] bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-right duration-500';
      notification.innerHTML = `
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        <div class="font-semibold">Successfully logged out! All data cleared.</div>
      `;
      document.body.appendChild(notification);
      
      // Remove notification after 3 seconds
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 3000);
      
      // Prevent back navigation by pushing multiple history states
      window.history.pushState(null, "", window.location.href);
      window.history.pushState(null, "", window.location.href);
      
      // Redirect to login page with a delay to show notification
      setTimeout(() => {
        navigate("/login", { replace: true });
        
        // Add event listener to prevent back navigation after logout
        window.onpopstate = () => {
          navigate("/login", { replace: true });
        };
      }, 1000);
      
    } catch (error) {
      console.error('Logout error:', error);
      // Still proceed with navigation even if cleanup fails
      navigate("/login", { replace: true });
    }
  };

  // Handle logout cancel
  const handleLogoutCancel = () => {
    setShowLogoutDialog(false);
  };

  // Handle logout button click
  const handleLogoutClick = () => {
    setShowLogoutDialog(true);
  };

  return (
    <>
      {/* Logout Button/Trigger */}
      {children ? (
        <div onClick={handleLogoutClick} className={className} data-testid={dataTestId}>
          {children}
        </div>
      ) : (
        <button
          onClick={handleLogoutClick}
          className={`${className} ${
            variant === "icon" 
              ? "p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" 
              : "bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-full px-3 sm:px-4 py-2 font-semibold cursor-pointer text-sm shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          }`}
          data-testid={dataTestId}
        >
          {showIcon && <LogOut className={variant === "icon" ? "w-5 h-5" : "w-4 h-4 sm:mr-2"} />}
          {variant !== "icon" && (
            <span className="hidden sm:inline">{buttonText}</span>
          )}
        </button>
      )}

      {/* Logout Confirmation Dialog */}
      {showLogoutDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border-2 border-red-200 dark:border-red-800 max-w-md w-full p-6 animate-in fade-in-0 zoom-in-95 duration-200">
            <div className="text-center">
              {/* Warning Icon */}
              <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              
              {/* Dialog Title */}
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                Logout Confirmation
              </h3>
              
              {/* Dialog Message */}
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                You are about to logout and clear all data. All your session data will be cleared. Do you want to continue?
              </p>
              
              {/* Action Buttons */}
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
    </>
  );
};

export default Logout;