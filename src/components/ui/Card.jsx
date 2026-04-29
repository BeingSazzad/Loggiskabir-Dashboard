import React from 'react';

export const Card = ({ children, className = '', hover = false, onClick, ...props }) => {
  return (
    <div 
      onClick={onClick}
      className={`bg-white rounded-xl border border-line-2 overflow-hidden ${hover ? 'hover:border-primary/30 hover:shadow-sm cursor-pointer transition-all' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
