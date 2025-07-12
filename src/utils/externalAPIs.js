// Estructura para integración con APIs externas - Preparado para integración futura

// Configuración de APIs externas
export const API_CONFIG = {
  enabled: false, // Cambiar a true cuando se implemente la integración
  endpoints: {
    ipc: 'https://api.indec.gob.ar/ipc', // Ejemplo - URL real a definir
    icl: 'https://api.indec.gob.ar/icl', // Ejemplo - URL real a definir
    uva: 'https://api.bcra.gob.ar/uva', // Ejemplo - URL real a definir
  },
  updateInterval: 24 * 60 * 60 * 1000, // 24 horas
  cacheDuration: 7 * 24 * 60 * 60 * 1000, // 7 días
  retryAttempts: 3,
  retryDelay: 5000, // 5 segundos
};

// Tipos de índices
export const INDEX_TYPES = {
  IPC: 'ipc', // Índice de Precios al Consumidor
  ICL: 'icl', // Índice de Contratos de Locación
  UVA: 'uva', // Unidad de Valor Adquisitivo
  CCL: 'ccl', // Contrato de Locación Comercial
};

// Estados de actualización
export const UPDATE_STATUS = {
  IDLE: 'idle',
  UPDATING: 'updating',
  SUCCESS: 'success',
  ERROR: 'error',
  CACHE_EXPIRED: 'cache_expired',
};

// Estado de APIs externas
let apiState = {
  status: UPDATE_STATUS.IDLE,
  lastUpdate: null,
  cachedData: {},
  errors: [],
};

// ===== GESTIÓN DE CACHE =====

// Guardar datos en cache
const saveToCache = (key, data) => {
  try {
    const cacheData = {
      data,
      timestamp: new Date().toISOString(),
      expiresAt: new Date(Date.now() + API_CONFIG.cacheDuration).toISOString(),
    };
    
    localStorage.setItem(`konrad_api_cache_${key}`, JSON.stringify(cacheData));
    apiState.cachedData[key] = cacheData;
  } catch (error) {
    console.error('Error al guardar en cache:', error);
  }
};

// Obtener datos del cache
const getFromCache = (key) => {
  try {
    const cached = localStorage.getItem(`konrad_api_cache_${key}`);
    if (cached) {
      const cacheData = JSON.parse(cached);
      const now = new Date();
      const expiresAt = new Date(cacheData.expiresAt);
      
      if (now < expiresAt) {
        apiState.cachedData[key] = cacheData;
        return cacheData.data;
      } else {
        // Cache expirado
        localStorage.removeItem(`konrad_api_cache_${key}`);
        delete apiState.cachedData[key];
      }
    }
  } catch (error) {
    console.error('Error al leer cache:', error);
  }
  
  return null;
};

// Verificar si el cache está expirado
const isCacheExpired = (key) => {
  const cached = getFromCache(key);
  return cached === null;
};

// ===== FUNCIONES DE API (PREPARADAS PARA IMPLEMENTACIÓN) =====

// Obtener índice IPC
export const fetchIPC = async (date = null) => {
  if (!API_CONFIG.enabled) {
    console.log('APIs externas deshabilitadas');
    return null;
  }
  
  const cacheKey = `ipc_${date || 'latest'}`;
  
  // Verificar cache primero
  const cached = getFromCache(cacheKey);
  if (cached) {
    return cached;
  }
  
  apiState.status = UPDATE_STATUS.UPDATING;
  
  try {
    // Aquí iría la llamada real a la API
    console.log('Obteniendo índice IPC...');
    
    // Simular llamada a API
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Datos simulados - reemplazar con datos reales
    const ipcData = {
      index: 123.45,
      date: date || new Date().toISOString().split('T')[0],
      source: 'INDEC',
      previousIndex: 122.30,
      change: 0.94,
      changePercent: 0.76,
    };
    
    // Guardar en cache
    saveToCache(cacheKey, ipcData);
    
    apiState.status = UPDATE_STATUS.SUCCESS;
    apiState.lastUpdate = new Date().toISOString();
    
    return ipcData;
    
  } catch (error) {
    apiState.status = UPDATE_STATUS.ERROR;
    apiState.errors.push({
      type: INDEX_TYPES.IPC,
      error: error.message,
      timestamp: new Date().toISOString(),
    });
    
    console.error('Error obteniendo IPC:', error);
    return null;
  }
};

