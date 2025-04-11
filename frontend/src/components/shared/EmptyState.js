// src/components/shared/EmptyState.js - Empty state component
import React from 'react';
import { FileX } from 'lucide-react';

const EmptyState = ({ 
  message = 'No data available', 
  description = 'There are no items to display at this time.',
  icon = <FileX size={48} className="text-gray-400" />,
  action = null
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 bg-gray-50 rounded-lg border border-gray-200">
      <div className="mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{message}</h3>
      <p className="text-sm text-gray-500 text-center max-w-md mb-6">{description}</p>
      {action && (
        <div>{action}</div>
      )}
    </div>
  );
};

export default EmptyState;