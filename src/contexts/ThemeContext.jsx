'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

/**
 * Temas disponibles
 */
export const themes = {
  dark: {
    name: 'Oscuro',
    className: 'dark',
    colors: {
      primary: '#3B82F6',
      secondary: '#6B7280',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#06B6D4',
      background: '#0F0F0F',
      surface: '#1F1F1F',
      text: '#FFFFFF',
      textSecondary: '#9CA3AF'
    }
  },
  light: {
    name: 'Claro',
    className: 'light',
    colors: {
      primary: '#2563EB',
      secondary: '#6B7280',
      success: '#059669',
      warning: '#D97706',
      error: '#DC2626',
      info: '#0891B2',
      background: '#FFFFFF',
      surface: '#F9FAFB',
      text: '#111827',
      textSecondary: '#6B7280'
    }
  },
  blue: {
    name: 'Azul',
    className: 'blue',
    colors: {
      primary: '#1E40AF',
      secondary: '#64748B',
      success: '#047857',
      warning: '#B45309',
      error: '#B91C1C',
      info: '#0E7490',
      background: '#0F172A',
      surface: '#1E293B',
      text: '#F8FAFC',
      textSecondary: '#94A3B8'
    }
  },
  green: {
    name: 'Verde',
    className: 'green',
    colors: {
      primary: '#059669',
      secondary: '#6B7280',
      success: '#047857',
      warning: '#B45309',
      error: '#B91C1C',
      info: '#0E7490',
      background: '#064E3B',
      surface: '#065F46',
      text: '#ECFDF5',
      textSecondary: '#A7F3D0'
    }
  }
};

/**
 * Configuraciones de densidad
 */
export const densities = {
  compact: {
    name: 'Compacto',
    spacing: '0.75rem',
    fontSize: '0.875rem',
    borderRadius: '0.375rem'
  },
  normal: {
    name: 'Normal',
    spacing: '1rem',
    fontSize: '1rem',
    borderRadius: '0.5rem'
  },
  spacious: {
    name: 'Espacioso',
    spacing: '1.25rem',
    fontSize: '1.125rem',
    borderRadius: '0.75rem'
  }
};

/**
 * Configuraciones de animaciones
 */
export const animations = {
  none: {
    name: 'Sin animaciones',
    enabled: false
  },
  subtle: {
    name: 'Sutiles',
    enabled: true,
    duration: '150ms'
  },
  smooth: {
    name: 'Suaves',
    enabled: true,
    duration: '300ms'
  },
  bouncy: {
    name: 'Elásticas',
    enabled: true,
    duration: '500ms'
  }
};

/**
 * Hook para usar el contexto de tema
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme debe usarse dentro de ThemeProvider');
  }
  return context;
}

/**
 * Proveedor del contexto de tema
 */
export function ThemeProvider({ children }) {
  const [currentTheme, setCurrentTheme] = useState('dark');
  const [currentDensity, setCurrentDensity] = useState('normal');
  const [currentAnimation, setCurrentAnimation] = useState('smooth');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showAnimations, setShowAnimations] = useState(true);

  // Cargar configuración guardada
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    const savedDensity = localStorage.getItem('density') || 'normal';
    const savedAnimation = localStorage.getItem('animation') || 'smooth';
    const savedSidebarCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
    const savedShowAnimations = localStorage.getItem('showAnimations') !== 'false';

    setCurrentTheme(savedTheme);
    setCurrentDensity(savedDensity);
    setCurrentAnimation(savedAnimation);
    setSidebarCollapsed(savedSidebarCollapsed);
    setShowAnimations(savedShowAnimations);
  }, []);

  // Aplicar tema al documento
  useEffect(() => {
    const root = document.documentElement;
    
    // Remover clases anteriores
    Object.values(themes).forEach(theme => {
      root.classList.remove(theme.className);
    });

    // Aplicar tema actual
    const theme = themes[currentTheme];
    if (theme) {
      root.classList.add(theme.className);
    }

    // Aplicar variables CSS
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });

    // Aplicar densidad
    const density = densities[currentDensity];
    if (density) {
      root.style.setProperty('--spacing-base', density.spacing);
      root.style.setProperty('--font-size-base', density.fontSize);
      root.style.setProperty('--border-radius-base', density.borderRadius);
    }

    // Aplicar animaciones
    const animation = animations[currentAnimation];
    if (animation) {
      root.style.setProperty('--animation-duration', animation.duration);
      root.style.setProperty('--animation-enabled', animation.enabled ? '1' : '0');
    }

    // Guardar en localStorage
    localStorage.setItem('theme', currentTheme);
    localStorage.setItem('density', currentDensity);
    localStorage.setItem('animation', currentAnimation);
    localStorage.setItem('sidebarCollapsed', sidebarCollapsed);
    localStorage.setItem('showAnimations', showAnimations);
  }, [currentTheme, currentDensity, currentAnimation, sidebarCollapsed, showAnimations]);

  const changeTheme = (themeName) => {
    if (themes[themeName]) {
      setCurrentTheme(themeName);
    }
  };

  const changeDensity = (densityName) => {
    if (densities[densityName]) {
      setCurrentDensity(densityName);
    }
  };

  const changeAnimation = (animationName) => {
    if (animations[animationName]) {
      setCurrentAnimation(animationName);
    }
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const toggleAnimations = () => {
    setShowAnimations(!showAnimations);
  };

  const value = {
    // Estado actual
    currentTheme,
    currentDensity,
    currentAnimation,
    sidebarCollapsed,
    showAnimations,

    // Temas disponibles
    themes,
    densities,
    animations,

    // Funciones
    changeTheme,
    changeDensity,
    changeAnimation,
    toggleSidebar,
    toggleAnimations,

    // Valores actuales
    theme: themes[currentTheme],
    density: densities[currentDensity],
    animation: animations[currentAnimation]
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
} 