// Obtener índice ICL
export const fetchICL = async (date = null) => {
  if (!API_CONFIG.enabled) {
    console.log('APIs externas deshabilitadas');
    return null;
  }
  
  const cacheKey = `icl_${date || 'latest'}`;
  
  // Verificar cache primero
  const cached = getFromCache(cacheKey);
  if (cached) {
    return cached;
  }
  
  apiState.status = UPDATE_STATUS.UPDATING;
  
  try {
    // Aquí iría la llamada real a la API
    console.log('Obteniendo índice ICL...');
    
    // Simular llamada a API
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Datos simulados - reemplazar con datos reales
    const iclData = {
      index: 456.78,
      date: date || new Date().toISOString().split('T')[0],
      source: 'INDEC',
      previousIndex: 455.20,
      change: 1.58,
      changePercent: 0.35,
      category: 'locacion_residencial',
    };
    
    // Guardar en cache
    saveToCache(cacheKey, iclData);
    
    apiState.status = UPDATE_STATUS.SUCCESS;
    apiState.lastUpdate = new Date().toISOString();
    
    return iclData;
    
  } catch (error) {
    apiState.status = UPDATE_STATUS.ERROR;
    apiState.errors.push({
      type: INDEX_TYPES.ICL,
      error: error.message,
      timestamp: new Date().toISOString(),
    });
    
    console.error('Error obteniendo ICL:', error);
    return null;
  }
};

// Obtener índice UVA
export const fetchUVA = async (date = null) => {
  if (!API_CONFIG.enabled) {
    console.log('APIs externas deshabilitadas');
    return null;
  }
  
  const cacheKey = `uva_${date || 'latest'}`;
  
  // Verificar cache primero
  const cached = getFromCache(cacheKey);
  if (cached) {
    return cached;
  }
  
  apiState.status = UPDATE_STATUS.UPDATING;
  
  try {
    // Aquí iría la llamada real a la API
    console.log('Obteniendo índice UVA...');
    
    // Simular llamada a API
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Datos simulados - reemplazar con datos reales
    const uvaData = {
      index: 789.12,
      date: date || new Date().toISOString().split('T')[0],
      source: 'BCRA',
      previousIndex: 788.50,
      change: 0.62,
      changePercent: 0.08,
    };
    
    // Guardar en cache
    saveToCache(cacheKey, uvaData);
    
    apiState.status = UPDATE_STATUS.SUCCESS;
    apiState.lastUpdate = new Date().toISOString();
    
    return uvaData;
    
  } catch (error) {
    apiState.status = UPDATE_STATUS.ERROR;
    apiState.errors.push({
      type: INDEX_TYPES.UVA,
      error: error.message,
      timestamp: new Date().toISOString(),
    });
    
    console.error('Error obteniendo UVA:', error);
    return null;
  }
};

// ===== CÁLCULOS CON ÍNDICES =====

// Calcular ajuste por IPC
export const calculateIPCAdjustment = (baseAmount, baseDate, targetDate) => {
  const baseIPC = fetchIPC(baseDate);
  const targetIPC = fetchIPC(targetDate);
  
  if (!baseIPC || !targetIPC) {
    return null;
  }
  
  const adjustmentFactor = targetIPC.index / baseIPC.index;
  const adjustedAmount = baseAmount * adjustmentFactor;
  
  return {
    originalAmount: baseAmount,
    adjustedAmount,
    adjustmentFactor,
    baseIPC: baseIPC.index,
    targetIPC: targetIPC.index,
    difference: adjustedAmount - baseAmount,
    percentageChange: ((adjustmentFactor - 1) * 100),
  };
};

