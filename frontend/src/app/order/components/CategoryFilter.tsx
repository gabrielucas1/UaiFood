'use client';

interface Category {
  id: string;
  description: string;
}

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
  getCategoryIcon: (categoryName: string) => string;
}

export default function CategoryFilter({ 
  categories, 
  selectedCategory, 
  onSelectCategory, 
  getCategoryIcon 
}: CategoryFilterProps) {
  console.log('🏷️ CategoryFilter renderizado:', {
    categoriesCount: categories.length,
    selectedCategory,
    categories: categories.map(c => ({ id: c.id, name: c.description }))
  });

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">🍽️ Filtrar por Categoria</h3>
      
      <div className="flex flex-wrap gap-3">
        {/* Todas as categorias */}
        <button
          onClick={() => onSelectCategory(null)}
          className={`px-4 py-2 rounded-full font-medium transition-all ${
            selectedCategory === null
              ? 'bg-orange-500 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Todas
        </button>
        
        {/* Categorias específicas */}
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className={`px-4 py-2 rounded-full font-medium transition-all flex items-center space-x-2 ${
              selectedCategory === category.id
                ? 'bg-orange-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span>{getCategoryIcon(category.description)}</span>
            <span>{category.description}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export { CategoryFilter };