'use client';
import { Fragment } from 'react';

interface CartItem {
  id: string;
  description: string;
  unitPrice: string;
  quantity: number;
  price: number;
  category: {
    id: string;
    description: string;
  };
}

interface ValidationError {
  field: string;
  message: string;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
  onSubmitOrder: () => void;
  submitting: boolean;
  total: number;
  error?: string | null;
  validationErrors?: ValidationError[];
  getFieldError?: (fieldName: string) => string;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  paymentMethod,
  setPaymentMethod,
  onSubmitOrder,
  submitting,
  total,
  error,
  validationErrors = [],
  getFieldError
}: CartDrawerProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform translate-x-0 transition-transform">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-bold text-gray-900">🛒 Seu Carrinho</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              ❌
            </button>
          </div>

          {/* Mensagens de erro */}
          {error && (
            <div className="mx-6 mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm font-medium">{error}</p>
            </div>
          )}
          
          {/* Erros específicos de validação */}
          {validationErrors.length > 0 && (
            <div className="mx-6 mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-semibold text-red-800 mb-2">Corrija os seguintes erros:</h4>
              <ul className="space-y-1">
                {validationErrors.map((error, index) => (
                  <li key={index} className="text-red-700 text-sm flex items-start">
                    <span className="text-red-500 mr-2">•</span>
                    <span><strong>{error.field}:</strong> {error.message}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-8">
                <div className="text-6xl mb-4">🛒</div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Carrinho Vazio</h3>
                <p className="text-gray-500 text-center">
                  Adicione alguns itens deliciosos ao seu carrinho para continuar
                </p>
              </div>
            ) : (
              <div className="p-6 space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{item.description}</h4>
                        <p className="text-sm text-gray-600">{item.category?.description}</p>
                        <p className="text-sm font-medium text-orange-600">
                          R$ {item.price.toFixed(2).replace('.', ',')} cada
                        </p>
                      </div>
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        🗑️
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 bg-white rounded-lg px-3 py-2">
                        <button
                          onClick={() => onUpdateQuantity(item.id, Math.max(0, item.quantity - 1))}
                          className="text-red-600 hover:text-red-800 font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-50"
                        >
                          −
                        </button>
                        <span className="font-semibold text-gray-900 min-w-[2rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="text-green-600 hover:text-green-800 font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-green-50"
                        >
                          +
                        </button>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-bold text-gray-900">
                          R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer - Payment and Submit */}
          {cart.length > 0 && (
            <div className="border-t p-6 bg-gray-50">
              <div className="space-y-4">
                {/* Payment Method */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    💳 Forma de Pagamento
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 ${
                      getFieldError && getFieldError('paymentMethod') 
                        ? 'border-red-500 focus:border-red-500' 
                        : 'border-gray-300 focus:border-orange-500'
                    }`}
                  >
                    <option value="">Selecione o método de pagamento</option>
                    <option value="PIX">💰 PIX</option>
                    <option value="CREDIT">💳 Cartão de Crédito</option>
                    <option value="DEBIT">💳 Cartão de Débito</option>
                    <option value="CASH">💵 Dinheiro</option>
                  </select>
                  {getFieldError && getFieldError('paymentMethod') && (
                    <p className="mt-1 text-sm text-red-600">
                      {getFieldError('paymentMethod')}
                    </p>
                  )}
                </div>

                {/* Total */}
                <div className="flex justify-between items-center py-2 border-t">
                  <span className="text-lg font-semibold text-gray-700">Total:</span>
                  <span className="text-2xl font-bold text-orange-600">
                    R$ {total.toFixed(2).replace('.', ',')}
                  </span>
                </div>

                {/* Submit Button */}
                <button
                  onClick={onSubmitOrder}
                  disabled={submitting}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  {submitting ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Processando...</span>
                    </div>
                  ) : (
                    <>🚀 Finalizar Pedido</>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export { CartDrawer };