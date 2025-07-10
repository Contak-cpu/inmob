/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuraciones de seguridad
  headers: async () => {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
  // Configuración de imágenes optimizada
  images: {
    domains: [],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // Configuración de compilación optimizada
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Configuración de trailing slash
  trailingSlash: false,
  // Configuración de base path (si es necesario)
  basePath: '',
  // Configuración de asset prefix
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',
  // Configuración para Vercel
  output: 'standalone',
};

module.exports = nextConfig; 