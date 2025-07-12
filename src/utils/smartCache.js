class SmartCache {
  constructor() {
    this.cache = new Map();
    this.metadata = new Map();
    this.maxSize = 100;
    this.cleanupInterval = 5 * 60 * 1000; // 5 minutos
    this.startCleanup();
  }

  // Establecer un valor en caché
  set(key, value, options = {}) {
    const {
      ttl = 30 * 60 * 1000, // 30 minutos por defecto
      priority = 'normal',
      tags = [],
      persist = false
    } = options;

    const metadata = {
      timestamp: Date.now(),
      ttl,
      priority,
      tags,
      persist,
      accessCount: 0,
      lastAccessed: Date.now()
    };

    // Verificar si hay espacio disponible
    if (this.cache.size >= this.maxSize) {
      this.evictLeastImportant();
    }

    this.cache.set(key, value);
    this.metadata.set(key, metadata);

    // Persistir si es necesario
    if (persist) {
      this.persistToStorage(key, value, metadata);
    }
  }

  // Obtener un valor del caché
  get(key) {
    const value = this.cache.get(key);
    const metadata = this.metadata.get(key);

    if (!value || !metadata) {
      return null;
    }

    // Verificar si ha expirado
    if (this.isExpired(metadata)) {
      this.delete(key);
      return null;
    }

    // Actualizar estadísticas de acceso
    metadata.accessCount++;
    metadata.lastAccessed = Date.now();

    return value;
  }

  // Verificar si un elemento ha expirado
  isExpired(metadata) {
    return Date.now() - metadata.timestamp > metadata.ttl;
  }

  // Eliminar un elemento del caché
  delete(key) {
    this.cache.delete(key);
    this.metadata.delete(key);
    this.removeFromStorage(key);
  }

  // Limpiar elementos expirados
  cleanup() {
    const now = Date.now();
    const expiredKeys = [];

    for (const [key, metadata] of this.metadata.entries()) {
      if (this.isExpired(metadata)) {
        expiredKeys.push(key);
      }
    }

    expiredKeys.forEach(key => this.delete(key));
  }

  // Evictar elementos menos importantes
  evictLeastImportant() {
    const entries = Array.from(this.metadata.entries());
    
    // Ordenar por prioridad y último acceso
    entries.sort((a, b) => {
      const priorityOrder = { high: 3, normal: 2, low: 1 };
      const aPriority = priorityOrder[a[1].priority] || 2;
      const bPriority = priorityOrder[b[1].priority] || 2;
      
      if (aPriority !== bPriority) {
        return aPriority - bPriority;
      }
      
      return a[1].lastAccessed - b[1].lastAccessed;
    });

    // Eliminar el elemento menos importante
    const leastImportant = entries[0];
    if (leastImportant) {
      this.delete(leastImportant[0]);
    }
  }

  // Obtener estadísticas del caché
  getStats() {
    const stats = {
      size: this.cache.size,
      maxSize: this.maxSize,
      hitRate: 0,
      totalHits: 0,
      totalRequests: 0,
      expiredItems: 0,
      byPriority: { high: 0, normal: 0, low: 0 },
      byTag: {}
    };

    let totalHits = 0;
    let totalRequests = 0;

    for (const [key, metadata] of this.metadata.entries()) {
      totalHits += metadata.accessCount;
      totalRequests += metadata.accessCount + 1; // +1 por la primera carga
      
      if (this.isExpired(metadata)) {
        stats.expiredItems++;
      }

      stats.byPriority[metadata.priority] = (stats.byPriority[metadata.priority] || 0) + 1;

      metadata.tags.forEach(tag => {
        stats.byTag[tag] = (stats.byTag[tag] || 0) + 1;
      });
    }

    stats.totalHits = totalHits;
    stats.totalRequests = totalRequests;
    stats.hitRate = totalRequests > 0 ? (totalHits / totalRequests) * 100 : 0;

    return stats;
  }

  // Buscar elementos por tag
  findByTag(tag) {
    const results = [];
    
    for (const [key, metadata] of this.metadata.entries()) {
      if (metadata.tags.includes(tag)) {
        const value = this.cache.get(key);
        if (value && !this.isExpired(metadata)) {
          results.push({ key, value, metadata });
        }
      }
    }

    return results;
  }

  // Invalidar elementos por tag
  invalidateByTag(tag) {
    const keysToDelete = [];
    
    for (const [key, metadata] of this.metadata.entries()) {
      if (metadata.tags.includes(tag)) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => this.delete(key));
  }

  // Precalentar caché
  prewarm(keys) {
    return Promise.all(
      keys.map(async key => {
        try {
          // Simular carga de datos
          const data = await this.loadData(key);
          this.set(key, data, { priority: 'high', tags: ['prewarmed'] });
        } catch (error) {
          console.error(`Error precalentando ${key}:`, error);
        }
      })
    );
  }

  // Simular carga de datos
  async loadData(key) {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Simular diferentes tipos de datos
    const mockData = {
      'users': Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        name: `Usuario ${i + 1}`,
        email: `usuario${i + 1}@example.com`,
        role: i % 3 === 0 ? 'admin' : 'user'
      })),
      'contracts': Array.from({ length: 30 }, (_, i) => ({
        id: i + 1,
        title: `Contrato ${i + 1}`,
        client: `Cliente ${i + 1}`,
        amount: Math.floor(Math.random() * 100000) + 10000,
        status: ['active', 'pending', 'completed'][i % 3]
      })),
      'receipts': Array.from({ length: 40 }, (_, i) => ({
        id: i + 1,
        number: `R-${String(i + 1).padStart(4, '0')}`,
        amount: Math.floor(Math.random() * 5000) + 1000,
        date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        status: ['paid', 'pending', 'overdue'][i % 3]
      }))
    };

    return mockData[key] || [];
  }

  // Persistir en localStorage
  persistToStorage(key, value, metadata) {
    try {
      const data = {
        value,
        metadata: {
          ...metadata,
          timestamp: Date.now()
        }
      };
      localStorage.setItem(`cache_${key}`, JSON.stringify(data));
    } catch (error) {
      console.error('Error persistiendo en caché:', error);
    }
  }

  // Remover de localStorage
  removeFromStorage(key) {
    try {
      localStorage.removeItem(`cache_${key}`);
    } catch (error) {
      console.error('Error removiendo de caché:', error);
    }
  }

  // Cargar desde localStorage
  loadFromStorage() {
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('cache_')) {
          const data = JSON.parse(localStorage.getItem(key));
          const cacheKey = key.replace('cache_', '');
          
          if (data && !this.isExpired(data.metadata)) {
            this.cache.set(cacheKey, data.value);
            this.metadata.set(cacheKey, data.metadata);
          } else {
            localStorage.removeItem(key);
          }
        }
      }
    } catch (error) {
      console.error('Error cargando caché desde storage:', error);
    }
  }

  // Iniciar limpieza automática
  startCleanup() {
    setInterval(() => {
      this.cleanup();
    }, this.cleanupInterval);
  }

  // Limpiar todo el caché
  clear() {
    this.cache.clear();
    this.metadata.clear();
    
    // Limpiar localStorage
    try {
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key && key.startsWith('cache_')) {
          localStorage.removeItem(key);
        }
      }
    } catch (error) {
      console.error('Error limpiando localStorage:', error);
    }
  }
}

// Instancia singleton
const smartCache = new SmartCache();

// Cargar datos persistentes al inicializar
smartCache.loadFromStorage();

export default smartCache; 