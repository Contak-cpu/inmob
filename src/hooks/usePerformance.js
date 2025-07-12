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

  // Virtualización para listas grandes
  const virtualizeList = useCallback((items, itemHeight, containerHeight) => {
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
  }, []);

  // Cache de datos
  const useCache = useCallback((key, data, ttl = 5 * 60 * 1000) => {
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

  // Monitoreo de rendimiento
  const usePerformanceMonitor = useCallback(() => {
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
  }, []);

  // Optimización de re-renders
  const useOptimizedCallback = useCallback((callback, dependencies) => {
    return useCallback(callback, dependencies);
  }, []);

  const useOptimizedMemo = useCallback((factory, dependencies) => {
    return useMemo(factory, dependencies);
  }, []);

  // Gestión de estado optimizada
  const useOptimizedState = useCallback((initialState) => {
    const [state, setState] = useState(initialState);
    
    const setOptimizedState = useCallback((newState) => {
      setState(prevState => {
        if (typeof newState === 'function') {
          const result = newState(prevState);
          return result === prevState ? prevState : result;
        }
        return newState === prevState ? prevState : newState;
      });
    }, []);

    return [state, setOptimizedState];
  }, []);

  return {
    // Estados
    isLoading,
    setIsLoading,
    error,
    setError,
    lastUpdate,
    setLastUpdate,

    // Utilidades de optimización
    debounce,
    throttle,
    memoizeData,
    lazyLoad,
    virtualizeList,
    useCache,
    optimizeImage,
    prefetchData,
    usePerformanceMonitor,
    useOptimizedCallback,
    useOptimizedMemo,
    useOptimizedState
  };
}

/**
 * Hook para lazy loading de imágenes
 */
export function useLazyImage(src, placeholder = '/placeholder.png') {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!src) return;

    const img = new Image();
    
    img.onload = () => {
      setImageSrc(src);
      setIsLoaded(true);
      setError(false);
    };
    
    img.onerror = () => {
      setError(true);
      setIsLoaded(false);
    };
    
    img.src = src;
  }, [src]);

  return {
    src: imageSrc,
    isLoaded,
    error,
    isLoading: !isLoaded && !error
  };
}

/**
 * Hook para infinite scroll
 */
export function useInfiniteScroll(callback, options = {}) {
  const {
    threshold = 100,
    root = null,
    rootMargin = '0px'
  } = options;

  const [isIntersecting, setIsIntersecting] = useState(false);

  const observerRef = useCallback((node) => {
    if (node) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsIntersecting(true);
            callback();
          } else {
            setIsIntersecting(false);
          }
        },
        {
          threshold,
          root,
          rootMargin
        }
      );

      observer.observe(node);

      return () => observer.disconnect();
    }
  }, [callback, threshold, root, rootMargin]);

  return {
    observerRef,
    isIntersecting
  };
}

/**
 * Hook para optimización de formularios
 */
export function useOptimizedForm(initialData = {}) {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;

    setFormData(prev => ({
      ...prev,
      [name]: fieldValue
    }));

    // Limpiar error del campo si existe
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  }, [errors]);

  const handleSubmit = useCallback(async (onSubmit) => {
    setIsSubmitting(true);
    setErrors({});

    try {
      await onSubmit(formData);
    } catch (error) {
      if (error.errors) {
        setErrors(error.errors);
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [formData]);

  const resetForm = useCallback(() => {
    setFormData(initialData);
    setErrors({});
    setIsSubmitting(false);
  }, [initialData]);

  return {
    formData,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    resetForm,
    setFormData,
    setErrors
  };
} 