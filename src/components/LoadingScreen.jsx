'use client';

import React from 'react';
import { Building } from 'lucide-react';

export default function LoadingScreen({ message = 'Cargando...' }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 flex items-center justify-center">
      <div className="text-center">
        <div className="mb-6">
          <Building className="h-16 w-16 text-primary-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">
            Konrad Inmobiliaria
          </h2>
          <p className="text-neutral-400">Sistema de Gestión</p>
        </div>
        
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-400 mx-auto mb-4"></div>
        <p className="text-white text-lg">{message}</p>
        
        <div className="mt-6 space-y-2">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-primary-400 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-primary-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-primary-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
} 