'use client';

import React from 'react';
import { hasPermission } from '@/utils/auth';
import LoginForm from './LoginForm';
import LoadingScreen from './LoadingScreen';
import { useApp } from '@/contexts/AppContext';

export default function ProtectedRoute({ 
  children, 
  requiredPermission = null, 
  fallback = null,
  showLogin = true 
}) {
  const { isLoading, isAuthenticated, user } = useApp();

  // Mostrar loading mientras se inicializa
  if (isLoading) {
    return <LoadingScreen message="Verificando autenticación..." />;
  }

  // Usuario no autenticado
  if (!isAuthenticated) {
    if (showLogin) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 flex items-center justify-center p-4">
          <LoginForm />
        </div>
      );
    }
    
    return fallback || (
      <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 flex items-center justify-center">
        <div className="text-center">
          <div className="p-4 bg-error-500/10 border border-error-500/20 rounded-xl mb-4">
            <svg className="h-12 w-12 text-error-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Acceso Requerido</h2>
          <p className="text-neutral-400 mb-4">Debes iniciar sesión para acceder a esta sección</p>
          <button
            onClick={() => window.location.href = '/'}
            className="btn-primary"
          >
            Volver al Inicio
          </button>
        </div>
      </div>
    );
  }

  // Usuario autenticado pero sin permisos
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return fallback || (
      <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 flex items-center justify-center">
        <div className="text-center">
          <div className="p-4 bg-warning-500/10 border border-warning-500/20 rounded-xl mb-4">
            <svg className="h-12 w-12 text-warning-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Acceso Denegado</h2>
          <p className="text-neutral-400 mb-4">No tienes permisos para acceder a esta sección</p>
          <div className="flex space-x-3 justify-center">
            <button
              onClick={() => window.location.href = '/'}
              className="btn-secondary"
            >
              Volver al Inicio
            </button>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Usuario autenticado y con permisos
  return <>{children}</>;
}

// Componente de protección específica para contratos
export function ContractRoute({ children }) {
  return (
    <ProtectedRoute requiredPermission="canCreateContracts">
      {children}
    </ProtectedRoute>
  );
}

// Componente de protección específica para recibos
export function ReceiptRoute({ children }) {
  return (
    <ProtectedRoute requiredPermission="canCreateReceipts">
      {children}
    </ProtectedRoute>
  );
}

// Componente de protección específica para historial
export function HistoryRoute({ children }) {
  return (
    <ProtectedRoute requiredPermission="canViewHistory">
      {children}
    </ProtectedRoute>
  );
}

// Componente de protección específica para administración
export function AdminRoute({ children }) {
  return (
    <ProtectedRoute requiredPermission="canManageUsers">
      {children}
    </ProtectedRoute>
  );
}

// Componente de protección específica para dashboard
export function DashboardRoute({ children }) {
  return (
    <ProtectedRoute requiredPermission="canViewDashboard">
      {children}
    </ProtectedRoute>
  );
}

// Componente de protección específica para analytics
export function AnalyticsRoute({ children }) {
  return (
    <ProtectedRoute requiredPermission="canViewAnalytics">
      {children}
    </ProtectedRoute>
  );
} 