import { useState, useEffect, useCallback } from 'react';
import securityManager from '../utils/security';
import serverValidation from '../utils/serverValidation';

export const useSecurity = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userPermissions, setUserPermissions] = useState([]);
  const [securityLogs, setSecurityLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Verificar sesión existente al cargar
    const user = securityManager.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
      setUserPermissions(securityManager.getUserPermissions());
    }
  }, []);

  // Login
  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    
    try {
      // Validar credenciales primero
      const validation = serverValidation.validateLoginCredentials(email, password);
      if (!validation.isValid) {
        return {
          success: false,
          errors: validation.errors
        };
      }

      // Intentar autenticación
      const result = await securityManager.authenticateUser(email, password);
      
      if (result.success) {
        setCurrentUser(result.user);
        setIsAuthenticated(true);
        setUserPermissions(securityManager.getUserPermissions());
        
        return { success: true, user: result.user };
      } else {
        return { success: false, error: 'Credenciales inválidas' };
      }
    } catch (error) {
      console.error('Error en login:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Logout
  const logout = useCallback(() => {
    securityManager.logout();
    setCurrentUser(null);
    setIsAuthenticated(false);
    setUserPermissions([]);
  }, []);

  // Verificar permiso
  const hasPermission = useCallback((permission) => {
    return securityManager.hasPermission(permission);
  }, []);

  // Verificar múltiples permisos
  const hasAnyPermission = useCallback((permissions) => {
    return securityManager.hasAnyPermission(permissions);
  }, []);

  // Verificar todos los permisos
  const hasAllPermissions = useCallback((permissions) => {
    return securityManager.hasAllPermissions(permissions);
  }, []);

  // Verificar nivel de acceso
  const hasAccessLevel = useCallback((requiredLevel) => {
    return securityManager.hasAccessLevel(requiredLevel);
  }, []);

  // Validar datos
  const validateData = useCallback((data, type) => {
    return serverValidation.validate(data, type);
  }, []);

  // Validar contrato
  const validateContract = useCallback((contractData) => {
    return serverValidation.validateContract(contractData);
  }, []);

  // Validar recibo
  const validateReceipt = useCallback((receiptData) => {
    return serverValidation.validateReceipt(receiptData);
  }, []);

  // Validar usuario
  const validateUser = useCallback((userData) => {
    return serverValidation.validateUser(userData);
  }, []);

  // Validar archivo
  const validateFile = useCallback((file, allowedTypes, maxSize) => {
    return serverValidation.validateFile(file, allowedTypes, maxSize);
  }, []);

  // Validar consulta de búsqueda
  const validateSearchQuery = useCallback((query, maxLength) => {
    return serverValidation.validateSearchQuery(query, maxLength);
  }, []);

  // Registrar evento de seguridad
  const logSecurityEvent = useCallback((action, data) => {
    securityManager.auditLog(action, data);
  }, []);

  // Obtener logs de auditoría
  const getAuditLogs = useCallback((filters) => {
    return securityManager.getAuditLogs(filters);
  }, []);

  // Obtener roles disponibles
  const getAvailableRoles = useCallback(() => {
    return securityManager.getAvailableRoles();
  }, []);

  // Obtener permisos disponibles
  const getAvailablePermissions = useCallback(() => {
    return securityManager.getAvailablePermissions();
  }, []);

  // Verificar si es admin
  const isAdmin = useCallback(() => {
    return currentUser?.role === 'admin';
  }, [currentUser]);

  // Verificar si es gerente o superior
  const isManagerOrHigher = useCallback(() => {
    return hasAccessLevel(80);
  }, [hasAccessLevel]);

  // Verificar si puede gestionar usuarios
  const canManageUsers = useCallback(() => {
    return hasPermission('users:write') || hasPermission('users:manage_roles');
  }, [hasPermission]);

  // Verificar si puede gestionar contratos
  const canManageContracts = useCallback(() => {
    return hasPermission('contracts:write') || hasPermission('contracts:delete');
  }, [hasPermission]);

  // Verificar si puede gestionar recibos
  const canManageReceipts = useCallback(() => {
    return hasPermission('receipts:write') || hasPermission('receipts:delete');
  }, [hasPermission]);

  // Verificar si puede exportar datos
  const canExportData = useCallback(() => {
    return hasPermission('export:all') || hasPermission('export:limited');
  }, [hasPermission]);

  // Verificar si puede ver analytics
  const canViewAnalytics = useCallback(() => {
    return hasPermission('analytics:read');
  }, [hasPermission]);

  // Verificar si puede ver logs del sistema
  const canViewSystemLogs = useCallback(() => {
    return hasPermission('system:logs');
  }, [hasPermission]);

  // Obtener estadísticas de seguridad
  const getSecurityStats = useCallback(() => {
    const logs = securityManager.getAuditLogs();
    const now = new Date();
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const stats = {
      totalLogs: logs.length,
      logsLast24h: logs.filter(log => new Date(log.timestamp) >= last24h).length,
      logsLast7d: logs.filter(log => new Date(log.timestamp) >= last7d).length,
      securityViolations: logs.filter(log => log.action === 'SECURITY_VIOLATION').length,
      failedLogins: logs.filter(log => log.action === 'LOGIN_FAILED').length,
      successfulLogins: logs.filter(log => log.action === 'LOGIN_SUCCESS').length,
      byAction: {},
      byUser: {},
      byRole: {}
    };

    // Agrupar por acción
    logs.forEach(log => {
      stats.byAction[log.action] = (stats.byAction[log.action] || 0) + 1;
      stats.byUser[log.userEmail] = (stats.byUser[log.userEmail] || 0) + 1;
      stats.byRole[log.userRole] = (stats.byRole[log.userRole] || 0) + 1;
    });

    return stats;
  }, []);

  // Verificar integridad de datos
  const validateDataIntegrity = useCallback((data) => {
    const issues = [];

    // Verificar tipos de datos
    if (data && typeof data === 'object') {
      for (const [key, value] of Object.entries(data)) {
        if (typeof value === 'string') {
          const securityIssues = serverValidation.detectSecurityIssues(value);
          if (securityIssues.length > 0) {
            issues.push({
              field: key,
              type: 'security',
              issues: securityIssues
            });
          }
        }
      }
    }

    return {
      isValid: issues.length === 0,
      issues
    };
  }, []);

  // Sanitizar datos
  const sanitizeData = useCallback((data) => {
    if (typeof data === 'string') {
      return serverValidation.sanitizeInput(data);
    }

    if (typeof data === 'object' && data !== null) {
      const sanitized = {};
      for (const [key, value] of Object.entries(data)) {
        sanitized[key] = typeof value === 'string' 
          ? serverValidation.sanitizeInput(value)
          : value;
      }
      return sanitized;
    }

    return data;
  }, []);

  return {
    // Estado
    currentUser,
    isAuthenticated,
    userPermissions,
    isLoading,

    // Autenticación
    login,
    logout,

    // Verificación de permisos
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasAccessLevel,

    // Validación de datos
    validateData,
    validateContract,
    validateReceipt,
    validateUser,
    validateFile,
    validateSearchQuery,

    // Auditoría
    logSecurityEvent,
    getAuditLogs,

    // Roles y permisos
    getAvailableRoles,
    getAvailablePermissions,

    // Verificaciones específicas
    isAdmin,
    isManagerOrHigher,
    canManageUsers,
    canManageContracts,
    canManageReceipts,
    canExportData,
    canViewAnalytics,
    canViewSystemLogs,

    // Estadísticas
    getSecurityStats,

    // Integridad y sanitización
    validateDataIntegrity,
    sanitizeData
  };
}; 