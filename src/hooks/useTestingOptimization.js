import { useState, useEffect, useCallback } from 'react';
import { runTests } from '../utils/testRunner';
import performanceOptimizer from '../utils/performanceOptimizer';
import accessibilityManager from '../utils/accessibility';

export const useTestingOptimization = () => {
  const [testResults, setTestResults] = useState(null);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [performanceMetrics, setPerformanceMetrics] = useState(null);
  const [accessibilityReport, setAccessibilityReport] = useState(null);
  const [optimizationStatus, setOptimizationStatus] = useState('idle');
  const [autoRefresh, setAutoRefresh] = useState(false);

  // Cargar métricas iniciales
  useEffect(() => {
    loadPerformanceMetrics();
    loadAccessibilityReport();
  }, []);

  // Auto-refresh si está habilitado
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      loadPerformanceMetrics();
      loadAccessibilityReport();
    }, 30000); // Actualizar cada 30 segundos

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const loadPerformanceMetrics = useCallback(() => {
    try {
      const metrics = performanceOptimizer.getPerformanceMetrics();
      setPerformanceMetrics(metrics);
    } catch (error) {
      console.error('Error cargando métricas de rendimiento:', error);
    }
  }, []);

  const loadAccessibilityReport = useCallback(() => {
    try {
      const report = accessibilityManager.generateAccessibilityReport();
      setAccessibilityReport(report);
    } catch (error) {
      console.error('Error cargando reporte de accesibilidad:', error);
    }
  }, []);

  const runAllTests = useCallback(async () => {
    setIsRunningTests(true);
    try {
      const results = await runTests();
      setTestResults(results);
      return results;
    } catch (error) {
      console.error('Error ejecutando tests:', error);
      throw error;
    } finally {
      setIsRunningTests(false);
    }
  }, []);

  const applyOptimizations = useCallback(() => {
    setOptimizationStatus('running');
    
    try {
      performanceOptimizer.applyOptimizations();
      
      setTimeout(() => {
        loadPerformanceMetrics();
        setOptimizationStatus('completed');
        
        setTimeout(() => {
          setOptimizationStatus('idle');
        }, 3000);
      }, 2000);
    } catch (error) {
      console.error('Error aplicando optimizaciones:', error);
      setOptimizationStatus('error');
    }
  }, [loadPerformanceMetrics]);

  const generateReports = useCallback(() => {
    try {
      const performanceReport = performanceOptimizer.generateReport();
      const accessibilityReport = accessibilityManager.generateAccessibilityReport();
      
      const combinedReport = {
        timestamp: Date.now(),
        performance: performanceReport,
        accessibility: accessibilityReport,
        testResults,
        summary: {
          testsPassed: testResults?.passedTests || 0,
          testsFailed: testResults?.failedTests || 0,
          performanceScore: calculatePerformanceScore(performanceMetrics),
          accessibilityScore: calculateAccessibilityScore(accessibilityReport),
          recommendations: generateRecommendations()
        }
      };

      return combinedReport;
    } catch (error) {
      console.error('Error generando reportes:', error);
      throw error;
    }
  }, [testResults, performanceMetrics, accessibilityReport]);

  const downloadReport = useCallback(() => {
    try {
      const report = generateReports();
      const blob = new Blob([JSON.stringify(report, null, 2)], {
        type: 'application/json'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reporte-testing-optimizacion-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error descargando reporte:', error);
      throw error;
    }
  }, [generateReports]);

  const calculatePerformanceScore = useCallback((metrics) => {
    if (!metrics) return 0;
    
    let score = 100;
    
    // Penalizar por tiempo de carga alto
    if (metrics.averagePageLoad > 3000) {
      score -= 20;
    } else if (metrics.averagePageLoad > 2000) {
      score -= 10;
    }
    
    // Penalizar por llamadas API lentas
    if (metrics.averageApiCall > 2000) {
      score -= 15;
    } else if (metrics.averageApiCall > 1000) {
      score -= 5;
    }
    
    // Penalizar por uso de memoria alto
    if (metrics.memoryUsage?.percentage > 80) {
      score -= 20;
    } else if (metrics.memoryUsage?.percentage > 60) {
      score -= 10;
    }
    
    // Penalizar por errores
    if (metrics.errorRate > 5) {
      score -= 25;
    } else if (metrics.errorRate > 1) {
      score -= 10;
    }
    
    return Math.max(0, score);
  }, []);

  const calculateAccessibilityScore = useCallback((report) => {
    if (!report) return 0;
    
    let score = 100;
    const issues = report.issues || [];
    
    // Penalizar por errores críticos
    const criticalErrors = issues.filter(issue => issue.type === 'error').length;
    score -= criticalErrors * 20;
    
    // Penalizar por advertencias
    const warnings = issues.filter(issue => issue.type === 'warning').length;
    score -= warnings * 5;
    
    // Bonus por elementos enfocables
    if (report.focusableElements > 10) {
      score += 5;
    }
    
    // Bonus por landmarks completos
    const landmarks = report.landmarks || {};
    const totalLandmarks = Object.values(landmarks).reduce((sum, count) => sum + count, 0);
    if (totalLandmarks >= 3) {
      score += 10;
    }
    
    return Math.max(0, Math.min(100, score));
  }, []);

  const generateRecommendations = useCallback(() => {
    const recommendations = [];
    
    // Recomendaciones basadas en tests
    if (testResults && testResults.failedTests > 0) {
      recommendations.push({
        priority: 'high',
        category: 'testing',
        message: `Corregir ${testResults.failedTests} tests fallidos`,
        action: 'Revisar y corregir los tests que fallaron'
      });
    }
    
    // Recomendaciones basadas en rendimiento
    if (performanceMetrics) {
      if (performanceMetrics.averagePageLoad > 3000) {
        recommendations.push({
          priority: 'high',
          category: 'performance',
          message: 'Optimizar tiempo de carga de página',
          action: 'Implementar lazy loading y optimizar recursos'
        });
      }
      
      if (performanceMetrics.averageApiCall > 2000) {
        recommendations.push({
          priority: 'medium',
          category: 'performance',
          message: 'Optimizar llamadas a API',
          action: 'Implementar caché y optimizar consultas'
        });
      }
      
      if (performanceMetrics.memoryUsage?.percentage > 80) {
        recommendations.push({
          priority: 'high',
          category: 'performance',
          message: 'Reducir uso de memoria',
          action: 'Implementar garbage collection y optimizar variables'
        });
      }
    }
    
    // Recomendaciones basadas en accesibilidad
    if (accessibilityReport) {
      const criticalIssues = accessibilityReport.issues?.filter(issue => issue.type === 'error') || [];
      if (criticalIssues.length > 0) {
        recommendations.push({
          priority: 'high',
          category: 'accessibility',
          message: `Corregir ${criticalIssues.length} problemas críticos de accesibilidad`,
          action: 'Agregar atributos alt, labels y landmarks faltantes'
        });
      }
      
      const warnings = accessibilityReport.issues?.filter(issue => issue.type === 'warning') || [];
      if (warnings.length > 0) {
        recommendations.push({
          priority: 'medium',
          category: 'accessibility',
          message: `Mejorar ${warnings.length} aspectos de accesibilidad`,
          action: 'Revisar contraste de colores y navegación por teclado'
        });
      }
    }
    
    return recommendations;
  }, [testResults, performanceMetrics, accessibilityReport]);

  const getSystemHealth = useCallback(() => {
    const performanceScore = calculatePerformanceScore(performanceMetrics);
    const accessibilityScore = calculateAccessibilityScore(accessibilityReport);
    const testScore = testResults ? (testResults.passedTests / testResults.totalTests) * 100 : 0;
    
    const overallScore = (performanceScore + accessibilityScore + testScore) / 3;
    
    let status = 'excellent';
    if (overallScore < 60) status = 'poor';
    else if (overallScore < 80) status = 'fair';
    else if (overallScore < 90) status = 'good';
    
    return {
      overallScore: Math.round(overallScore),
      performanceScore: Math.round(performanceScore),
      accessibilityScore: Math.round(accessibilityScore),
      testScore: Math.round(testScore),
      status,
      recommendations: generateRecommendations()
    };
  }, [performanceMetrics, accessibilityReport, testResults, calculatePerformanceScore, calculateAccessibilityScore, generateRecommendations]);

  const toggleAutoRefresh = useCallback(() => {
    setAutoRefresh(prev => !prev);
  }, []);

  const resetAll = useCallback(() => {
    setTestResults(null);
    setPerformanceMetrics(null);
    setAccessibilityReport(null);
    setOptimizationStatus('idle');
    setAutoRefresh(false);
    
    // Recargar métricas
    loadPerformanceMetrics();
    loadAccessibilityReport();
  }, [loadPerformanceMetrics, loadAccessibilityReport]);

  return {
    // Estado
    testResults,
    isRunningTests,
    performanceMetrics,
    accessibilityReport,
    optimizationStatus,
    autoRefresh,
    
    // Acciones
    runAllTests,
    applyOptimizations,
    generateReports,
    downloadReport,
    loadPerformanceMetrics,
    loadAccessibilityReport,
    toggleAutoRefresh,
    resetAll,
    
    // Utilidades
    getSystemHealth,
    calculatePerformanceScore,
    calculateAccessibilityScore,
    generateRecommendations
  };
}; 