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
      {/* Sidebar para móviles */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black/50" onClick={closeSidebar} />
        <div className="fixed left-0 top-0 h-full w-64 bg-neutral-800 border-r border-neutral-700">
          <div className="flex items-center justify-between p-4 border-b border-neutral-700">
            <div className="flex items-center space-x-2">
              <Building className="h-6 w-6 text-primary-400" />
              <span className="text-white font-semibold">Konrad</span>
            </div>
            <button
              onClick={closeSidebar}
              className="p-1 hover:bg-neutral-700 rounded-lg"
            >
              <X className="h-5 w-5 text-neutral-400" />
            </button>
          </div>
          
          {/* Navegación móvil */}
          <nav className="p-4 space-y-2">
            {filteredNavigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                    isActiveRoute(item.href)
                      ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                      : 'text-neutral-300 hover:bg-neutral-700/50 hover:text-white'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs text-neutral-400">{item.description}</div>
                  </div>
                </Link>
              );
            })}
          </nav>
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
        {/* Header */}
        <header className="glass-effect border-b border-neutral-700/50">
          <div className="flex items-center justify-between px-4 sm:px-6 py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleSidebar}
                className="lg:hidden p-2 hover:bg-neutral-700/50 rounded-lg"
              >
                <Menu className="h-5 w-5 text-neutral-400" />
              </button>
              
              <div className="flex items-center space-x-2">
                <Building className="h-6 w-6 text-primary-400" />
                <div className="hidden sm:block">
                  <h1 className="text-lg font-bold text-white">Konrad Inmobiliaria</h1>
                  <p className="text-xs text-neutral-400">Sistema de Gestión</p>
                </div>
              </div>
            </div>

            {/* Acciones del header */}
            <div className="flex items-center space-x-3">
              {/* Búsqueda global */}
              <button 
                onClick={() => setGlobalSearchOpen(true)}
                className="p-2 hover:bg-neutral-700/50 rounded-lg transition-colors"
                title="Búsqueda global (Ctrl+K)"
              >
                <Search className="h-5 w-5 text-neutral-400" />
              </button>

              {/* Configuración de tema */}
              <button 
                onClick={() => setThemeSettingsOpen(true)}
                className="p-2 hover:bg-neutral-700/50 rounded-lg transition-colors"
                title="Configuración"
              >
                <Settings className="h-5 w-5 text-neutral-400" />
              </button>

              {/* Ayuda */}
              <button 
                onClick={() => setHelpModalOpen(true)}
                className="p-2 hover:bg-neutral-700/50 rounded-lg transition-colors"
                title="Ayuda (Ctrl+/)"
              >
                <HelpCircle className="h-5 w-5 text-neutral-400" />
              </button>

              {/* Notificaciones */}
              <button 
                onClick={() => setNotificationModalOpen(true)}
                className="p-2 hover:bg-neutral-700/50 rounded-lg relative transition-colors"
                title="Ver notificaciones"
              >
                <Bell className="h-5 w-5 text-neutral-400" />
                {unreadNotificationsCount > 0 && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-error-400 rounded-full animate-pulse"></div>
                )}
              </button>

              {/* Estadísticas (Header) */}
              <Link
                href="/analytics"
                className="p-2 hover:bg-neutral-700/50 rounded-lg relative"
                title="Ver Estadísticas"
              >
                <BarChart3 className="h-5 w-5 text-neutral-400" />
              </Link>

              {/* Perfil móvil */}
              <div className="lg:hidden">
                <div className="flex items-center space-x-2 p-2 hover:bg-neutral-700/50 rounded-lg">
                  <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-white">{user?.name}</p>
                    <p className="text-xs text-neutral-400">{getUserRole()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Contenido */}
        <main className="p-4 sm:p-6">
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