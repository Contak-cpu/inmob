'use client';

import React from 'react';
import Link from 'next/link';
import { Home, Building, Wrench, Settings, FileText } from 'lucide-react';
import { RECEIPT_TYPES } from '@/lib/config';
import PictoNSignature from '@/components/PictoNSignature';
import { ReceiptRoute } from '@/components/ProtectedRoute';

const receiptTypeIcons = {
  alquiler: { icon: <Home className="h-8 w-8" />, color: 'primary', bg: 'bg-primary-500/20', border: 'border-primary-500/30', text: 'text-primary-400' },
  expensas: { icon: <Building className="h-8 w-8" />, color: 'secondary', bg: 'bg-secondary-500/20', border: 'border-secondary-500/30', text: 'text-secondary-400' },
  reparacion: { icon: <Wrench className="h-8 w-8" />, color: 'danger', bg: 'bg-red-500/20', border: 'border-red-500/30', text: 'text-red-400' },
  servicios: { icon: <Settings className="h-8 w-8" />, color: 'success', bg: 'bg-success-500/20', border: 'border-success-500/30', text: 'text-success-400' },
  otros: { icon: <FileText className="h-8 w-8" />, color: 'muted', bg: 'bg-neutral-500/20', border: 'border-neutral-500/30', text: 'text-neutral-400' },
};

export default function ReceiptsPage() {
  return (
    <ReceiptRoute>
      <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900">
      {/* Header */}
      <header className="glass-effect border-b border-neutral-700/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-3">
              <FileText className="h-8 w-8 text-primary-400" />
              <div className="text-center">
                <h1 className="text-xl font-bold text-white">Recibos Konrad</h1>
                <p className="text-sm text-neutral-400">Selecciona el tipo de recibo a generar</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Tipos de <span className="text-gradient-primary">Recibos</span>
            </h2>
            <p className="text-lg text-neutral-300 max-w-2xl mx-auto">
              Elige el tipo de recibo que necesitas. Cada uno tiene campos y diseño únicos.
            </p>
          </div>

          {/* Receipt Types Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {Object.entries(RECEIPT_TYPES).map(([type, data]) => {
              const iconData = receiptTypeIcons[type] || receiptTypeIcons.otros;
              return (
                <Link key={type} href={`/receipts/${type}`} className="group">
                  <div className={`card card-hover group-hover:scale-105 border ${iconData.border} hover:bg-neutral-800/60 transition-all duration-200`}>
                    <div className={`flex items-center space-x-4 mb-4`}>
                      <div className={`p-3 rounded-xl ${iconData.bg}`}>
                        <span className={iconData.text}>{iconData.icon}</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white">{data.name}</h3>
                        <p className="text-sm text-neutral-400">{data.description}</p>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-neutral-700">
                      <div className={`flex items-center ${iconData.text} group-hover:translate-x-1 transition-transform`}>
                        <span className="font-medium">Comenzar</span>
                        <svg className="h-4 w-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Info Section */}
          <div className="mt-12 p-8 glass-effect rounded-xl">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-white mb-4">
                ¿Para qué sirve cada recibo?
              </h3>
              <div className="grid md:grid-cols-3 gap-6 text-sm text-neutral-300">
                <div>
                  <h4 className="font-semibold text-primary-400 mb-2">Alquiler</h4>
                  <p>Recibo mensual para inquilinos, con detalle de alquiler y pagos.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-red-400 mb-2">Reparaciones</h4>
                  <p>Recibo para gastos de arreglos, materiales y mano de obra.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-success-400 mb-2">Servicios</h4>
                  <p>Recibo para servicios prestados (limpieza, mantenimiento, etc).</p>
                </div>
              </div>
            </div>
          </div>
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
    </ReceiptRoute>
  );
} 