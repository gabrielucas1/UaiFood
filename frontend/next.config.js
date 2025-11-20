
const nextConfig = {
  output: 'standalone',

  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: 'http://localhost:3991/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;