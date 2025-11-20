'use client'

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/authContext';
import FormInput from '../components/FormInput';
import LoadingButton from '../components/LoadingButton';
import ErrorMessage from '../components/ErrorMessage';
import { useRouter } from 'next/navigation';

interface UserData {
  nome: string;
  phone: string;
  type: string;
}

interface AddressData {
  id?: string;
  street: string;
  number: string;
  district: string;
  city: string;
  state: string;
  zipCode: string;
}

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Funções auxiliares para formatação
const formatPhone = (value: string) => {
  const phone = value.replace(/\D/g, '');
  if (phone.length <= 11) {
    if (phone.length === 11) {
      return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (phone.length === 10) {
      return phone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    } else if (phone.length > 6) {
      return phone.replace(/(\d{2})(\d{4})(\d+)/, '($1) $2-$3');
    } else if (phone.length > 2) {
      return phone.replace(/(\d{2})(\d+)/, '($1) $2');
    } else {
      return phone;
    }
  }
  return phone.substring(0, 11);
};

const formatZipCode = (value: string) => {
  const zipCode = value.replace(/\D/g, '');
  if (zipCode.length <= 8) {
    if (zipCode.length > 5) {
      return zipCode.replace(/(\d{5})(\d+)/, '$1-$2');
    }
    return zipCode;
  }
  return zipCode.substring(0, 8);
};

// Funções de validação baseadas nos schemas do backend
const validateUserData = (data: Partial<UserData>) => {
  const errors: string[] = [];
  
  if (data.nome !== undefined) {
    const nome = data.nome.trim();
    if (!nome) errors.push('Nome é obrigatório');
    else if (nome.length < 4) errors.push('Nome deve ter pelo menos 4 caracteres');
    else if (nome.length > 100) errors.push('Nome deve ter no máximo 100 caracteres');
    else if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(nome)) errors.push('Nome deve conter apenas letras e espaços');
  }
  
  if (data.phone !== undefined) {
    const phone = data.phone.replace(/\D/g, '');
    if (!phone) errors.push('Telefone é obrigatório');
    else if (phone.length < 10 || phone.length > 11) errors.push('Telefone deve ter 10 ou 11 dígitos (ex: 31999999999)');
    else if (!/^[1-9]/.test(phone)) errors.push('Telefone deve começar com um dígito válido');
  }
  
  return errors;
};

const validateAddress = (data: AddressData) => {
  const errors: string[] = [];
  
  const street = data.street.trim();
  if (!street) errors.push('Nome da rua é obrigatório');
  else if (street.length < 5) errors.push('Nome da rua deve ter pelo menos 5 caracteres');
  else if (street.length > 200) errors.push('Nome da rua deve ter no máximo 200 caracteres');
  else if (!/^[a-zA-ZÀ-ÿ0-9\s\-.,()]+$/.test(street)) errors.push('Rua contém caracteres inválidos');
  
  const number = data.number.trim();
  if (!number) errors.push('Número é obrigatório');
  else if (number.length > 10) errors.push('Número deve ter no máximo 10 caracteres');
  else if (!/^[0-9a-zA-Z\-\/]+$/.test(number)) errors.push('Número deve conter apenas números, letras, hífen ou barra');
  
  const district = data.district.trim();
  if (!district) errors.push('Bairro é obrigatório');
  else if (district.length < 3) errors.push('Bairro deve ter pelo menos 3 caracteres');
  else if (district.length > 100) errors.push('Bairro deve ter no máximo 100 caracteres');
  else if (!/^[a-zA-ZÀ-ÿ\s\-]+$/.test(district)) errors.push('Bairro deve conter apenas letras, espaços e hífen');
  
  const city = data.city.trim();
  if (!city) errors.push('Cidade é obrigatória');
  else if (city.length < 2) errors.push('Cidade deve ter pelo menos 2 caracteres');
  else if (city.length > 100) errors.push('Cidade deve ter no máximo 100 caracteres');
  else if (!/^[a-zA-ZÀ-ÿ\s\-]+$/.test(city)) errors.push('Cidade deve conter apenas letras, espaços e hífen');
  
  const state = data.state.trim().toUpperCase();
  const validStates = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'];
  if (!state) errors.push('Estado é obrigatório');
  else if (state.length !== 2) errors.push('Estado deve ter exatamente 2 caracteres (ex: MG, SP, RJ)');
  else if (!/^[A-Z]{2}$/.test(state)) errors.push('Estado deve ser uma sigla válida em maiúsculas (ex: MG)');
  else if (!validStates.includes(state)) errors.push('Digite uma sigla de estado válida (ex: MG, SP, RJ)');
  
  const zipCode = data.zipCode.replace(/\D/g, '');
  if (!zipCode) errors.push('CEP é obrigatório');
  else if (zipCode.length !== 8) errors.push('CEP deve ter exatamente 8 dígitos (ex: 30100000)');
  else if (!/^[0-9]{8}$/.test(zipCode)) errors.push('CEP deve conter apenas números');
  
  return errors;
};

