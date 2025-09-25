import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, ArrowRight, Bus, LogOut } from "lucide-react";
import { Button } from "./ui/button.jsx";
import ThemeToggle from "./ThemeToggle.jsx";

const Navbar = ({ isAdmin = false, showBackButton = true }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const clearAllData = () => {
    // Clear local storage
    localStorage.clear();
    
    // Clear session storage
    sessionStorage.clear();
    
    // Clear cookies
    document.cookie.split(";").forEach((cookie) => {
      const name = cookie.split("=")[0].trim();
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    });
    
    // Clear console logs and errors
    console.clear();
    
    // Clear any stored errors in console
    if (window.console && window.console.memory) {
      window.console.memory = {};
    }
  };

  const handleLogout = () => {
    // Show confirmation dialog
    const confirmLogout = window.confirm(
      "Are you sure you want to logout? This will clear all your session data and redirect you to the login page."
    );
    
    if (confirmLogout) {
      // Perform logout cleanup
      clearAllData();
      
      // Prevent back navigation by pushing multiple history states
      window.history.pushState(null, "", window.location.href);
      window.history.pushState(null, "", window.location.href);
      
      // Redirect to login page
      navigate("/login", { replace: true });
      
      // Add event listener to prevent back navigation after logout
      window.onpopstate = () => {
        navigate("/login", { replace: true });
      };
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