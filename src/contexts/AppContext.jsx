'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  getCurrentUser, 
  isAuthenticated, 
  login as authLogin, 
  logout as authLogout,
  initializeAuth 
} from '@/utils/auth';
import { notifySuccess, notifyError } from '@/utils/notifications';

// Contexto principal de la aplicación
const AppContext = createContext();

// Hook personalizado para usar el contexto
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp debe ser usado dentro de AppProvider');
  }
  return context;
}

// Proveedor del contexto
export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Inicializar la aplicación
  useEffect(() => {
    const initializeApp = async () => {
      try {
        setIsLoading(true);
        
        // Inicializar sistema de autenticación
        initializeAuth();
        
        // Verificar estado de autenticación
        const authenticated = isAuthenticated();
        setIsAuthenticated(authenticated);
        
        if (authenticated) {
          const currentUser = getCurrentUser();
          setUser(currentUser);
        }
      } catch (error) {
        console.error('Error inicializando la aplicación:', error);
        notifyError('Error de Inicialización', 'No se pudo inicializar la aplicación correctamente');
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  // Función de login
  const login = useCallback(async (username, password) => {
    try {
      setIsLoading(true);
      
      const result = await authLogin(username, password);
      
      if (result.success) {
        setUser(result.user);
        setIsAuthenticated(true);
        notifySuccess('Bienvenido', `Hola ${result.user.name}`);
        return { success: true };
      } else {
        notifyError('Error de Autenticación', result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Error en login:', error);
      notifyError('Error del Sistema', 'Error interno del sistema');
      return { success: false, error: 'Error interno del sistema' };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Función de logout
  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      
      const result = await authLogout();
      
      if (result.success) {
        setUser(null);
        setIsAuthenticated(false);
        notifySuccess('Sesión Cerrada', 'Has cerrado sesión exitosamente');
        return { success: true };
      } else {
        notifyError('Error', 'Error al cerrar sesión');
        return { success: false, error: 'Error al cerrar sesión' };
      }
    } catch (error) {
      console.error('Error en logout:', error);
      notifyError('Error del Sistema', 'Error interno del sistema');
      return { success: false, error: 'Error interno del sistema' };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Función para actualizar usuario
  const updateUser = useCallback((userData) => {
    setUser(prevUser => ({ ...prevUser, ...userData }));
  }, []);

  // Función para agregar notificación
  const addNotification = useCallback((notification) => {
    const id = Date.now();
    const newNotification = { 
      id, 
      ...notification, 
      timestamp: new Date(),
      read: false 
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    
    // Auto-remover después de 5 segundos
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  }, []);

  // Función para marcar notificación como leída
  const markNotificationAsRead = useCallback((notificationId) => {
    setNotifications(prev => 
      prev.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
  }, []);

  // Función para limpiar notificaciones
  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Función para alternar sidebar
  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);

  // Función para cerrar sidebar
  const closeSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  // Valor del contexto
  const value = {
    // Estado
    user,
    isLoading,
    isAuthenticated,
    notifications,
    sidebarOpen,
    
    // Funciones de autenticación
    login,
    logout,
    updateUser,
    
    // Funciones de notificaciones
    addNotification,
    markNotificationAsRead,
    clearNotifications,
    
    // Funciones de UI
    toggleSidebar,
    closeSidebar,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
} 