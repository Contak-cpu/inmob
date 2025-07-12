'use client';

import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Trash2, 
  X, 
  Check,
  Info
} from 'lucide-react';

/**
 * Componente de diálogo de confirmación
 */
export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirmar Acción',
  message = '¿Estás seguro de que quieres realizar esta acción?',
  type = 'warning', // 'warning', 'danger', 'info'
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  icon: Icon = AlertTriangle
}) {
  if (!isOpen) return null;

  const getTypeConfig = () => {
    switch (type) {
      case 'danger':
        return {
          iconColor: 'text-error-400',
          bgColor: 'bg-error-500/20',
          borderColor: 'border-error-500/30',
          buttonColor: 'bg-error-600 hover:bg-error-700 text-white'
        };
      case 'warning':
        return {
          iconColor: 'text-warning-400',
          bgColor: 'bg-warning-500/20',
          borderColor: 'border-warning-500/30',
          buttonColor: 'bg-warning-600 hover:bg-warning-700 text-white'
        };
      case 'info':
        return {
          iconColor: 'text-info-400',
          bgColor: 'bg-info-500/20',
          borderColor: 'border-info-500/30',
          buttonColor: 'bg-info-600 hover:bg-info-700 text-white'
        };
      default:
        return {
          iconColor: 'text-primary-400',
          bgColor: 'bg-primary-500/20',
          borderColor: 'border-primary-500/30',
          buttonColor: 'bg-primary-600 hover:bg-primary-700 text-white'
        };
    }
  };

  const config = getTypeConfig();

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Dialog */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md bg-neutral-800 border border-neutral-700 rounded-xl shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-neutral-700">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${config.bgColor}`}>
                <Icon className={`h-5 w-5 ${config.iconColor}`} />
              </div>
              <h3 className="text-lg font-semibold text-white">{title}</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-neutral-700 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-neutral-400" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4">
            <p className="text-neutral-300">{message}</p>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 p-4 border-t border-neutral-700">
            <button
              onClick={onClose}
              className="btn-secondary"
            >
              {cancelText}
            </button>
            <button
              onClick={handleConfirm}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${config.buttonColor}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Hook para usar el diálogo de confirmación
 */
export function useConfirmDialog() {
  const [dialogState, setDialogState] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'warning',
    onConfirm: () => {}
  });

  const showConfirm = (options) => {
    setDialogState({
      isOpen: true,
      title: options.title || 'Confirmar Acción',
      message: options.message || '¿Estás seguro?',
      type: options.type || 'warning',
      onConfirm: options.onConfirm || (() => {})
    });
  };

  const hideConfirm = () => {
    setDialogState(prev => ({ ...prev, isOpen: false }));
  };

  const ConfirmDialogComponent = () => (
    <ConfirmDialog
      isOpen={dialogState.isOpen}
      onClose={hideConfirm}
      onConfirm={dialogState.onConfirm}
      title={dialogState.title}
      message={dialogState.message}
      type={dialogState.type}
    />
  );

  return {
    showConfirm,
    hideConfirm,
    ConfirmDialogComponent
  };
} 