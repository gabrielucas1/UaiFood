// frontend/src/app/page.tsx

'use client';
import Link from 'next/link';

export default function Home() {
  return (
    // Container Principal: Fundo levemente roxo/lavanda
    <div className="min-h-screen bg-indigo-50 flex flex-col font-sans">

      {/* 1. Barra de Navegação Superior (Imita o Readowl) */}
      <header className="w-full bg-white shadow-md p-4 flex justify-between items-center z-10">
        <h1 className="text-2xl font-bold text-indigo-700">UaiFood</h1>
        <nav className="space-x-4">
          <Link href="/login" className="px-4 py-2 text-indigo-700 hover:text-indigo-900 font-medium transition duration-150">
            Login
          </Link>
          <Link href="/register" className="px-4 py-2 bg-indigo-700 text-white rounded-lg shadow-md hover:bg-indigo-600 transition duration-150">
            Cadastrar
          </Link>
        </nav>
      </header>

      {/* 2. Conteúdo Principal (Hero Section) */}
      <main className="flex flex-1 items-center justify-center p-8">
        <div className="max-w-4xl w-full flex flex-col md:flex-row items-center justify-center space-y-8 md:space-y-0 md:space-x-12">
          
          {/* 🍽️ Bloco da Imagem/Logo (Lado Esquerdo) */}
          <div className="w-full md:w-1/3 flex justify-center order-2 md:order-1">
            <div className="bg-indigo-200 p-8 rounded-full shadow-2xl shadow-indigo-300/50">
              <span className="text-8xl">🍽️</span>
            </div>
          </div>
          
          {/* 📝 Bloco do Texto e Ação (Lado Direito) */}
          <div className="w-full md:w-2/3 text-center md:text-left order-1 md:order-2">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-500 mb-2">
              Seja Bem-vindo ao
            </h2>
            <h1 className="text-6xl md:text-7xl font-extrabold text-indigo-800 leading-tight">
              UaiFood
            </h1>
            <p className="text-xl italic text-indigo-500 mt-4 mb-6">
              "Sabor mineiro na palma da sua mão."
            </p>
            
            {/* Descrição Detalhada - Similar ao Readowl */}
            <p className="text-gray-700 max-w-md mb-8">
              O UaiFood democratiza o acesso à culinária mineira. Navegue pelo nosso cardápio exclusivo, faça seu pedido em segundos e receba na sua casa. Junte-se a nós para valorizar o verdadeiro sabor de Minas!
            </p>

            {/* Botões de Ação (Dois principais) */}
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              {/* Botão Principal: Ver Cardápio */}
              <Link href="/menu" className="px-6 py-3 bg-indigo-700 text-white font-bold rounded-full shadow-lg hover:bg-indigo-600 transition duration-200 transform hover:scale-105">
                Iniciar Pedido
              </Link>

              {/* Botão Secundário: Criar Conta */}
              <Link href="/register" className="px-6 py-3 bg-transparent border-2 border-indigo-700 text-indigo-700 font-bold rounded-full hover:bg-indigo-700 hover:text-white transition duration-200 transform hover:scale-105">
                Criar Conta
              </Link>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}