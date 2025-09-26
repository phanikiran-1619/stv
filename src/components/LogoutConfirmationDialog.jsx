import React from 'react';

const LogoutConfirmationDialog = ({ 
  showDialog, 
  onConfirm, 
  onCancel 
}) => {
  if (!showDialog) return null;

  return (
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
              onClick={onCancel}
              className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-500"
              data-testid="logout-cancel-button"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              data-testid="logout-confirm-button"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoutConfirmationDialog;