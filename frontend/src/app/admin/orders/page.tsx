'use client';

import { useEffect, useState } from 'react';
import { adminService } from '../services/adminService';
import DataTable from '../components/DataTable';
import ErrorDisplay from '../components/ErrorDisplay';
import PageHeader from '../components/PageHeader';

interface Order {
  id: string;
  userId: string;
  user?: {
    nome: string;
    phone: string;
  };
  paymentMethod: string;
  status: string;
  total: string | number; // Pode vir como string do backend
  createdAt: string;
  orderItems: Array<{
    id: string;
    quantity: number;
    unitPrice: string | number; // Pode vir como string do backend
    item: {
      name: string;
      price: string | number; // Pode vir como string do backend
    };
  }>;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estados para modal de status
  const [statusModal, setStatusModal] = useState({
    isOpen: false,
    orderId: '',
    currentStatus: '',
    loading: false
  });
  
  // Estados para notificação
  const [notification, setNotification] = useState({
    isOpen: false,
    message: '',
    type: 'success' as 'success' | 'error'
  });

  useEffect(() => {
    // Verificar se o usuário é ADMIN
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      console.log('👤 Usuário atual:', userData);
      console.log('🔐 Tipo de usuário:', userData.type);
    }
    
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      console.log('🔄 Carregando pedidos admin...');
      const data = await adminService.getOrders();
      console.log('📦 Dados recebidos:', data);
      setOrders(data);
      setError(null);
    } catch (error) {
      console.error('❌ Erro ao carregar pedidos:', error);
      setError('Erro ao carregar pedidos. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Funções para gerenciar modal de status
  const openStatusModal = (orderId: string, currentStatus: string) => {
    setStatusModal({
      isOpen: true,
      orderId,
      currentStatus,
      loading: false
    });
  };

  const closeStatusModal = () => {
    setStatusModal({
      isOpen: false,
      orderId: '',
      currentStatus: '',
      loading: false
    });
  };

  // Função para atualizar status
  const updateOrderStatus = async (newStatus: string) => {
    try {
      setStatusModal(prev => ({ ...prev, loading: true }));
      
      console.log(`🔄 Atualizando status do pedido ${statusModal.orderId} para ${newStatus}`);
      
      await adminService.updateOrderStatus(statusModal.orderId, newStatus);
      
      // Atualizar a lista local
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === statusModal.orderId 
            ? { ...order, status: newStatus }
            : order
        )
      );
      
      showNotification('Status do pedido atualizado com sucesso!', 'success');
      closeStatusModal();
      
      console.log('✅ Status atualizado com sucesso');
    } catch (error: any) {
      console.error('❌ Erro ao atualizar status:', error);
      
      let errorMessage = 'Erro ao atualizar status do pedido';
      
      if (error.message) {
        errorMessage = error.message;
      } else if (error.details && error.details.length > 0) {
        errorMessage = error.details.map((d: any) => `${d.field}: ${d.message}`).join(', ');
      }
      
      showNotification(errorMessage, 'error');
    } finally {
      setStatusModal(prev => ({ ...prev, loading: false }));
    }
  };

  // Função para mostrar notificação
  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ isOpen: true, message, type });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, isOpen: false }));
    }, 3000);
  };

  const getStatusBadge = (status: string, orderId: string) => {
    const styles = {
      PENDING: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
      PREPARING: 'bg-blue-100 text-blue-800 hover:bg-blue-200', 
      DELIVERING: 'bg-purple-100 text-purple-800 hover:bg-purple-200',
      DELIVERED: 'bg-green-100 text-green-800 hover:bg-green-200',
      CANCELLED: 'bg-red-100 text-red-800 hover:bg-red-200'
    };

    const labels = {
      PENDING: 'Pendente',
      PREPARING: 'Preparando',
      DELIVERING: 'Entregando',
      DELIVERED: 'Entregue', 
      CANCELLED: 'Cancelado'
    };

    return (
      <button
        onClick={() => openStatusModal(orderId, status)}
        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
          styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800 hover:bg-gray-200'
        }`}
        title="Clique para alterar o status"
      >
        {labels[status as keyof typeof labels] || status}
      </button>
    );
  };



  const columns = [
    {
      key: 'id',
      label: 'Pedido',
      render: (value: string) => `#${value.slice(0, 8)}`
    },
    {
      key: 'user',
      label: 'Cliente',
      render: (value: any, row: Order) => row.user?.nome || 'N/A'
    },
    {
      key: 'orderItems',
      label: 'Itens',
      render: (value: any[]) => `${value?.length || 0} itens`
    },
    {
      key: 'total',
      label: 'Total',
      render: (value: string | number) => {
        const total = typeof value === 'string' ? parseFloat(value) : value;
        return `R$ ${total.toFixed(2).replace('.', ',')}`;
      }
    },
    {
      key: 'paymentMethod',
      label: 'Pagamento'
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string, row: Order) => getStatusBadge(value, row.id)
    },
    {
      key: 'createdAt',
      label: 'Data',
      render: (value: string) => new Date(value).toLocaleString('pt-BR')
    }
  ];

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Pedidos" description="Gerencie os pedidos do restaurante" />
        <ErrorDisplay error={error} onRetry={loadOrders} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Pedidos"
        description={`${orders.length} pedidos encontrados`}
      />

      <DataTable 
        data={orders}
        columns={columns}
        loading={loading}
        emptyMessage="Nenhum pedido encontrado"
      />

      {/* Modal de alteração de status */}
      {statusModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Alterar Status do Pedido
              </h3>
              <p className="text-sm text-gray-600">
                Status atual: <span className="font-medium">{statusModal.currentStatus}</span>
              </p>
            </div>

            <div className="space-y-2 mb-6">
              {['PENDING', 'PREPARING', 'DELIVERING', 'DELIVERED', 'CANCELLED'].map(status => {
                const labels = {
                  PENDING: 'Pendente',
                  PREPARING: 'Preparando',
                  DELIVERING: 'Entregando',
                  DELIVERED: 'Entregue',
                  CANCELLED: 'Cancelado'
                };

                const isCurrentStatus = status === statusModal.currentStatus;
                
                return (
                  <button
                    key={status}
                    onClick={() => updateOrderStatus(status)}
                    disabled={isCurrentStatus || statusModal.loading}
                    className={`w-full p-3 rounded-lg border text-left transition-colors ${
                      isCurrentStatus 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'hover:bg-gray-50 text-gray-900 cursor-pointer'
                    } ${statusModal.loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {labels[status as keyof typeof labels]}
                    {isCurrentStatus && (
                      <span className="text-xs text-gray-500 ml-2">(atual)</span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex gap-3">
              <button
                onClick={closeStatusModal}
                disabled={statusModal.loading}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancelar
              </button>
            </div>

            {statusModal.loading && (
              <div className="flex items-center justify-center mt-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                <span className="ml-2 text-sm text-gray-600">Atualizando...</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Notificação */}
      {notification.isOpen && (
        <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
          notification.type === 'success' 
            ? 'bg-green-500 text-white' 
            : 'bg-red-500 text-white'
        }`}>
          <div className="flex items-center gap-2">
            {notification.type === 'success' ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            <span>{notification.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}