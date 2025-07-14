'use client';

import React, { useEffect } from 'react';
import { TestTube, Eye, EyeOff } from 'lucide-react';
import { useTest } from '@/contexts/TestContext';
import { useNotifications } from '@/hooks/useNotifications';

export default function TestModeToggle() {
  const { isTestMode, toggleTestMode } = useTest();
  const { showSuccess } = useNotifications();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handler = (e) => {
        if (e.key === 'konrad_test_mode') {
          window.location.reload();
        }
      };
      window.addEventListener('storage', handler);
      return () => window.removeEventListener('storage', handler);
    }
  }, []);

  const handleToggle = () => {
    toggleTestMode();
    showSuccess(
      !isTestMode ? 'Modo Test activado' : 'Modo Test desactivado',
      !isTestMode
        ? 'Ahora verás datos de prueba en toda la app.'
        : 'Ahora verás datos reales en toda la app.'
    );
  };

  return (
    <button
      onClick={handleToggle}
      className={`fixed top-4 right-4 z-50 p-3 rounded-full shadow-lg transition-all duration-300 ${
        isTestMode 
          ? 'bg-warning-500 hover:bg-warning-600 text-white' 
          : 'bg-neutral-700 hover:bg-neutral-600 text-neutral-300'
      }`}
      title={isTestMode ? 'Desactivar datos de prueba' : 'Activar datos de prueba'}
    >
      <div className="flex items-center space-x-2">
        <TestTube className="h-4 w-4" />
        {isTestMode ? (
          <>
            <Eye className="h-4 w-4" />
            <span className="text-xs font-medium">TEST ON</span>
          </>
        ) : (
          <>
            <EyeOff className="h-4 w-4" />
            <span className="text-xs font-medium">TEST OFF</span>
          </>
        )}
      </div>
    </button>
  );
} 