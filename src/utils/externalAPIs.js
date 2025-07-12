import smartCache from './smartCache.js';
import realtimeSync from './realtimeSync.js';

class ExternalAPIManager {
  constructor() {
    this.apis = new Map();
    this.retryConfig = {
      maxRetries: 3,
      baseDelay: 1000,
      maxDelay: 10000
    };
    this.rateLimits = new Map();
    this.setupDefaultAPIs();
  }

  // Configurar APIs por defecto
  setupDefaultAPIs() {
    // API de geocodificación
    this.registerAPI('geocoding', {
      baseURL: 'https://api.mapbox.com/geocoding/v5/mapbox.places',
      token: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
      rateLimit: { requests: 100, window: 60000 }, // 100 requests por minuto
      cache: { ttl: 24 * 60 * 60 * 1000, tags: ['geocoding'] } // 24 horas
    });

    // API de validación de documentos
    this.registerAPI('documentValidation', {
      baseURL: 'https://api.validacion.com/v1',
      token: process.env.NEXT_PUBLIC_VALIDATION_TOKEN,
      rateLimit: { requests: 50, window: 60000 },
      cache: { ttl: 60 * 60 * 1000, tags: ['validation'] } // 1 hora
    });

    // API de notificaciones push
    this.registerAPI('pushNotifications', {
      baseURL: 'https://fcm.googleapis.com/fcm/send',
      token: process.env.NEXT_PUBLIC_FCM_TOKEN,
      rateLimit: { requests: 1000, window: 60000 },
      cache: { ttl: 5 * 60 * 1000, tags: ['notifications'] } // 5 minutos
    });

    // API de conversión de moneda
    this.registerAPI('currencyConverter', {
      baseURL: 'https://api.exchangerate-api.com/v4/latest',
      rateLimit: { requests: 100, window: 60000 },
      cache: { ttl: 60 * 60 * 1000, tags: ['currency'] } // 1 hora
    });
  }

  // Registrar una nueva API
  registerAPI(name, config) {
    this.apis.set(name, {
      ...config,
      lastRequest: 0,
      requestCount: 0
    });
  }

  // Realizar petición con retry y rate limiting
  async request(apiName, endpoint, options = {}) {
    const api = this.apis.get(apiName);
    if (!api) {
      throw new Error(`API ${apiName} no registrada`);
    }

    const {
      method = 'GET',
      body,
      headers = {},
      useCache = true,
      cacheKey = null,
      retry = true
    } = options;

    // Verificar rate limiting
    if (this.isRateLimited(apiName)) {
      throw new Error(`Rate limit excedido para ${apiName}`);
    }

    // Verificar caché
    const cacheKeyToUse = cacheKey || `${apiName}_${endpoint}_${JSON.stringify(options)}`;
    if (useCache) {
      const cachedData = smartCache.get(cacheKeyToUse);
      if (cachedData) {
        return cachedData;
      }
    }

    // Realizar petición con retry
    const response = await this.makeRequestWithRetry(api, endpoint, {
      method,
      body,
      headers,
      retry
    });

    // Guardar en caché si es exitoso
    if (useCache && response.ok) {
      const data = await response.json();
      smartCache.set(cacheKeyToUse, data, {
        ttl: api.cache?.ttl || 30 * 60 * 1000,
        tags: api.cache?.tags || [apiName],
        priority: 'normal'
      });
      return data;
    }

    return response;
  }

  // Realizar petición con retry automático
  async makeRequestWithRetry(api, endpoint, options, attempt = 1) {
    try {
      const url = `${api.baseURL}${endpoint}`;
      const headers = {
        'Content-Type': 'application/json',
        ...options.headers
      };

      if (api.token) {
        headers.Authorization = `Bearer ${api.token}`;
      }

      const requestOptions = {
        method: options.method,
        headers,
        ...(options.body && { body: JSON.stringify(options.body) })
      };

      // Actualizar rate limiting
      this.updateRateLimit(api.name);

      const response = await fetch(url, requestOptions);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return response;

    } catch (error) {
      if (attempt < this.retryConfig.maxRetries && options.retry) {
        const delay = this.calculateRetryDelay(attempt);
        console.log(`Reintentando petición a ${endpoint} en ${delay}ms (intento ${attempt})`);
        
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.makeRequestWithRetry(api, endpoint, options, attempt + 1);
      }
      
      throw error;
    }
  }

