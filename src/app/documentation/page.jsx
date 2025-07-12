'use client';

import React, { useState } from 'react';
import { BookOpen, HelpCircle, Search, Download, Eye, TrendingUp } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import DocumentationHelpPanel from '@/components/DocumentationHelpPanel';
import { useDocumentationHelp } from '@/hooks/useDocumentationHelp';

export default function DocumentationPage() {
  const [showQuickHelp, setShowQuickHelp] = useState(false);
  const {
    currentContext,
    readingProgress,
    getUsageStats,
    getRecommendations,
    downloadCompleteReport
  } = useDocumentationHelp();

  const usageStats = getUsageStats();
  const recommendations = getRecommendations();

  const quickHelpItems = [
    {
      title: 'Crear Contrato',
      description: 'Generar un nuevo contrato de alquiler o venta',
      icon: '📄',
      action: 'Ver guía'
    },
    {
      title: 'Generar Recibo',
      description: 'Crear recibos automáticos o manuales',
      icon: '🧾',
      action: 'Ver guía'
    },
    {
      title: 'Gestionar Usuarios',
      description: 'Administrar usuarios y permisos del sistema',
      icon: '👥',
      action: 'Ver guía'
    },
    {
      title: 'Exportar Datos',
      description: 'Exportar información en diferentes formatos',
      icon: '📊',
      action: 'Ver guía'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Breadcrumbs />
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">Documentación y Ayuda</h1>
            <p className="text-neutral-400">
              Guías completas y ayuda contextual del sistema
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowQuickHelp(!showQuickHelp)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <HelpCircle className="h-5 w-5 mr-2" />
              Ayuda Rápida
            </button>
            <button
              onClick={downloadCompleteReport}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="h-5 w-5 mr-2" />
              Exportar
            </button>
          </div>
        </div>
      </div>

      {/* Estadísticas de uso */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center space-x-3">
            <BookOpen className="h-8 w-8 text-blue-400" />
            <div>
              <div className="text-2xl font-bold text-white">{readingProgress?.readCount || 0}</div>
              <div className="text-sm text-neutral-400">Secciones leídas</div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-3">
            <HelpCircle className="h-8 w-8 text-green-400" />
            <div>
              <div className="text-2xl font-bold text-white">{usageStats.totalHelpVisits}</div>
              <div className="text-sm text-neutral-400">Visitas a ayuda</div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-3">
            <TrendingUp className="h-8 w-8 text-purple-400" />
            <div>
              <div className="text-2xl font-bold text-white">{readingProgress?.percentage || 0}%</div>
              <div className="text-sm text-neutral-400">Progreso de lectura</div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-3">
            <Eye className="h-8 w-8 text-orange-400" />
            <div>
              <div className="text-2xl font-bold text-white">{usageStats.mostVisitedHelp.length}</div>
              <div className="text-sm text-neutral-400">Secciones populares</div>
            </div>
          </div>
        </div>
      </div>

      {/* Ayuda rápida */}
      {showQuickHelp && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Ayuda Rápida</h3>
            <button
              onClick={() => setShowQuickHelp(false)}
              className="text-neutral-400 hover:text-white"
            >
              ✕
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickHelpItems.map((item, index) => (
              <div key={index} className="p-4 bg-neutral-700/30 rounded-lg">
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-2xl">{item.icon}</span>
                  <h4 className="font-semibold text-white">{item.title}</h4>
                </div>
                <p className="text-sm text-neutral-400 mb-3">{item.description}</p>
                <button className="text-sm text-blue-400 hover:text-blue-300">
                  {item.action}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recomendaciones */}
      {recommendations.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-white mb-4">Recomendaciones</h3>
          <div className="space-y-3">
            {recommendations.map((rec, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-neutral-700/30 rounded-lg">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  rec.priority === 'high' ? 'bg-red-400' :
                  rec.priority === 'medium' ? 'bg-yellow-400' :
                  'bg-blue-400'
                }`}></div>
                <div>
                  <p className="text-sm text-white">{rec.message}</p>
                  <p className="text-xs text-neutral-400 mt-1">
                    Basado en tu uso del sistema
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Panel principal de documentación */}
      <DocumentationHelpPanel />

      {/* Información adicional */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Contexto Actual</h3>
            <BookOpen className="h-5 w-5 text-neutral-400" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <span className="text-lg">{currentContext?.icon || '📄'}</span>
              <div>
                <div className="font-medium text-white">{currentContext?.title}</div>
                <div className="text-sm text-neutral-400">{currentContext?.description}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Actividad Reciente</h3>
            <TrendingUp className="h-5 w-5 text-neutral-400" />
          </div>
          <div className="space-y-3">
            {usageStats.recentActivity.slice(0, 3).map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 p-2 bg-neutral-700/30 rounded-lg">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <div className="flex-1">
                  <div className="text-sm text-white">{activity.context}</div>
                  <div className="text-xs text-neutral-400">
                    {new Date(activity.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 