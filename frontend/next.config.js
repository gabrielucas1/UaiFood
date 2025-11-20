// frontend/next.config.ts

const nextConfig = {
  output: 'standalone',

  // CORRIGIDO: Remoção do v1 duplicado
  async rewrites() {
    return [
      {
        // Rota de onde o frontend fará a chamada
        source: '/api/v1/:path*',
        // Onde a API real está rodando (sem v1 duplicado)
        destination: 'http://localhost:3991/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;