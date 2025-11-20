'use client';

import { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';

interface ValidationError {
  field: string;
  message: string;
}

interface Category {
  id: string;
  description: string;
}

interface ItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (item: any) => void;
  item?: any; // Item para edição
}

export default function ItemModal({ isOpen, onClose, onSubmit, item }: ItemModalProps) {
  const [formData, setFormData] = useState({
    description: '',
    unitPrice: '',
    categoryId: ''
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);

  // Função para obter erro específico de um campo
  const getFieldError = (fieldName: string) => {
    const error = validationErrors.find(err => err.field === fieldName);
    return error ? error.message : '';
  };

  useEffect(() => {
    if (isOpen) {
      loadCategories();
      if (item) {
        setFormData({
          description: item.description || '',
          unitPrice: item.unitPrice?.toString() || '',
          categoryId: item.categoryId || ''
        });
      } else {
        setFormData({
          description: '',
          unitPrice: '',
          categoryId: ''
        });
      }
    }
  }, [isOpen, item]);

  const loadCategories = async () => {
    try {
      const data = await adminService.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
      setError('Erro ao carregar categorias');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setValidationErrors([]);

    try {
      const submitData = {
        description: formData.description,
        unitPrice: parseFloat(formData.unitPrice),
        categoryId: parseInt(formData.categoryId)
      };

      await onSubmit(submitData);
      onClose();
    } catch (error: any) {
      console.error('Erro ao salvar item:', error);
      console.error('Error details:', error.details);
      console.error('Error response:', error.response);
      
      // Captura mensagens específicas do Zod
      if (error.response?.data?.details && Array.isArray(error.response.data.details)) {
        // Erros de validação específicos do backend (Zod)
        console.log('Zod validation errors found:', error.response.data.details);
        setValidationErrors(error.response.data.details);
        setError('Por favor, corrija os erros abaixo:');
      } else if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else if (error.details && Array.isArray(error.details)) {
        console.log('Direct details found:', error.details);
        setValidationErrors(error.details);
        setError('Por favor, corrija os erros abaixo:');
      } else if (error.message) {
        setError(error.message);
      } else if (error.error) {
        setError(error.error);
      } else {
        setError('Erro ao salvar item. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpar erros quando o usuário começar a digitar
    if (error) setError(null);
    if (validationErrors.length > 0) {
      setValidationErrors(prev => prev.filter(err => err.field !== name));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            {item ? 'Editar Item' : 'Adicionar Item'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Erros específicos de validação */}
        {validationErrors.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
            <h4 className="font-semibold text-red-800 mb-2">Corrija os seguintes erros:</h4>
            <ul className="space-y-1">
              {validationErrors.map((error, index) => (
                <li key={index} className="text-red-700 text-sm flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  <span><strong>{error.field}:</strong> {error.message}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Campo Descrição */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome do Item
            </label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              className={`w-full border rounded-md px-3 py-2 focus:ring-orange-500 ${
                getFieldError('description') 
                  ? 'border-red-500 focus:border-red-500' 
                  : 'border-gray-300 focus:border-orange-500'
              }`}
              placeholder="Ex: Pizza Margherita"
            />
            {getFieldError('description') && (
              <p className="mt-1 text-sm text-red-600">
                {getFieldError('description')}
              </p>
            )}
          </div>

          {/* Campo Preço */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Preço
            </label>
            <input
              type="number"
              name="unitPrice"
              value={formData.unitPrice}
              onChange={handleChange}
              step="0.01"
              min="0"
              required
              className={`w-full border rounded-md px-3 py-2 focus:ring-orange-500 ${
                getFieldError('unitPrice') 
                  ? 'border-red-500 focus:border-red-500' 
                  : 'border-gray-300 focus:border-orange-500'
              }`}
              placeholder="0.00"
            />
            {getFieldError('unitPrice') && (
              <p className="mt-1 text-sm text-red-600">
                {getFieldError('unitPrice')}
              </p>
            )}
          </div>

          {/* Campo Categoria */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categoria
            </label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              required
              className={`w-full border rounded-md px-3 py-2 focus:ring-orange-500 ${
                getFieldError('categoryId') 
                  ? 'border-red-500 focus:border-red-500' 
                  : 'border-gray-300 focus:border-orange-500'
              }`}
            >
              <option value="">Selecione uma categoria</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.description}
                </option>
              ))}
            </select>
            {getFieldError('categoryId') && (
              <p className="mt-1 text-sm text-red-600">
                {getFieldError('categoryId')}
              </p>
            )}
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Salvando...' : (item ? 'Atualizar' : 'Adicionar')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export { ItemModal };