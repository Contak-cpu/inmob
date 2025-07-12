// Sistema de notificaciones para Konrad Inmobiliaria

// Tipos de notificación
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};

// Sistema de logging silencioso en producción
const logError = (message, error) => {
  if (process.env.NODE_ENV !== 'production') {
    console.error(message, error);
  }
};

// Claves para localStorage
const NOTIFICATION_KEYS = {
  NOTIFICATIONS: 'konrad_notifications',
  SETTINGS: 'konrad_notification_settings',
};

// Configuración por defecto
const DEFAULT_SETTINGS = {
  enabled: true,
  sound: true,
  desktop: true,
  email: false,
  autoHide: true,
  duration: 5000,
};

// ===== GESTIÓN DE NOTIFICACIONES =====

// Crear notificación
export const createNotification = (type, title, message, options = {}) => {
  const notification = {
    id: generateId(),
    type,
    title,
    message,
    timestamp: new Date().toISOString(),
    read: false,
    ...options,
  };

  // Guardar notificación
  saveNotification(notification);

  // Mostrar toast si está habilitado
  if (typeof window !== 'undefined' && window.showToast) {
    window.showToast(notification);
  }

  return notification;
};

// Guardar notificación
const saveNotification = (notification) => {
  try {
    const notifications = getNotifications();
    notifications.unshift(notification);
    
    // Mantener solo las últimas 100 notificaciones
    if (notifications.length > 100) {
      notifications.splice(100);
    }
    
    localStorage.setItem(NOTIFICATION_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  } catch (error) {
    logError('Error al guardar notificación:', error);
  }
};

// Obtener notificaciones
export const getNotifications = (limit = 50) => {
  try {
    const data = localStorage.getItem(NOTIFICATION_KEYS.NOTIFICATIONS);
    const notifications = data ? JSON.parse(data) : [];
    return limit ? notifications.slice(0, limit) : notifications;
  } catch (error) {
    logError('Error al cargar notificaciones:', error);
    return [];
  }
};

// Marcar notificación como leída
export const markNotificationAsRead = (id) => {
  try {
    const notifications = getNotifications();
    const index = notifications.findIndex(n => n.id === id);
    
    if (index !== -1) {
      notifications[index].read = true;
      localStorage.setItem(NOTIFICATION_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
    }
  } catch (error) {
    logError('Error al marcar notificación como leída:', error);
  }
};

// Eliminar notificación
export const deleteNotification = (id) => {
  try {
    const notifications = getNotifications();
    const filtered = notifications.filter(n => n.id !== id);
    localStorage.setItem(NOTIFICATION_KEYS.NOTIFICATIONS, JSON.stringify(filtered));
  } catch (error) {
    logError('Error al eliminar notificación:', error);
  }
};

// Limpiar todas las notificaciones
export const clearAllNotifications = () => {
  try {
    localStorage.removeItem(NOTIFICATION_KEYS.NOTIFICATIONS);
  } catch (error) {
    logError('Error al limpiar notificaciones:', error);
  }
};

// ===== NOTIFICACIONES ESPECÍFICAS =====

// Notificación de contrato creado
export const notifyContractCreated = (contractData) => {
  return createNotification(
    NOTIFICATION_TYPES.SUCCESS,
    'Contrato Generado',
    `Contrato de ${contractData.contractType} generado exitosamente para ${contractData.tenantName}`,
    {
      action: 'view',
      data: { type: 'contract', id: contractData.id }
    }
  );
};

// Notificación de recibo creado
export const notifyReceiptCreated = (receiptData) => {
  return createNotification(
    NOTIFICATION_TYPES.SUCCESS,
    'Recibo Generado',
    `Recibo de ${receiptData.receiptType} generado exitosamente para ${receiptData.tenantName || receiptData.clientName}`,
    {
      action: 'view',
      data: { type: 'receipt', id: receiptData.id }
    }
  );
};

// Notificación de error
export const notifyError = (title, message) => {
  return createNotification(
    NOTIFICATION_TYPES.ERROR,
    title,
    message
  );
};

// Notificación de éxito
export const notifySuccess = (title, message) => {
  return createNotification(
    NOTIFICATION_TYPES.SUCCESS,
    title,
    message
  );
};

// Notificación de advertencia
export const notifyWarning = (title, message) => {
  return createNotification(
    NOTIFICATION_TYPES.WARNING,
    title,
    message
  );
};

// Notificación de información
export const notifyInfo = (title, message) => {
  return createNotification(
    NOTIFICATION_TYPES.INFO,
    title,
    message
  );
};

// ===== CONFIGURACIÓN =====

// Obtener configuración
export const getNotificationSettings = () => {
  try {
    const data = localStorage.getItem(NOTIFICATION_KEYS.SETTINGS);
    return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
  } catch (error) {
    logError('Error al cargar configuración de notificaciones:', error);
    return DEFAULT_SETTINGS;
  }
};

// Guardar configuración
export const saveNotificationSettings = (settings) => {
  try {
    localStorage.setItem(NOTIFICATION_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (error) {
    logError('Error al guardar configuración de notificaciones:', error);
  }
};

// ===== UTILIDADES =====

// Generar ID único
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// ===== RECORDATORIOS =====

// Crear recordatorio
export const createReminder = (title, message, dueDate, type = 'general') => {
  return createNotification(
    NOTIFICATION_TYPES.REMINDER,
    title,
    message,
    {
      dueDate,
      type,
      autoHide: false,
    }
  );
};

// Recordatorio de vencimiento de contrato
export const createContractExpiryReminder = (contractData) => {
  const expiryDate = new Date(contractData.startDate);
  expiryDate.setMonth(expiryDate.getMonth() + parseInt(contractData.duration));
  
  const daysUntilExpiry = Math.ceil((expiryDate - new Date()) / (1000 * 60 * 60 * 24));
  
  if (daysUntilExpiry <= 30) {
    return createReminder(
      'Vencimiento de Contrato',
      `El contrato de ${contractData.tenantName} vence en ${daysUntilExpiry} días`,
      expiryDate,
      'contract_expiry'
    );
  }
  
  return null;
};

// Recordatorio de pago de alquiler
export const createRentPaymentReminder = (tenantName, propertyAddress, dueDate) => {
  const daysUntilDue = Math.ceil((new Date(dueDate) - new Date()) / (1000 * 60 * 60 * 24));
  
  if (daysUntilDue <= 7) {
    return createReminder(
      'Pago de Alquiler',
      `Recordatorio: Pago de alquiler de ${tenantName} vence en ${daysUntilDue} días`,
      dueDate,
      'rent_payment'
    );
  }
  
  return null;
};

// ===== PERSISTENCIA =====

// Guardar notificaciones en localStorage
const saveNotifications = () => {
  try {
    localStorage.setItem('konrad_notifications', JSON.stringify(notifications));
  } catch (error) {
    console.error('Error al guardar notificaciones:', error);
  }
};

// Cargar notificaciones desde localStorage
const loadNotifications = () => {
  try {
    const saved = localStorage.getItem('konrad_notifications');
    if (saved) {
      notifications = JSON.parse(saved);
      notificationId = notifications.length > 0 ? Math.max(...notifications.map(n => n.id)) : 0;
    }
  } catch (error) {
    console.error('Error al cargar notificaciones:', error);
    notifications = [];
  }
};

// ===== NOTIFICACIONES VISUALES =====

// Mostrar notificación visual
const showVisualNotification = (notification) => {
  // Crear elemento de notificación
  const notificationElement = document.createElement('div');
  notificationElement.className = `fixed ${getPositionClass()} z-50 p-4 rounded-lg shadow-lg max-w-sm transform transition-all duration-300 translate-x-full`;
  
  // Aplicar estilos según tipo
  const typeStyles = getTypeStyles(notification.type);
  Object.assign(notificationElement.style, typeStyles);
  
  // Contenido de la notificación
  notificationElement.innerHTML = `
    <div class="flex items-start space-x-3">
      <div class="flex-shrink-0">
        ${getTypeIcon(notification.type)}
      </div>
      <div class="flex-1 min-w-0">
        <h4 class="text-sm font-medium text-white">${notification.title}</h4>
        <p class="text-sm text-gray-200 mt-1">${notification.message}</p>
      </div>
      <button onclick="this.parentElement.parentElement.remove()" class="text-gray-300 hover:text-white">
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>
  `;
  
  // Agregar al DOM
  document.body.appendChild(notificationElement);
  
  // Animación de entrada
  setTimeout(() => {
    notificationElement.style.transform = 'translateX(0)';
  }, 100);
  
  // Auto-hide si está configurado
  if (notification.autoHide !== false) {
    setTimeout(() => {
      notificationElement.style.transform = 'translateX(full)';
      setTimeout(() => {
        if (notificationElement.parentNode) {
          notificationElement.parentNode.removeChild(notificationElement);
        }
      }, 300);
    }, NOTIFICATION_CONFIG.autoHideDelay);
  }
};

// Obtener clase de posición
const getPositionClass = () => {
  switch (NOTIFICATION_CONFIG.position) {
    case 'top-right':
      return 'top-4 right-4';
    case 'top-left':
      return 'top-4 left-4';
    case 'bottom-right':
      return 'bottom-4 right-4';
    case 'bottom-left':
      return 'bottom-4 left-4';
    default:
      return 'top-4 right-4';
  }
};

// Obtener estilos según tipo
const getTypeStyles = (type) => {
  const baseStyles = {
    backgroundColor: '#1f2937',
    border: '1px solid #374151',
    color: '#ffffff',
  };
  
  switch (type) {
    case NOTIFICATION_TYPES.SUCCESS:
      return { ...baseStyles, borderColor: '#10b981', backgroundColor: '#065f46' };
    case NOTIFICATION_TYPES.ERROR:
      return { ...baseStyles, borderColor: '#ef4444', backgroundColor: '#991b1b' };
    case NOTIFICATION_TYPES.WARNING:
      return { ...baseStyles, borderColor: '#f59e0b', backgroundColor: '#92400e' };
    case NOTIFICATION_TYPES.INFO:
      return { ...baseStyles, borderColor: '#3b82f6', backgroundColor: '#1e3a8a' };
    case NOTIFICATION_TYPES.REMINDER:
      return { ...baseStyles, borderColor: '#8b5cf6', backgroundColor: '#5b21b6' };
    default:
      return baseStyles;
  }
};

// Obtener icono según tipo
const getTypeIcon = (type) => {
  switch (type) {
    case NOTIFICATION_TYPES.SUCCESS:
      return '<svg class="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>';
    case NOTIFICATION_TYPES.ERROR:
      return '<svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path></svg>';
    case NOTIFICATION_TYPES.WARNING:
      return '<svg class="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>';
    case NOTIFICATION_TYPES.INFO:
      return '<svg class="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>';
    case NOTIFICATION_TYPES.REMINDER:
      return '<svg class="h-5 w-5 text-purple-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"></path></svg>';
    default:
      return '<svg class="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>';
  }
};

// ===== INICIALIZACIÓN =====

// Inicializar sistema de notificaciones
export const initializeNotifications = () => {
  loadNotifications();
  
  // Verificar recordatorios pendientes
  checkPendingReminders();
  
  // Configurar verificación periódica
  setInterval(checkPendingReminders, 60000); // Cada minuto
};

// Verificar recordatorios pendientes
const checkPendingReminders = () => {
  const unreadNotifications = getUnreadNotifications();
  const reminders = unreadNotifications.filter(n => n.type === NOTIFICATION_TYPES.REMINDER);
  
  reminders.forEach(reminder => {
    if (reminder.dueDate && new Date(reminder.dueDate) <= new Date()) {
      // Mostrar recordatorio vencido
      showVisualNotification(reminder);
    }
  });
};

// Inicializar cuando el DOM esté listo
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', initializeNotifications);
} 