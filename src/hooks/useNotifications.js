'use client';

import { useCallback, useState } from 'react';
import { useApp } from '@/contexts/AppContext';

/**
 * Hook personalizado para manejar las notificaciones
 * Proporciona funciones para mostrar diferentes tipos de notificaciones
 */
export function useNotifications() {
  const { 
    notifications, 
    addNotification, 
    markNotificationAsRead, 
    clearNotifications 
  } = useApp();

  // Estado local para toasts
  const [toasts, setToasts] = useState([]);

  // Agregar toast
  const addToast = useCallback((toast) => {
    const id = Date.now().toString();
    const newToast = { id, ...toast };
    setToasts(prev => [...prev, newToast]);
    return id;
  }, []);

  // Remover toast
  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  // Mostrar notificación de éxito
  const showSuccess = useCallback((title, message, options = {}) => {
    const toastId = addToast({
      type: 'success',
      title,
      message,
      duration: 5000,
      ...options
    });
    
    // También agregar al contexto global
    addNotification({
      type: 'success',
      title,
      message,
      icon: 'check-circle'
    });

    return toastId;
  }, [addToast, addNotification]);

  // Mostrar notificación de error
  const showError = useCallback((title, message, options = {}) => {
    const toastId = addToast({
      type: 'error',
      title,
      message,
      duration: 7000, // Errores duran más
      ...options
    });
    
    addNotification({
      type: 'error',
      title,
      message,
      icon: 'alert-circle'
    });

    return toastId;
  }, [addToast, addNotification]);

  // Mostrar notificación de advertencia
  const showWarning = useCallback((title, message, options = {}) => {
    const toastId = addToast({
      type: 'warning',
      title,
      message,
      duration: 6000,
      ...options
    });
    
    addNotification({
      type: 'warning',
      title,
      message,
      icon: 'alert-triangle'
    });

    return toastId;
  }, [addToast, addNotification]);

  // Mostrar notificación de información
  const showInfo = useCallback((title, message, options = {}) => {
    const toastId = addToast({
      type: 'info',
      title,
      message,
      duration: 5000,
      ...options
    });
    
    addNotification({
      type: 'info',
      title,
      message,
      icon: 'info'
    });

    return toastId;
  }, [addToast, addNotification]);

  // Mostrar notificación persistente
  const showPersistent = useCallback((title, message, options = {}) => {
    const toastId = addToast({
      type: 'info',
      title,
      message,
      persistent: true,
      ...options
    });
    
    addNotification({
      type: 'info',
      title,
      message,
      icon: 'info'
    });

    return toastId;
  }, [addToast, addNotification]);

  // Obtener notificaciones no leídas
  const getUnreadNotifications = useCallback(() => {
    return notifications.filter(notification => !notification.read);
  }, [notifications]);

  // Obtener notificaciones por tipo
  const getNotificationsByType = useCallback((type) => {
    return notifications.filter(notification => notification.type === type);
  }, [notifications]);

  // Contar notificaciones no leídas
  const getUnreadCount = useCallback(() => {
    return getUnreadNotifications().length;
  }, [getUnreadNotifications]);

  // Marcar todas las notificaciones como leídas
  const markAllAsRead = useCallback(() => {
    notifications.forEach(notification => {
      if (!notification.read) {
        markNotificationAsRead(notification.id);
      }
    });
  }, [notifications, markNotificationAsRead]);

  // Limpiar todos los toasts
  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  return {
    // Estado
    notifications,
    toasts,
    unreadCount: getUnreadCount(),
    unreadNotifications: getUnreadNotifications(),
    
    // Funciones de notificación
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showPersistent,
    
    // Funciones de gestión
    markNotificationAsRead,
    markAllAsRead,
    removeToast,
    clearToasts,
    clearNotifications,
    
    // Funciones de utilidad
    getNotificationsByType,
  };
} 