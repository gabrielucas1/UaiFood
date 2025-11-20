'use client';

import { useState, useEffect } from 'react';

interface Category {
  id: string;
  description: string;
}

interface Item {
  id: string;
  description: string;
  unitPrice: string;
  category: Category;
}

export function useOrderData() {
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Carregar dados em paralelo usando proxy
      const [categoriesResponse, itemsResponse] = await Promise.all([
        fetch('/api/v1/categories'),
        fetch('/api/v1/items')
      ]);

      if (categoriesResponse.ok) {
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData);
      }

      if (itemsResponse.ok) {
        const itemsData = await itemsResponse.json();
        setItems(itemsData);
      }
      
      setError(null);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setError('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtrar itens
  const getFilteredItems = (selectedCategory: string | null, searchTerm: string) => {
    return items.filter(item => {
      const matchesCategory = selectedCategory ? item.category?.id === selectedCategory : true;
      const matchesSearch = item.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  };

  return {
    items,
    categories,
    loading,
    error,
    getFilteredItems,
    refetch: loadData
  };
}