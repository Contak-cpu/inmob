import React from 'react';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'KONRAD Inmobiliaria - Generadores',
  description: 'Sistema de generación de contratos y recibos para KONRAD Inversiones + Desarrollos Inmobiliarios',
  keywords: 'inmobiliaria, contratos, recibos, Santa Rosa, La Pampa',
  authors: [{ name: 'KONRAD Inmobiliaria' }],
  robots: 'noindex, nofollow', // Por seguridad, no indexamos en producción
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0ea5e9',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
        <header className="w-full flex items-center gap-4 px-6 py-3 bg-slate-900/80 border-b border-slate-700/50">
          <img src="/logo.svg" alt="Logo KONRAD" className="h-10 w-10 rounded shadow" />
          <span className="text-2xl font-bold text-white tracking-tight">KONRAD Inmobiliaria</span>
        </header>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          {children}
        </div>
      </body>
    </html>
  );
} 