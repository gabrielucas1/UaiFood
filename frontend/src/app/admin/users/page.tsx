'use client';

import { useEffect, useState } from 'react';
import DataTable from '../components/DataTable';
import ErrorDisplay from '../components/ErrorDisplay';
import PageHeader from '../components/PageHeader';
import { adminService } from '../services/adminService';

interface User {
  id: string;
  nome: string;
  phone: string;
  type: 'CLIENT' | 'ADMIN';
  createdAt: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estados para modal de alteração de tipo
  const [typeModal, setTypeModal] = useState({
    isOpen: false,
    userId: '',
    userName: '',
    currentType: 'CLIENT' as 'CLIENT' | 'ADMIN',
    loading: false
  });
  
  // Estados para notificação
  const [notification, setNotification] = useState({
    isOpen: false,
    message: '',
    type: 'success' as 'success' | 'error'
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await adminService.getUsers();
      setUsers(data);
      setError(null);
    } catch (error) {
      setError('Erro ao carregar usuários. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Funções para gerenciar modal de tipo
  const openTypeModal = (userId: string, userName: string, currentType: 'CLIENT' | 'ADMIN') => {
    setTypeModal({
      isOpen: true,
      userId,
      userName,
      currentType,
      loading: false
    });
  };

  const closeTypeModal = () => {
    setTypeModal({
      isOpen: false,
      userId: '',
      userName: '',
      currentType: 'CLIENT',
      loading: false
    });
  };

  // Função para alterar tipo de usuário
  const changeUserType = async (newType: 'CLIENT' | 'ADMIN') => {
    try {
      setTypeModal(prev => ({ ...prev, loading: true }));
      
      console.log(`🔄 Alterando tipo do usuário ${typeModal.userId} para ${newType}`);
      
      await adminService.changeUserType(typeModal.userId, newType);
      
      // Atualizar a lista local
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === typeModal.userId 
            ? { ...user, type: newType }
            : user
        )
      );
      
      showNotification(`Tipo de usuário alterado para ${newType === 'ADMIN' ? 'Administrador' : 'Cliente'} com sucesso!`, 'success');
      closeTypeModal();
      
      console.log('✅ Tipo alterado com sucesso');
    } catch (error: any) {
      console.error('❌ Erro ao alterar tipo:', error);
      
      let errorMessage = 'Erro ao alterar tipo de usuário';
      
      if (error.message) {
        errorMessage = error.message;
      }
      
      showNotification(errorMessage, 'error');
    } finally {
      setTypeModal(prev => ({ ...prev, loading: false }));
    }
  };

  // Função para mostrar notificação
  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ isOpen: true, message, type });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, isOpen: false }));
    }, 3000);
  };

  // Função para renderizar badge de tipo clicável
  const getTypeBadge = (type: 'CLIENT' | 'ADMIN', userId: string, userName: string) => {
    // Não permitir que o usuário altere seu próprio tipo
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const isCurrentUser = currentUser.id === userId;
    
    const baseClass = `px-2 py-1 rounded-full text-xs font-medium transition-colors ${
      type === 'ADMIN' 
        ? 'bg-red-100 text-red-800' 
        : 'bg-green-100 text-green-800'
    }`;
    
    if (isCurrentUser) {
      return (
        <span className={baseClass}>
          {type === 'ADMIN' ? 'Administrador' : 'Cliente'} (Você)
        </span>
      );
    }
    
    return (
      <button
        onClick={() => openTypeModal(userId, userName, type)}
        className={`${baseClass} hover:opacity-80 cursor-pointer`}
        title="Clique para alterar o tipo"
      >
        {type === 'ADMIN' ? 'Administrador' : 'Cliente'}
      </button>
    );
  };

  const columns = [
    {
      key: 'nome',
      label: 'Nome'
    },
    {
      key: 'phone',
      label: 'Telefone'
    },
    {
      key: 'type',
      label: 'Tipo',
      render: (value: 'CLIENT' | 'ADMIN', row: User) => getTypeBadge(value, row.id, row.nome)
    },
    {
      key: 'createdAt',
      label: 'Data de Cadastro',
      render: (value: string) => new Date(value).toLocaleDateString('pt-BR')
    }
  ];

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Usuários" description="Gerencie os usuários do sistema" />
        <ErrorDisplay error={error} onRetry={loadUsers} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Usuários"
        description={`${users.length} usuários cadastrados`}
      />

      <DataTable 
        data={users}
        columns={columns}
        loading={loading}
        emptyMessage="Nenhum usuário encontrado"
      />

      {/* Modal de alteração de tipo */}
      {typeModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Alterar Tipo de Usuário
              </h3>
              <p className="text-sm text-gray-600">
                Usuário: <span className="font-medium">{typeModal.userName}</span>
              </p>
              <p className="text-sm text-gray-600">
                Tipo atual: <span className="font-medium">
                  {typeModal.currentType === 'ADMIN' ? 'Administrador' : 'Cliente'}
                </span>
              </p>
            </div>

            <div className="space-y-2 mb-6">
              {['CLIENT', 'ADMIN'].map(type => {
                const labels = {
                  CLIENT: 'Cliente',
                  ADMIN: 'Administrador'
                };

                const isCurrentType = type === typeModal.currentType;
                
                return (
                  <button
                    key={type}
                    onClick={() => changeUserType(type as 'CLIENT' | 'ADMIN')}
                    disabled={isCurrentType || typeModal.loading}
                    className={`w-full p-3 rounded-lg border text-left transition-colors ${
                      isCurrentType 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'hover:bg-gray-50 text-gray-900 cursor-pointer'
                    } ${typeModal.loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-3 ${
                        type === 'ADMIN' ? 'bg-red-500' : 'bg-green-500'
                      }`}></div>
                      {labels[type as keyof typeof labels]}
                      {isCurrentType && (
                        <span className="text-xs text-gray-500 ml-2">(atual)</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex gap-3">
              <button
                onClick={closeTypeModal}
                disabled={typeModal.loading}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancelar
              </button>
            </div>

            {typeModal.loading && (
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