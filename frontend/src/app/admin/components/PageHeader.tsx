'use client';

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
  };
}

export default function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="flex justify-between items-start">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        {description && (
          <p className="text-gray-600 mt-1">{description}</p>
        )}
      </div>
      
      {action && (
        <button
          onClick={action.onClick}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            action.variant === 'secondary'
              ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              : 'bg-orange-600 text-white hover:bg-orange-700'
          }`}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}