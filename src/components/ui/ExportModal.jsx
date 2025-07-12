'use client';

import React, { useState } from 'react';
import { 
  Download, 
  FileText, 
  FileSpreadsheet, 
  FileJson, 
  FilePdf,
  X,
  CheckCircle,
  AlertCircle,
  Loader,
  Info
} from 'lucide-react';
import { 
  exportContracts, 
  exportReceipts, 
  exportStats, 
  exportHistory 
} from '@/utils/exportUtils';
import { useNotifications } from '@/hooks/useNotifications';

/**
 * Modal para exportación avanzada
 */
export default function ExportModal({
  isOpen,
  onClose,
  dataType = 'contracts' // 'contracts', 'receipts', 'stats', 'history'
}) {
  const [selectedFormat, setSelectedFormat] = useState('csv');
  const [isExporting, setIsExporting] = useState(false);
  const { showSuccess, showError } = useNotifications();

  const exportOptions = [
    { 
      value: 'csv', 
      label: 'CSV', 
      icon: FileText, 
      description: 'Formato de texto separado por comas',
      color: 'text-blue-400'
    },
    { 
      value: 'excel', 
      label: 'Excel', 
      icon: FileSpreadsheet, 
      description: 'Formato de hoja de cálculo',
      color: 'text-green-400'
    },
    { 
      value: 'json', 
      label: 'JSON', 
      icon: FileJson, 
      description: 'Formato de datos estructurados',
      color: 'text-yellow-400'
    },
    { 
      value: 'pdf', 
      label: 'PDF', 
      icon: FilePdf, 
      description: 'Documento portable',
      color: 'text-red-400'
    }
  ];

  const dataTypeConfig = {
    contracts: {
      title: 'Exportar Contratos',
      description: 'Exporta todos los contratos del sistema',
      exportFunction: exportContracts
    },
    receipts: {
      title: 'Exportar Recibos',
      description: 'Exporta todos los recibos generados',
      exportFunction: exportReceipts
    },
    stats: {
      title: 'Exportar Estadísticas',
      description: 'Exporta estadísticas del sistema',
      exportFunction: exportStats
    },
    history: {
      title: 'Exportar Historial',
      description: 'Exporta todo el historial de actividad',
      exportFunction: exportHistory
    }
  };

  const config = dataTypeConfig[dataType];

  const handleExport = async () => {
    if (!config) return;

    setIsExporting(true);
    
    try {
      const result = await config.exportFunction(selectedFormat);
      
      if (result.success) {
        showSuccess(
          'Exportación Exitosa', 
          `Archivo ${result.filename} descargado correctamente`
        );
        onClose();
      } else {
        showError('Error de Exportación', result.error || 'No se pudo exportar el archivo');
      }
    } catch (error) {
      showError('Error de Exportación', 'Ocurrió un error inesperado');
      console.error('Error en exportación:', error);
    } finally {
      setIsExporting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md bg-neutral-800 border border-neutral-700 rounded-xl shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-neutral-700">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary-500/20 rounded-lg">
                <Download className="h-5 w-5 text-primary-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">{config.title}</h3>
                <p className="text-sm text-neutral-400">{config.description}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-neutral-700 rounded-lg transition-colors"
              disabled={isExporting}
            >
              <X className="h-5 w-5 text-neutral-400" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4">
            <div className="space-y-4">
              {/* Formato de exportación */}
              <div>
                <label className="block text-sm font-medium text-white mb-3">
                  Selecciona el formato de exportación:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {exportOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <button
                        key={option.value}
                        onClick={() => setSelectedFormat(option.value)}
                        disabled={isExporting}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          selectedFormat === option.value
                            ? 'border-primary-500 bg-primary-500/10'
                            : 'border-neutral-600 hover:border-neutral-500'
                        } ${isExporting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        <div className="flex items-center space-x-2">
                          <Icon className={`h-4 w-4 ${option.color}`} />
                          <span className="text-sm font-medium text-white">
                            {option.label}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-400 mt-1 text-left">
                          {option.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Información adicional */}
              <div className="bg-neutral-700/30 rounded-lg p-3">
                <div className="flex items-start space-x-2">
                  <Info className="h-4 w-4 text-info-400 mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-neutral-300">
                    <p className="font-medium mb-1">Información de exportación:</p>
                    <ul className="space-y-1">
                      <li>• Los datos se exportarán con la fecha actual</li>
                      <li>• El archivo se descargará automáticamente</li>
                      <li>• Se incluirán todos los registros disponibles</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 p-4 border-t border-neutral-700">
            <button
              onClick={onClose}
              className="btn-secondary"
              disabled={isExporting}
            >
              Cancelar
            </button>
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="btn-primary flex items-center space-x-2"
            >
              {isExporting ? (
                <>
                  <Loader className="h-4 w-4 animate-spin" />
                  <span>Exportando...</span>
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  <span>Exportar</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 