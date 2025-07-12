'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';

/**
 * Hook para optimizaciones de rendimiento
 */
export function usePerformance() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  // Debounce para evitar llamadas excesivas
  const debounce = useCallback((func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  }, []);

  // Throttle para limitar la frecuencia de llamadas
  const throttle = useCallback((func, limit) => {
    let inThrottle;
    return (...args) => {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }, []);

  // Memoización de datos pesados
  const memoizeData = useCallback((data, dependencies) => {
    return useMemo(() => data, dependencies);
  }, []);

  // Lazy loading de componentes
  const lazyLoad = useCallback((importFunc) => {
    return React.lazy(importFunc);
  }, []);

  // Optimización de imágenes
  const optimizeImage = useCallback((src, options = {}) => {
    const {
      width = 800,
      quality = 80,
      format = 'webp'
    } = options;

    // Simular optimización de imagen
    return `${src}?w=${width}&q=${quality}&fmt=${format}`;
  }, []);

  // Prefetch de datos
  const prefetchData = useCallback(async (url, options = {}) => {
    try {
      const response = await fetch(url, {
        method: 'GET',
        ...options
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Guardar en cache
      localStorage.setItem(`prefetch_${url}`, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
      
      return data;
    } catch (error) {
      console.error('Error prefetching data:', error);
      return null;
    }
  }, []);

  return {
    // Estado
    isLoading,
    setIsLoading,
    error,
    setError,
    lastUpdate,
    setLastUpdate,
    
    // Funciones de optimización
    debounce,
    throttle,
    memoizeData,
    lazyLoad,
    optimizeImage,
    prefetchData,
  };
}

/**
 * Hook para virtualización de listas
 */
export function useVirtualization(items, itemHeight, containerHeight) {
  const [scrollTop, setScrollTop] = useState(0);
  
  const visibleItems = useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight) + 1,
      items.length
    );
    
    return items.slice(startIndex, endIndex).map((item, index) => ({
      ...item,
      index: startIndex + index,
      style: {
        position: 'absolute',
        top: (startIndex + index) * itemHeight,
        height: itemHeight,
        width: '100%'
      }
    }));
  }, [items, scrollTop, itemHeight, containerHeight]);

  const handleScroll = useCallback((e) => {
    setScrollTop(e.target.scrollTop);
  }, []);

  return {
    visibleItems,
    handleScroll,
    totalHeight: items.length * itemHeight
  };
}

/**
 * Hook para lazy loading de imágenes
 */
export function useLazyImage(src, placeholder = '/placeholder.png') {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!src) return;

    setIsLoading(true);
    setError(null);

    const img = new Image();
    img.onload = () => {
      setImageSrc(src);
      setIsLoading(false);
    };
    img.onerror = () => {
      setError('Error loading image');
      setIsLoading(false);
    };
    img.src = src;
  }, [src]);

  return { imageSrc, isLoading, error };
}

/**
 * Hook para infinite scroll
 */
export function useInfiniteScroll(callback, options = {}) {
  const {
    threshold = 100,
    rootMargin = '0px',
    enabled = true
  } = options;

  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const observerRef = useCallback((node) => {
    if (!node || !enabled) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && hasMore && !isLoading) {
            setIsLoading(true);
            callback().finally(() => setIsLoading(false));
          }
        });
      },
      {
        rootMargin,
        threshold
      }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [callback, hasMore, isLoading, enabled, rootMargin, threshold]);

  return {
    observerRef,
    isLoading,
    hasMore,
    setHasMore
  };
}

/**
 * Hook para formularios optimizados
 */
export function useOptimizedForm(initialData = {}) {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpiar error del campo si existe
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [errors]);

  const setFieldError = useCallback((field, error) => {
    setErrors(prev => ({ ...prev, [field]: error }));
  }, []);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const resetForm = useCallback(() => {
    setFormData(initialData);
    setErrors({});
    setIsSubmitting(false);
  }, [initialData]);

  const handleSubmit = useCallback(async (submitFunction) => {
    setIsSubmitting(true);
    try {
      await submitFunction(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData]);

  return {
    formData,
    errors,
    isSubmitting,
    updateField,
    setFieldError,
    clearErrors,
    resetForm,
    handleSubmit
  };
}

/**
 * Hook para cache de datos
 */
export function useCache(key, data, ttl = 5 * 60 * 1000) {
  const [cachedData, setCachedData] = useState(null);

  useEffect(() => {
    const cached = localStorage.getItem(`cache_${key}`);
    if (cached) {
      const { data: cachedData, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < ttl) {
        setCachedData(cachedData);
        return;
      }
    }
    
    if (data) {
      setCachedData(data);
      localStorage.setItem(`cache_${key}`, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
    }
  }, [key, data, ttl]);

  return cachedData;
}

/**
 * Hook para monitoreo de rendimiento
 */
export function usePerformanceMonitor() {
  const [metrics, setMetrics] = useState({
    fps: 0,
    memory: 0,
    loadTime: 0
  });

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animationId;

    const measurePerformance = () => {
      const currentTime = performance.now();
      frameCount++;

      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        
        setMetrics(prev => ({
          ...prev,
          fps,
          memory: performance.memory ? performance.memory.usedJSHeapSize / 1024 / 1024 : 0
        }));

        frameCount = 0;
        lastTime = currentTime;
      }

      animationId = requestAnimationFrame(measurePerformance);
    };

    measurePerformance();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  return metrics;
}

/**
 * Hook para estado optimizado
 */
export function useOptimizedState(initialState) {
  const [state, setState] = useState(initialState);
  
  const setOptimizedState = useCallback((newState) => {
    if (typeof newState === 'function') {
      setState(prevState => {
        const nextState = newState(prevState);
        return JSON.stringify(prevState) === JSON.stringify(nextState) ? prevState : nextState;
      });
    } else {
      setState(prevState => 
        JSON.stringify(prevState) === JSON.stringify(newState) ? prevState : newState
      );
    }
  }, []);

  return [state, setOptimizedState];
} 