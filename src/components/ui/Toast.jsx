'use client';

import React, { useEffect, useState } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Info, 
  X,
  AlertTriangle
} from 'lucide-react';

/**
 * Componente de notificación Toast
 * 
 * @param {Object} props - Props del componente
 * @param {string} props.id - ID único del toast
 * @param {string} props.type - Tipo de toast ('success', 'error', 'warning', 'info')
 * @param {string} props.title - Título del toast
 * @param {string} props.message - Mensaje del toast
 * @param {number} props.duration - Duración en milisegundos (0 = no auto-close)
 * @param {Function} props.onClose - Función llamada al cerrar
 * @param {boolean} props.persistent - Si el toast no se cierra automáticamente
 * @param {React.ReactNode} props.action - Acción adicional (botón, link, etc.)
 * @returns {JSX.Element} Componente toast
 */
export default function Toast({
  id,
  type = 'info',
  title,
  message,
  duration = 5000,
  onClose,
  persistent = false,
  action
}) {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (persistent || duration === 0) return;

    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, persistent]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose?.(id);
    }, 300);
  };

  const getTypeConfig = () => {
    switch (type) {
      case 'success':
        return {
          icon: CheckCircle,
          bgColor: 'bg-success-500/20',
          borderColor: 'border-success-500/30',
          iconColor: 'text-success-400',
          titleColor: 'text-success-100'
        };
      case 'error':
        return {
          icon: XCircle,
          bgColor: 'bg-error-500/20',
          borderColor: 'border-error-500/30',
          iconColor: 'text-error-400',
          titleColor: 'text-error-100'
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          bgColor: 'bg-warning-500/20',
          borderColor: 'border-warning-500/30',
          iconColor: 'text-warning-400',
          titleColor: 'text-warning-100'
        };
      case 'info':
        return {
          icon: Info,
          bgColor: 'bg-info-500/20',
          borderColor: 'border-info-500/30',
          iconColor: 'text-info-400',
          titleColor: 'text-info-100'
        };
      default:
        return {
          icon: Info,
          bgColor: 'bg-neutral-500/20',
          borderColor: 'border-neutral-500/30',
          iconColor: 'text-neutral-400',
          titleColor: 'text-neutral-100'
        };
    }
  };

  const config = getTypeConfig();
  const Icon = config.icon;

  if (!isVisible) return null;

  return (
    <div
      className={`
        relative w-full max-w-sm bg-neutral-800 border rounded-lg shadow-lg
        ${config.bgColor} ${config.borderColor}
        transform transition-all duration-300 ease-in-out
        ${isExiting ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'}
      `}
    >
      <div className="flex items-start p-4">
        <div className="flex-shrink-0">
          <Icon className={`h-5 w-5 ${config.iconColor}`} />
        </div>
        
        <div className="flex-1 ml-3 min-w-0">
          {title && (
            <p className={`text-sm font-medium ${config.titleColor}`}>
              {title}
            </p>
          )}
          {message && (
            <p className="text-sm text-neutral-300 mt-1">
              {message}
            </p>
          )}
          {action && (
            <div className="mt-3">
              {action}
            </div>
          )}
        </div>
        
        <div className="flex-shrink-0 ml-4">
          <button
            onClick={handleClose}
            className="inline-flex text-neutral-400 hover:text-neutral-300 focus:outline-none focus:text-neutral-300 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Hook para manejar notificaciones
 */
export function useNotifications() {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (notification) => {
    const id = Date.now().toString();
    const newNotification = { id, ...notification };
    setNotifications(prev => [...prev, newNotification]);
    return id;
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const success = (title, message, options = {}) => {
    return addNotification({ type: 'success', title, message, ...options });
  };

  const error = (title, message, options = {}) => {
    return addNotification({ type: 'error', title, message, ...options });
  };

  const warning = (title, message, options = {}) => {
    return addNotification({ type: 'warning', title, message, ...options });
  };

  const info = (title, message, options = {}) => {
    return addNotification({ type: 'info', title, message, ...options });
  };

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    success,
    error,
    warning,
    info
  };
}

/**
 * Contenedor de notificaciones
 */
export function ToastContainer({ notifications, onRemove }) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map((notification) => (
        <Toast
          key={notification.id}
          {...notification}
          onClose={onRemove}
        />
      ))}
    </div>
  );
} 