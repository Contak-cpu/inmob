'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

/**
 * Componente reutilizable para modales
 * 
 * @param {Object} props - Props del componente
 * @param {boolean} props.isOpen - Si el modal está abierto
 * @param {Function} props.onClose - Función para cerrar el modal
 * @param {string} props.title - Título del modal
 * @param {React.ReactNode} props.children - Contenido del modal
 * @param {string} props.size - Tamaño del modal ('sm', 'md', 'lg', 'xl', 'full')
 * @param {boolean} props.closeOnOverlay - Si se cierra al hacer click en el overlay
 * @param {boolean} props.showCloseButton - Si mostrar el botón de cerrar
 * @param {string} props.className - Clases CSS adicionales
 * @returns {JSX.Element} Componente modal
 */
export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  closeOnOverlay = true,
  showCloseButton = true,
  className = ''
}) {
  // Cerrar modal con Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Obtener clases de tamaño
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'max-w-sm';
      case 'md':
        return 'max-w-md';
      case 'lg':
        return 'max-w-lg';
      case 'xl':
        return 'max-w-xl';
      case '2xl':
        return 'max-w-2xl';
      case '3xl':
        return 'max-w-3xl';
      case '4xl':
        return 'max-w-4xl';
      case '5xl':
        return 'max-w-5xl';
      case '6xl':
        return 'max-w-6xl';
      case '7xl':
        return 'max-w-7xl';
      case 'full':
        return 'max-w-full mx-4';
      default:
        return 'max-w-md';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={closeOnOverlay ? onClose : undefined}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className={`relative w-full ${getSizeClasses()} bg-neutral-800 rounded-xl shadow-2xl border border-neutral-700 ${className}`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between p-6 border-b border-neutral-700">
              {title && (
                <h2 className="text-xl font-semibold text-white">{title}</h2>
              )}
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-neutral-700 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-neutral-400" />
                </button>
              )}
            </div>
          )}

          {/* Content */}
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Componente para el footer del modal
 */
export function ModalFooter({ children, className = '' }) {
  return (
    <div className={`flex items-center justify-end space-x-3 pt-6 border-t border-neutral-700 ${className}`}>
      {children}
    </div>
  );
}

/**
 * Componente para el header del modal
 */
export function ModalHeader({ title, onClose, className = '' }) {
  return (
    <div className={`flex items-center justify-between ${className}`}>
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      {onClose && (
        <button
          onClick={onClose}
          className="p-2 hover:bg-neutral-700 rounded-lg transition-colors"
        >
          <X className="h-5 w-5 text-neutral-400" />
        </button>
      )}
    </div>
  );
} 