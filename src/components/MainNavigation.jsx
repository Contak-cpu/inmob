'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  FileText, 
  Receipt, 
  Building, 
  History, 
  Menu, 
  X, 
  ChevronRight,
  BarChart3,
  Users,
  LogOut,
  User,
  Bell,
  LayoutDashboard,
  Settings,
  Search,
  HelpCircle
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useUI } from '@/hooks/useUI';
import { useNotifications } from '@/hooks/useNotifications';
import { useTheme } from '@/contexts/ThemeContext';
import { useSystemShortcuts } from '@/hooks/useKeyboardShortcuts';
import LoadingScreen from './LoadingScreen';
import NotificationModal from '@/components/ui/NotificationModal';
import ThemeSettings from '@/components/ui/ThemeSettings';
import GlobalSearch from '@/components/ui/GlobalSearch';
import { KeyboardShortcutsHelp } from '@/hooks/useKeyboardShortcuts';

export default function MainNavigation({ children }) {
  const pathname = usePathname();
  const [notificationModalOpen, setNotificationModalOpen] = useState(false);
  const [themeSettingsOpen, setThemeSettingsOpen] = useState(false);
  const [globalSearchOpen, setGlobalSearchOpen] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  
  const { 
    user, 
    isLoading, 
    isAuthenticated, 
    logout, 
    getUserRole,
    getRoleColor
  } = useAuth();
  
  const { 
    sidebarOpen, 
    toggleSidebar, 
    closeSidebar 
  } = useUI();

  const {
    notifications,
    unreadCount: unreadNotificationsCount,
    markNotificationAsRead,
    clearNotifications
  } = useNotifications();

  const { currentTheme } = useTheme();

  // Activar atajos de teclado del sistema
  useSystemShortcuts();

  // Cerrar sidebar en móviles al cambiar de ruta
  useEffect(() => {
    closeSidebar();
  }, [pathname, closeSidebar]);

  // Prevenir scroll del body cuando el sidebar móvil está abierto
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [sidebarOpen]);

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      window.location.href = '/login';
    }
  };

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      permission: 'canViewDashboard',
      description: 'Análisis y reportes'
    },
    {
      name: 'Contratos',
      href: '/contracts',
      icon: FileText,
      permission: 'canCreateContracts',
      description: 'Generar contratos'
    },
    {
      name: 'Recibos',
      href: '/receipts',
      icon: Receipt,
      permission: 'canCreateReceipts',
      description: 'Generar recibos'
    },
    {
      name: 'Historial',
      href: '/history',
      icon: History,
      permission: 'canViewHistory',
      description: 'Ver historial'
    },
    {
      name: 'Estadísticas',
      href: '/analytics',
      icon: BarChart3,
      permission: 'canViewAnalytics',
      description: 'Análisis avanzado'
    },
    {
      name: 'Usuarios',
      href: '/users',
      icon: Users,
      permission: 'canManageUsers',
      description: 'Gestionar usuarios'
    }
  ];

  const filteredNavigation = navigationItems.filter(item => 
    !item.permission || user?.role === 'admin' || item.permission === 'canViewDashboard'
  );

  const isActiveRoute = (href) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  // Mostrar loading si la aplicación está cargando
  if (isLoading) {
    return <LoadingScreen message="Inicializando Konrad Inmobiliaria..." />;
  }

  // Si no está autenticado, mostrar solo el contenido
  if (!isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900">
      {/* Sidebar para móviles - Mejorado */}
      <div className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${
        sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}>
        {/* Overlay con backdrop blur */}
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm" 
          onClick={closeSidebar}
        />
        
        {/* Sidebar móvil con animación */}
        <div className={`fixed left-0 top-0 h-full w-80 max-w-[85vw] bg-neutral-800/95 backdrop-blur-md border-r border-neutral-700/50 transform transition-transform duration-300 ease-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          {/* Header del sidebar móvil */}
          <div className="flex items-center justify-between p-6 border-b border-neutral-700/50">
            <div className="flex items-center space-x-3">
              <Building className="h-8 w-8 text-primary-400" />
              <div>
                <h1 className="text-xl font-bold text-white">Konrad</h1>
                <p className="text-xs text-neutral-400">Inmobiliaria</p>
              </div>
            </div>
            <button
              onClick={closeSidebar}
              className="p-3 hover:bg-neutral-700/50 rounded-xl transition-colors touch-manipulation"
            >
              <X className="h-6 w-6 text-neutral-400" />
            </button>
          </div>
          
          {/* Navegación móvil mejorada */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {filteredNavigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-4 p-4 rounded-xl transition-all duration-200 touch-manipulation ${
                    isActiveRoute(item.href)
                      ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30 shadow-lg'
                      : 'text-neutral-300 hover:bg-neutral-700/50 hover:text-white active:scale-95'
                  }`}
                  onClick={closeSidebar}
                >
                  <div className={`p-3 rounded-xl ${
                    isActiveRoute(item.href) 
                      ? 'bg-primary-500/20' 
                      : 'bg-neutral-700/50'
                  }`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-base">{item.name}</div>
                    <div className="text-sm text-neutral-400">{item.description}</div>
                  </div>
                  {isActiveRoute(item.href) && (
                    <ChevronRight className="h-5 w-5 text-primary-400" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Perfil de usuario móvil */}
          <div className="p-4 border-t border-neutral-700/50">
            <div className="flex items-center space-x-4 p-4 bg-neutral-700/30 rounded-xl">
              <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base font-semibold text-white truncate">{user?.name}</p>
                <p className="text-sm text-neutral-400">{getUserRole()}</p>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-3 p-4 mt-3 text-error-400 hover:bg-error-500/10 rounded-xl transition-colors touch-manipulation"
            >
              <LogOut className="h-5 w-5" />
              <span className="text-base font-medium">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-neutral-800 border-r border-neutral-700">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center space-x-3 p-6 border-b border-neutral-700 hover:bg-neutral-700/30 transition-colors">
            <Building className="h-8 w-8 text-primary-400" />
            <div>
              <h1 className="text-lg font-bold text-white">Konrad</h1>
              <p className="text-xs text-neutral-400">Inmobiliaria</p>
            </div>
          </Link>

          {/* Navegación */}
          <nav className="flex-1 p-4 space-y-2">
            {filteredNavigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-colors group ${
                    isActiveRoute(item.href)
                      ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                      : 'text-neutral-300 hover:bg-neutral-700/50 hover:text-white'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <div className="flex-1">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs text-neutral-400">{item.description}</div>
                  </div>
                  {isActiveRoute(item.href) && (
                    <ChevronRight className="h-4 w-4 text-primary-400" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Perfil de usuario */}
          <div className="p-4 border-t border-neutral-700">
            <div className="flex items-center space-x-3 p-3 bg-neutral-700/50 rounded-lg">
              <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                <p className="text-xs text-neutral-400">{getUserRole()}</p>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 p-3 mt-3 text-error-400 hover:bg-error-500/10 rounded-lg transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span className="text-sm">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="lg:pl-64">
        {/* Header mejorado para móviles */}
        <header className="glass-effect border-b border-neutral-700/50 sticky top-0 z-40">
          <div className="flex items-center justify-between px-4 sm:px-6 py-4">
            <div className="flex items-center space-x-4">
              {/* Botón hamburguesa mejorado */}
              <button
                onClick={toggleSidebar}
                className="lg:hidden p-3 hover:bg-neutral-700/50 rounded-xl transition-colors touch-manipulation"
                aria-label="Abrir menú"
              >
                <Menu className="h-6 w-6 text-neutral-400" />
              </button>
              
              {/* Logo y título */}
              <div className="flex items-center space-x-3">
                <Building className="h-7 w-7 text-primary-400" />
                <div className="hidden sm:block">
                  <h1 className="text-lg font-bold text-white">Konrad Inmobiliaria</h1>
                  <p className="text-xs text-neutral-400">Sistema de Gestión</p>
                </div>
                <div className="sm:hidden">
                  <h1 className="text-base font-bold text-white">Konrad</h1>
                </div>
              </div>
            </div>

            {/* Acciones del header - Mejoradas para móviles */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Búsqueda global */}
              <button 
                onClick={() => setGlobalSearchOpen(true)}
                className="p-3 hover:bg-neutral-700/50 rounded-xl transition-colors touch-manipulation"
                title="Búsqueda global (Ctrl+K)"
                aria-label="Búsqueda global"
              >
                <Search className="h-5 w-5 text-neutral-400" />
              </button>

              {/* Configuración de tema */}
              <button 
                onClick={() => setThemeSettingsOpen(true)}
                className="p-3 hover:bg-neutral-700/50 rounded-xl transition-colors touch-manipulation"
                title="Configuración"
                aria-label="Configuración"
              >
                <Settings className="h-5 w-5 text-neutral-400" />
              </button>

              {/* Ayuda */}
              <button 
                onClick={() => setHelpModalOpen(true)}
                className="hidden sm:block p-3 hover:bg-neutral-700/50 rounded-xl transition-colors touch-manipulation"
                title="Ayuda (Ctrl+/)"
                aria-label="Ayuda"
              >
                <HelpCircle className="h-5 w-5 text-neutral-400" />
              </button>

              {/* Notificaciones */}
              <button 
                onClick={() => setNotificationModalOpen(true)}
                className="p-3 hover:bg-neutral-700/50 rounded-xl relative transition-colors touch-manipulation"
                title="Ver notificaciones"
                aria-label="Notificaciones"
              >
                <Bell className="h-5 w-5 text-neutral-400" />
                {unreadNotificationsCount > 0 && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-error-400 rounded-full animate-pulse flex items-center justify-center">
                    <span className="text-xs text-white font-bold">
                      {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
                    </span>
                  </div>
                )}
              </button>

              {/* Estadísticas (Header) */}
              <Link
                href="/analytics"
                className="p-3 hover:bg-neutral-700/50 rounded-xl relative transition-colors touch-manipulation"
                title="Ver Estadísticas"
                aria-label="Estadísticas"
              >
                <BarChart3 className="h-5 w-5 text-neutral-400" />
              </Link>

              {/* Perfil móvil mejorado */}
              <div className="lg:hidden">
                <div className="flex items-center space-x-3 p-3 hover:bg-neutral-700/50 rounded-xl transition-colors touch-manipulation">
                  <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-white truncate max-w-[100px]">{user?.name}</p>
                    <p className="text-xs text-neutral-400">{getUserRole()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Contenido principal con mejor padding para móviles */}
        <main className="p-3 sm:p-4 lg:p-6 min-h-[calc(100vh-80px)]">
          {children}
        </main>
      </div>

      {/* Modal de Notificaciones */}
      <NotificationModal
        isOpen={notificationModalOpen}
        onClose={() => setNotificationModalOpen(false)}
        notifications={notifications}
        onMarkAsRead={markNotificationAsRead}
        onClearAll={clearNotifications}
      />

      {/* Modal de Configuración de Temas */}
      <ThemeSettings
        isOpen={themeSettingsOpen}
        onClose={() => setThemeSettingsOpen(false)}
      />

      {/* Búsqueda Global */}
      <GlobalSearch
        isOpen={globalSearchOpen}
        onClose={() => setGlobalSearchOpen(false)}
      />

      {/* Modal de Ayuda */}
      <KeyboardShortcutsHelp
        isOpen={helpModalOpen}
        onClose={() => setHelpModalOpen(false)}
      />
    </div>
  );
} 