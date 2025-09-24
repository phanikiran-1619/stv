import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, ArrowRight, Bell, Bus, LogOut } from "lucide-react";
import { Button } from "./ui/button.jsx";
import { toast } from "../hooks/use-toast.js";
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
    
    // Clear console logs
    console.clear();
  };

  const handleNavigation = (path) => {
    if (path === "/login") {
      // Perform logout cleanup
      clearAllData();
      
      // Prevent back navigation by pushing a new history state
      window.history.pushState(null, "", window.location.href);
      window.history.pushState(null, "", window.location.href);
      
      // Redirect to login page
      navigate("/login");
      
      // Add event listener to prevent back navigation after logout
      window.onpopstate = () => {
        navigate("/login");
      };
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

  const handleNotificationClick = () => {
    // Display a sample notification
    toast({
      title: "Notifications",
      description: "You have 3 new notifications! Check your dashboard for updates.",
    });
  };

  return (
    <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-11/12 max-w-4xl">
      <div className="bg-card/80 dark:bg-gray-900/80 backdrop-blur-md rounded-full border border-border/50 dark:border-gray-700 px-4 sm:px-6 py-3 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
              <Bus className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg sm:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-purple-600">
              EmcomServ
            </span>
          </div>

          {isAdmin ? (
            <div className="flex items-center space-x-2 sm:space-x-4">
              <ThemeToggle className="text-muted-foreground hover:text-purple-500" />
              <Button
                variant="ghost"
                size="icon"
                onClick={handleNotificationClick}
                className="text-muted-foreground hover:text-purple-500 transition-colors duration-200 cursor-pointer"
              >
                <Bell className="w-4 sm:w-5 h-4 sm:h-5" />
              </Button>
              {showBackButton && (
                <Button
                  variant="ghost"
                  onClick={handleBack}
                  className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-purple-600 hover:text-purple-400 transition-colors duration-200 cursor-pointer border border-border/50 rounded-full px-2 sm:px-3 py-1 hover:border-purple-500 text-sm"
                >
                  <span className="hidden sm:inline">Back</span>
                  <ArrowLeft className="w-4 h-4 sm:ml-1" />
                </Button>
              )}
              <Button
                onClick={() => handleNavigation("/login")}
                className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-full px-3 sm:px-4 py-2 font-semibold cursor-pointer text-sm"
              >
                <LogOut className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2 sm:space-x-4">
              <ThemeToggle className="text-muted-foreground hover:text-purple-500" />
              <Button
                onClick={() => handleNavigation("/login")}
                className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-full px-4 sm:px-6 py-2 font-semibold cursor-pointer text-sm sm:text-base"
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