/**
 * Componente reutilizável para ícones de categorias
 * Mapeia descrições de categorias para emojis apropriados
 */

interface CategoryIconProps {
  description: string;
  className?: string;
}

export const CategoryIcon = ({ description, className = "" }: CategoryIconProps) => {
  const getCategoryIcon = (description: string): string => {
    const desc = (description || '').toLowerCase();
    
    // Pratos Principais
    if (desc.includes('prato') || desc.includes('principal') || desc.includes('principais')) {
      return '🍖';
    }
    
    // Lanches e Hambúrgueres (incluindo x-tudo, x-frango, etc.)
    if (desc.includes('hamburg') || desc.includes('hambúrg') || desc.includes('burger') || 
        desc.includes('lanche') || desc.includes('x-') || desc.includes('smash')) {
      return '🍔';
    }
    
    // Pizzas
    if (desc.includes('pizza')) {
      return '🍕';
    }
    
    // Petiscos e Aperitivos (incluindo bacon, picanha, etc.)
    if (desc.includes('petisco') || desc.includes('aperitivo') || desc.includes('entrada') || 
        desc.includes('bacon') || desc.includes('picanha')) {
      return '🍤';
    }
    
    // Sobremesas
    if (desc.includes('sobremesa') || desc.includes('doce') || desc.includes('açaí') || desc.includes('pudim')) {
      return '🍰';
    }
    
    // Bebidas
    if (desc.includes('bebida') || desc.includes('suco') || desc.includes('refrigerante') || desc.includes('água') || desc.includes('cerveja')) {
      return '🥤';
    }
    
    // Comida Mineira específica
    if (desc.includes('mineira') || desc.includes('tropeiro') || desc.includes('tutu')) {
      return '🍛';
    }
    
    // Massas
    if (desc.includes('massa') || desc.includes('macarrão') || desc.includes('lasanha') || desc.includes('espaguete')) {
      return '🍝';
    }
    
    // Café e cafeteria
    if (desc.includes('café') || desc.includes('cappuccino') || desc.includes('expresso')) {
      return '☕';
    }
    
    // Saladas
    if (desc.includes('salada') || desc.includes('verde')) {
      return '🥗';
    }
    
    return '🍽️'; // ícone padrão
  };

  return (
    <span className={className}>
      {getCategoryIcon(description)}
    </span>
  );
};

// Hook personalizado para usar apenas a função
export const useCategoryIcon = () => {
  const getCategoryIcon = (description: string): string => {
    const desc = (description || '').toLowerCase();
    
    // Pratos Principais
    if (desc.includes('prato') || desc.includes('principal') || desc.includes('principais')) {
      return '🍖';
    }
    
    // Lanches e Hambúrgueres (incluindo x-tudo, x-frango, etc.)
    if (desc.includes('hamburg') || desc.includes('hambúrg') || desc.includes('burger') || 
        desc.includes('lanche') || desc.includes('x-') || desc.includes('smash')) {
      return '🍔';
    }
    
    // Pizzas
    if (desc.includes('pizza')) {
      return '🍕';
    }
    
    // Petiscos e Aperitivos (incluindo bacon, picanha, etc.)
    if (desc.includes('petisco') || desc.includes('aperitivo') || desc.includes('entrada') || 
        desc.includes('bacon') || desc.includes('picanha')) {
      return '🍤';
    }
    
    // Sobremesas
    if (desc.includes('sobremesa') || desc.includes('doce') || desc.includes('açaí') || desc.includes('pudim')) {
      return '🍰';
    }
    
    // Bebidas
    if (desc.includes('bebida') || desc.includes('suco') || desc.includes('refrigerante') || desc.includes('água') || desc.includes('cerveja')) {
      return '🥤';
    }
    
    // Comida Mineira específica
    if (desc.includes('mineira') || desc.includes('tropeiro') || desc.includes('tutu')) {
      return '🍛';
    }
    
    // Massas
    if (desc.includes('massa') || desc.includes('macarrão') || desc.includes('lasanha') || desc.includes('espaguete')) {
      return '🍝';
    }
    
    // Café e cafeteria
    if (desc.includes('café') || desc.includes('cappuccino') || desc.includes('expresso')) {
      return '☕';
    }
    
    // Saladas
    if (desc.includes('salada') || desc.includes('verde')) {
      return '🥗';
    }
    
    return '🍽️'; // ícone padrão
  };

  return { getCategoryIcon };
};

export default CategoryIcon;