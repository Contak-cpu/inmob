'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

// Contexto para manejar el modo de prueba
const TestContext = createContext();

// Hook personalizado para usar el contexto
export function useTest() {
  const context = useContext(TestContext);
  if (!context) {
    throw new Error('useTest debe ser usado dentro de TestProvider');
  }
  return context;
}

// Proveedor del contexto
export function TestProvider({ children }) {
  const [isTestMode, setIsTestMode] = useState(false);

  // Cargar estado de test desde localStorage al inicializar
  useEffect(() => {
    const savedTestMode = localStorage.getItem('konrad_test_mode');
    if (savedTestMode !== null) {
      setIsTestMode(JSON.parse(savedTestMode));
    }
  }, []);

  // Guardar estado de test en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('konrad_test_mode', JSON.stringify(isTestMode));
  }, [isTestMode]);

  // Función para alternar modo de prueba
  const toggleTestMode = () => {
    setIsTestMode(prev => !prev);
  };

  // Función para activar modo de prueba
  const enableTestMode = () => {
    setIsTestMode(true);
  };

  // Función para desactivar modo de prueba
  const disableTestMode = () => {
    setIsTestMode(false);
  };

  const value = {
    isTestMode,
    toggleTestMode,
    enableTestMode,
    disableTestMode,
  };

  return (
    <TestContext.Provider value={value}>
      {children}
    </TestContext.Provider>
  );
} 