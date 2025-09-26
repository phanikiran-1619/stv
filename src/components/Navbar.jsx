import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, ArrowRight, Bus, LogOut } from "lucide-react";
import { Button } from "./ui/button.jsx";
import ThemeToggle from "./ThemeToggle.jsx";

const Navbar = ({ isAdmin = false, showBackButton = true }) => {
  const navigate = useNavigate();
  const location = useLocation();

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

  const handleLogout = () => {
    // Show enhanced confirmation dialog
    const confirmLogout = window.confirm(
      "Are you sure you want to logout? This will clear all your data and cannot be undone."
    );
    
    if (confirmLogout) {
      try {
        // Perform comprehensive logout cleanup
        clearAllData();
        
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
    }
  };

  const handleNavigation = (path) => {
    if (path === "/login") {
      if (isAdmin) {
        // If user is admin, show logout confirmation
        handleLogout();
      } else {
        // Regular navigation to login page
        navigate("/login");
      }
    } else {
      // Regular navigation for other paths
      navigate(path);
    }
  };

  const handleBack = () => {
    const currentPath = location.pathname;

    if (currentPath.startsWith("/dashboard") && currentPath !== "/dashboard") {
      // Always go to dashboard from any dashboard subpage
      navigate("/dashboard");
    } else {
      // For admin or other pages, go to actual previous page
      navigate(-1);
    }
  };

  return (
    <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-11/12 max-w-4xl">
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-full border-2 border-purple-200/70 dark:border-purple-700/70 px-4 sm:px-6 py-3 shadow-2xl hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-500">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
              <Bus className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg sm:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800">
              EmcomServ
            </span>
          </div>

          {isAdmin ? (
            <div className="flex items-center space-x-2 sm:space-x-4">
              <ThemeToggle className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400" />
              {showBackButton && (
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 border-2 border-purple-200 dark:border-purple-700 hover:border-purple-400 dark:hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-950/30 transition-all duration-300 rounded-full px-2 sm:px-3 py-1 text-sm font-medium"
                >
                  <ArrowLeft className="w-4 h-4 sm:mr-1" />
                  <span className="hidden sm:inline">Back</span>
                </Button>
              )}
              <Button
                onClick={handleLogout}
                className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-full px-3 sm:px-4 py-2 font-semibold cursor-pointer text-sm shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                data-testid="logout-button"
              >
                <LogOut className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2 sm:space-x-4">
              <ThemeToggle className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400" />
              <Button
                onClick={() => handleNavigation("/login")}
                className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-full px-4 sm:px-6 py-2 font-semibold cursor-pointer text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <span className="hidden sm:inline">Login</span>
                <span className="sm:hidden">Login</span>
                <ArrowRight className="ml-1 sm:ml-2 w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;