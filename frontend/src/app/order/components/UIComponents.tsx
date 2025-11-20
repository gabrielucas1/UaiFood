interface LoadingSpinnerProps {
  message?: string;
}

export function LoadingSpinner({ message = "Carregando..." }: LoadingSpinnerProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
        <p className="text-lg text-gray-600">{message}</p>
      </div>
    </div>
  );
}

interface ErrorMessageProps {
  error: string;
  onClose?: () => void;
}

export function ErrorMessage({ error, onClose }: ErrorMessageProps) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-red-500">⚠️</span>
          <span className="text-red-700">{error}</span>
        </div>
        {onClose && (
          <button 
            onClick={onClose}
            className="text-red-500 hover:text-red-700"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}

interface HeaderProps {
  cartItemCount: number;
  onCartOpen: () => void;
}

export function Header({ cartItemCount, onCartOpen }: HeaderProps) {
  return (
    <div className="bg-white shadow-lg sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <a 
              href="/home"
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              ← Voltar
            </a>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">🛒 Fazer Pedido</h1>
              <p className="text-gray-600">Escolha seus pratos favoritos</p>
            </div>
          </div>
          
          {cartItemCount > 0 && (
            <button
              onClick={onCartOpen}
              className="relative bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg"
            >
              <span className="flex items-center space-x-2">
                <span>🛒</span>
                <span>Carrinho</span>
              </span>
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
                {cartItemCount}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

interface FloatingCartButtonProps {
  cartItemCount: number;
  onCartOpen: () => void;
  isCartOpen: boolean;
}

export function FloatingCartButton({ cartItemCount, onCartOpen, isCartOpen }: FloatingCartButtonProps) {
  if (cartItemCount === 0 || isCartOpen) return null;

  return (
    <button
      onClick={onCartOpen}
      className="fixed bottom-6 right-6 bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-full shadow-2xl transition-all z-40 md:hidden"
    >
      <span className="flex items-center space-x-2">
        <span className="text-xl">🛒</span>
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
          {cartItemCount}
        </span>
      </span>
    </button>
  );
}