// Calcular ajuste por ICL
export const calculateICLAdjustment = (baseAmount, baseDate, targetDate) => {
  const baseICL = fetchICL(baseDate);
  const targetICL = fetchICL(targetDate);
  
  if (!baseICL || !targetICL) {
    return null;
  }
  
  const adjustmentFactor = targetICL.index / baseICL.index;
  const adjustedAmount = baseAmount * adjustmentFactor;
  
  return {
    originalAmount: baseAmount,
    adjustedAmount,
    adjustmentFactor,
    baseICL: baseICL.index,
    targetICL: targetICL.index,
    difference: adjustedAmount - baseAmount,
    percentageChange: ((adjustmentFactor - 1) * 100),
  };
};

// Calcular ajuste por UVA
export const calculateUVAAdjustment = (baseAmount, baseDate, targetDate) => {
  const baseUVA = fetchUVA(baseDate);
  const targetUVA = fetchUVA(targetDate);
  
  if (!baseUVA || !targetUVA) {
    return null;
  }
  
  const adjustmentFactor = targetUVA.index / baseUVA.index;
  const adjustedAmount = baseAmount * adjustmentFactor;
  
  return {
    originalAmount: baseAmount,
    adjustedAmount,
    adjustmentFactor,
    baseUVA: baseUVA.index,
    targetUVA: targetUVA.index,
    difference: adjustedAmount - baseAmount,
    percentageChange: ((adjustmentFactor - 1) * 100),
  };
};

// ===== ACTUALIZACIÓN AUTOMÁTICA =====

// Actualizar todos los índices
export const updateAllIndices = async () => {
  if (!API_CONFIG.enabled) {
    return { success: false, message: 'APIs externas deshabilitadas' };
  }
  
  console.log('Actualizando índices externos...');
  
  const results = {
    ipc: await fetchIPC(),
    icl: await fetchICL(),
    uva: await fetchUVA(),
  };
  
  const successCount = Object.values(results).filter(r => r !== null).length;
  
  return {
    success: successCount > 0,
    message: `Actualización completada - ${successCount}/3 índices actualizados`,
    results,
  };
};

// Configurar actualización automática
export const setupAutoUpdate = () => {
  if (!API_CONFIG.enabled) {
    return;
  }
  
  // Actualización periódica
  setInterval(() => {
    updateAllIndices();
  }, API_CONFIG.updateInterval);
  
  // Verificar cache expirado al iniciar
  setTimeout(() => {
    const indices = [INDEX_TYPES.IPC, INDEX_TYPES.ICL, INDEX_TYPES.UVA];
    indices.forEach(index => {
      if (isCacheExpired(index)) {
        console.log(`Cache expirado para ${index} - Actualizando...`);
        switch (index) {
          case INDEX_TYPES.IPC:
            fetchIPC();
            break;
          case INDEX_TYPES.ICL:
            fetchICL();
            break;
          case INDEX_TYPES.UVA:
            fetchUVA();
            break;
        }
      }
    });
  }, 5000);
};

// ===== UTILIDADES =====

// Obtener estado de APIs
export const getAPIState = () => {
  return { ...apiState };
};

// Limpiar cache
export const clearCache = () => {
  try {
    Object.keys(apiState.cachedData).forEach(key => {
      localStorage.removeItem(`konrad_api_cache_${key}`);
    });
    apiState.cachedData = {};
    console.log('Cache de APIs limpiado');
  } catch (error) {
    console.error('Error al limpiar cache:', error);
  }
};

// Obtener historial de errores
export const getAPIErrors = () => {
  return [...apiState.errors];
};

// Limpiar errores
export const clearAPIErrors = () => {
  apiState.errors = [];
};

// ===== INICIALIZACIÓN =====

// Inicializar sistema de APIs externas
export const initializeExternalAPIs = () => {
  if (!API_CONFIG.enabled) {
    console.log('APIs externas deshabilitadas');
    return;
  }
  
  console.log('Inicializando sistema de APIs externas...');
  
  // Configurar actualización automática
  setupAutoUpdate();
  
  console.log('Sistema de APIs externas inicializado');
};

// Inicializar cuando el DOM esté listo
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', initializeExternalAPIs);
} 