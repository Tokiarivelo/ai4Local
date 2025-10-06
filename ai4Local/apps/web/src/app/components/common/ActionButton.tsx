import React from 'react';

interface ActionButtonProps {
  onClick: () => void;
  label: string;
  variant?: 'default' | 'outline';
  icon?: React.ElementType;
}

const ActionButton: React.FC<ActionButtonProps> = ({ onClick, label, variant = 'default', icon: Icon }) => {
  const baseStyles = 'flex items-center justify-center h-12 px-4 rounded-lg transition-colors';
  const variantStyles = variant === 'outline' 
    ? 'border border-gray-300 text-gray-700 bg-white hover:bg-gray-100' 
    : 'bg-blue-600 text-white hover:bg-blue-700';

  return (
    <button onClick={onClick} className={`${baseStyles} ${variantStyles}`}>
      {Icon && <Icon className="mr-2" />}
      {label}
    </button>
  );
};

export default ActionButton;