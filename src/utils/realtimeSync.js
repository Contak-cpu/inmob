class RealtimeSync {
  constructor() {
    this.ws = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
    this.subscribers = new Map();
    this.pendingUpdates = new Map();
    this.isConnected = false;
    this.connectionStatus = 'disconnected';
  }

  // Conectar al WebSocket
  connect(url = 'ws://localhost:3001') {
    try {
      this.ws = new WebSocket(url);
      this.setupEventListeners();
    } catch (error) {
      console.error('Error conectando WebSocket:', error);
      this.handleConnectionError();
    }
  }

  // Configurar event listeners
  setupEventListeners() {
    this.ws.onopen = () => {
      console.log('WebSocket conectado');
      this.isConnected = true;
      this.connectionStatus = 'connected';
      this.reconnectAttempts = 0;
      this.notifySubscribers('connection', { status: 'connected' });
      this.syncPendingUpdates();
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.handleMessage(data);
      } catch (error) {
        console.error('Error procesando mensaje:', error);
      }
    };

    this.ws.onclose = () => {
      console.log('WebSocket desconectado');
      this.isConnected = false;
      this.connectionStatus = 'disconnected';
      this.notifySubscribers('connection', { status: 'disconnected' });
      this.attemptReconnect();
    };

    this.ws.onerror = (error) => {
      console.error('Error en WebSocket:', error);
      this.handleConnectionError();
    };
  }

  // Manejar mensajes recibidos
  handleMessage(data) {
    const { type, payload, timestamp, id } = data;

    switch (type) {
      case 'data_update':
        this.handleDataUpdate(payload, timestamp, id);
        break;
      case 'conflict_resolution':
        this.handleConflictResolution(payload);
        break;
      case 'sync_request':
        this.handleSyncRequest(payload);
        break;
      case 'user_activity':
        this.handleUserActivity(payload);
        break;
      default:
        console.log('Mensaje no reconocido:', type);
    }
  }

  // Manejar actualizaciones de datos
  handleDataUpdate(payload, timestamp, id) {
    const { entity, data, operation } = payload;
    
    // Verificar si hay conflictos
    if (this.hasConflict(entity, data, timestamp)) {
      this.resolveConflict(entity, data, timestamp, id);
    } else {
      this.applyUpdate(entity, data, operation);
      this.notifySubscribers('data_update', { entity, data, operation });
    }
  }

  // Verificar conflictos
  hasConflict(entity, data, timestamp) {
    const localData = this.getLocalData(entity);
    if (!localData) return false;

    // Comparar timestamps para detectar conflictos
    return localData.lastModified > timestamp;
  }

  // Resolver conflictos
  resolveConflict(entity, data, timestamp, id) {
    const conflictData = {
      entity,
      localData: this.getLocalData(entity),
      serverData: data,
      timestamp,
      id
    };

    this.notifySubscribers('conflict', conflictData);
    
    // Enviar conflicto al servidor
    this.sendMessage({
      type: 'conflict_detected',
      payload: conflictData
    });
  }

  // Aplicar actualización
  applyUpdate(entity, data, operation) {
    const localData = this.getLocalData(entity) || [];
    
    switch (operation) {
      case 'create':
        localData.push(data);
        break;
      case 'update':
        const index = localData.findIndex(item => item.id === data.id);
        if (index !== -1) {
          localData[index] = { ...localData[index], ...data };
        }
        break;
      case 'delete':
        const deleteIndex = localData.findIndex(item => item.id === data.id);
        if (deleteIndex !== -1) {
          localData.splice(deleteIndex, 1);
        }
        break;
    }

    this.setLocalData(entity, localData);
  }

  // Enviar mensaje al servidor
  sendMessage(message) {
    if (this.isConnected && this.ws) {
      this.ws.send(JSON.stringify({
        ...message,
        timestamp: Date.now()
      }));
    } else {
      // Guardar para sincronización posterior
      this.addPendingUpdate(message);
    }
  }

  // Agregar actualización pendiente
  addPendingUpdate(message) {
    const key = `${message.type}_${Date.now()}`;
    this.pendingUpdates.set(key, message);
  }

  // Sincronizar actualizaciones pendientes
  syncPendingUpdates() {
    if (!this.isConnected) return;

    this.pendingUpdates.forEach((message, key) => {
      this.sendMessage(message);
      this.pendingUpdates.delete(key);
    });
  }

  // Suscribirse a eventos
  subscribe(event, callback) {
    if (!this.subscribers.has(event)) {
      this.subscribers.set(event, []);
    }
    this.subscribers.get(event).push(callback);

    // Retornar función para desuscribirse
    return () => {
      const callbacks = this.subscribers.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    };
  }

  // Notificar a suscriptores
  notifySubscribers(event, data) {
    const callbacks = this.subscribers.get(event);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('Error en callback:', error);
        }
      });
    }
  }

  // Intentar reconectar
  attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      this.connectionStatus = 'reconnecting';
      
      setTimeout(() => {
        console.log(`Intento de reconexión ${this.reconnectAttempts}`);
        this.connect();
      }, this.reconnectDelay * this.reconnectAttempts);
    } else {
      this.connectionStatus = 'failed';
      this.notifySubscribers('connection', { 
        status: 'failed', 
        message: 'No se pudo reconectar al servidor' 
      });
    }
  }

  // Manejar errores de conexión
  handleConnectionError() {
    this.connectionStatus = 'error';
    this.notifySubscribers('connection', { 
      status: 'error', 
      message: 'Error de conexión' 
    });
  }

  // Obtener datos locales
  getLocalData(entity) {
    try {
      const data = localStorage.getItem(`sync_${entity}`);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error obteniendo datos locales:', error);
      return null;
    }
  }

  // Establecer datos locales
  setLocalData(entity, data) {
    try {
      localStorage.setItem(`sync_${entity}`, JSON.stringify(data));
    } catch (error) {
      console.error('Error guardando datos locales:', error);
    }
  }

  // Obtener estado de conexión
  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      status: this.connectionStatus,
      reconnectAttempts: this.reconnectAttempts
    };
  }

  // Desconectar
  disconnect() {
    if (this.ws) {
      this.ws.close();
    }
  }
}

// Instancia singleton
const realtimeSync = new RealtimeSync();

export default realtimeSync; 