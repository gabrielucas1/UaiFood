// Configuração da API
const API_BASE_URL = 'http://localhost:3991/api';

// Função helper para fazer requests autenticados
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token');
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    
    // Estrutura o erro para ser capturado pelo frontend
    const error = new Error(errorData.message || errorData.error || `API Error: ${response.status}`);
    (error as any).details = errorData.details || [];
    (error as any).status = response.status;
    
    throw error;
  }
  
  return response.json();
};

// Serviços para cada entidade
export const adminService = {
  // Buscar todos os usuários
  getUsers: async () => {
    return apiRequest('/users');
  },

  // Buscar todos os pedidos
  getOrders: async () => {
    return apiRequest('/orders');
  },

  // Buscar todos os itens
  getItems: async () => {
    return apiRequest('/items');
  },

  // Criar novo item
  createItem: async (itemData: {
    description: string;
    unitPrice: number;
    categoryId: number;
  }) => {
    return apiRequest('/items', {
      method: 'POST',
      body: JSON.stringify(itemData),
    });
  },

  // Atualizar item
  updateItem: async (id: string, itemData: {
    description?: string;
    unitPrice?: number;
    categoryId?: number;
  }) => {
    return apiRequest(`/items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(itemData),
    });
  },

  // Deletar item
  deleteItem: async (id: string) => {
    return apiRequest(`/items/${id}`, {
      method: 'DELETE',
    });
  },

  // Buscar todas as categorias
  getCategories: async () => {
    return apiRequest('/categories');
  },

  // Buscar estatísticas do dashboard
  getStats: async () => {
    // Como não temos uma rota específica para stats, vamos buscar os dados e calcular
    const [users, orders, items] = await Promise.all([
      apiRequest('/users'),
      apiRequest('/order'),
      apiRequest('/items')
    ]);

    // Calcular pedidos de hoje
    const today = new Date().toISOString().split('T')[0];
    const todayOrders = orders.filter((order: any) => 
      order.createdAt?.startsWith(today)
    );

    return {
      totalUsers: users.length,
      totalOrders: orders.length,
      totalItems: items.length,
      todayOrders: todayOrders.length
    };
  }
};