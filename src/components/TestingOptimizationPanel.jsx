'use client';

import React, { useState, useEffect } from 'react';
import { runTests } from '../utils/testRunner';
import performanceOptimizer from '../utils/performanceOptimizer';
import accessibilityManager from '../utils/accessibility';

const TestingOptimizationPanel = () => {
  const [activeTab, setActiveTab] = useState('testing');
  const [testResults, setTestResults] = useState(null);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [performanceMetrics, setPerformanceMetrics] = useState(null);
  const [accessibilityReport, setAccessibilityReport] = useState(null);
  const [optimizationStatus, setOptimizationStatus] = useState('idle');

  useEffect(() => {
    // Cargar métricas iniciales
    loadPerformanceMetrics();
    loadAccessibilityReport();
  }, []);

  const loadPerformanceMetrics = () => {
    const metrics = performanceOptimizer.getPerformanceMetrics();
    setPerformanceMetrics(metrics);
  };

  const loadAccessibilityReport = () => {
    const report = accessibilityManager.generateAccessibilityReport();
    setAccessibilityReport(report);
  };

  const runAllTests = async () => {
    setIsRunningTests(true);
    try {
      const results = await runTests();
      setTestResults(results);
    } catch (error) {
      console.error('Error ejecutando tests:', error);
    } finally {
      setIsRunningTests(false);
    }
  };

  const applyOptimizations = () => {
    setOptimizationStatus('running');
    performanceOptimizer.applyOptimizations();
    
    setTimeout(() => {
      loadPerformanceMetrics();
      setOptimizationStatus('completed');
      
      setTimeout(() => {
        setOptimizationStatus('idle');
      }, 3000);
    }, 2000);
  };

  const generateReports = () => {
    const performanceReport = performanceOptimizer.generateReport();
    const accessibilityReport = accessibilityManager.generateAccessibilityReport();
    
    // Crear reporte combinado
    const combinedReport = {
      timestamp: Date.now(),
      performance: performanceReport,
      accessibility: accessibilityReport,
      testResults
    };

    // Descargar reporte
    const blob = new Blob([JSON.stringify(combinedReport, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reporte-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const tabs = [
    { id: 'testing', label: '🧪 Testing', icon: '🧪' },
    { id: 'performance', label: '⚡ Rendimiento', icon: '⚡' },
    { id: 'accessibility', label: '♿ Accesibilidad', icon: '♿' },
    { id: 'reports', label: '📊 Reportes', icon: '📊' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Testing y Optimización
        </h2>
        <div className="flex gap-2">
          <button
            onClick={runAllTests}
            disabled={isRunningTests}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isRunningTests ? 'Ejecutando...' : 'Ejecutar Tests'}
          </button>
          <button
            onClick={applyOptimizations}
            disabled={optimizationStatus === 'running'}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {optimizationStatus === 'running' ? 'Optimizando...' : 'Aplicar Optimizaciones'}
          </button>
          <button
            onClick={generateReports}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Generar Reportes
          </button>
        </div>
      </div>

      {/* Pestañas */}
      <div className="flex border-b border-gray-200 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Contenido de pestañas */}
      <div className="min-h-[400px]">
        {activeTab === 'testing' && (
          <TestingTab
            testResults={testResults}
            isRunningTests={isRunningTests}
            onRunTests={runAllTests}
          />
        )}

        {activeTab === 'performance' && (
          <PerformanceTab
            metrics={performanceMetrics}
            optimizationStatus={optimizationStatus}
            onRefresh={loadPerformanceMetrics}
          />
        )}

        {activeTab === 'accessibility' && (
          <AccessibilityTab
            report={accessibilityReport}
            onRefresh={loadAccessibilityReport}
          />
        )}

        {activeTab === 'reports' && (
          <ReportsTab
            testResults={testResults}
            performanceMetrics={performanceMetrics}
            accessibilityReport={accessibilityReport}
            onGenerateReport={generateReports}
          />
        )}
      </div>
    </div>
  );
};

// Componente de Testing
const TestingTab = ({ testResults, isRunningTests, onRunTests }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Tests Unitarios</h3>
        <button
          onClick={onRunTests}
          disabled={isRunningTests}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isRunningTests ? 'Ejecutando...' : 'Ejecutar Tests'}
        </button>
      </div>

      {isRunningTests && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Ejecutando tests...</span>
        </div>
      )}

      {testResults && (
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-gray-800">
                {testResults.totalTests}
              </div>
              <div className="text-sm text-gray-600">Total Tests</div>
            </div>
            <div className="bg-green-100 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-800">
                {testResults.passedTests}
              </div>
              <div className="text-sm text-green-600">Exitosos</div>
            </div>
            <div className="bg-red-100 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-red-800">
                {testResults.failedTests}
              </div>
              <div className="text-sm text-red-600">Fallidos</div>
            </div>
            <div className="bg-blue-100 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-800">
                {testResults.duration}ms
              </div>
              <div className="text-sm text-blue-600">Duración</div>
            </div>
          </div>

          <div className="text-center">
            <div className={`text-lg font-semibold ${
              testResults.success ? 'text-green-600' : 'text-red-600'
            }`}>
              {testResults.success ? '✅ Todos los tests pasaron' : '❌ Algunos tests fallaron'}
            </div>
            <div className="text-sm text-gray-600 mt-2">
              Tasa de éxito: {((testResults.passedTests / testResults.totalTests) * 100).toFixed(1)}%
            </div>
          </div>
        </div>
      )}

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-semibold text-yellow-800 mb-2">Información de Testing</h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Los tests verifican funcionalidades críticas del sistema</li>
          <li>• Se ejecutan validaciones de seguridad, rendimiento y accesibilidad</li>
          <li>• Los resultados se muestran en tiempo real</li>
          <li>• Se generan reportes detallados de cada test</li>
        </ul>
      </div>
    </div>
  );
};

// Componente de Rendimiento
const PerformanceTab = ({ metrics, optimizationStatus, onRefresh }) => {
  if (!metrics) return <div>Cargando métricas...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Métricas de Rendimiento</h3>
        <button
          onClick={onRefresh}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
        >
          Actualizar
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 p-6 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-4">Carga de Página</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Tiempo promedio:</span>
              <span className="font-semibold">{metrics.averagePageLoad?.toFixed(2)}ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Cargas registradas:</span>
              <span className="font-semibold">{metrics.pageLoads}</span>
            </div>
          </div>
        </div>

        <div className="bg-green-50 p-6 rounded-lg">
          <h4 className="font-semibold text-green-800 mb-4">API Calls</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Tiempo promedio:</span>
              <span className="font-semibold">{metrics.averageApiCall?.toFixed(2)}ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Llamadas registradas:</span>
              <span className="font-semibold">{metrics.apiCalls}</span>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 p-6 rounded-lg">
          <h4 className="font-semibold text-purple-800 mb-4">Memoria</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Uso actual:</span>
              <span className="font-semibold">
                {metrics.memoryUsage?.percentage?.toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Optimizaciones:</span>
              <span className="font-semibold">{metrics.optimizations}</span>
            </div>
          </div>
        </div>
      </div>

      {optimizationStatus === 'completed' && (
        <div className="bg-green-100 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <span className="text-green-800">✅ Optimizaciones aplicadas exitosamente</span>
          </div>
        </div>
      )}

      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold text-gray-800 mb-2">Recomendaciones</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          {metrics.averagePageLoad > 3000 && (
            <li>• Considerar optimizar el tiempo de carga de página</li>
          )}
          {metrics.averageApiCall > 2000 && (
            <li>• Optimizar llamadas a API para mejor rendimiento</li>
          )}
          {metrics.memoryUsage?.percentage > 80 && (
            <li>• Monitorear uso de memoria y aplicar optimizaciones</li>
          )}
        </ul>
      </div>
    </div>
  );
};

