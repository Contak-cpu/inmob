import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FileText, Receipt, Building, Home, Settings, ArrowRight, History, Bell } from 'lucide-react';
import PictoNSignature from '@/components/PictoNSignature';
import UserProfile from '@/components/UserProfile';
import { getCurrentUser, isAuthenticated } from '@/utils/auth';

export default function HomePage() {
  const [user, setUser] = useState(null);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = isAuthenticated();
      setIsAuth(authenticated);
      if (authenticated) {
        setUser(getCurrentUser());
      }
    };

    checkAuth();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900">
      {/* Header */}
      <header className="glass-effect border-b border-neutral-700/50">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
            <div className="flex items-center space-x-3">
              <Building className="h-7 w-7 sm:h-8 sm:w-8 text-primary-400" />
              <div className="text-center">
                <h1 className="text-lg sm:text-xl font-bold text-white">Konrad Inversiones + Desarrollos Inmobiliarios</h1>
              </div>
            </div>
            {isAuth && <UserProfile />}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
            {/* Dashboard */}
            <Link href="/dashboard" className="group">
              <div className="card card-hover group-hover:scale-105">
                <div className="flex items-center space-x-3 sm:space-x-4 mb-3 sm:mb-4">
                  <div className="p-2 sm:p-3 bg-indigo-500/20 rounded-xl">
                    <svg className="h-7 w-7 sm:h-8 sm:w-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-white">Dashboard</h3>
                    <p className="text-xs sm:text-sm text-neutral-400">Análisis y reportes</p>
                  </div>
                </div>
                <p className="text-neutral-300 mb-3 sm:mb-4 text-sm sm:text-base">
                  Visualiza métricas, gráficos y análisis en tiempo real.
                </p>
                <div className="flex items-center text-indigo-400 group-hover:text-indigo-300 transition-colors">
                  <span className="font-medium text-sm sm:text-base">Ver Dashboard</span>
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

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

          {/* Additional Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-6 sm:mt-8">
            <Link href="/history" className="group">
              <div className="card card-hover group-hover:scale-105">
                <div className="flex items-center space-x-3 sm:space-x-4 mb-3 sm:mb-4">
                  <div className="p-2 sm:p-3 bg-warning-500/20 rounded-xl">
                    <History className="h-7 w-7 sm:h-8 sm:w-8 text-warning-400" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-white">Historial y Estadísticas</h3>
                    <p className="text-xs sm:text-sm text-neutral-400">Gestiona tus documentos generados</p>
                  </div>
                </div>
                <p className="text-neutral-300 mb-3 sm:mb-4 text-sm sm:text-base">
                  Accede al historial completo de contratos y recibos con estadísticas detalladas.
                </p>
                <div className="flex items-center text-warning-400 group-hover:text-warning-300 transition-colors">
                  <span className="font-medium text-sm sm:text-base">Ver Historial</span>
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            <div className="card card-hover">
              <div className="flex items-center space-x-3 sm:space-x-4 mb-3 sm:mb-4">
                <div className="p-2 sm:p-3 bg-info-500/20 rounded-xl">
                  <Bell className="h-7 w-7 sm:h-8 sm:w-8 text-info-400" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-white">Sistema de Notificaciones</h3>
                  <p className="text-xs sm:text-sm text-neutral-400">Alertas y recordatorios automáticos</p>
                </div>
              </div>
              <p className="text-neutral-300 mb-3 sm:mb-4 text-sm sm:text-base">
                Recibe notificaciones sobre vencimientos de contratos y pagos pendientes.
              </p>
              <div className="flex items-center text-info-400">
                <span className="font-medium text-sm sm:text-base">Activo</span>
                <div className="w-2 h-2 bg-info-400 rounded-full ml-2 animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Company Info */}
          <div className="mt-8 sm:mt-12 p-4 sm:p-6 glass-effect rounded-xl text-center">
            <h3 className="text-base sm:text-lg font-semibold text-white mb-1 sm:mb-2">
              KONRAD Inversiones + Desarrollos Inmobiliarios
            </h3>
            <p className="text-xs sm:text-neutral-400 mb-1 sm:mb-2">
              Ameghino Nº 602, Santa Rosa, La Pampa
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