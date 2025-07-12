'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Lock } from 'lucide-react';
import LoginForm from '@/components/LoginForm';
import PictoNSignature from '@/components/PictoNSignature';

export default function LoginPage() {
  const handleLoginSuccess = (user) => {
    // Redirigir a la página principal después del login exitoso
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900">
      {/* Header */}
      <header className="glass-effect border-b border-neutral-700/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link
                href="/"
                className="p-2 hover:bg-neutral-700/50 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-neutral-400" />
              </Link>
              <Lock className="h-8 w-8 text-primary-400" />
              <div>
                <h1 className="text-xl font-bold text-white">Iniciar Sesión</h1>
                <p className="text-sm text-neutral-400">Accede a tu cuenta</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-neutral-400">Konrad Inversiones + Desarrollos Inmobiliarios</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto py-12">
        <div className="max-w-md mx-auto">
          <LoginForm onLoginSuccess={handleLoginSuccess} />
        </div>
      </main>

      {/* Footer */}
      <footer className="glass-effect border-t border-neutral-700/50 mt-8">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
            <p className="text-xs sm:text-sm text-neutral-400">
              © 2013 Konrad Inversiones + Desarrollos Inmobiliarios. Todos los derechos reservados.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
              <p className="text-[10px] sm:text-xs text-neutral-500">
                Sistema v1.0.0
              </p>
              <PictoNSignature />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 