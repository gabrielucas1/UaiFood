import SearchBar from './SearchBar';
import Link from 'next/link';
import { useAuth } from '../../contexts/authContext';

interface HeroSectionProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

export default function HeroSection({ searchTerm, setSearchTerm }: HeroSectionProps) {
  const { isLoggedIn, user } = useAuth();

  return (
    <section className="text-center mb-12 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl p-8">
      <div className="max-w-3xl mx-auto">
        <p className="text-xl text-gray-600 mb-6">
          Os melhores sabores de Minas Gerais na sua mesa
        </p>

        {isLoggedIn && user?.type === 'CLIENT' ? (
          // Para usuários logados - CTA direto
          <div className="space-y-4">
            <Link
              href="/order"
              className="inline-block bg-orange-500 hover:bg-orange-600 text-white text-xl font-semibold px-8 py-4 rounded-xl transition-colors shadow-lg"
            >
              🍕 Fazer Pedido Agora
            </Link>
          </div>
        ) : (
          // Para visitantes - mostrar busca e incentivo ao cadastro
          <div className="space-y-6">
            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            
            {!isLoggedIn && (
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  🎉 Faça seu cadastro e ganhe desconto!
                </h3>
                <p className="text-gray-600 mb-4">
                  Cadastre-se agora e ganhe 10% de desconto no seu primeiro pedido
                </p>
                <div className="space-x-4">
                  <Link
                    href="/register"
                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                  >
                    Cadastrar Grátis
                  </Link>
                  <Link
                    href="/login"
                    className="text-green-600 hover:text-green-700 font-medium"
                  >
                    Já tenho conta
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export { HeroSection };