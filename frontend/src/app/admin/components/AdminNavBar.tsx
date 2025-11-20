'use client';

import { useAuth } from '../../contexts/authContext';

export default function AdminNavBar() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="flex justify-between items-center px-6 py-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">UaiFood Admin</h2>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* User Info */}
          <div className="text-sm text-gray-600">
            Olá, <span className="font-medium">{user?.nome}</span>
          </div>
          
          {/* Logout Button */}
          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-600 transition-colors"
          >
            Sair
          </button>
        </div>
      </div>
    </header>
  );
}