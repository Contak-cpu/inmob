'use client';

import React from 'react';
import { useNotifications } from '@/hooks/useNotifications';
import { ToastContainer } from '@/components/ui/Toast';

/**
 * Componente que integra todo el sistema de notificaciones
 * Maneja tanto toasts como notificaciones persistentes
 */
export default function NotificationSystem() {
  const { toasts, removeToast } = useNotifications();

  return (
    <>
      {/* Sistema de Toasts */}
      <ToastContainer 
        notifications={toasts} 
        onRemove={removeToast} 
      />
    </>
  );
} 