'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText } from 'lucide-react';
import { CONTRACT_TYPES } from '@/lib/config';
import ContractTypeCard from '@/components/ContractTypeCard';
import PictoNSignature from '@/components/PictoNSignature';
import { ContractRoute } from '@/components/ProtectedRoute';

export default function ContractsPage() {
  return (
    <ContractRoute>
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
              <FileText className="h-8 w-8 text-primary-400" />
              <div>
                <h1 className="text-xl font-bold text-white">Generador de Contratos</h1>
                <p className="text-sm text-neutral-400">Selecciona el tipo de contrato</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-neutral-400">Konrad Inversiones + Desarrollos Inmobiliarios</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Tipos de <span className="text-gradient-primary">Contratos</span>
            </h2>
            <p className="text-lg text-neutral-300 max-w-2xl mx-auto">
              Selecciona el tipo de contrato que necesitas generar. Cada tipo tiene características específicas y ajustes automáticos.
            </p>
          </div>

          {/* Contract Types Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Object.entries(CONTRACT_TYPES).map(([contractType, contract]) => (
              <ContractTypeCard
                key={contractType}
                contractType={contractType}
                contract={contract}
              />
            ))}
          </div>

          {/* Info Section */}
          <div className="mt-12 p-8 glass-effect rounded-xl">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-white mb-4">
                Información sobre los Contratos
              </h3>
              <div className="grid md:grid-cols-3 gap-6 text-sm text-neutral-300">
                <div>
                  <h4 className="font-semibold text-primary-400 mb-2">Contrato Comercial</h4>
                  <p>Para locales comerciales con ajuste IPC automático</p>
                </div>
                <div>
                  <h4 className="font-semibold text-secondary-400 mb-2">Contrato Casa</h4>
                  <p>Para viviendas familiares con ajuste ICL automático</p>
                </div>
                <div>
                  <h4 className="font-semibold text-success-400 mb-2">Contrato Empresarial</h4>
                  <p>Para uso empresarial con ajustes específicos</p>
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
    </ContractRoute>
  );
} 