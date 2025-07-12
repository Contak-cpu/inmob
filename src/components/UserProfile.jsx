'use client';

import React, { useState } from 'react';
import { User, LogOut, Settings, Shield, Clock, Mail, Building } from 'lucide-react';
import { getCurrentUser, logout, hasPermission, hasRole, USER_ROLES } from '@/utils/auth';
import { notifySuccess } from '@/utils/notifications';

export default function UserProfile() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const user = getCurrentUser();

  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      const result = await logout();
      if (result.success) {
        notifySuccess('Sesión cerrada', 'Has cerrado sesión exitosamente');
        // Recargar la página para limpiar el estado
        window.location.reload();
      }
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case USER_ROLES.ADMIN:
        return 'Administrador';
      case USER_ROLES.MANAGER:
        return 'Gerente';
      case USER_ROLES.AGENT:
        return 'Agente';
      case USER_ROLES.VIEWER:
        return 'Visualizador';
      default:
        return 'Usuario';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case USER_ROLES.ADMIN:
        return 'text-error-400 bg-error-500/10 border-error-500/20';
      case USER_ROLES.MANAGER:
        return 'text-warning-400 bg-warning-500/10 border-warning-500/20';
      case USER_ROLES.AGENT:
        return 'text-success-400 bg-success-500/10 border-success-500/20';
      case USER_ROLES.VIEWER:
        return 'text-info-400 bg-info-500/10 border-info-500/20';
      default:
        return 'text-neutral-400 bg-neutral-500/10 border-neutral-500/20';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case USER_ROLES.ADMIN:
        return <Shield className="h-4 w-4" />;
      case USER_ROLES.MANAGER:
        return <Building className="h-4 w-4" />;
      case USER_ROLES.AGENT:
        return <User className="h-4 w-4" />;
      case USER_ROLES.VIEWER:
        return <Clock className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  return (
    <div className="relative">
      {/* Botón de perfil */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 hover:bg-neutral-700/50 rounded-lg transition-colors"
      >
        <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
          <User className="h-4 w-4 text-white" />
        </div>
        <div className="hidden sm:block text-left">
          <p className="text-sm font-medium text-white">{user.name}</p>
          <p className="text-xs text-neutral-400">{getRoleLabel(user.role)}</p>
        </div>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-neutral-800 border border-neutral-700 rounded-xl shadow-xl z-50">
          {/* Header */}
          <div className="p-4 border-b border-neutral-700">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-white">{user.name}</h3>
                <p className="text-sm text-neutral-400">{user.email}</p>
                <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs border ${getRoleColor(user.role)} mt-1`}>
                  {getRoleIcon(user.role)}
                  <span>{getRoleLabel(user.role)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Permisos */}
          <div className="p-4 border-b border-neutral-700">
            <h4 className="text-sm font-medium text-neutral-300 mb-3">Permisos</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className={`flex items-center space-x-2 ${hasPermission('canCreateContracts') ? 'text-success-400' : 'text-neutral-500'}`}>
                <div className={`w-2 h-2 rounded-full ${hasPermission('canCreateContracts') ? 'bg-success-400' : 'bg-neutral-600'}`}></div>
                <span>Crear Contratos</span>
              </div>
              <div className={`flex items-center space-x-2 ${hasPermission('canEditContracts') ? 'text-success-400' : 'text-neutral-500'}`}>
                <div className={`w-2 h-2 rounded-full ${hasPermission('canEditContracts') ? 'bg-success-400' : 'bg-neutral-600'}`}></div>
                <span>Editar Contratos</span>
              </div>
              <div className={`flex items-center space-x-2 ${hasPermission('canCreateReceipts') ? 'text-success-400' : 'text-neutral-500'}`}>
                <div className={`w-2 h-2 rounded-full ${hasPermission('canCreateReceipts') ? 'bg-success-400' : 'bg-neutral-600'}`}></div>
                <span>Crear Recibos</span>
              </div>
              <div className={`flex items-center space-x-2 ${hasPermission('canViewHistory') ? 'text-success-400' : 'text-neutral-500'}`}>
                <div className={`w-2 h-2 rounded-full ${hasPermission('canViewHistory') ? 'bg-success-400' : 'bg-neutral-600'}`}></div>
                <span>Ver Historial</span>
              </div>
              <div className={`flex items-center space-x-2 ${hasPermission('canExportData') ? 'text-success-400' : 'text-neutral-500'}`}>
                <div className={`w-2 h-2 rounded-full ${hasPermission('canExportData') ? 'bg-success-400' : 'bg-neutral-600'}`}></div>
                <span>Exportar Datos</span>
              </div>
              <div className={`flex items-center space-x-2 ${hasPermission('canManageUsers') ? 'text-success-400' : 'text-neutral-500'}`}>
                <div className={`w-2 h-2 rounded-full ${hasPermission('canManageUsers') ? 'bg-success-400' : 'bg-neutral-600'}`}></div>
                <span>Gestionar Usuarios</span>
              </div>
            </div>
          </div>

          {/* Acciones */}
          <div className="p-4">
            <div className="space-y-2">
              {hasPermission('canManageUsers') && (
                <button className="w-full flex items-center space-x-3 p-2 hover:bg-neutral-700 rounded-lg transition-colors text-left">
                  <Settings className="h-4 w-4 text-neutral-400" />
                  <span className="text-sm text-neutral-300">Configuración</span>
                </button>
              )}
              <button
                onClick={handleLogout}
                disabled={isLoading}
                className="w-full flex items-center space-x-3 p-2 hover:bg-error-500/10 rounded-lg transition-colors text-left text-error-400 hover:text-error-300"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-error-400"></div>
                ) : (
                  <LogOut className="h-4 w-4" />
                )}
                <span className="text-sm">
                  {isLoading ? 'Cerrando sesión...' : 'Cerrar Sesión'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Overlay para cerrar dropdown */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
} 