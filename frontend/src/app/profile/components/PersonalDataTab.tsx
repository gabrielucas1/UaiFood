'use client'

import { useState, useEffect } from 'react';
import FormInput from '../../components/FormInput';
import LoadingButton from '../../components/LoadingButton';
import ErrorMessage from '../../components/ErrorMessage';

interface UserData {
  name: string;
  phone: string;
  address: string;
}

export default function PersonalDataTab() {
  const [userData, setUserData] = useState<UserData>({
    name: '',
    phone: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // Carregar dados do usuário
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch('http://localhost:3991/api/users/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    };

    fetchUserData();
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

      const response = await fetch('http://localhost:3991/api/users/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nome: userData.name,
          phone: userData.phone
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Dados atualizados com sucesso!');
        setIsEditing(false);
      } else {
        setError(data.message || 'Erro ao atualizar dados');
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
    // Recarregar dados originais
    window.location.reload();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">📝 Informações Pessoais</h3>
        
        <div className="space-y-4">
          <FormInput
            name="name"
            label="Nome Completo"
            type="text"
            value={userData.name}
            onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))}
            required
            placeholder="Seu nome completo"
          />

          <FormInput
            name="phone"
            label="Telefone"
            type="tel"
            value={userData.phone}
            onChange={(e) => {
              const phone = e.target.value.replace(/\D/g, '');
              setUserData(prev => ({ ...prev, phone }));
            }}
            required
            placeholder="31999999999"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Endereço de Entrega
            </label>
            <div className="p-3 bg-white border border-gray-300 rounded-md text-gray-600">
              {userData.address || 'Nenhum endereço cadastrado'}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Para alterar o endereço, use a aba "🏠 Endereço"
            </p>
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
        {!isEditing ? (
          <button
            type="button"
            onClick={handleEdit}
            className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-3 px-4 rounded-md transition-colors"
          >
            ✏️ Editar Dados
          </button>
        ) : (
          <>
            <LoadingButton
              isLoading={loading}
              loadingText="Salvando..."
            >
              💾 Salvar Alterações
            </LoadingButton>
            
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-medium py-3 px-4 rounded-md transition-colors"
            >
              ❌ Cancelar
            </button>
          </>
        )}
      </div>

      <div className="text-center">
        <a
          href="/home"
          className="text-yellow-600 hover:text-yellow-800 text-sm font-medium"
        >
          ← Voltar ao Cardápio
        </a>
      </div>
    </form>
  );
}