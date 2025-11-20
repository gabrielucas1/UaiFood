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
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 'ADMIN' 
            ? 'bg-red-100 text-red-800' 
            : 'bg-green-100 text-green-800'
        }`}>
          {value === 'ADMIN' ? 'Administrador' : 'Cliente'}
        </span>
      )
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
    </div>
  );
}