// Componente de Accesibilidad
const AccessibilityTab = ({ report, onRefresh }) => {
  if (!report) return <div>Cargando reporte...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Reporte de Accesibilidad</h3>
        <button
          onClick={onRefresh}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
        >
          Actualizar
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50 p-6 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-4">Elementos Enfocables</h4>
          <div className="text-2xl font-bold text-blue-600">
            {report.focusableElements}
          </div>
          <div className="text-sm text-blue-600">Elementos navegables por teclado</div>
        </div>

        <div className="bg-green-50 p-6 rounded-lg">
          <h4 className="font-semibold text-green-800 mb-4">Landmarks</h4>
          <div className="space-y-2">
            {Object.entries(report.landmarks).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="text-sm text-gray-600 capitalize">{key}:</span>
                <span className="font-semibold">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-red-50 p-6 rounded-lg">
        <h4 className="font-semibold text-red-800 mb-4">Problemas Detectados</h4>
        {report.issues.length === 0 ? (
          <div className="text-green-600">✅ No se detectaron problemas de accesibilidad</div>
        ) : (
          <div className="space-y-2">
            {report.issues.map((issue, index) => (
              <div key={index} className="flex items-start">
                <span className={`inline-block w-3 h-3 rounded-full mt-1 mr-2 ${
                  issue.type === 'error' ? 'bg-red-500' : 'bg-yellow-500'
                }`}></span>
                <div>
                  <div className="font-medium">{issue.message}</div>
                  <div className="text-sm text-gray-600">
                    {issue.elements?.length || 0} elementos afectados
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-semibold text-yellow-800 mb-2">Recomendaciones</h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          {report.recommendations.map((rec, index) => (
            <li key={index}>• {rec.message}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// Componente de Reportes
const ReportsTab = ({ testResults, performanceMetrics, accessibilityReport, onGenerateReport }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Generación de Reportes</h3>
        <button
          onClick={onGenerateReport}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          Generar Reporte Completo
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 p-6 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-4">Tests</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Estado:</span>
              <span className={`font-semibold ${
                testResults?.success ? 'text-green-600' : 'text-red-600'
              }`}>
                {testResults ? (testResults.success ? 'Completado' : 'Fallido') : 'No ejecutado'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Tests:</span>
              <span className="font-semibold">{testResults?.totalTests || 0}</span>
            </div>
          </div>
        </div>

        <div className="bg-green-50 p-6 rounded-lg">
          <h4 className="font-semibold text-green-800 mb-4">Rendimiento</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Estado:</span>
              <span className="font-semibold text-green-600">Monitoreando</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Métricas:</span>
              <span className="font-semibold">{performanceMetrics ? 'Disponibles' : 'No disponibles'}</span>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 p-6 rounded-lg">
          <h4 className="font-semibold text-purple-800 mb-4">Accesibilidad</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Estado:</span>
              <span className="font-semibold text-purple-600">Verificado</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Problemas:</span>
              <span className="font-semibold">{accessibilityReport?.issues?.length || 0}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold text-gray-800 mb-2">Información del Reporte</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• El reporte incluye resultados de tests, métricas de rendimiento y accesibilidad</li>
          <li>• Se genera en formato JSON para fácil análisis</li>
          <li>• Incluye recomendaciones y sugerencias de mejora</li>
          <li>• Se puede descargar y compartir con el equipo</li>
        </ul>
      </div>
    </div>
  );
};

export default TestingOptimizationPanel; 