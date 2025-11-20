'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface CartItem {
  id: string;
  description: string;
  unitPrice: string;
  quantity: number;
  price: number;
}

interface ValidationError {
  field: string;
  message: string;
}

export function useOrderSubmission() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const router = useRouter();

  const submitOrder = async (
    cart: CartItem[], 
    paymentMethod: string,
    onSuccess: () => void
  ) => {
    if (cart.length === 0) {
      setError('Adicione pelo menos um item ao carrinho');
      return;
    }

    setSubmitting(true);
    setError(null);
    setValidationErrors([]);

    try {
      const token = localStorage.getItem('token');
      const orderItems = cart.map(item => ({
        itemId: item.id,
        quantity: item.quantity,
        unitPrice: item.price
      }));

      const response = await fetch('/api/v1/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          paymentMethod,
          items: orderItems
        })
      });

      if (response.ok) {
        onSuccess();
        alert('🎉 Pedido realizado com sucesso!');
        router.push('/home');
      } else {
        const errorData = await response.json();
        
        // 🔧 CAPTURAR ERROS ESPECÍFICOS DO BACKEND
        if (errorData.details && Array.isArray(errorData.details)) {
          setValidationErrors(errorData.details);
          setError('Por favor, corrija os erros no pedido:');
        } else if (errorData.message) {
          setError(errorData.message);
        } else if (errorData.error) {
          setError(errorData.error);
        } else {
          setError('Erro ao realizar pedido');
        }
      }
    } catch (error) {
      console.error('Erro ao enviar pedido:', error);
      setError('Erro ao realizar pedido. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  return {
    submitting,
    error,
    validationErrors,
    submitOrder,
    clearError: () => {
      setError(null);
      setValidationErrors([]);
    },
    getFieldError: (fieldName: string) => {
      const error = validationErrors.find(err => err.field === fieldName);
      return error ? error.message : '';
    }
  };
}