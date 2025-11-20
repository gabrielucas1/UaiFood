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

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await adminService.getOrders();
      setOrders(data);
      setError(null);
    } catch (error) {
      setError('Erro ao carregar pedidos. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      PREPARING: 'bg-blue-100 text-blue-800', 
      DELIVERED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800'
    };

    const labels = {
      PENDING: 'Pendente',
      PREPARING: 'Preparando',
      DELIVERED: 'Entregue', 
      CANCELLED: 'Cancelado'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800'}`}>
        {labels[status as keyof typeof labels] || status}
      </span>
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
      render: (value: string) => getStatusBadge(value)
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
    </div>
  );
}