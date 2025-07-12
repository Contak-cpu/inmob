'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, History } from 'lucide-react';
import HistoryPanel from '@/components/HistoryPanel';
import PictoNSignature from '@/components/PictoNSignature';
import { HistoryRoute } from '@/components/ProtectedRoute';

export default function HistoryPage() {
  return (
    <HistoryRoute>
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
              <History className="h-8 w-8 text-warning-400" />
              <div>
                <h1 className="text-xl font-bold text-white">Historial y Estadísticas</h1>
                <p className="text-sm text-neutral-400">Gestiona tus documentos generados</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-neutral-400">Konrad Inversiones + Desarrollos Inmobiliarios</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto py-6">
        <HistoryPanel />
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
    </HistoryRoute>
  );
} 