import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const useLogoutConfirmation = () => {
  const navigate = useNavigate();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  // Comprehensive data clearing function
  const clearAllData = useCallback(() => {
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
  }, []);

  // Handle logout confirmation
  const handleLogoutConfirm = useCallback(() => {
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
  }, [navigate, clearAllData]);

  // Handle logout cancel
  const handleLogoutCancel = useCallback(() => {
    setShowLogoutDialog(false);
    // Push state to prevent actual navigation
    window.history.pushState(null, "", window.location.href);
  }, []);

  // Handle logout button click
  const handleLogoutClick = useCallback(() => {
    setShowLogoutDialog(true);
  }, []);

  // Handle browser back button - to be used in useEffect
  const handleBrowserBack = useCallback((event) => {
    event.preventDefault();
    
    // Check if user is authenticated (adjust token key as needed)
    const adminToken = localStorage.getItem("admintoken");
    const operatorToken = localStorage.getItem("operatortoken");
    
    if (adminToken || operatorToken) {
      // Show logout confirmation dialog
      setShowLogoutDialog(true);
      // Push state to maintain current location
      window.history.pushState(null, "", window.location.href);
    } else {
      // If no token, just navigate to login
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  return {
    showLogoutDialog,
    setShowLogoutDialog,
    handleLogoutConfirm,
    handleLogoutCancel,
    handleLogoutClick,
    handleBrowserBack
  };
};

export default useLogoutConfirmation;