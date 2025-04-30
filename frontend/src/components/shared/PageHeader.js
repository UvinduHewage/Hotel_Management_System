// Consistent page headers
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const PageHeader = ({ 
  title, 
  subtitle = '', 
  showBackButton = false,
  actionButton = null
}) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-4 border-b border-gray-200">
      <div className="flex items-center">
        {showBackButton && (
          <button 
            onClick={() => navigate(-1)}
            className="mr-3 p-1 rounded-full hover:bg-gray-100"
            aria-label="Go back"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
        )}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
      </div>
      
      {actionButton && (
        <div className="mt-4 sm:mt-0">
          {actionButton}
        </div>
      )}
    </div>
  );
};

export default PageHeader;