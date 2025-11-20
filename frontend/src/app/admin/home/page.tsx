'use client';

export default function AdminHomePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">🍽️ UaiFood Admin</h1>
        <p className="text-gray-600">Gerencie seu restaurante</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Menu Principal</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a href="/admin/items" className="p-6 border border-gray-200 rounded-lg hover:border-orange-500 hover:shadow-md transition-all text-center">
            <div className="text-4xl mb-3">🍕</div>
            <p className="font-medium text-gray-900 mb-1">Itens</p>
            <p className="text-sm text-gray-500">Gerencie o cardápio</p>
          </a>
          
          <a href="/admin/orders" className="p-6 border border-gray-200 rounded-lg hover:border-orange-500 hover:shadow-md transition-all text-center">
            <div className="text-4xl mb-3">📋</div>
            <p className="font-medium text-gray-900 mb-1">Pedidos</p>
            <p className="text-sm text-gray-500">Visualize pedidos</p>
          </a>
          
          <a href="/admin/users" className="p-6 border border-gray-200 rounded-lg hover:border-orange-500 hover:shadow-md transition-all text-center">
            <div className="text-4xl mb-3">👥</div>
            <p className="font-medium text-gray-900 mb-1">Usuários</p>
            <p className="text-sm text-gray-500">Visualize clientes</p>
          </a>
        </div>
      </div>
    </div>
  );
}