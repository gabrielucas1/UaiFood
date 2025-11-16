// frontend/next.config.ts

const nextConfig = {
  // ... outras configurações ...

  // ADICIONE ESTE BLOCO:
  async rewrites() {
    return [
      {
        // Rota de onde o frontend fará a chamada
        source: '/api/v1/:path*',
        // Onde a API real está rodando
        destination: 'http://localhost:3991/api/:path*', 
      },
    ];
  },
};

export default nextConfig;