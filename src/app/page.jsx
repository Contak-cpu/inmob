import React from 'react';
import Link from 'next/link';
import { FileText, Receipt, Building, Home, Settings, ArrowRight } from 'lucide-react';
import PictoNSignature from '@/components/PictoNSignature';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900">
      {/* Header */}
      <header className="glass-effect border-b border-neutral-700/50">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
            <div className="flex items-center space-x-3">
              <Building className="h-7 w-7 sm:h-8 sm:w-8 text-primary-400" />
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-white">KONRAD Inmobiliaria</h1>
                <p className="text-xs sm:text-sm text-neutral-400">Sistema de Generadores</p>
              </div>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-xs sm:text-sm text-neutral-400">Santa Rosa, La Pampa</p>
              <p className="text-[10px] sm:text-xs text-neutral-500">Mat. 573</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-12">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-3 sm:mb-4">
              Sistema de <span className="text-gradient-primary">Generadores</span>
            </h2>
            <p className="text-base sm:text-lg text-neutral-300 mb-6 sm:mb-8">
              Genera contratos y recibos de manera rápida y profesional
            </p>
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12">
            {/* Contract Generator */}
            <Link href="/contracts" className="group">
              <div className="card card-hover group-hover:scale-105">
                <div className="flex items-center space-x-3 sm:space-x-4 mb-3 sm:mb-4">
                  <div className="p-2 sm:p-3 bg-primary-500/20 rounded-xl">
                    <FileText className="h-7 w-7 sm:h-8 sm:w-8 text-primary-400" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-white">Generador de Contratos</h3>
                    <p className="text-xs sm:text-sm text-neutral-400">Contratos de locación y comerciales</p>
                  </div>
                </div>
                <p className="text-neutral-300 mb-3 sm:mb-4 text-sm sm:text-base">
                  Crea contratos profesionales con validación automática y formatos legales.
                </p>
                <div className="flex items-center text-primary-400 group-hover:text-primary-300 transition-colors">
                  <span className="font-medium text-sm sm:text-base">Comenzar</span>
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            {/* Receipt Generator */}
            <Link href="/receipts" className="group">
              <div className="card card-hover group-hover:scale-105">
                <div className="flex items-center space-x-3 sm:space-x-4 mb-3 sm:mb-4">
                  <div className="p-2 sm:p-3 bg-success-500/20 rounded-xl">
                    <Receipt className="h-7 w-7 sm:h-8 sm:w-8 text-success-400" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-white">Generador de Recibos</h3>
                    <p className="text-xs sm:text-sm text-neutral-400">Recibos de alquiler y servicios</p>
                  </div>
                </div>
                <p className="text-neutral-300 mb-3 sm:mb-4 text-sm sm:text-base">
                  Genera recibos detallados con múltiples conceptos y cálculos automáticos.
                </p>
                <div className="flex items-center text-success-400 group-hover:text-success-300 transition-colors">
                  <span className="font-medium text-sm sm:text-base">Comenzar</span>
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </div>

          {/* Features Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            <div className="text-center p-4 sm:p-6 glass-effect rounded-xl">
              <div className="p-2 sm:p-3 bg-primary-500/20 rounded-xl w-fit mx-auto mb-3 sm:mb-4">
                <Home className="h-5 w-5 sm:h-6 sm:w-6 text-primary-400" />
              </div>
              <h4 className="font-semibold text-white mb-1 sm:mb-2 text-base sm:text-lg">Contratos de Locación</h4>
              <p className="text-xs sm:text-sm text-neutral-400">
                Contratos residenciales con ajustes automáticos
              </p>
            </div>

            <div className="text-center p-4 sm:p-6 glass-effect rounded-xl">
              <div className="p-2 sm:p-3 bg-secondary-500/20 rounded-xl w-fit mx-auto mb-3 sm:mb-4">
                <Building className="h-5 w-5 sm:h-6 sm:w-6 text-secondary-400" />
              </div>
              <h4 className="font-semibold text-white mb-1 sm:mb-2 text-base sm:text-lg">Contratos Comerciales</h4>
              <p className="text-xs sm:text-sm text-neutral-400">
                Contratos para uso comercial y empresarial
              </p>
            </div>

            <div className="text-center p-4 sm:p-6 glass-effect rounded-xl">
              <div className="p-2 sm:p-3 bg-success-500/20 rounded-xl w-fit mx-auto mb-3 sm:mb-4">
                <Settings className="h-5 w-5 sm:h-6 sm:w-6 text-success-400" />
              </div>
              <h4 className="font-semibold text-white mb-1 sm:mb-2 text-base sm:text-lg">Recibos Detallados</h4>
              <p className="text-xs sm:text-sm text-neutral-400">
                Recibos con múltiples conceptos y totales
              </p>
            </div>
          </div>

          {/* Company Info */}
          <div className="mt-8 sm:mt-12 p-4 sm:p-6 glass-effect rounded-xl text-center">
            <h3 className="text-base sm:text-lg font-semibold text-white mb-1 sm:mb-2">
              KONRAD Inversiones + Desarrollos Inmobiliarios
            </h3>
            <p className="text-xs sm:text-neutral-400 mb-1 sm:mb-2">
              calle AMEGHINO Nº 602, Santa Rosa, La Pampa
            </p>
            <p className="text-[10px] sm:text-sm text-neutral-500">
              Tel: +54 2954 123456 | Email: info@konradinmobiliaria.com
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="glass-effect border-t border-neutral-700/50 mt-8 sm:mt-12">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
            <p className="text-xs sm:text-sm text-neutral-400">
              © 2024 KONRAD Inmobiliaria. Todos los derechos reservados.
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