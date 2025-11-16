'use client'

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Register() {
  const [formData, setFormData] = useState({
    nome: '',
    phone: '',
    password: ''
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpar erro quando usuário começar a digitar
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    // Validação
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    } else if (formData.nome.length < 2) {
      newErrors.nome = 'Nome deve ter pelo menos 2 caracteres';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefone é obrigatório';
    } else {
      const phoneNumbers = formData.phone.replace(/\D/g, '');
      if (phoneNumbers.length < 10 || phoneNumbers.length > 11) {
        newErrors.phone = 'Telefone deve ter 10 ou 11 dígitos';
      }
    }

    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      // Limpar telefone (remover caracteres especiais)
      const cleanPhone = formData.phone.replace(/\D/g, '');
      
      const response = await fetch('http://localhost:3991/api/users/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: formData.nome,
          phone: cleanPhone,
          password: formData.password,
          type: 'CLIENT'
        }),
      });

      if (response.ok) {
        alert('✅ Conta criada com sucesso!');
        router.push('/login');
      } else {
        const errorData = await response.json();
        if (response.status === 409) {
          setErrors({ phone: 'Este telefone já está cadastrado' });
        } else {
          setErrors({ general: errorData.message || 'Erro ao criar conta' });
        }
      }
    } catch (error) {
      setErrors({ general: 'Erro de conexão. Tente novamente.' });
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '16px 20px 16px 50px',
    borderRadius: '50px',
    border: '1px solid #d1d5db',
    fontSize: '16px',
    outline: 'none',
    transition: 'all 0.3s ease'
  };

  const inputErrorStyle = {
    ...inputStyle,
    border: '1px solid #ef4444'
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#ef4444', // red-500
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '32px',
        borderRadius: '16px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        width: '100%',
        maxWidth: '400px'
      }}>
        {/* Título */}
        <h1 style={{
          fontSize: '32px',
          fontWeight: 'bold',
          color: '#374151',
          marginBottom: '32px',
          textAlign: 'center',
          margin: '0 0 32px 0'
        }}>
          Cadastrar
        </h1>

        <form onSubmit={handleSubmit}>
          {/* Nome */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Nome
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '16px',
                zIndex: 1
              }}>
                👤
              </span>
              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                placeholder="João Silva"
                style={errors.nome ? inputErrorStyle : inputStyle}
                disabled={isLoading}
              />
            </div>
            {errors.nome && (
              <p style={{
                color: '#ef4444',
                fontSize: '14px',
                marginTop: '4px',
                margin: '4px 0 0 0'
              }}>
                {errors.nome}
              </p>
            )}
          </div>

          {/* Telefone */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Telefone
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '16px',
                zIndex: 1
              }}>
                📱
              </span>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="(31) 99999-9999"
                style={errors.phone ? inputErrorStyle : inputStyle}
                disabled={isLoading}
              />
            </div>
            {errors.phone && (
              <p style={{
                color: '#ef4444',
                fontSize: '14px',
                marginTop: '4px',
                margin: '4px 0 0 0'
              }}>
                {errors.phone}
              </p>
            )}
          </div>

          {/* Senha */}
          <div style={{ marginBottom: '32px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Senha
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '16px',
                zIndex: 1
              }}>
                🔒
              </span>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Mínimo 6 caracteres"
                style={errors.password ? inputErrorStyle : inputStyle}
                disabled={isLoading}
              />
            </div>
            {errors.password && (
              <p style={{
                color: '#ef4444',
                fontSize: '14px',
                marginTop: '4px',
                margin: '4px 0 0 0'
              }}>
                {errors.password}
              </p>
            )}
          </div>

          {/* Erro geral */}
          {errors.general && (
            <div style={{
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#dc2626',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '16px',
              fontSize: '14px'
            }}>
              {errors.general}
            </div>
          )}

          {/* Botão Cadastrar */}
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              background: isLoading ? '#9ca3af' : 'linear-gradient(135deg, #ef4444, #f97316)',
              color: 'white',
              fontWeight: 'bold',
              padding: '16px',
              borderRadius: '50px',
              border: 'none',
              fontSize: '18px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            {isLoading ? (
              <>
                <div style={{
                  width: '20px',
                  height: '20px',
                  border: '2px solid #ffffff',
                  borderTop: '2px solid transparent',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></div>
                Criando conta...
              </>
            ) : (
              '🚀 Cadastrar'
            )}
          </button>

          {/* Divisor */}
          <div style={{
            margin: '24px 0',
            textAlign: 'center',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute',
              top: '50%',
              left: 0,
              right: 0,
              height: '1px',
              backgroundColor: '#e5e7eb'
            }}></div>
            <span style={{
              backgroundColor: 'white',
              padding: '0 16px',
              color: '#6b7280',
              fontSize: '14px'
            }}>
              ou
            </span>
          </div>

          {/* Link para login */}
          <p style={{
            textAlign: 'center',
            color: '#6b7280',
            fontSize: '14px',
            margin: 0
          }}>
            Já tem uma conta?{' '}
            <Link 
              href="/login" 
              style={{
                color: '#2563eb',
                textDecoration: 'underline',
                fontWeight: '500'
              }}
            >
              Entre agora!
            </Link>
          </p>
        </form>

        {/* CSS para animação */}
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
}