const validatePassword = (data: PasswordData) => {
  const errors: string[] = [];
  
  if (!data.currentPassword.trim()) errors.push('Senha atual é obrigatória');
  
  if (!data.newPassword.trim()) errors.push('Nova senha é obrigatória');
  else if (data.newPassword.length < 6) errors.push('Nova senha deve ter pelo menos 6 caracteres');
  else if (data.newPassword.length > 100) errors.push('Nova senha deve ter no máximo 100 caracteres');
  else if (!/(?=.*[a-z])/.test(data.newPassword)) errors.push('Nova senha deve conter pelo menos uma letra minúscula');
  else if (!/(?=.*[0-9])/.test(data.newPassword)) errors.push('Nova senha deve conter pelo menos um número');
  
  if (!data.confirmPassword.trim()) errors.push('Confirmação de senha é obrigatória');
  else if (data.newPassword !== data.confirmPassword) errors.push('As senhas não coincidem');
  
  return errors;
};

export default function ProfilePage() {
  const { user, isLoggedIn } = useAuth();
  const router = useRouter();
  
  const [userData, setUserData] = useState<UserData>({
    nome: '',
    phone: '',
    type: ''
  });
  
  const [address, setAddress] = useState<AddressData>({
    street: '',
    number: '',
    district: '',
    city: '',
    state: '',
    zipCode: ''
  });

  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [hasAddress, setHasAddress] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [showPassword, setShowPassword] = useState(false);

  // Verificar se está logado
  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }
  }, [isLoggedIn, router]);

  // Carregar dados do usuário
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        // Buscar dados pessoais
        const profileResponse = await fetch('http://localhost:3991/api/users/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          setUserData({
            nome: profileData.nome || profileData.name || '', // Tentar ambos os campos
            phone: profileData.phone || '',
            type: user?.type || ''
          });
        }

        // Buscar endereço
        const addressResponse = await fetch('http://localhost:3991/api/address', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        });

        if (addressResponse.ok) {
          const addressData = await addressResponse.json();
          // Verificar se tem endereço nos dados retornados
          if (addressData && (addressData.data || addressData.id)) {
            const addr = addressData.data || addressData;
            setAddress({
              id: addr.id || '',
              street: addr.street || '',
              number: addr.number || '',
              district: addr.district || '',
              city: addr.city || '',
              state: addr.state || '',
              zipCode: addr.zipCode || ''
            });
            setHasAddress(true);
          }
        }

        // Buscar pedidos do usuário
        console.log('Buscando pedidos do usuário...');
        const ordersResponse = await fetch('http://localhost:3991/api/orders/my-orders', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        });

        console.log('Response status dos pedidos:', ordersResponse.status);
        
        if (ordersResponse.ok) {
          const ordersData = await ordersResponse.json();
          console.log('Dados dos pedidos recebidos:', ordersData);
          setOrders(ordersData.orders || ordersData || []);
        } else {
          console.error('Erro ao buscar pedidos:', ordersResponse.status);
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    };

    if (isLoggedIn) {
      loadUserData();
    }
  }, [isLoggedIn, user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validações do frontend seguindo o schema do backend
    const validationErrors = validateUserData(userData);
    if (validationErrors.length > 0) {
      setError(validationErrors[0]); // Mostrar primeiro erro
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Token não encontrado. Faça login novamente.');
        setLoading(false);
        return;
      }

      // Limpar e formatar dados antes de enviar
      const formattedData = {
        nome: userData.nome.trim(),
        phone: userData.phone.replace(/\D/g, '') // Remove caracteres não numéricos
      };

      const response = await fetch('http://localhost:3991/api/users/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formattedData)
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Dados pessoais atualizados com sucesso!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        // Tratamento específico para erros de validação Zod
        if (data.errors && Array.isArray(data.errors)) {
          // Erros de validação Zod
          const errorMessages = data.errors.map((err: any) => err.message).join(', ');
          setError(errorMessages);
        } else if (data.details && Array.isArray(data.details)) {
          // Outros detalhes de erro
          setError(data.details.map((detail: any) => detail.message).join(', '));
        } else {
          setError(data.message || data.error || 'Erro ao atualizar dados pessoais');
        }
        setTimeout(() => setError(''), 5000); // Limpar erro após 5 segundos
      }
    } catch (error) {
      setError('Erro ao conectar com o servidor');
      setTimeout(() => setError(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validações do frontend seguindo o schema do backend
    const validationErrors = validateAddress(address);
    if (validationErrors.length > 0) {
      setError(validationErrors[0]); // Mostrar primeiro erro
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Token não encontrado. Faça login novamente.');
        setLoading(false);
        return;
      }

      // Limpar e formatar dados antes de enviar
      const formattedAddress = {
        ...address,
        street: address.street.trim(),
        number: address.number.trim(),
        district: address.district.trim(),
        city: address.city.trim(),
        state: address.state.trim().toUpperCase(),
        zipCode: address.zipCode.replace(/\D/g, '') // Remove caracteres não numéricos
      };

      const method = hasAddress ? 'PUT' : 'POST';
      const response = await fetch('http://localhost:3991/api/address', {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formattedAddress)
      });

      const data = await response.json();

      if (response.ok) {
        // Sucesso - atualizar estado local com dados retornados
        if (data.id) {
          setAddress({
            id: data.id,
            street: data.street,
            number: data.number,
            district: data.district,
            city: data.city,
            state: data.state,
            zipCode: data.zipCode
          });
        }
        setSuccess(hasAddress ? 'Endereço atualizado com sucesso!' : 'Endereço criado com sucesso!');
        setHasAddress(true);
        setTimeout(() => setSuccess(''), 3000);
      } else {
        // Tratamento específico para erros de validação Zod
        if (data.errors && Array.isArray(data.errors)) {
          // Erros de validação Zod
          const errorMessages = data.errors.map((err: any) => err.message).join(', ');
          setError(errorMessages);
        } else if (data.details && Array.isArray(data.details)) {
          // Outros detalhes de erro
          setError(data.details.map((detail: any) => detail.message).join(', '));
        } else {
          setError(data.message || data.error || 'Erro ao salvar endereço');
        }
        setTimeout(() => setError(''), 5000); // Limpar erro após 5 segundos
      }
    } catch (error) {
      setError('Erro ao conectar com o servidor');
      setTimeout(() => setError(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validações do frontend seguindo o schema do backend
    const validationErrors = validatePassword(passwordData);
    if (validationErrors.length > 0) {
      setError(validationErrors[0]); // Mostrar primeiro erro
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Token não encontrado. Faça login novamente.');
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:3991/api/users/change-password', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
          confirmPassword: passwordData.confirmPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Senha alterada com sucesso!');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setTimeout(() => setSuccess(''), 3000);
      } else {
        // Tratamento específico para erros de validação Zod
        if (data.errors && Array.isArray(data.errors)) {
          // Erros de validação Zod
          const errorMessages = data.errors.map((err: any) => err.message).join(', ');
          setError(errorMessages);
        } else if (data.details && Array.isArray(data.details)) {
          // Outros detalhes de erro
          setError(data.details.map((detail: any) => detail.message).join(', '));
        } else {
          setError(data.message || data.error || 'Erro ao alterar senha');
        }
        setTimeout(() => setError(''), 5000); // Limpar erro após 5 segundos
      }
    } catch (error) {
      setError('Erro ao conectar com o servidor');
      setTimeout(() => setError(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-yellow-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">👤 Meu Perfil</h1>
            <p className="text-gray-600">Gerencie suas informações pessoais</p>
          </div>
        </div>

        {/* Mensagens de Erro e Sucesso */}
        {error && <ErrorMessage message={error} />}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
            <div className="flex">
              <span className="text-green-500 text-xl mr-3">✅</span>
              <p className="text-green-700">{success}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Dados Pessoais */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              📝 Informações Pessoais
            </h2>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <FormInput
                label="Nome Completo"
                name="nome"
                type="text"
                value={userData.nome}
                onChange={(e) => {
                  const nome = e.target.value;
                  // Permitir apenas letras, espaços e acentos
                  if (/^[a-zA-ZÀ-ÿ\s]*$/.test(nome)) {
                    setUserData(prev => ({ ...prev, nome }));
                  }
                }}
                required
                placeholder="Seu nome completo"
              />

              <FormInput
                label="Telefone"
                name="phone"
                type="text"
                value={formatPhone(userData.phone)}
                onChange={(e) => {
                  const phone = e.target.value.replace(/\D/g, '');
                  setUserData(prev => ({ ...prev, phone }));
                }}
                required
                placeholder="(31) 99999-9999"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Usuário
                </label>
                <div className="p-3 bg-gray-100 rounded-md">
                  <span className="text-gray-800 font-medium">
                    {userData.type === 'ADMIN' ? '🛠️ Administrador' : '👤 Cliente'}
                  </span>
                </div>
              </div>

              <LoadingButton
                isLoading={loading}
                loadingText="Atualizando..."
              >
                💾 Atualizar Dados Pessoais
              </LoadingButton>
            </form>
          </div>

          {/* Endereço */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              🏠 Endereço de Entrega
            </h2>
            <form onSubmit={handleUpdateAddress} className="space-y-4">
              <FormInput
                name="street"
                label="Rua"
                type="text"
                value={address.street}
                onChange={(e) => setAddress(prev => ({ ...prev, street: e.target.value }))}
                required
                placeholder="Nome da rua"
              />

              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  label="Número"
                  name="number"
                  type="text"
                  value={address.number}
                  onChange={(e) => setAddress(prev => ({ ...prev, number: e.target.value }))}
                  required
                  placeholder="123"
                />

                <FormInput
                  label="Bairro"
                  name="neighborhood"
                  type="text"
                  value={address.district}
                  onChange={(e) => setAddress(prev => ({ ...prev, district: e.target.value }))}
                  required
                  placeholder="Nome do bairro"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  label="Cidade"
                  name="city"
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
              </div>

              <FormInput
                label="CEP"
                name="cep"
                type="text"
                value={formatZipCode(address.zipCode)}
                onChange={(e) => {
                  const cep = e.target.value.replace(/\D/g, '');
                  setAddress(prev => ({ ...prev, zipCode: cep }));
                }}
                required
                placeholder="30000-000"
              />

              <LoadingButton
                isLoading={loading}
                loadingText="Salvando..."
              >
                💾 {hasAddress ? 'Atualizar' : 'Salvar'} Endereço
              </LoadingButton>
            </form>
          </div>
        </div>

        {/* Alterar Senha - Sempre visível */}
        <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            🔐 Alterar Senha
          </h2>

          <form onSubmit={handleChangePassword} className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <FormInput
                  label="Senha Atual"
                  name="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                  required
                  placeholder="Digite sua senha atual"
                />
              </div>

              <div>
                <FormInput
                  label="Nova Senha"
                  name="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                  required
                  placeholder="Digite sua nova senha"
                />
                {passwordData.newPassword && (
                  <div className="mt-1 text-xs">
                    <div className={passwordData.newPassword.length >= 6 ? 'text-green-600' : 'text-red-600'}>
                      {passwordData.newPassword.length >= 6 ? '✅' : '❌'} Mínimo de 6 caracteres
                    </div>
                    <div className={/(?=.*[a-z])/.test(passwordData.newPassword) ? 'text-green-600' : 'text-red-600'}>
                      {/(?=.*[a-z])/.test(passwordData.newPassword) ? '✅' : '❌'} Letra minúscula
                    </div>
                    <div className={/(?=.*[0-9])/.test(passwordData.newPassword) ? 'text-green-600' : 'text-red-600'}>
                      {/(?=.*[0-9])/.test(passwordData.newPassword) ? '✅' : '❌'} Número
                    </div>
                  </div>
                )}
              </div>

              <div>
                <FormInput
                  label="Confirmar Nova Senha"
                  name="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  required
                  placeholder="Confirme sua nova senha"
                />
                {passwordData.confirmPassword && (
                  <div className="mt-1 text-xs">
                    <div className={passwordData.newPassword === passwordData.confirmPassword ? 'text-green-600' : 'text-red-600'}>
                      {passwordData.newPassword === passwordData.confirmPassword ? '✅' : '❌'} Senhas coincidem
                    </div>
                  </div>
                )}
              </div>

              <div className="md:col-span-3">
                <LoadingButton
                  isLoading={loading}
                  loadingText="Alterando..."
                >
                  🔒 Alterar Senha
                </LoadingButton>
                
                <div className="text-center mt-2">
                  <p className="text-sm text-gray-500">
                    ⚠️ Após alterar a senha, você precisará fazer login novamente
                  </p>
                </div>
              </div>
            </form>
          </div>

        {/* Botão Voltar */}
        <div className="text-center mt-8">
          <button
            onClick={() => router.push('/home')}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            ← Voltar ao Início
          </button>
        </div>

        {/* Seção de Pedidos */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-6 mt-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            📋 Meus Pedidos
          </h2>
          {orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order: any, index) => (
                <div key={order.id || index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium text-gray-800">
                        Pedido #{order.id || `${index + 1}`}
                      </p>
                      <p className="text-sm text-gray-600">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString('pt-BR') : 'Data não disponível'}
                      </p>
                    </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">
                          {order.total && typeof order.total === 'number' ? `R$ ${order.total.toFixed(2)}` : 
                           order.total && typeof order.total === 'string' ? `R$ ${parseFloat(order.total).toFixed(2)}` :
                           'Valor não disponível'}
                        </p>
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                        order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                        order.status === 'PREPARING' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'PENDING' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status === 'DELIVERED' ? 'Entregue' :
                         order.status === 'PREPARING' ? 'Preparando' :
                         order.status === 'PENDING' ? 'Pendente' : order.status}
                      </span>
                    </div>
                  </div>
                  {order.items && order.items.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm text-gray-600 mb-1">Itens:</p>
                      <ul className="text-sm text-gray-700">
                        {order.items.map((item: any, itemIndex: number) => (
                          <li key={itemIndex} className="flex justify-between">
                            <span>{item.name || 'Item'} x{item.quantity || 1}</span>
                            <span>
                              {item.price && typeof item.price === 'number' ? 
                                `R$ ${(item.price * (item.quantity || 1)).toFixed(2)}` : 
                                item.price && typeof item.price === 'string' ?
                                `R$ ${(parseFloat(item.price) * (item.quantity || 1)).toFixed(2)}` :
                                'Preço não disponível'
                              }
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">Você ainda não fez nenhum pedido</p>
              <button
                onClick={() => router.push('/home')}
                className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
              >
                🍴 Fazer Primeiro Pedido
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}