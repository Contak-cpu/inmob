'use client';

import React, { useState } from 'react';
import { 
  Settings, 
  Palette, 
  Type, 
  Zap, 
  X,
  Check,
  Monitor,
  Smartphone,
  Tablet
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

/**
 * Modal de configuración de temas
 */
export default function ThemeSettings({ isOpen, onClose }) {
  const {
    currentTheme,
    currentDensity,
    currentAnimation,
    showAnimations,
    themes,
    densities,
    animations,
    changeTheme,
    changeDensity,
    changeAnimation,
    toggleAnimations
  } = useTheme();

  const [activeTab, setActiveTab] = useState('theme');

  if (!isOpen) return null;

  const tabs = [
    { id: 'theme', label: 'Tema', icon: Palette },
    { id: 'density', label: 'Densidad', icon: Type },
    { id: 'animations', label: 'Animaciones', icon: Zap }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-2xl bg-neutral-800 border border-neutral-700 rounded-xl shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-neutral-700">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary-500/20 rounded-lg">
                <Settings className="h-5 w-5 text-primary-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Configuración</h3>
                <p className="text-sm text-neutral-400">Personaliza la apariencia del sistema</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-neutral-700 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-neutral-400" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-neutral-700">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'text-primary-400 border-b-2 border-primary-400'
                      : 'text-neutral-400 hover:text-neutral-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Content */}
          <div className="p-6">
            {activeTab === 'theme' && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-medium text-white mb-4">Tema de Color</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(themes).map(([key, theme]) => (
                      <button
                        key={key}
                        onClick={() => changeTheme(key)}
                        className={`relative p-4 rounded-lg border-2 transition-all ${
                          currentTheme === key
                            ? 'border-primary-500 bg-primary-500/10'
                            : 'border-neutral-600 hover:border-neutral-500'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-6 h-6 rounded-full"
                            style={{ backgroundColor: theme.colors.primary }}
                          />
                          <div className="flex-1 text-left">
                            <p className="font-medium text-white">{theme.name}</p>
                            <p className="text-xs text-neutral-400">Tema {theme.name.toLowerCase()}</p>
                          </div>
                          {currentTheme === key && (
                            <Check className="h-5 w-5 text-primary-400" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-medium text-white mb-4">Vista Previa</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-neutral-700 rounded-lg">
                      <div className="flex items-center space-x-2 mb-3">
                        <Monitor className="h-4 w-4 text-neutral-400" />
                        <span className="text-sm text-neutral-400">Desktop</span>
                      </div>
                      <div className="space-y-2">
                        <div className="h-2 bg-primary-500 rounded"></div>
                        <div className="h-2 bg-neutral-600 rounded"></div>
                        <div className="h-2 bg-success-500 rounded"></div>
                      </div>
                    </div>
                    <div className="p-4 bg-neutral-700 rounded-lg">
                      <div className="flex items-center space-x-2 mb-3">
                        <Tablet className="h-4 w-4 text-neutral-400" />
                        <span className="text-sm text-neutral-400">Tablet</span>
                      </div>
                      <div className="space-y-2">
                        <div className="h-2 bg-primary-500 rounded"></div>
                        <div className="h-2 bg-neutral-600 rounded"></div>
                        <div className="h-2 bg-warning-500 rounded"></div>
                      </div>
                    </div>
                    <div className="p-4 bg-neutral-700 rounded-lg">
                      <div className="flex items-center space-x-2 mb-3">
                        <Smartphone className="h-4 w-4 text-neutral-400" />
                        <span className="text-sm text-neutral-400">Móvil</span>
                      </div>
                      <div className="space-y-2">
                        <div className="h-2 bg-primary-500 rounded"></div>
                        <div className="h-2 bg-neutral-600 rounded"></div>
                        <div className="h-2 bg-error-500 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'density' && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-medium text-white mb-4">Densidad de Interfaz</h4>
                  <div className="space-y-4">
                    {Object.entries(densities).map(([key, density]) => (
                      <button
                        key={key}
                        onClick={() => changeDensity(key)}
                        className={`w-full p-4 rounded-lg border-2 transition-all ${
                          currentDensity === key
                            ? 'border-primary-500 bg-primary-500/10'
                            : 'border-neutral-600 hover:border-neutral-500'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="text-left">
                            <p className="font-medium text-white">{density.name}</p>
                            <p className="text-sm text-neutral-400">
                              Espaciado: {density.spacing} • Tamaño: {density.fontSize}
                            </p>
                          </div>
                          {currentDensity === key && (
                            <Check className="h-5 w-5 text-primary-400" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-medium text-white mb-4">Ejemplo de Densidad</h4>
                  <div className="p-4 bg-neutral-700 rounded-lg">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary-500 rounded"></div>
                        <div className="flex-1">
                          <div className="h-3 bg-neutral-600 rounded mb-1"></div>
                          <div className="h-2 bg-neutral-600 rounded w-2/3"></div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-success-500 rounded"></div>
                        <div className="flex-1">
                          <div className="h-3 bg-neutral-600 rounded mb-1"></div>
                          <div className="h-2 bg-neutral-600 rounded w-1/2"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'animations' && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-medium text-white mb-4">Configuración de Animaciones</h4>
                  <div className="space-y-4">
                    {Object.entries(animations).map(([key, animation]) => (
                      <button
                        key={key}
                        onClick={() => changeAnimation(key)}
                        className={`w-full p-4 rounded-lg border-2 transition-all ${
                          currentAnimation === key
                            ? 'border-primary-500 bg-primary-500/10'
                            : 'border-neutral-600 hover:border-neutral-500'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="text-left">
                            <p className="font-medium text-white">{animation.name}</p>
                            <p className="text-sm text-neutral-400">
                              Duración: {animation.duration || 'N/A'}
                            </p>
                          </div>
                          {currentAnimation === key && (
                            <Check className="h-5 w-5 text-primary-400" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-medium text-white mb-4">Opciones Adicionales</h4>
                  <div className="space-y-4">
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={showAnimations}
                        onChange={toggleAnimations}
                        className="rounded border-neutral-600 bg-neutral-700 text-primary-500 focus:ring-primary-500"
                      />
                      <div>
                        <p className="font-medium text-white">Mostrar animaciones</p>
                        <p className="text-sm text-neutral-400">
                          Habilita o deshabilita todas las animaciones del sistema
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-medium text-white mb-4">Vista Previa</h4>
                  <div className="p-4 bg-neutral-700 rounded-lg">
                    <div className="space-y-3">
                      <div className="h-8 bg-primary-500 rounded animate-pulse"></div>
                      <div className="h-6 bg-neutral-600 rounded animate-pulse"></div>
                      <div className="h-4 bg-neutral-600 rounded animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 p-4 border-t border-neutral-700">
            <button
              onClick={onClose}
              className="btn-secondary"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 