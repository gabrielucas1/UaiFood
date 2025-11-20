'use client';

import { useEffect, useState } from 'react';
import DataTable from '../components/DataTable';
import ErrorDisplay from '../components/ErrorDisplay';
import PageHeader from '../components/PageHeader';
import FilterSelect from '../components/FilterSelect';
import { ItemModal } from '../components/ItemModal';
import { adminService } from '../services/adminService';

interface Item {
  id: string;
  description: string;
  unitPrice: string | number; // Pode vir como string do backend
  createdAt: string;
  category: {
    id: string;
    description: string;
  };
}

interface Category {
  id: string;
  description: string;
}

export default function ItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  
  // Estados para modal de confirmação
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    confirmText: 'Confirmar',
    cancelText: 'Cancelar',
    type: 'danger' as 'danger' | 'success' | 'info'
  });
  
  // Estados para notificação
  const [notification, setNotification] = useState({
    isOpen: false,
    message: '',
    type: 'success' as 'success' | 'error'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [itemsData, categoriesData] = await Promise.all([
        adminService.getItems(),
        adminService.getCategories()
      ]);
      setItems(itemsData);
      setCategories(categoriesData);
      setError(null);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setError('Erro ao carregar dados. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Funções utilitárias para modais
  const showConfirmModal = (options: {
    title: string;
    message: string;
    onConfirm: () => void;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'success' | 'info';
  }) => {
    setConfirmModal({
      isOpen: true,
      title: options.title,
      message: options.message,
      onConfirm: options.onConfirm,
      confirmText: options.confirmText || 'Confirmar',
      cancelText: options.cancelText || 'Cancelar',
      type: options.type || 'danger'
    });
  };

  const closeConfirmModal = () => {
    setConfirmModal(prev => ({ ...prev, isOpen: false }));
  };

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ isOpen: true, message, type });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, isOpen: false }));
    }, 3000);
  };

  // Ações do modal
  const openCreateModal = () => {
    setEditingItem(null);
    setModalOpen(true);
  };

  const openEditModal = (item: Item) => {
    setEditingItem(item);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingItem(null);
  };

  // Ações de CRUD
  const handleSaveItem = async (itemData: any) => {
    if (editingItem) {
      await adminService.updateItem(editingItem.id, itemData);
      showNotification('Item atualizado com sucesso!', 'success');
    } else {
      await adminService.createItem(itemData);
      showNotification('Item criado com sucesso!', 'success');
    }
    await loadData(); // Recarregar dados
    closeModal();
  };

  const handleDeleteItem = async (item: Item) => {
    showConfirmModal({
      title: 'Confirmar Exclusão',
      message: `Tem certeza que deseja excluir o item "${item.description}"?\n\nEsta ação não pode ser desfeita.`,
      confirmText: 'Excluir',
      cancelText: 'Cancelar',
      type: 'danger',
      onConfirm: async () => {
        try {
          await adminService.deleteItem(item.id);
          showNotification('Item excluído com sucesso!', 'success');
          await loadData();
        } catch (error) {
          console.error('Erro ao excluir item:', error);
          showNotification('Erro ao excluir item. O Item pode estar sendo usado em pedidos.', 'error');
        }
        closeConfirmModal();
      }
    });
  };

  // Filtro de itens
  const filteredItems = selectedCategory 
    ? items.filter(item => item.category?.id === selectedCategory)
    : items;

  // Opções do filtro
  const categoryOptions = categories.map(category => ({
    value: category.id,
    label: category.description
  }));

  const columns = [
    {
      key: 'description',
      label: 'Nome do Item'
    },
    {
      key: 'category',
      label: 'Categoria',
      render: (value: any) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {value?.description || 'N/A'}
        </span>
      )
    },
    {
      key: 'unitPrice',
      label: 'Preço',
      render: (value: string | number) => {
        const numValue = typeof value === 'string' ? parseFloat(value) : value;
        return (
          <span className="font-semibold text-green-600">
            R$ {numValue.toFixed(2).replace('.', ',')}
          </span>
        );
      }
    },
    {
      key: 'createdAt',
      label: 'Data de Cadastro',
      render: (value: string) => new Date(value).toLocaleDateString('pt-BR')
    },
    {
      key: 'actions',
      label: 'Ações',
      render: (value: any, row: Item) => (
        <div className="flex space-x-2">
          <button 
            onClick={() => openEditModal(row)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            ✏️ Editar
          </button>
          <button 
            onClick={() => handleDeleteItem(row)}
            className="text-red-600 hover:text-red-800 font-medium hover:underline"
          >
            🗑️ Excluir
          </button>
        </div>
      )
    }
  ];

  // Renderização da página
  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Gerenciar Itens" description="Gerencie o cardápio do restaurante" />
        <ErrorDisplay error={error} onRetry={loadData} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Gerenciar Itens"
        description={`${filteredItems.length} ${filteredItems.length === 1 ? 'item' : 'itens'} encontrados`}
        action={{ label: "Novo Item", onClick: openCreateModal }}
      />

      <div className="bg-white rounded-lg shadow-md p-4">
        <FilterSelect
          label="Filtrar por Categoria"
          value={selectedCategory}
          onChange={setSelectedCategory}
          options={categoryOptions}
          placeholder="Todas as categorias"
        />
      </div>

      <DataTable 
        data={filteredItems}
        columns={columns}
        loading={loading}
        emptyMessage="Nenhum item cadastrado ainda"
      />

      <ItemModal
        isOpen={modalOpen}
        onClose={closeModal}
        onSubmit={handleSaveItem}
        item={editingItem}
      />

      {/* Modal de Confirmação */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4 relative z-[10000]">
            <div className="flex items-center mb-4">
              <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                confirmModal.type === 'danger' ? 'bg-red-100' :
                confirmModal.type === 'success' ? 'bg-green-100' : 'bg-blue-100'
              }`}>
                <span className="text-xl">
                  {confirmModal.type === 'danger' ? '⚠️' :
                   confirmModal.type === 'success' ? '✅' : 'ℹ️'}
                </span>
              </div>
              <h3 className="ml-3 text-lg font-medium text-gray-900">
                {confirmModal.title}
              </h3>
            </div>
            
            <div className="mb-6">
              <p className="text-sm text-gray-700 whitespace-pre-line">
                {confirmModal.message}
              </p>
            </div>
            
            <div className="flex space-x-3 justify-end">
              <button
                type="button"
                onClick={closeConfirmModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {confirmModal.cancelText}
              </button>
              <button
                type="button"
                onClick={() => {
                  confirmModal.onConfirm();
                }}
                className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  confirmModal.type === 'danger' ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' :
                  confirmModal.type === 'success' ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500' :
                  'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                }`}
              >
                {confirmModal.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notificação */}
      {notification.isOpen && (
        <div className="fixed top-4 right-4 z-[9998]">
          <div className={`rounded-lg shadow-lg p-4 max-w-sm ${
            notification.type === 'success' ? 'bg-green-50 border border-green-200' :
            'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-xl">
                  {notification.type === 'success' ? '✅' : '❌'}
                </span>
              </div>
              <div className="ml-3">
                <p className={`text-sm font-medium ${
                  notification.type === 'success' ? 'text-green-800' : 'text-red-800'
                }`}>
                  {notification.message}
                </p>
              </div>
              <div className="ml-4 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setNotification(prev => ({ ...prev, isOpen: false }))}
                  className={`rounded-md p-1.5 hover:bg-opacity-20 ${
                    notification.type === 'success' ? 'text-green-500 hover:bg-green-600' :
                    'text-red-500 hover:bg-red-600'
                  }`}
                >
                  <span className="text-sm">✕</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}