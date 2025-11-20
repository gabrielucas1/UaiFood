'use client';
import { useState, useEffect } from 'react';
import { Header, RestaurantsSection, Footer } from './components';
import { useAuth } from '../contexts/authContext';
import { useCategoryIcon } from '../components/CategoryIcon';
import Link from 'next/link';

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
  category: Category;
}

interface UserProfile {
  name: string;
  address: string;
  phone: string;
}

interface UserOrder {
  id: string;
  total: string | number;
  status: string;
  createdAt: string;
  orderItems: Array<{
    quantity: number;
    item: {
      description: string;
    };
  }>;
}

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userOrders, setUserOrders] = useState<UserOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const { user, isLoggedIn } = useAuth();
  const { getCategoryIcon } = useCategoryIcon();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Buscar categorias com seus itens
        const response = await fetch('http://localhost:3991/api/categories');
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchUserProfile = async () => {
      if (!isLoggedIn) return;
      
      try {
        const token = localStorage.getItem('token');
        
        const response = await fetch('http://localhost:3991/api/users/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        
        if (response.ok) {
          const profileData = await response.json();
          setUserProfile(profileData);
        } else {
          const errorText = await response.text();
        }
      } catch (error) {
      }
    };

    const fetchUserOrders = async () => {
      
      if (!isLoggedIn) {
        return;
      }
      
      try {
        setOrdersLoading(true);
        const token = localStorage.getItem('token');
        
        const response = await fetch('http://localhost:3991/api/orders/my-orders', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        

        
        if (response.ok) {
          const ordersData = await response.json();

          const ordersToShow = ordersData.slice(0, 3);
          
          setUserOrders(ordersToShow);
        } else {
          const errorText = await response.text();
        }
      } catch (error) {
      
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchData();
    if (isLoggedIn) {
      fetchUserProfile();
      fetchUserOrders();
    } else {
    }
  }, [isLoggedIn]);


  // Funções auxiliares para exibir status dos pedidos
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'PREPARING':
        return 'bg-blue-100 text-blue-800';
      case 'DELIVERING':
        return 'bg-purple-100 text-purple-800';
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Pendente';
      case 'PREPARING':
        return 'Preparando';
      case 'DELIVERING':
        return 'Entregando';
      case 'DELIVERED':
        return 'Entregue';
      case 'CANCELLED':
        return 'Cancelado';
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1 max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              {isLoggedIn ? `Bem-vindo, ${user?.nome}!` : 'Bem-vindo ao UaiFood!'}
            </h1>
            <p className="text-lg text-gray-600">Explore os melhores sabores de Minas Gerais.</p>
          </div>

          <RestaurantsSection 
            categories={categories} 
            loading={loading} 
            getCategoryIcon={getCategoryIcon} 
          />
        </div>

        {isLoggedIn && (
          <aside className="space-y-6">
            {/* Informações do Usuário */}
            <div className="bg-white shadow-md rounded-lg p-4 h-fit">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Informações do Usuário</h2>
              {userProfile ? (
                <div className="space-y-3">
                  <div>
                    <strong className="text-gray-700">Nome:</strong>
                    <p className="text-gray-600">{userProfile.name || user?.nome || 'Não informado'}</p>
                  </div>
                  <div>
                    <strong className="text-gray-700">Endereço:</strong>
                    <p className="text-gray-600">{userProfile.address || 'Endereço não cadastrado'}</p>
                  </div>
                  <div>
                    <strong className="text-gray-700">Telefone:</strong>
                    <p className="text-gray-600">{userProfile.phone || 'Telefone não informado'}</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                  </div>
                </div>
              )}
            </div>

            {/* Meus Pedidos - só para clientes */}
            {user?.type === 'CLIENT' && (
              <div className="bg-white shadow-md rounded-lg p-4 h-fit">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800">Meus Pedidos</h2>
                </div>
                
                {ordersLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="animate-pulse border rounded-lg p-3">
                        <div className="h-3 bg-gray-200 rounded w-2/3 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                ) : userOrders.length > 0 ? (
                  <div className="space-y-3">
                    {userOrders.map(order => (
                      <div key={order.id} className="border rounded-lg p-3 hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-medium text-gray-800">Pedido #{order.id}</p>
                            <p className="text-sm text-gray-600">
                              {order.orderItems.reduce((acc, item) => acc + item.quantity, 0)} itens
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-green-600">
                              R$ {typeof order.total === 'string' ? parseFloat(order.total).toFixed(2).replace('.', ',') : order.total.toFixed(2).replace('.', ',')}
                            </p>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                              {getStatusLabel(order.status)}
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-500 mb-3">Você ainda não fez nenhum pedido</p>
                    <Link 
                      href="/order"
                      className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      🛒 Fazer Primeiro Pedido
                    </Link>
                  </div>
                )}
              </div>
            )}
          </aside>
        )}
      </main>

      <Footer />
    </div>
  );
}
