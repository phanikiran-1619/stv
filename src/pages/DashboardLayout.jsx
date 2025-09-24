import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Determine active tab from URL
  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes('passengers')) return 'passengers';
    if (path.includes('trip-assign')) return 'trip-assign';
    return 'registration';
  };

  const [activeTab, setActiveTab] = useState(getActiveTab());

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    navigate(`/dashboard/${tab}`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-all duration-300">
      <Navbar isAdmin={true} showBackButton={false} />
      
      {/* Main Content */}
      <div className="pt-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Navigation Tabs - Centered */}
          <div className="flex justify-center mb-8 sm:mb-12">
            <div className="flex space-x-1 bg-card/50 backdrop-blur-sm rounded-2xl p-2 border border-border/30 shadow-lg">
              <button
                onClick={() => handleTabChange('registration')}
                className={`px-6 sm:px-8 py-3 rounded-xl font-semibold transition-all duration-300 text-sm sm:text-base min-w-[120px] ${
                  activeTab === 'registration'
                    ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg transform scale-105'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                }`}
              >
                Registrations
              </button>
              <button
                onClick={() => handleTabChange('passengers')}
                className={`px-6 sm:px-8 py-3 rounded-xl font-semibold transition-all duration-300 text-sm sm:text-base min-w-[120px] ${
                  activeTab === 'passengers'
                    ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg transform scale-105'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                }`}
              >
                Passengers
              </button>
              <button
                onClick={() => handleTabChange('trip-assign')}
                className={`px-6 sm:px-8 py-3 rounded-xl font-semibold transition-all duration-300 text-sm sm:text-base min-w-[120px] ${
                  activeTab === 'trip-assign'
                    ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg transform scale-105'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                }`}
              >
                Trip-Assign
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