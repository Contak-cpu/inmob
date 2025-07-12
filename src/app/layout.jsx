import React from 'react';
import { Inter } from 'next/font/google';
import './globals.css';
import ClientInitializer from '@/components/ClientInitializer';
import { ToastContainer } from '@/components/Toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'KONRAD Inmobiliaria - Generadores',
  description: 'Sistema de generación de contratos y recibos para KONRAD Inversiones + Desarrollos Inmobiliarios',
  keywords: 'inmobiliaria, contratos, recibos, Santa Rosa, La Pampa',
  authors: [{ name: 'KONRAD Inmobiliaria' }],
  robots: 'noindex, nofollow', // Por seguridad, no indexamos en producción
  manifest: '/manifest.json',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0ea5e9',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className="h-full">
      <head>
        <meta name="description" content="Sistema de generación de contratos y recibos para KONRAD Inversiones + Desarrollos Inmobiliarios" />
        <meta name="author" content="KONRAD Inmobiliaria" />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="icon" type="image/svg+xml" href="/logo.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.className} h-full`}>
        <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900">
          <ClientInitializer />
          {children}
          <ToastContainer />
        </div>
      </body>
    </html>
  );
} 