'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../contexts/authContext';

import FormContainer from '../components/FormContainer';
import FormHeader from '../components/FormHeader';
import FormInput from '../components/FormInput';
import LoadingButton from '../components/LoadingButton';
import ErrorMessage from '../components/ErrorMessage';

export default function Login() {
  const [formData, setFormData] = useState({
    phone: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth(); // Usar o contexto

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!formData.phone.trim() || !formData.password.trim()) {
      setError('Todos os campos são obrigatórios');
      setIsLoading(false);
      return;
    }

    try {
      console.log('🚀 Iniciando login...');
      const response = await fetch('/api/v1/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: formData.phone.replace(/\D/g, ''),
          password: formData.password
        }),
      });

      const data = await response.json();
      

      
      if (data.user) {
        console.log('👤 Dados do usuário:', data.user);
        console.log('🏷️ Tipo do usuário:', data.user.type);
      }

      // CONDIÇÃO CORRIGIDA - removendo data.success
      if (response.ok && data.token && data.user) {
        console.log('🚀 Fazendo login no contexto...');
        
        // Fazer login usando o contexto
        login(data.token, data.user);
        
        console.log('🎯 Redirecionando para:', data.user.type === 'ADMIN' ? '/admin' : '/home');
        
        // Redirecionar
        if (data.user.type === 'ADMIN') {
          console.log('🏢 Redirecionando para Admin Dashboard...');
          router.push('/admin/home');
        } else {
          console.log('🏠 Redirecionando para Home...');
          router.push('/home');
        }
        
        console.log('✅ Redirecionamento executado');
        
        // Aguardar um pouco e verificar se ainda está na página
        setTimeout(() => {
          console.log('🔍 URL atual após redirecionamento:', window.location.pathname);
        }, 1000);
      } else {
        console.log('❌ Condições não atendidas para login');
        setError(data.message || 'Credenciais inválidas');
      }
    } catch (error) {
      console.log('🚨 Erro na requisição:', error);
      setError('Erro de conexão. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormContainer>
      <FormHeader title="Entrar" subtitle="Acesse sua conta UaiFood" />

      <form onSubmit={handleSubmit} className="space-y-4">
        <ErrorMessage message={error} />
        
        <FormInput
          label="Telefone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          placeholder="(31) 99999-9999"
          icon="📱"
        />

        <FormInput
          label="Senha"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Digite sua senha"
          icon="🔒"
        />

        <LoadingButton isLoading={isLoading} loadingText="Entrando...">
           Entrar
        </LoadingButton>
      </form>

      <div className="mt-6 text-center pt-4 border-t border-gray-200">
        <p className="text-gray-600 text-sm">
          Não tem conta?{' '}
          <Link href="/register" className="text-green-600 hover:text-green-700 font-semibold">
            Cadastre-se
          </Link>
        </p>
      </div>

      <div className="mt-4 text-center">
        <Link href="/" className="text-gray-500 hover:text-green-600 text-sm transition-colors">
          ← Voltar ao início
        </Link>
      </div>
    </FormContainer>
  );
}
