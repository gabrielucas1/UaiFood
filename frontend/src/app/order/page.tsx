'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/authContext';
import { useRouter } from 'next/navigation';
import { useCategoryIcon } from '../components/CategoryIcon';

// Hooks customizados
import { useOrderData } from './hooks/useOrderData';
import { useCart } from './hooks/useCart';
import { useOrderSubmission } from './hooks/useOrderSubmission';

// Componentes
import { CartDrawer } from './components/CartDrawer';
import CategoryFilter from './components/CategoryFilter';
import { ItemsGrid } from './components/ItemsGrid';
import { 
  LoadingSpinner, 
  ErrorMessage, 
  Header, 
  FloatingCartButton 
} from './components/UIComponents';

export default function OrderPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { getCategoryIcon } = useCategoryIcon();
  
  // Estados locais
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [cartOpen, setCartOpen] = useState(false);

  // Hooks customizados
  const { categories, loading, error: dataError, getFilteredItems } = useOrderData();
  const { 
    cart, 
    paymentMethod, 
    setPaymentMethod, 
    addToCart, 
    updateQuantity, 
    removeItem, 
    clearCart, 
    getTotalPrice, 
    getTotalItems 
  } = useCart();
  const { submitting, error: submitError, validationErrors, submitOrder, getFieldError } = useOrderSubmission();

  // Efeito para redirecionar usuários não autenticados
  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  // Dados filtrados
  const filteredItems = getFilteredItems(selectedCategory, searchTerm);

  // Handler para submeter o pedido
  const handleSubmitOrder = () => {
    submitOrder(cart, paymentMethod, () => {
      clearCart();
      setCartOpen(false);
    });
  };

  // Estados de loading e erro
  if (loading) return <LoadingSpinner message="Carregando cardápio..." />;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
      {/* Header */}
      <Header 
        cartItemCount={getTotalItems()} 
        onCartOpen={() => setCartOpen(true)} 
      />

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Mensagens de erro */}
        {(dataError || submitError) && (
          <ErrorMessage error={dataError || submitError || ''} />
        )}
        
        {/* Erros específicos de validação */}
        {validationErrors.length > 0 && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="font-semibold text-red-800 mb-2">Corrija os seguintes erros:</h3>
            <ul className="list-disc list-inside space-y-1">
              {validationErrors.map((error, index) => (
                <li key={index} className="text-red-700 text-sm">
                  <strong>{error.field}:</strong> {error.message}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Filtro de categorias */}
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          getCategoryIcon={getCategoryIcon}
        />

        {/* Grid de itens */}
        <ItemsGrid
          items={filteredItems}
          onAddToCart={addToCart}
          getCategoryIcon={getCategoryIcon}
          selectedCategory={selectedCategory}
          categories={categories}
        />
      </div>

      {/* Drawer do carrinho */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        onSubmitOrder={handleSubmitOrder}
        submitting={submitting}
        total={getTotalPrice()}
        error={submitError}
        validationErrors={validationErrors}
        getFieldError={getFieldError}
      />

      {/* Botão flutuante do carrinho (mobile) */}
      <FloatingCartButton
        cartItemCount={getTotalItems()}
        onCartOpen={() => setCartOpen(true)}
        isCartOpen={cartOpen}
      />
    </div>
  );
}