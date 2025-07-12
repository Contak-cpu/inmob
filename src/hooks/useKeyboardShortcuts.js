'use client';

import { useEffect, useCallback, useRef } from 'react';
import { X } from 'lucide-react';

/**
 * Hook para manejar atajos de teclado
 */
export function useKeyboardShortcuts(shortcuts = {}) {
  const pressedKeys = useRef(new Set());
  const shortcutsRef = useRef(shortcuts);

  // Actualizar shortcuts cuando cambien
  useEffect(() => {
    shortcutsRef.current = shortcuts;
  }, [shortcuts]);

  const isKeyPressed = useCallback((key) => {
    return pressedKeys.current.has(key.toLowerCase());
  }, []);

  const isCombinationPressed = useCallback((combination) => {
    const keys = combination.toLowerCase().split('+');
    return keys.every(key => isKeyPressed(key.trim()));
  }, [isKeyPressed]);

  const handleKeyDown = useCallback((event) => {
    const key = event.key.toLowerCase();
    pressedKeys.current.add(key);

    // Verificar shortcuts
    Object.entries(shortcutsRef.current).forEach(([combination, callback]) => {
      if (isCombinationPressed(combination)) {
        event.preventDefault();
        callback(event);
      }
    });
  }, [isCombinationPressed]);

  const handleKeyUp = useCallback((event) => {
    const key = event.key.toLowerCase();
    pressedKeys.current.delete(key);
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  return {
    isKeyPressed,
    isCombinationPressed
  };
}

/**
 * Hook para atajos de teclado específicos del sistema
 */
export function useSystemShortcuts() {
  const shortcuts = {
    'ctrl+k': (e) => {
      e.preventDefault();
      // Abrir búsqueda global
      const searchInput = document.querySelector('[data-search-input]');
      if (searchInput) {
        searchInput.focus();
      }
    },
    'ctrl+n': (e) => {
      e.preventDefault();
      // Nuevo contrato
      window.location.href = '/contracts/generate';
    },
    'ctrl+r': (e) => {
      e.preventDefault();
      // Nuevo recibo
      window.location.href = '/receipts';
    },
    'ctrl+u': (e) => {
      e.preventDefault();
      // Gestión de usuarios
      window.location.href = '/users';
    },
    'ctrl+a': (e) => {
      e.preventDefault();
      // Analytics
      window.location.href = '/analytics';
    },
    'ctrl+s': (e) => {
      e.preventDefault();
      // Guardar (en formularios)
      const saveButton = document.querySelector('[data-save-button]');
      if (saveButton) {
        saveButton.click();
      }
    },
    'escape': (e) => {
      // Cerrar modales
      const modals = document.querySelectorAll('[data-modal]');
      modals.forEach(modal => {
        if (modal.style.display !== 'none') {
          const closeButton = modal.querySelector('[data-close-modal]');
          if (closeButton) {
            closeButton.click();
          }
        }
      });
    },
    'ctrl+/': (e) => {
      e.preventDefault();
      // Mostrar ayuda/atajos
      const helpModal = document.querySelector('[data-help-modal]');
      if (helpModal) {
        helpModal.style.display = 'block';
      }
    }
  };

  return useKeyboardShortcuts(shortcuts);
}

/**
 * Hook para atajos de navegación
 */
export function useNavigationShortcuts() {
  const shortcuts = {
    'alt+1': () => window.location.href = '/dashboard',
    'alt+2': () => window.location.href = '/contracts',
    'alt+3': () => window.location.href = '/receipts',
    'alt+4': () => window.location.href = '/analytics',
    'alt+5': () => window.location.href = '/users',
    'alt+6': () => window.location.href = '/history',
    'alt+h': () => window.history.back(),
    'alt+l': () => window.history.forward(),
    'f5': (e) => {
      e.preventDefault();
      window.location.reload();
    }
  };

  return useKeyboardShortcuts(shortcuts);
}

/**
 * Hook para atajos de formularios
 */
export function useFormShortcuts(onSave, onCancel, onReset) {
  const shortcuts = {
    'ctrl+s': (e) => {
      e.preventDefault();
      onSave?.();
    },
    'escape': (e) => {
      onCancel?.();
    },
    'ctrl+r': (e) => {
      e.preventDefault();
      onReset?.();
    }
  };

  return useKeyboardShortcuts(shortcuts);
}

/**
 * Componente para mostrar atajos de teclado
 */
export function KeyboardShortcutsHelp({ isOpen, onClose }) {
  const shortcuts = [
    { key: 'Ctrl + K', description: 'Búsqueda global' },
    { key: 'Ctrl + N', description: 'Nuevo contrato' },
    { key: 'Ctrl + R', description: 'Nuevo recibo' },
    { key: 'Ctrl + U', description: 'Gestión de usuarios' },
    { key: 'Ctrl + A', description: 'Analytics' },
    { key: 'Ctrl + S', description: 'Guardar' },
    { key: 'Escape', description: 'Cerrar modales' },
    { key: 'Ctrl + /', description: 'Mostrar ayuda' },
    { key: 'Alt + 1-6', description: 'Navegación rápida' },
    { key: 'Alt + H/L', description: 'Navegar atrás/adelante' },
    { key: 'F5', description: 'Recargar página' }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md bg-neutral-800 border border-neutral-700 rounded-xl shadow-xl">
          <div className="flex items-center justify-between p-4 border-b border-neutral-700">
            <h3 className="text-lg font-semibold text-white">Atajos de Teclado</h3>
            <button
              onClick={onClose}
              className="p-1 hover:bg-neutral-700 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-neutral-400" />
            </button>
          </div>
          
          <div className="p-4">
            <div className="space-y-3">
              {shortcuts.map((shortcut, index) => (
                <div key={index} className="flex items-center justify-between">
                  <kbd className="px-2 py-1 bg-neutral-700 border border-neutral-600 rounded text-sm font-mono text-white">
                    {shortcut.key}
                  </kbd>
                  <span className="text-sm text-neutral-300">{shortcut.description}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 