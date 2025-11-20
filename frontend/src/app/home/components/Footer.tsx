import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-center md:text-left">
          {/* Logo e descrição */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-center md:justify-start space-x-3 mb-4">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">🍴</span>
              </div>
              <span className="font-bold text-white text-lg">UaiFood</span>
            </div>
            <p className="text-sm text-gray-300 max-w-md mx-auto md:mx-0 leading-relaxed">
              A melhor experiência gastronômica de Minas Gerais, 
              entregue diretamente na sua casa com sabor e qualidade.
            </p>
          </div>
          
          {/* Informações de contato */}
          <div>
            <h4 className="font-bold text-white text-base mb-4">Contato</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center justify-center md:justify-start space-x-2">
                <span className="text-green-400">📱</span>
                <span>(34) 99999-9999</span>
              </li>
              <li className="flex items-center justify-center md:justify-start space-x-2">
                <span className="text-green-400">📧</span>
                <span>contato@uaifood.com</span>
              </li>
              <li className="flex items-center justify-center md:justify-start space-x-2">
                <span className="text-green-400">📍</span>
                <span>Uberaba, MG</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-gray-600 mt-6 pt-6 text-center">
          <p className="text-gray-400 text-xs">
            &copy; 2025 UaiFood. Todos os direitos reservados. | Feito com ❤️ em Minas Gerais
          </p>
        </div>
      </div>
    </footer>
  );
}

export { Footer };