  // Calcular delay para retry
  calculateRetryDelay(attempt) {
    const delay = this.retryConfig.baseDelay * Math.pow(2, attempt - 1);
    return Math.min(delay, this.retryConfig.maxDelay);
  }

  // Verificar rate limiting
  isRateLimited(apiName) {
    const api = this.apis.get(apiName);
    if (!api || !api.rateLimit) return false;

    const now = Date.now();
    const windowStart = now - api.rateLimit.window;

    // Limpiar requests antiguos
    if (api.lastRequest < windowStart) {
      api.requestCount = 0;
    }

    return api.requestCount >= api.rateLimit.requests;
  }

  // Actualizar rate limiting
  updateRateLimit(apiName) {
    const api = this.apis.get(apiName);
    if (!api) return;

    const now = Date.now();
    api.lastRequest = now;
    api.requestCount++;
  }

  // Geocodificar dirección
  async geocodeAddress(address) {
    try {
      const data = await this.request('geocoding', `/${encodeURIComponent(address)}.json`, {
        useCache: true,
        cacheKey: `geocode_${address}`
      });

      if (data.features && data.features.length > 0) {
        const feature = data.features[0];
        return {
          latitude: feature.center[1],
          longitude: feature.center[0],
          address: feature.place_name,
          confidence: feature.relevance
        };
      }

      throw new Error('No se encontró la dirección');
    } catch (error) {
      console.error('Error geocodificando dirección:', error);
      throw error;
    }
  }

  // Validar documento
  async validateDocument(documentType, documentNumber) {
    try {
      const data = await this.request('documentValidation', '/validate', {
        method: 'POST',
        body: { type: documentType, number: documentNumber },
        useCache: true,
        cacheKey: `validation_${documentType}_${documentNumber}`
      });

      return {
        isValid: data.valid,
        details: data.details,
        confidence: data.confidence
      };
    } catch (error) {
      console.error('Error validando documento:', error);
      throw error;
    }
  }

  // Enviar notificación push
  async sendPushNotification(token, title, body, data = {}) {
    try {
      const message = {
        to: token,
        notification: {
          title,
          body
        },
        data: {
          ...data,
          click_action: 'FLUTTER_NOTIFICATION_CLICK'
        }
      };

      await this.request('pushNotifications', '', {
        method: 'POST',
        body: message,
        useCache: false
      });

      return { success: true };
    } catch (error) {
      console.error('Error enviando notificación push:', error);
      throw error;
    }
  }

  // Convertir moneda
  async convertCurrency(from, to, amount) {
    try {
      const data = await this.request('currencyConverter', `/${from}`, {
        useCache: true,
        cacheKey: `currency_${from}_${to}`
      });

      const rate = data.rates[to];
      if (!rate) {
        throw new Error(`Tasa de cambio no disponible para ${to}`);
      }

      return {
        from,
        to,
        amount,
        convertedAmount: amount * rate,
        rate,
        date: data.date
      };
    } catch (error) {
      console.error('Error convirtiendo moneda:', error);
      throw error;
    }
  }

  // Obtener estadísticas de uso
  getUsageStats() {
    const stats = {};
    
    for (const [name, api] of this.apis.entries()) {
      stats[name] = {
        requestCount: api.requestCount,
        lastRequest: api.lastRequest,
        rateLimit: api.rateLimit
      };
    }

    return stats;
  }

  // Limpiar estadísticas
  clearStats() {
    for (const api of this.apis.values()) {
      api.requestCount = 0;
      api.lastRequest = 0;
    }
  }
}

// Instancia singleton
const externalAPIManager = new ExternalAPIManager();

export default externalAPIManager; 