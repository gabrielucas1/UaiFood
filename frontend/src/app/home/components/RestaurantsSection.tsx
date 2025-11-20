'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../contexts/authContext';

interface Category {
  id: string;
  description: string;
  items?: Item[];
  _count?: {
    items: number;
  };
}

interface Item {
  id: string;
  description: string;
  unitPrice: string;
  categoryId: string;
}

interface RestaurantsSectionProps {
  categories: Category[];
  loading: boolean;
  getCategoryIcon: (description: string) => string;
}

export default function RestaurantsSection({ categories, loading, getCategoryIcon }: RestaurantsSectionProps) {
  const { isLoggedIn, user } = useAuth();
  const [expandedRestaurant, setExpandedRestaurant] = useState<string | null>(null);
  const [loadingItems, setLoadingItems] = useState<string | null>(null);
  const [restaurantItems, setRestaurantItems] = useState<Record<string, Item[]>>({});

  const loadRestaurantItems = async (categoryId: string) => {
    if (restaurantItems[categoryId]) {
      setExpandedRestaurant(expandedRestaurant === categoryId ? null : categoryId);
      return;
    }

    setLoadingItems(categoryId);
    try {
      const response = await fetch(`http://localhost:3991/api/items?categoryId=${categoryId}`);
      if (response.ok) {
        const items = await response.json();
        setRestaurantItems(prev => ({
          ...prev,
          [categoryId]: items.filter((item: Item) => item.categoryId === categoryId)
        }));
        setExpandedRestaurant(categoryId);
      }
    } catch (error) {
      console.error('Erro ao carregar itens:', error);
    } finally {
      setLoadingItems(null);
    }
  };

  if (loading) {
    return (
      <section className="mb-12">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Comidas Populares</h3>
        <div className="space-y-4">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg p-6 shadow-md animate-pulse">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-5 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mb-12">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">Comidas Populares</h3>
      
      {categories.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🍽️</div>
          <p className="text-gray-500 text-lg">Nenhum restaurante encontrado</p>
        </div>
      ) : (
        <div className="space-y-4">
          {categories.map((category) => (
            <div key={category.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Header do Restaurante */}
              <div 
                className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => loadRestaurantItems(category.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-full flex items-center justify-center text-2xl">
                      {getCategoryIcon(category.description)}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-900">{category.description}</h4>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-sm text-gray-600">
                          ⭐ {(Math.random() * (5 - 4) + 4).toFixed(1)}
                        </span>
                        <span className="text-sm text-gray-600">
                          🍽️ {category._count?.items || 0} pratos
                        </span>
                        <span className="text-sm text-gray-600">
                          🚚 Entrega 15-30 min
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    {isLoggedIn && user?.type === 'CLIENT' && (
                      <Link
                        href="/order"
                        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        🛒 Pedir
                      </Link>
                    )}
                    
                    {loadingItems === category.id ? (
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
                    ) : (
                      <span className="text-gray-400">
                        {expandedRestaurant === category.id ? '▼' : '▶'}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Lista de Pratos (expandível) */}
              {expandedRestaurant === category.id && restaurantItems[category.id] && (
                <div className="border-t border-gray-100 bg-gray-50">
                  <div className="p-6">
                    <h5 className="font-semibold text-gray-800 mb-4">Pratos Disponíveis</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {restaurantItems[category.id].map((item) => (
                        <div key={item.id} className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start mb-2">
                            <h6 className="font-medium text-gray-900 text-sm">{item.description}</h6>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-orange-600 font-bold">
                              R$ {parseFloat(item.unitPrice).toFixed(2).replace('.', ',')}
                            </span>
                            {isLoggedIn && user?.type === 'CLIENT' ? (
                              <Link
                                href="/order"
                                className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                              >
                                Adicionar
                              </Link>
                            ) : (
                              <Link
                                href="/order"
                                className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                              >
                                Comprar
                              </Link>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {restaurantItems[category.id].length === 0 && (
                      <p className="text-center text-gray-500 py-8">
                        Nenhum prato disponível no momento
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export { RestaurantsSection };