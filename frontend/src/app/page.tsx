// frontend/src/app/page.tsx

'use client';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    // Container Principal: Tema mineiro com cores verdes
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex flex-col font-sans">

      {/* 1. Barra de Navegação Superior */}
      <header className="w-full bg-white shadow-lg p-4 flex justify-between items-center z-10">
        <div className="flex items-center space-x-3">
          <Image 
            src="/delivery-logo.svg" 
            alt="UaiFood Delivery" 
            width={40} 
            height={40}
            className="w-10 h-10"
          />
          <h1 className="text-2xl font-bold text-primary-700">UaiFood</h1>
        </div>
        <nav className="space-x-4">
          <Link href="/login" className="px-4 py-2 text-primary-700 hover:text-primary-900 font-medium transition duration-150">
            Login
          </Link>
          <Link href="/register" className="btn-primary">
            Cadastrar
          </Link>
        </nav>
      </header>

      {/* 2. Conteúdo Principal (Hero Section) */}
      <main className="flex flex-1 items-center justify-center p-8">
        <div className="max-w-6xl w-full flex flex-col md:flex-row items-center justify-center space-y-8 md:space-y-0 md:space-x-12">
          
          <div className="w-full md:w-1/2 flex justify-center order-2 md:order-1 fade-in">
            <div className="bg-gradient-to-br from-primary-100 to-secondary-100 p-12 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105">
              <Image 
                src="/delivery-logo.svg" 
                alt="UaiFood - Delivery de Comida Mineira" 
                width={300} 
                height={225}
                className="w-full max-w-sm mx-auto"
                priority
              />
            </div>
          </div>
          
          {/* 📝 Bloco do  e Ação (Lado Direito) */}
          <div className="w-full md:w-1/2 text-center md:text-left order-1 md:order-2 fade-in">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-primary-600 mb-2">
              Seja Bem-vindo ao
            </h2>
            <h1 className="text-6xl md:text-7xl font-extrabold text-primary-800 leading-tight mb-4">
              UaiFood
            </h1>
            <p className="text-xl italic text-secondary-600 mt-4 mb-6 font-medium">
              "Sabor mineiro na palma da sua mão, uai!"
            </p>
            
            {/* Descrição Detalhada */}
            <p className="text-gray-700 max-w-lg mb-8 text-lg leading-relaxed">
              O UaiFood democratiza o acesso à culinária mineira tradicional. Navegue pelo nosso cardápio exclusivo, faça seu pedido em segundos e receba o verdadeiro sabor de Minas na sua casa!
            </p>



          </div>

        </div>
      </main>
    </div>
  );
}