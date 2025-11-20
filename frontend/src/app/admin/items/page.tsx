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
    } else {
      await adminService.createItem(itemData);
    }
    await loadData(); // Recarregar dados
    closeModal();
  };

  const handleDeleteItem = async (item: Item) => {
    if (!confirm(`Tem certeza que deseja excluir o item "${item.description}"?\n\nEsta ação não pode ser desfeita.`)) return;
    
    try {
      await adminService.deleteItem(item.id);
      alert('Item excluído com sucesso!');
      await loadData();
    } catch (error) {
      console.error('Erro ao excluir item:', error);
      alert('Erro ao excluir item. Verifique se o item não está sendo usado em pedidos.');
    }
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
    </div>
  );
}