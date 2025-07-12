class OfflineManager {
  constructor() {
    this.isOnline = navigator.onLine;
    this.pendingActions = [];
    this.syncQueue = [];
    this.offlineData = new Map();
    this.syncInterval = null;
    this.setupEventListeners();
    this.loadOfflineData();
  }

  // Configurar event listeners
  setupEventListeners() {
    window.addEventListener('online', () => {
      this.handleOnline();
    });

    window.addEventListener('offline', () => {
      this.handleOffline();
    });

    // Escuchar cambios de visibilidad para sincronizar cuando la app vuelve a estar activa
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && this.isOnline) {
        this.syncPendingActions();
      }
    });
  }

  // Manejar cuando se conecta
  handleOnline() {
    console.log('Conexión restaurada');
    this.isOnline = true;
    this.notifyStatusChange('online');
    this.syncPendingActions();
    this.startSyncInterval();
  }

  // Manejar cuando se desconecta
  handleOffline() {
    console.log('Conexión perdida');
    this.isOnline = false;
    this.notifyStatusChange('offline');
    this.stopSyncInterval();
  }

  // Agregar acción pendiente
  addPendingAction(action) {
    const pendingAction = {
      id: this.generateId(),
      action,
      timestamp: Date.now(),
      retryCount: 0,
      maxRetries: 3
    };

    this.pendingActions.push(pendingAction);
    this.saveOfflineData();
    this.notifyActionAdded(pendingAction);
  }

  // Sincronizar acciones pendientes
  async syncPendingActions() {
    if (!this.isOnline || this.pendingActions.length === 0) {
      return;
    }

    console.log(`Sincronizando ${this.pendingActions.length} acciones pendientes...`);

    const actionsToProcess = [...this.pendingActions];
    const successfulActions = [];
    const failedActions = [];

    for (const pendingAction of actionsToProcess) {
      try {
        await this.processAction(pendingAction);
        successfulActions.push(pendingAction);
      } catch (error) {
        console.error('Error procesando acción:', error);
        pendingAction.retryCount++;
        
        if (pendingAction.retryCount >= pendingAction.maxRetries) {
          failedActions.push(pendingAction);
        }
      }
    }

    // Remover acciones exitosas
    successfulActions.forEach(action => {
      const index = this.pendingActions.findIndex(a => a.id === action.id);
      if (index > -1) {
        this.pendingActions.splice(index, 1);
      }
    });

    // Remover acciones fallidas definitivamente
    failedActions.forEach(action => {
      const index = this.pendingActions.findIndex(a => a.id === action.id);
      if (index > -1) {
        this.pendingActions.splice(index, 1);
      }
    });

    this.saveOfflineData();
    this.notifySyncComplete(successfulActions, failedActions);
  }

  // Procesar una acción específica
  async processAction(pendingAction) {
    const { action } = pendingAction;

    switch (action.type) {
      case 'CREATE_CONTRACT':
        return this.processCreateContract(action.data);
      case 'UPDATE_CONTRACT':
        return this.processUpdateContract(action.data);
      case 'DELETE_CONTRACT':
        return this.processDeleteContract(action.data);
      case 'CREATE_RECEIPT':
        return this.processCreateReceipt(action.data);
      case 'UPDATE_RECEIPT':
        return this.processUpdateReceipt(action.data);
      case 'DELETE_RECEIPT':
        return this.processDeleteReceipt(action.data);
      case 'CREATE_USER':
        return this.processCreateUser(action.data);
      case 'UPDATE_USER':
        return this.processUpdateUser(action.data);
      case 'DELETE_USER':
        return this.processDeleteUser(action.data);
      default:
        throw new Error(`Tipo de acción no soportado: ${action.type}`);
    }
  }

  // Procesar creación de contrato
  async processCreateContract(data) {
    // Simular llamada a API
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Aquí iría la lógica real de creación
    console.log('Creando contrato:', data);
    
    return { success: true, id: this.generateId() };
  }

  // Procesar actualización de contrato
  async processUpdateContract(data) {
    await new Promise(resolve => setTimeout(resolve, 300));
    console.log('Actualizando contrato:', data);
    return { success: true };
  }

  // Procesar eliminación de contrato
  async processDeleteContract(data) {
    await new Promise(resolve => setTimeout(resolve, 200));
    console.log('Eliminando contrato:', data);
    return { success: true };
  }

  // Procesar creación de recibo
  async processCreateReceipt(data) {
    await new Promise(resolve => setTimeout(resolve, 400));
    console.log('Creando recibo:', data);
    return { success: true, id: this.generateId() };
  }

  // Procesar actualización de recibo
  async processUpdateReceipt(data) {
    await new Promise(resolve => setTimeout(resolve, 300));
    console.log('Actualizando recibo:', data);
    return { success: true };
  }

  // Procesar eliminación de recibo
  async processDeleteReceipt(data) {
    await new Promise(resolve => setTimeout(resolve, 200));
    console.log('Eliminando recibo:', data);
    return { success: true };
  }

  // Procesar creación de usuario
  async processCreateUser(data) {
    await new Promise(resolve => setTimeout(resolve, 600));
    console.log('Creando usuario:', data);
    return { success: true, id: this.generateId() };
  }

  // Procesar actualización de usuario
  async processUpdateUser(data) {
    await new Promise(resolve => setTimeout(resolve, 400));
    console.log('Actualizando usuario:', data);
    return { success: true };
  }

  // Procesar eliminación de usuario
  async processDeleteUser(data) {
    await new Promise(resolve => setTimeout(resolve, 300));
    console.log('Eliminando usuario:', data);
    return { success: true };
  }

  // Guardar datos offline
  saveOfflineData() {
    try {
      const data = {
        pendingActions: this.pendingActions,
        offlineData: Array.from(this.offlineData.entries()),
        timestamp: Date.now()
      };
      localStorage.setItem('offline_data', JSON.stringify(data));
    } catch (error) {
      console.error('Error guardando datos offline:', error);
    }
  }

  // Cargar datos offline
  loadOfflineData() {
    try {
      const data = localStorage.getItem('offline_data');
      if (data) {
        const parsed = JSON.parse(data);
        this.pendingActions = parsed.pendingActions || [];
        this.offlineData = new Map(parsed.offlineData || []);
      }
    } catch (error) {
      console.error('Error cargando datos offline:', error);
    }
  }

  // Iniciar intervalo de sincronización
  startSyncInterval() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }
    
    this.syncInterval = setInterval(() => {
      if (this.isOnline && this.pendingActions.length > 0) {
        this.syncPendingActions();
      }
    }, 30000); // Sincronizar cada 30 segundos
  }

  // Detener intervalo de sincronización
  stopSyncInterval() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  // Generar ID único
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Notificar cambio de estado
  notifyStatusChange(status) {
    const event = new CustomEvent('offlineStatusChange', {
      detail: { status, timestamp: Date.now() }
    });
    window.dispatchEvent(event);
  }

  // Notificar acción agregada
  notifyActionAdded(action) {
    const event = new CustomEvent('offlineActionAdded', {
      detail: { action, pendingCount: this.pendingActions.length }
    });
    window.dispatchEvent(event);
  }

  // Notificar sincronización completada
  notifySyncComplete(successful, failed) {
    const event = new CustomEvent('offlineSyncComplete', {
      detail: { 
        successful, 
        failed, 
        pendingCount: this.pendingActions.length 
      }
    });
    window.dispatchEvent(event);
  }

  // Obtener estado actual
  getStatus() {
    return {
      isOnline: this.isOnline,
      pendingActionsCount: this.pendingActions.length,
      lastSync: this.lastSync,
      offlineDataSize: this.offlineData.size
    };
  }

  // Obtener acciones pendientes
  getPendingActions() {
    return [...this.pendingActions];
  }

  // Limpiar acciones pendientes
  clearPendingActions() {
    this.pendingActions = [];
    this.saveOfflineData();
  }

  // Obtener estadísticas
  getStats() {
    const stats = {
      totalActions: this.pendingActions.length,
      byType: {},
      oldestAction: null,
      newestAction: null
    };

    if (this.pendingActions.length > 0) {
      this.pendingActions.forEach(action => {
        const type = action.action.type;
        stats.byType[type] = (stats.byType[type] || 0) + 1;
      });

      const sorted = [...this.pendingActions].sort((a, b) => a.timestamp - b.timestamp);
      stats.oldestAction = sorted[0];
      stats.newestAction = sorted[sorted.length - 1];
    }

    return stats;
  }
}

// Instancia singleton
const offlineManager = new OfflineManager();

export default offlineManager; 