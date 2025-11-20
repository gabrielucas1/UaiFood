'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '../../contexts/authContext';
import { useRouter } from 'next/navigation';

export default function Header() {
  const { user, isLoggedIn, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 hover:opacity-90 transition-opacity">
            <Image 
              src="/delivery-logo.svg" 
              alt="UaiFood" 
              width={50} 
              height={50}
              className="w-10 h-10"
            />
            <div>
              <h1 className="text-xl font-bold text-green-600">UaiFood</h1>
              <p className="text-xs text-gray-600">Sabor de Minas</p>
            </div>
          </Link>

          {/* Menu do usuário */}
          <div className="flex items-center">
            {isLoggedIn ? (
              // Mostrar quando logado
              <div className="flex items-center space-x-4">
                {/* Botão Fazer Pedido (apenas para clientes) */}
                {user?.type === 'CLIENT' && (
                  <Link
                    href="/order"
                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    🛒 Fazer Pedido
                  </Link>
                )}
                
                {/* Informações do usuário */}
                <div className="flex items-center space-x-3">
                  {/* Avatar com primeira letra do nome */}
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-md">
                    <span className="text-white font-bold">
                      {user?.nome.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  
                  {/* Informações do usuário */}
                  <div className="hidden sm:block">
                    <p className="text-sm font-semibold text-gray-800">
                      Olá, {user?.nome.split(' ')[0]}!
                    </p>
                    <p className="text-xs text-gray-600">
                      {user?.type === 'ADMIN' ? 'Administrador' : 'Cliente'}
                    </p>
                  </div>
                </div>
                
                {/* Botão de logout */}
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Sair
                </button>
              </div>
            ) : (
              // Mostrar quando não logado
              <div className="flex items-center space-x-3">
                <Link 
                  href="/login"
                  className="text-green-600 hover:text-green-700 font-medium px-3 py-2 rounded-lg hover:bg-green-50 transition-all"
                >
                  Entrar
                </Link>
                <Link 
                  href="/register"
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Cadastrar
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export { Header };