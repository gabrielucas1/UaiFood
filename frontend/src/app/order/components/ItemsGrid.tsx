import { ItemCard } from './ItemCard';

interface Item {
  id: string;
  description: string;
  unitPrice: string;
  category: {
    id: string;
    description: string;
  };
}

interface ItemsGridProps {
  items: Item[];
  onAddToCart: (item: Item) => void;
  getCategoryIcon: (categoryName: string) => string;
  selectedCategory: string | null;
  categories: Array<{ id: string; description: string }>;
}

export function ItemsGrid({ 
  items, 
  onAddToCart, 
  getCategoryIcon, 
  selectedCategory, 
  categories 
}: ItemsGridProps) {
  const categoryName = selectedCategory 
    ? categories.find(c => c.id === selectedCategory)?.description || 'Categoria'
    : 'Todos os Pratos';

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">{categoryName}</h2>
        <span className="text-sm text-gray-600">
          {items.length} {items.length === 1 ? 'item' : 'itens'} encontrados
        </span>
      </div>
      
      {items.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🍽️</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Nenhum prato encontrado
          </h3>
          <p className="text-gray-500">
            Tente ajustar os filtros ou buscar por outro termo
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onAddToCart={onAddToCart}
              getCategoryIcon={getCategoryIcon}
            />
          ))}
        </div>
      )}
    </div>
  );
}