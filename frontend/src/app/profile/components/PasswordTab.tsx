'use client'

import { useState } from 'react';
import FormInput from '../../components/FormInput';
import LoadingButton from '../../components/LoadingButton';
import ErrorMessage from '../../components/ErrorMessage';

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function PasswordTab() {
  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validação no frontend
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('As senhas não coincidem');
      setLoading(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('A nova senha deve ter pelo menos 6 caracteres');
      setLoading(false);
      return;
    }

    if (!/(?=.*[a-z])/.test(passwordData.newPassword) || !/(?=.*[0-9])/.test(passwordData.newPassword)) {
      setError('A nova senha deve conter pelo menos uma letra minúscula e um número');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Token não encontrado. Faça login novamente.');
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
      } else {
        if (data.details && Array.isArray(data.details)) {
          setError(data.details.map((detail: any) => detail.message).join(', '));
        } else {
          setError(data.message || 'Erro ao alterar senha');
        }
      }
    } catch (error) {
      setError('Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  };

  const toggleShowPassword = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 6) strength++;
    if (/(?=.*[a-z])/.test(password)) strength++;
    if (/(?=.*[A-Z])/.test(password)) strength++;
    if (/(?=.*[0-9])/.test(password)) strength++;
    if (/(?=.*[^A-Za-z0-9])/.test(password)) strength++;

    if (strength <= 1) return { level: 'Fraca', color: 'text-red-500', bg: 'bg-red-100' };
    if (strength <= 2) return { level: 'Regular', color: 'text-orange-500', bg: 'bg-orange-100' };
    if (strength <= 3) return { level: 'Boa', color: 'text-yellow-500', bg: 'bg-yellow-100' };
    return { level: 'Forte', color: 'text-green-500', bg: 'bg-green-100' };
  };

  const passwordStrength = getPasswordStrength(passwordData.newPassword);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">🔐 Alterar Senha</h3>
        
        <div className="space-y-4">
          <div className="relative">
            <FormInput
              name="currentPassword"
              label="Senha Atual"
              type={showPasswords.current ? "text" : "password"}
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
              required
              placeholder="Digite sua senha atual"
            />
            <button
              type="button"
              onClick={() => toggleShowPassword('current')}
              className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
            >
              {showPasswords.current ? '🙈' : '👁️'}
            </button>
          </div>

          <div className="relative">
            <FormInput
              name="newPassword"
              label="Nova Senha"
              type={showPasswords.new ? "text" : "password"}
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
              required
              placeholder="Digite sua nova senha"
            />
            <button
              type="button"
              onClick={() => toggleShowPassword('new')}
              className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
            >
              {showPasswords.new ? '🙈' : '👁️'}
            </button>
            
            {/* Indicador de força da senha */}
            {passwordData.newPassword && (
              <div className={`mt-2 p-2 rounded text-sm ${passwordStrength.bg}`}>
                <span className={passwordStrength.color}>
                  Força da senha: {passwordStrength.level}
                </span>
              </div>
            )}
          </div>

          <div className="relative">
            <FormInput
              name="confirmPassword"
              label="Confirmar Nova Senha"
              type={showPasswords.confirm ? "text" : "password"}
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
              required
              placeholder="Confirme sua nova senha"
            />
            <button
              type="button"
              onClick={() => toggleShowPassword('confirm')}
              className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
            >
              {showPasswords.confirm ? '🙈' : '👁️'}
            </button>
            
            {/* Validação de confirmação */}
            {passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword && (
              <div className="mt-2 p-2 bg-red-100 rounded text-sm text-red-600">
                As senhas não coincidem
              </div>
            )}
          </div>
        </div>

        {/* Requisitos da senha */}
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Requisitos da senha:</h4>
          <ul className="text-xs text-gray-600 space-y-1">
            <li className={passwordData.newPassword.length >= 6 ? 'text-green-600' : ''}>
              {passwordData.newPassword.length >= 6 ? '✅' : '❌'} Mínimo de 6 caracteres
            </li>
            <li className={/(?=.*[a-z])/.test(passwordData.newPassword) ? 'text-green-600' : ''}>
              {/(?=.*[a-z])/.test(passwordData.newPassword) ? '✅' : '❌'} Pelo menos uma letra minúscula
            </li>
            <li className={/(?=.*[0-9])/.test(passwordData.newPassword) ? 'text-green-600' : ''}>
              {/(?=.*[0-9])/.test(passwordData.newPassword) ? '✅' : '❌'} Pelo menos um número
            </li>
          </ul>
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

      <LoadingButton
        isLoading={loading}
        loadingText="Alterando senha..."
      >
        🔐 Alterar Senha
      </LoadingButton>

      <div className="text-center">
        <p className="text-sm text-gray-500">
          ⚠️ Após alterar a senha, você precisará fazer login novamente
        </p>
      </div>
    </form>
  );
}