'use client';

interface Category {
  id: string;
  description: string;
}

interface Item {
  id: string;
  description: string;
  unitPrice: string;
  category: Category;
}

interface ItemCardProps {
  item: Item;
  onAddToCart: (item: Item) => void;
  getCategoryIcon: (categoryName: string) => string;
}

export default function ItemCard({ item, onAddToCart, getCategoryIcon }: ItemCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group">
      {/* Image Placeholder with Category Icon */}
      <div className="h-40 bg-gradient-to-br from-orange-100 via-yellow-100 to-orange-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
        <div className="absolute inset-0 flex items-center justify-center text-5xl group-hover:scale-110 transition-transform duration-300">
          {getCategoryIcon(item.category?.description || '')}
        </div>
        
        {/* Rating Badge */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-semibold text-gray-800">
          ⭐ {(Math.random() * (5 - 4) + 4).toFixed(1)}
        </div>
      </div>
      
      {/* Content */}
      <div className="p-5">
        {/* Header */}
        <div className="mb-3">
          <h3 className="font-bold text-gray-900 text-lg mb-1 line-clamp-1">
            {item.description}
          </h3>
        </div>
        
        {/* Category Badge */}
        <div className="mb-4">
          <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
            {item.category?.description || 'Categoria não informada'}
          </span>
        </div>
        
        {/* Footer */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-orange-600">
              R$ {parseFloat(item.unitPrice).toFixed(2).replace('.', ',')}
            </span>
            <p className="text-xs text-gray-500">por unidade</p>
          </div>
          
          <button
            onClick={() => onAddToCart(item)}
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
          >
            <span className="flex items-center space-x-2">
              <span>🛒</span>
              <span>Adicionar</span>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export { ItemCard };