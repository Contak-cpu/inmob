'use client';

import React, { useState } from 'react';
import { AlertTriangle, AlertCircle, Info, CheckCircle } from 'lucide-react';
import Modal from './Modal';
import Button from './Button';

/**
 * Componente de diálogo de confirmación
 * 
 * @param {Object} props - Props del componente
 * @param {boolean} props.isOpen - Si el diálogo está abierto
 * @param {Function} props.onClose - Función para cerrar el diálogo
 * @param {string} props.title - Título del diálogo
 * @param {string} props.message - Mensaje del diálogo
 * @param {string} props.type - Tipo de confirmación ('warning', 'danger', 'info', 'success')
 * @param {string} props.confirmText - Texto del botón de confirmar
 * @param {string} props.cancelText - Texto del botón de cancelar
 * @param {Function} props.onConfirm - Función llamada al confirmar
 * @param {boolean} props.loading - Si está en estado de carga
 * @param {React.ReactNode} props.children - Contenido adicional
 * @returns {JSX.Element} Componente de confirmación
 */
export default function ConfirmDialog({
  isOpen,
  onClose,
  title,
  message,
  type = 'warning',
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  onConfirm,
  loading = false,
  children
}) {
  const getTypeConfig = () => {
    switch (type) {
      case 'danger':
        return {
          icon: AlertTriangle,
          iconColor: 'text-error-400',
          bgColor: 'bg-error-500/20',
          confirmVariant: 'error'
        };
      case 'warning':
        return {
          icon: AlertCircle,
          iconColor: 'text-warning-400',
          bgColor: 'bg-warning-500/20',
          confirmVariant: 'warning'
        };
      case 'info':
        return {
          icon: Info,
          iconColor: 'text-info-400',
          bgColor: 'bg-info-500/20',
          confirmVariant: 'primary'
        };
      case 'success':
        return {
          icon: CheckCircle,
          iconColor: 'text-success-400',
          bgColor: 'bg-success-500/20',
          confirmVariant: 'success'
        };
      default:
        return {
          icon: AlertCircle,
          iconColor: 'text-warning-400',
          bgColor: 'bg-warning-500/20',
          confirmVariant: 'warning'
        };
    }
  };

  const config = getTypeConfig();
  const Icon = config.icon;

  const handleConfirm = () => {
    onConfirm?.();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      showCloseButton={false}
    >
      <div className="text-center">
        {/* Icono */}
        <div className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full ${config.bgColor} mb-4`}>
          <Icon className={`h-6 w-6 ${config.iconColor}`} />
        </div>

        {/* Título */}
        {title && (
          <h3 className="text-lg font-medium text-white mb-2">
            {title}
          </h3>
        )}

        {/* Mensaje */}
        {message && (
          <p className="text-sm text-neutral-300 mb-6">
            {message}
          </p>
        )}

        {/* Contenido adicional */}
        {children && (
          <div className="mb-6">
            {children}
          </div>
        )}

        {/* Botones */}
        <div className="flex items-center justify-center space-x-3">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={loading}
          >
            {cancelText}
          </Button>
          <Button
            variant={config.confirmVariant}
            onClick={handleConfirm}
            loading={loading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

/**
 * Hook para manejar confirmaciones
 */
export function useConfirm() {
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'warning',
    onConfirm: null,
    confirmText: 'Confirmar',
    cancelText: 'Cancelar'
  });

  const confirm = (options) => {
    return new Promise((resolve) => {
      setConfirmState({
        isOpen: true,
        onConfirm: () => resolve(true),
        ...options
      });
    });
  };

  const closeConfirm = () => {
    setConfirmState(prev => ({ ...prev, isOpen: false }));
  };

  const ConfirmDialogComponent = () => (
    <ConfirmDialog
      {...confirmState}
      onClose={closeConfirm}
    />
  );

  return {
    confirm,
    ConfirmDialogComponent
  };
} 