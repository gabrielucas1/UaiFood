'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  { 
    name: 'Início', 
    href: '/admin/home', 
    icon: '🏠' 
  },
  { 
    name: 'Itens', 
    href: '/admin/items', 
    icon: '🍕' 
  },
  { 
    name: 'Pedidos', 
    href: '/admin/orders', 
    icon: '🛒' 
  },
  { 
    name: 'Usuários', 
    href: '/admin/users', 
    icon: '👥' 
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-white shadow-md">
      {/* Logo */}
      <div className="p-6 border-b">
        <h1 className="text-2xl font-bold text-orange-600">UaiFood</h1>
        <p className="text-sm text-gray-500">Administração</p>
      </div>

      {/* Menu Items */}
      <nav className="mt-6">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-orange-50 text-orange-600 border-r-2 border-orange-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <span className="mr-3 text-lg">{item.icon}</span>
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}