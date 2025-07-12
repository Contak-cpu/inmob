'use client';

import { useCallback } from 'react';
import { useApp } from '@/contexts/AppContext';
import { hasPermission, hasRole, USER_ROLES } from '@/utils/auth';

/**
 * Hook personalizado para manejar la autenticación
 * Proporciona funciones y estado relacionados con la autenticación
 */
export function useAuth() {
  const { user, isLoading, isAuthenticated, login, logout, updateUser } = useApp();

  // Verificar si el usuario tiene un permiso específico
  const checkPermission = useCallback((permission) => {
    if (!user) return false;
    return hasPermission(permission);
  }, [user]);

  // Verificar si el usuario tiene un rol específico
  const checkRole = useCallback((role) => {
    if (!user) return false;
    return hasRole(role);
  }, [user]);

  // Verificar si el usuario es administrador
  const isAdmin = useCallback(() => {
    return checkRole(USER_ROLES.ADMIN);
  }, [checkRole]);

  // Verificar si el usuario es gerente
  const isManager = useCallback(() => {
    return checkRole(USER_ROLES.MANAGER);
  }, [checkRole]);

  // Verificar si el usuario es agente
  const isAgent = useCallback(() => {
    return checkRole(USER_ROLES.AGENT);
  }, [checkRole]);

  // Verificar si el usuario es visualizador
  const isViewer = useCallback(() => {
    return checkRole(USER_ROLES.VIEWER);
  }, [checkRole]);

  // Obtener el rol del usuario como texto
  const getUserRole = useCallback(() => {
    if (!user) return 'No autenticado';
    
    switch (user.role) {
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
  }, [user]);

  // Obtener el color del rol del usuario
  const getRoleColor = useCallback(() => {
    if (!user) return 'text-neutral-400 bg-neutral-500/10 border-neutral-500/20';
    
    switch (user.role) {
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
  }, [user]);

  // Verificar si el usuario puede crear contratos
  const canCreateContracts = useCallback(() => {
    return checkPermission('canCreateContracts');
  }, [checkPermission]);

  // Verificar si el usuario puede editar contratos
  const canEditContracts = useCallback(() => {
    return checkPermission('canEditContracts');
  }, [checkPermission]);

  // Verificar si el usuario puede crear recibos
  const canCreateReceipts = useCallback(() => {
    return checkPermission('canCreateReceipts');
  }, [checkPermission]);

  // Verificar si el usuario puede ver el historial
  const canViewHistory = useCallback(() => {
    return checkPermission('canViewHistory');
  }, [checkPermission]);

  // Verificar si el usuario puede exportar datos
  const canExportData = useCallback(() => {
    return checkPermission('canExportData');
  }, [checkPermission]);

  // Verificar si el usuario puede gestionar usuarios
  const canManageUsers = useCallback(() => {
    return checkPermission('canManageUsers');
  }, [checkPermission]);

  // Verificar si el usuario puede ver estadísticas
  const canViewStats = useCallback(() => {
    return checkPermission('canViewStats');
  }, [checkPermission]);

  // Verificar si el usuario puede ver el dashboard
  const canViewDashboard = useCallback(() => {
    return checkPermission('canViewDashboard');
  }, [checkPermission]);

  // Verificar si el usuario puede ver analytics
  const canViewAnalytics = useCallback(() => {
    return checkPermission('canViewAnalytics');
  }, [checkPermission]);

  return {
    // Estado
    user,
    isLoading,
    isAuthenticated,
    
    // Funciones de autenticación
    login,
    logout,
    updateUser,
    
    // Funciones de verificación de permisos
    checkPermission,
    canCreateContracts,
    canEditContracts,
    canCreateReceipts,
    canViewHistory,
    canExportData,
    canManageUsers,
    canViewStats,
    canViewDashboard,
    canViewAnalytics,
    
    // Funciones de verificación de roles
    checkRole,
    isAdmin,
    isManager,
    isAgent,
    isViewer,
    
    // Funciones de utilidad
    getUserRole,
    getRoleColor,
  };
} 