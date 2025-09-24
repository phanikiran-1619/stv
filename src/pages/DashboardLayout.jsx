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
          {/* Enhanced Navigation Tabs - Centered with Purple Border */}
          <div className="flex justify-center mb-8 sm:mb-12">
            <div className="relative flex space-x-1 bg-card/70 backdrop-blur-md rounded-2xl p-3 border-2 border-purple-500/30 hover:border-purple-500/50 transition-all duration-500 shadow-sm hover:shadow-purple-500/10">
              {/* Purple gradient background glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-purple-600/10 to-purple-500/5 rounded-2xl blur-xl opacity-50"></div>
              
              <button
                onClick={() => handleTabChange('registration')}
                className={`relative z-10 px-6 sm:px-8 py-3.5 rounded-xl font-semibold transition-all duration-300 text-sm sm:text-base min-w-[130px] group ${
                  activeTab === 'registration'
                    ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-sm shadow-purple-500/25 transform scale-105 border border-purple-400/50'
                    : 'text-muted-foreground hover:text-foreground hover:bg-purple-50/50 dark:hover:bg-purple-950/30 hover:border-purple-300/30 border border-transparent hover:scale-102 hover:shadow-sm'
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
                    ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-sm shadow-purple-500/25 transform scale-105 border border-purple-400/50'
                    : 'text-muted-foreground hover:text-foreground hover:bg-purple-50/50 dark:hover:bg-purple-950/30 hover:border-purple-300/30 border border-transparent hover:scale-102 hover:shadow-sm'
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
                    ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-sm shadow-purple-500/25 transform scale-105 border border-purple-400/50'
                    : 'text-muted-foreground hover:text-foreground hover:bg-purple-50/50 dark:hover:bg-purple-950/30 hover:border-purple-300/30 border border-transparent hover:scale-102 hover:shadow-sm'
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