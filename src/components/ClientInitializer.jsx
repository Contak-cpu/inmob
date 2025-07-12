"use client";

import { useEffect } from 'react';
import { initializeNotifications } from '@/utils/notifications';
import { initializeAuth } from '@/utils/auth';

export default function ClientInitializer() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      initializeNotifications();
      initializeAuth();
    }
  }, []);

  // Este componente no renderiza nada visible
  return null;
} 