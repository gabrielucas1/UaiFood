'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import FormContainer from '../components/FormContainer';
import FormHeader from '../components/FormHeader';
import FormInput from '../components/FormInput';
import LoadingButton from '../components/LoadingButton';
import ErrorMessage from '../components/ErrorMessage';

interface ValidationError {
  field: string;
  message: string;
}

export default function Register() {
  const [formData, setFormData] = useState({
    nome: '',
    phone: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpar erros quando o usuário começar a digitar
    if (error) setError('');
    if (validationErrors.length > 0) {
      setValidationErrors(prev => prev.filter(err => err.field !== name));
    }
  };

  // Função para obter erro específico de um campo
  const getFieldError = (fieldName: string) => {
    const error = validationErrors.find(err => err.field === fieldName);
    return error ? error.message : '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setValidationErrors([]);

    try {
      const response = await fetch('/api/v1/users/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: formData.nome,
          phone: formData.phone.replace(/\D/g, ''), // Remove formatação
          password: formData.password,
          type: 'CLIENT'
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert('✅ Cadastro realizado com sucesso! Faça login para continuar.');
        router.push('/login');
      } else {
        // 🔧 CAPTURAR ERROS ESPECÍFICOS DO BACKEND
        if (data.details && Array.isArray(data.details)) {
          setValidationErrors(data.details);
          setError('Por favor, corrija os erros abaixo:');
        } else if (data.message) {
          setError(data.message);
        } else if (data.error) {
          setError(data.error);
        } else {
          setError('Erro ao criar conta');
        }
      }
    } catch (error) {
      setError('Erro de conexão. Tente novamente.');
      console.error('Erro no cadastro:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormContainer>
      <FormHeader 
        title="Criar Conta"
        subtitle="Junte-se ao UaiFood!"
      />

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Mensagem de erro geral */}
        {error && <ErrorMessage message={error} />}

        {/* Campo Nome */}
        <div>
          <FormInput
            label="Nome"
            name="nome"
            type="text"
            value={formData.nome}
            onChange={handleChange}
            placeholder="Seu nome completo"
            icon="👤"
            className={getFieldError('nome') ? 'border-red-500 focus:border-red-500' : ''}
          />
          {getFieldError('nome') && (
            <p className="mt-1 text-sm text-red-600">
              {getFieldError('nome')}
            </p>
          )}
        </div>

        {/* Campo Telefone */}
        <div>
          <FormInput
            label="Telefone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="(31) 99999-9999"
            icon="📱"
            className={getFieldError('phone') ? 'border-red-500 focus:border-red-500' : ''}
          />
          {getFieldError('phone') && (
            <p className="mt-1 text-sm text-red-600">
              {getFieldError('phone')}
            </p>
          )}
        </div>

        {/* Campo Senha */}
        <div>
          <FormInput
            label="Senha"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Mínimo 6 caracteres"
            icon="🔒"
            className={getFieldError('password') ? 'border-red-500 focus:border-red-500' : ''}
          />
          {getFieldError('password') && (
            <p className="mt-1 text-sm text-red-600">
              {getFieldError('password')}
            </p>
          )}
        </div>

        <LoadingButton
          isLoading={isLoading}
          loadingText="Criando conta..."
        >
          🚀 Criar Conta
        </LoadingButton>
      </form>

      {/* Links de navegação */}
      <div className="mt-6 text-center pt-4 border-t border-gray-200">
        <p className="text-gray-600 text-sm">
          Já tem conta?{' '}
          <Link href="/login" className="text-green-600 hover:text-green-700 font-semibold">
            Faça login
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