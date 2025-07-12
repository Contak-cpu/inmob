import { useState, useEffect, useCallback } from 'react';
import realtimeSync from '../utils/realtimeSync';
import smartCache from '../utils/smartCache';
import externalAPIManager from '../utils/externalAPIs';
import offlineManager from '../utils/offlineManager';

export const useIntegration = () => {
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [cacheStats, setCacheStats] = useState({});
  const [apiStats, setApiStats] = useState({});
  const [offlineStats, setOfflineStats] = useState({});
  const [isInitialized, setIsInitialized] = useState(false);

  // Inicializar todos los sistemas
  const initializeSystems = useCallback(async () => {
    try {
      console.log('Inicializando sistemas de integración...');

      // Inicializar sincronización en tiempo real
      realtimeSync.connect();
      
      // Precalentar caché con datos importantes
      await smartCache.prewarm(['users', 'contracts', 'receipts']);
      
      // Configurar suscripciones
      const unsubscribeConnection = realtimeSync.subscribe('connection', (data) => {
        setConnectionStatus(data.status);
      });

      const unsubscribeDataUpdate = realtimeSync.subscribe('data_update', (data) => {
        console.log('Datos actualizados en tiempo real:', data);
        // Aquí se pueden actualizar los estados de la aplicación
      });

      const unsubscribeConflict = realtimeSync.subscribe('conflict', (data) => {
        console.log('Conflicto detectado:', data);
        // Manejar conflictos de datos
      });

      // Configurar intervalos de actualización de estadísticas
      const statsInterval = setInterval(() => {
        setCacheStats(smartCache.getStats());
        setApiStats(externalAPIManager.getUsageStats());
        setOfflineStats(offlineManager.getStats());
      }, 10000); // Actualizar cada 10 segundos

      setIsInitialized(true);
      console.log('Sistemas de integración inicializados');

      // Cleanup function
      return () => {
        unsubscribeConnection();
        unsubscribeDataUpdate();
        unsubscribeConflict();
        clearInterval(statsInterval);
        realtimeSync.disconnect();
      };
    } catch (error) {
      console.error('Error inicializando sistemas:', error);
      setIsInitialized(false);
    }
  }, []);

  // Sincronizar datos
  const syncData = useCallback(async (entity, data, operation = 'update') => {
    try {
      // Guardar en caché
      smartCache.set(entity, data, {
        priority: 'high',
        tags: [entity, operation],
        persist: true
      });

      // Enviar a sincronización en tiempo real
      realtimeSync.sendMessage({
        type: 'data_update',
        payload: {
          entity,
          data,
          operation,
          timestamp: Date.now()
        }
      });

      // Si no hay conexión, agregar a acciones pendientes
      if (!navigator.onLine) {
        offlineManager.addPendingAction({
          type: `${operation.toUpperCase()}_${entity.toUpperCase()}`,
          data: { entity, data, operation }
        });
      }

      return { success: true };
    } catch (error) {
      console.error('Error sincronizando datos:', error);
      return { success: false, error: error.message };
    }
  }, []);

  // Obtener datos con caché inteligente
  const getData = useCallback(async (key, fetchFunction, options = {}) => {
    try {
      // Intentar obtener del caché primero
      let data = smartCache.get(key);
      
      if (!data) {
        // Si no está en caché, obtener de la fuente
        data = await fetchFunction();
        
        // Guardar en caché
        smartCache.set(key, data, {
          priority: options.priority || 'normal',
          tags: options.tags || [key],
          persist: options.persist || false,
          ttl: options.ttl || 30 * 60 * 1000 // 30 minutos por defecto
        });
      }

      return data;
    } catch (error) {
      console.error('Error obteniendo datos:', error);
      throw error;
    }
  }, []);

  // Llamar API externa con manejo de errores
  const callExternalAPI = useCallback(async (apiName, endpoint, options = {}) => {
    try {
      const result = await externalAPIManager.request(apiName, endpoint, options);
      return { success: true, data: result };
    } catch (error) {
      console.error(`Error llamando API ${apiName}:`, error);
      return { success: false, error: error.message };
    }
  }, []);

  // Geocodificar dirección
  const geocodeAddress = useCallback(async (address) => {
    return await callExternalAPI('geocoding', `/${encodeURIComponent(address)}.json`, {
      useCache: true,
      cacheKey: `geocode_${address}`
    });
  }, [callExternalAPI]);

  // Validar documento
  const validateDocument = useCallback(async (documentType, documentNumber) => {
    return await callExternalAPI('documentValidation', '/validate', {
      method: 'POST',
      body: { type: documentType, number: documentNumber },
      useCache: true,
      cacheKey: `validation_${documentType}_${documentNumber}`
    });
  }, [callExternalAPI]);

  // Enviar notificación push
  const sendPushNotification = useCallback(async (token, title, body, data = {}) => {
    return await callExternalAPI('pushNotifications', '', {
      method: 'POST',
      body: {
        to: token,
        notification: { title, body },
        data: { ...data, click_action: 'FLUTTER_NOTIFICATION_CLICK' }
      },
      useCache: false
    });
  }, [callExternalAPI]);

  // Convertir moneda
  const convertCurrency = useCallback(async (from, to, amount) => {
    return await callExternalAPI('currencyConverter', `/${from}`, {
      useCache: true,
      cacheKey: `currency_${from}_${to}`
    });
  }, [callExternalAPI]);

  // Obtener estadísticas completas
  const getIntegrationStats = useCallback(() => {
    return {
      connection: {
        status: connectionStatus,
        isOnline: navigator.onLine
      },
      cache: cacheStats,
      api: apiStats,
      offline: offlineStats,
      timestamp: Date.now()
    };
  }, [connectionStatus, cacheStats, apiStats, offlineStats]);

  // Limpiar caché
  const clearCache = useCallback(() => {
    smartCache.clear();
    setCacheStats(smartCache.getStats());
  }, []);

  // Limpiar acciones pendientes
  const clearPendingActions = useCallback(() => {
    offlineManager.clearPendingActions();
    setOfflineStats(offlineManager.getStats());
  }, []);

  // Inicializar al montar el componente
  useEffect(() => {
    const cleanup = initializeSystems();
    return () => {
      cleanup?.then(cleanupFn => cleanupFn?.());
    };
  }, [initializeSystems]);

  return {
    // Estado
    isInitialized,
    connectionStatus,
    cacheStats,
    apiStats,
    offlineStats,

    // Funciones
    syncData,
    getData,
    callExternalAPI,
    geocodeAddress,
    validateDocument,
    sendPushNotification,
    convertCurrency,
    getIntegrationStats,
    clearCache,
    clearPendingActions,

    // Utilidades
    isOnline: navigator.onLine,
    hasPendingActions: offlineStats.totalActions > 0
  };
}; 