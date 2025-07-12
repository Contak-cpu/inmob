class PerformanceOptimizer {
  constructor() {
    this.metrics = {
      pageLoads: [],
      apiCalls: [],
      renderTimes: [],
      memoryUsage: [],
      errors: []
    };
    this.observers = new Map();
    this.optimizations = new Set();
    this.startTime = Date.now();
    this.setupMonitoring();
  }

  // Configurar monitoreo automático
  setupMonitoring() {
    // Monitorear carga de página
    if (typeof window !== 'undefined') {
      window.addEventListener('load', () => {
        this.recordPageLoad();
      });

      // Monitorear errores
      window.addEventListener('error', (event) => {
        this.recordError(event.error);
      });

      // Monitorear memoria
      if ('memory' in performance) {
        setInterval(() => {
          this.recordMemoryUsage();
        }, 30000); // Cada 30 segundos
      }
    }
  }

  // Registrar carga de página
  recordPageLoad() {
    const loadTime = performance.now();
    const navigation = performance.getEntriesByType('navigation')[0];
    
    this.metrics.pageLoads.push({
      timestamp: Date.now(),
      loadTime,
      domContentLoaded: navigation?.domContentLoadedEventEnd - navigation?.domContentLoadedEventStart,
      firstPaint: this.getFirstPaint(),
      firstContentfulPaint: this.getFirstContentfulPaint()
    });

    // Optimizar si la carga es lenta
    if (loadTime > 3000) {
      this.suggestOptimizations('pageLoad', loadTime);
    }
  }

  // Registrar llamada a API
  recordApiCall(url, method, duration, status) {
    this.metrics.apiCalls.push({
      timestamp: Date.now(),
      url,
      method,
      duration,
      status
    });

    // Optimizar si la llamada es lenta
    if (duration > 2000) {
      this.suggestOptimizations('apiCall', duration, { url, method });
    }
  }

  // Registrar tiempo de renderizado
  recordRenderTime(component, duration) {
    this.metrics.renderTimes.push({
      timestamp: Date.now(),
      component,
      duration
    });

    // Optimizar si el render es lento
    if (duration > 100) {
      this.suggestOptimizations('render', duration, { component });
    }
  }

  // Registrar uso de memoria
  recordMemoryUsage() {
    if ('memory' in performance) {
      this.metrics.memoryUsage.push({
        timestamp: Date.now(),
        used: performance.memory.usedJSHeapSize,
        total: performance.memory.totalJSHeapSize,
        limit: performance.memory.jsHeapSizeLimit
      });

      // Alertar si el uso de memoria es alto
      const usagePercent = (performance.memory.usedJSHeapSize / performance.memory.jsHeapSizeLimit) * 100;
      if (usagePercent > 80) {
        this.suggestOptimizations('memory', usagePercent);
      }
    }
  }

  // Registrar error
  recordError(error) {
    this.metrics.errors.push({
      timestamp: Date.now(),
      message: error.message,
      stack: error.stack,
      url: window.location.href
    });
  }

  // Obtener First Paint
  getFirstPaint() {
    const paintEntries = performance.getEntriesByType('paint');
    const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
    return firstPaint ? firstPaint.startTime : null;
  }

  // Obtener First Contentful Paint
  getFirstContentfulPaint() {
    const paintEntries = performance.getEntriesByType('paint');
    const firstContentfulPaint = paintEntries.find(entry => entry.name === 'first-contentful-paint');
    return firstContentfulPaint ? firstContentfulPaint.startTime : null;
  }

  // Sugerir optimizaciones
  suggestOptimizations(type, value, context = {}) {
    const suggestions = [];

    switch (type) {
      case 'pageLoad':
        if (value > 5000) {
          suggestions.push('Implementar lazy loading de imágenes');
          suggestions.push('Optimizar bundle de JavaScript');
          suggestions.push('Implementar service worker para caché');
        } else if (value > 3000) {
          suggestions.push('Optimizar carga de recursos críticos');
          suggestions.push('Implementar preloading de recursos');
        }
        break;

      case 'apiCall':
        suggestions.push('Implementar caché para llamadas frecuentes');
        suggestions.push('Optimizar consultas de base de datos');
        suggestions.push('Implementar paginación si aplica');
        break;

      case 'render':
        suggestions.push('Implementar React.memo para componentes');
        suggestions.push('Optimizar re-renders innecesarios');
        suggestions.push('Usar useMemo y useCallback');
        break;

      case 'memory':
        suggestions.push('Limpiar event listeners no utilizados');
        suggestions.push('Implementar garbage collection manual');
        suggestions.push('Optimizar uso de variables globales');
        break;
    }

    if (suggestions.length > 0) {
      this.optimizations.add({
        type,
        value,
        context,
        suggestions,
        timestamp: Date.now()
      });

      console.warn(`🚨 Optimización sugerida (${type}):`, suggestions);
    }
  }

  // Optimización automática de imágenes
  optimizeImages() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      // Lazy loading
      if (!img.loading) {
        img.loading = 'lazy';
      }

      // Optimizar srcset si no existe
      if (!img.srcset && img.src) {
        const src = img.src;
        img.srcset = `${src} 1x, ${src.replace('.jpg', '@2x.jpg')} 2x`;
      }
    });
  }

  // Optimización de bundle
  optimizeBundle() {
    // Implementar code splitting dinámico
    if (typeof window !== 'undefined') {
      // Precargar rutas críticas
      const criticalPaths = ['/dashboard', '/contracts', '/receipts'];
      criticalPaths.forEach(path => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = path;
        document.head.appendChild(link);
      });
    }
  }

  // Optimización de caché
  optimizeCache() {
    // Implementar estrategia de caché inteligente
    const cacheStrategy = {
      api: {
        maxAge: 5 * 60 * 1000, // 5 minutos
        staleWhileRevalidate: 10 * 60 * 1000 // 10 minutos
      },
      static: {
        maxAge: 24 * 60 * 60 * 1000, // 24 horas
        immutable: true
      }
    };

    return cacheStrategy;
  }

  // Optimización de memoria
  optimizeMemory() {
    // Limpiar caché si es necesario
    if (this.metrics.memoryUsage.length > 0) {
      const latest = this.metrics.memoryUsage[this.metrics.memoryUsage.length - 1];
      const usagePercent = (latest.used / latest.limit) * 100;

      if (usagePercent > 70) {
        // Limpiar caché de imágenes
        if ('caches' in window) {
          caches.keys().then(names => {
            names.forEach(name => {
              if (name.includes('images')) {
                caches.delete(name);
              }
            });
          });
        }

        // Forzar garbage collection si es posible
        if (window.gc) {
          window.gc();
        }
      }
    }
  }

  // Optimización de red
  optimizeNetwork() {
    // Implementar compresión de datos
    const compressionStrategies = {
      gzip: true,
      brotli: true,
      images: {
        webp: true,
        avif: true
      }
    };

    return compressionStrategies;
  }

  // Aplicar optimizaciones automáticas
  applyOptimizations() {
    this.optimizeImages();
    this.optimizeBundle();
    this.optimizeMemory();
  }

  // Obtener métricas de rendimiento
  getPerformanceMetrics() {
    const now = Date.now();
    const uptime = now - this.startTime;

    const metrics = {
      uptime,
      pageLoads: this.metrics.pageLoads.length,
      apiCalls: this.metrics.apiCalls.length,
      renderTimes: this.metrics.renderTimes.length,
      errors: this.metrics.errors.length,
      optimizations: this.optimizations.size,
      averagePageLoad: this.calculateAverage(this.metrics.pageLoads, 'loadTime'),
      averageApiCall: this.calculateAverage(this.metrics.apiCalls, 'duration'),
      averageRenderTime: this.calculateAverage(this.metrics.renderTimes, 'duration'),
      errorRate: this.calculateErrorRate(),
      memoryUsage: this.getCurrentMemoryUsage()
    };

    return metrics;
  }

  // Calcular promedio
  calculateAverage(array, property) {
    if (array.length === 0) return 0;
    const sum = array.reduce((acc, item) => acc + item[property], 0);
    return sum / array.length;
  }

  // Calcular tasa de errores
  calculateErrorRate() {
    const totalRequests = this.metrics.apiCalls.length;
    const errors = this.metrics.errors.length;
    return totalRequests > 0 ? (errors / totalRequests) * 100 : 0;
  }

  // Obtener uso actual de memoria
  getCurrentMemoryUsage() {
    if ('memory' in performance) {
      const memory = performance.memory;
      return {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        limit: memory.jsHeapSizeLimit,
        percentage: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100
      };
    }
    return null;
  }

  // Generar reporte de rendimiento
  generateReport() {
    const metrics = this.getPerformanceMetrics();
    const report = {
      timestamp: Date.now(),
      metrics,
      optimizations: Array.from(this.optimizations),
      recommendations: this.generateRecommendations(metrics)
    };

    return report;
  }

  // Generar recomendaciones
  generateRecommendations(metrics) {
    const recommendations = [];

    if (metrics.averagePageLoad > 3000) {
      recommendations.push({
        type: 'critical',
        message: 'El tiempo de carga de página es alto',
        action: 'Implementar optimizaciones de carga'
      });
    }

    if (metrics.averageApiCall > 2000) {
      recommendations.push({
        type: 'warning',
        message: 'Las llamadas a API son lentas',
        action: 'Optimizar endpoints y implementar caché'
      });
    }

    if (metrics.errorRate > 5) {
      recommendations.push({
        type: 'critical',
        message: 'Tasa de errores alta',
        action: 'Revisar logs y corregir errores'
      });
    }

    if (metrics.memoryUsage?.percentage > 80) {
      recommendations.push({
        type: 'warning',
        message: 'Uso de memoria alto',
        action: 'Optimizar gestión de memoria'
      });
    }

    return recommendations;
  }

  // Limpiar métricas antiguas
  cleanup() {
    const oneHourAgo = Date.now() - (60 * 60 * 1000);
    
    this.metrics.pageLoads = this.metrics.pageLoads.filter(
      load => load.timestamp > oneHourAgo
    );
    this.metrics.apiCalls = this.metrics.apiCalls.filter(
      call => call.timestamp > oneHourAgo
    );
    this.metrics.renderTimes = this.metrics.renderTimes.filter(
      render => render.timestamp > oneHourAgo
    );
    this.metrics.memoryUsage = this.metrics.memoryUsage.filter(
      memory => memory.timestamp > oneHourAgo
    );
  }
}

// Instancia singleton
const performanceOptimizer = new PerformanceOptimizer();

// Limpiar métricas cada hora
setInterval(() => {
  performanceOptimizer.cleanup();
}, 60 * 60 * 1000);

export default performanceOptimizer; 