'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Componente reutilizable para botones
 * 
 * @param {Object} props - Props del componente
 * @param {React.ReactNode} props.children - Contenido del botón
 * @param {string} props.variant - Variante del botón ('primary', 'secondary', 'success', 'warning', 'error', 'ghost')
 * @param {string} props.size - Tamaño del botón ('sm', 'md', 'lg')
 * @param {boolean} props.loading - Si el botón está en estado de carga
 * @param {boolean} props.disabled - Si el botón está deshabilitado
 * @param {string} props.className - Clases CSS adicionales
 * @param {Function} props.onClick - Función llamada al hacer click
 * @param {string} props.type - Tipo del botón ('button', 'submit', 'reset')
 * @returns {JSX.Element} Componente botón
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  onClick,
  type = 'button',
  ...props
}) {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-primary-500 hover:bg-primary-600 text-white border-primary-500 hover:border-primary-600';
      case 'secondary':
        return 'bg-neutral-700 hover:bg-neutral-600 text-white border-neutral-600 hover:border-neutral-500';
      case 'success':
        return 'bg-success-500 hover:bg-success-600 text-white border-success-500 hover:border-success-600';
      case 'warning':
        return 'bg-warning-500 hover:bg-warning-600 text-white border-warning-500 hover:border-warning-600';
      case 'error':
        return 'bg-error-500 hover:bg-error-600 text-white border-error-500 hover:border-error-600';
      case 'ghost':
        return 'bg-transparent hover:bg-neutral-700 text-neutral-300 hover:text-white border-neutral-600 hover:border-neutral-500';
      case 'outline':
        return 'bg-transparent hover:bg-primary-500/10 text-primary-400 hover:text-primary-300 border-primary-500 hover:border-primary-400';
      default:
        return 'bg-primary-500 hover:bg-primary-600 text-white border-primary-500 hover:border-primary-600';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-sm';
      case 'md':
        return 'px-4 py-2 text-sm';
      case 'lg':
        return 'px-6 py-3 text-base';
      default:
        return 'px-4 py-2 text-sm';
    }
  };

  const baseClasses = `
    inline-flex items-center justify-center font-medium rounded-lg border
    transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-800
    disabled:opacity-50 disabled:cursor-not-allowed
    ${getVariantClasses()}
    ${getSizeClasses()}
    ${className}
  `.trim();

  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      className={baseClasses}
      disabled={isDisabled}
      onClick={onClick}
      {...props}
    >
      {loading && (
        <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
      )}
      {children}
    </button>
  );
}

/**
 * Componente para botón de icono
 */
export function IconButton({
  icon: Icon,
  variant = 'ghost',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  onClick,
  ...props
}) {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-primary-500 hover:bg-primary-600 text-white';
      case 'secondary':
        return 'bg-neutral-700 hover:bg-neutral-600 text-white';
      case 'success':
        return 'bg-success-500 hover:bg-success-600 text-white';
      case 'warning':
        return 'bg-warning-500 hover:bg-warning-600 text-white';
      case 'error':
        return 'bg-error-500 hover:bg-error-600 text-white';
      case 'ghost':
        return 'bg-transparent hover:bg-neutral-700 text-neutral-400 hover:text-white';
      default:
        return 'bg-transparent hover:bg-neutral-700 text-neutral-400 hover:text-white';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'p-1.5';
      case 'md':
        return 'p-2';
      case 'lg':
        return 'p-3';
      default:
        return 'p-2';
    }
  };

  const baseClasses = `
    inline-flex items-center justify-center rounded-lg
    transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-800
    disabled:opacity-50 disabled:cursor-not-allowed
    ${getVariantClasses()}
    ${getSizeClasses()}
    ${className}
  `.trim();

  const getIconSize = () => {
    switch (size) {
      case 'sm':
        return 'h-4 w-4';
      case 'md':
        return 'h-5 w-5';
      case 'lg':
        return 'h-6 w-6';
      default:
        return 'h-5 w-5';
    }
  };

  const isDisabled = disabled || loading;

  return (
    <button
      className={baseClasses}
      disabled={isDisabled}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <Loader2 className={`animate-spin ${getIconSize()}`} />
      ) : (
        <Icon className={getIconSize()} />
      )}
    </button>
  );
} 