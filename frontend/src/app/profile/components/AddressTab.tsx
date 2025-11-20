'use client'

import { useState, useEffect } from 'react';
import FormInput from '../../components/FormInput';
import LoadingButton from '../../components/LoadingButton';
import ErrorMessage from '../../components/ErrorMessage';

interface AddressData {
  id?: string;
  street: string;
  number: string;
  district: string;
  city: string;
  state: string;
  zipCode: string;
}

export default function AddressTab() {
  const [address, setAddress] = useState<AddressData>({
    street: '',
    number: '',
    district: '',
    city: '',
    state: '',
    zipCode: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [hasAddress, setHasAddress] = useState(false);

  // Carregar endereço do usuário
  useEffect(() => {
    const loadAddress = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch('http://localhost:3991/api/address', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.data) {
            setAddress(data.data);
            setHasAddress(true);
          }
        }
      } catch (error) {
        console.error('Erro ao carregar endereço:', error);
      }
    };

    loadAddress();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Token não encontrado. Faça login novamente.');
        return;
      }

      const method = hasAddress ? 'PUT' : 'POST';
      const response = await fetch('http://localhost:3991/api/address', {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(address)
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(hasAddress ? 'Endereço atualizado com sucesso!' : 'Endereço criado com sucesso!');
        setIsEditing(false);
        setHasAddress(true);
      } else {
        setError(data.message || 'Erro ao salvar endereço');
      }
    } catch (error) {
      setError('Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja excluir seu endereço?')) return;

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Token não encontrado. Faça login novamente.');
        return;
      }

      const response = await fetch('http://localhost:3991/api/address', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setAddress({
          street: '',
          number: '',
          district: '',
          city: '',
          state: '',
          zipCode: ''
        });
        setHasAddress(false);
        setIsEditing(true);
        setSuccess('Endereço excluído com sucesso!');
      } else {
        setError('Erro ao excluir endereço');
      }
    } catch (error) {
      setError('Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setError('');
    setSuccess('');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError('');
    setSuccess('');
    // Recarregar dados originais se houver endereço
    if (hasAddress) {
      window.location.reload();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">🏠 Endereço de Entrega</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <FormInput
              name="street"
              label="Rua"
              type="text"
              value={address.street}
              onChange={(e) => setAddress(prev => ({ ...prev, street: e.target.value }))}
              required
              placeholder="Nome da rua"
            />
          </div>

          <FormInput
            name="number"
            label="Número"
            type="text"
            value={address.number}
            onChange={(e) => setAddress(prev => ({ ...prev, number: e.target.value }))}
            required
            placeholder="123"
          />

          <FormInput
            name="district"
            label="Bairro"
            type="text"
            value={address.district}
            onChange={(e) => setAddress(prev => ({ ...prev, district: e.target.value }))}
            required
            placeholder="Nome do bairro"
          />

          <FormInput
            name="city"
            label="Cidade"
            type="text"
            value={address.city}
            onChange={(e) => setAddress(prev => ({ ...prev, city: e.target.value }))}
            required
            placeholder="Nome da cidade"
          />

          <FormInput
            name="state"
            label="Estado"
            type="text"
            value={address.state}
            onChange={(e) => setAddress(prev => ({ ...prev, state: e.target.value.toUpperCase() }))}
            required
            placeholder="MG"
          />

          <div className="md:col-span-2">
            <FormInput
              name="zipCode"
              label="CEP"
              type="text"
              value={address.zipCode}
              onChange={(e) => {
                const cep = e.target.value.replace(/\D/g, '');
                setAddress(prev => ({ ...prev, zipCode: cep }));
              }}
              required
              placeholder="30000000"
            />
          </div>
        </div>
      </div>

      {error && <ErrorMessage message={error} />}
      
      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-md">
          <div className="flex">
            <span className="text-green-500 text-xl mr-3">✅</span>
            <p className="text-green-700">{success}</p>
          </div>
        </div>
      )}

      <div className="flex space-x-4">
        {!isEditing && hasAddress ? (
          <>
            <button
              type="button"
              onClick={handleEdit}
              className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-3 px-4 rounded-md transition-colors"
            >
              ✏️ Editar Endereço
            </button>
            
            <button
              type="button"
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-4 rounded-md transition-colors"
            >
              🗑️ Excluir
            </button>
          </>
        ) : (
          <>
            <LoadingButton
              isLoading={loading}
              loadingText="Salvando..."
            >
              💾 {hasAddress ? 'Atualizar' : 'Salvar'} Endereço
            </LoadingButton>
            
            {hasAddress && (
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-3 px-4 rounded-md transition-colors"
              >
                ❌ Cancelar
              </button>
            )}
          </>
        )}
      </div>

      {!hasAddress && !isEditing && (
        <div className="text-center">
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-md transition-colors"
          >
            ➕ Adicionar Endereço
          </button>
        </div>
      )}
    </form>
  );
}