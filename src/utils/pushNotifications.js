// Sistema de notificaciones push para recordatorios críticos

// Tipos de notificaciones push
export const PUSH_TYPES = {
  CONTRACT_EXPIRY: 'contract_expiry',
  RENT_PAYMENT: 'rent_payment',
  URGENT_REPAIR: 'urgent_repair',
  SYSTEM_ALERT: 'system_alert',
  PAYMENT_OVERDUE: 'payment_overdue',
};

// Configuración de notificaciones push
const PUSH_CONFIG = {
  enablePush: true,
  enableSound: true,
  enableVibration: true,
  criticalThreshold: 3, // días para recordatorios críticos
  urgentThreshold: 1, // día para recordatorios urgentes
};

// Estado de notificaciones push
let pushPermission = false;
const pushSubscription = null;

// ===== GESTIÓN DE PERMISOS =====

// Solicitar permisos de notificación push
export const requestPushPermission = async () => {
  if (!('Notification' in window)) {
    // Log silencioso en producción
    if (process.env.NODE_ENV !== 'production') {
      console.log('Este navegador no soporta notificaciones push');
    }
    return false;
  }

  if (Notification.permission === 'granted') {
    pushPermission = true;
    return true;
  }

  if (Notification.permission === 'denied') {
    // Log silencioso en producción
    if (process.env.NODE_ENV !== 'production') {
      console.log('Permisos de notificación denegados');
    }
    return false;
  }

  try {
    const permission = await Notification.requestPermission();
    pushPermission = permission === 'granted';
    return pushPermission;
  } catch (error) {
    // Error silencioso en producción
    if (process.env.NODE_ENV !== 'production') {
      console.error('Error al solicitar permisos de notificación:', error);
    }
    return false;
  }
};

// Verificar si las notificaciones push están disponibles
export const isPushAvailable = () => {
  return 'Notification' in window && pushPermission;
};

// ===== NOTIFICACIONES PUSH CRÍTICAS =====

// Crear notificación push crítica
export const createCriticalPush = (type, title, message, options = {}) => {
  if (!isPushAvailable()) {
    return false;
  }

  const defaultOptions = {
    icon: '/logo.svg',
    badge: '/logo.svg',
    tag: type,
    requireInteraction: true,
    actions: [
      {
        action: 'view',
        title: 'Ver',
        icon: '/logo.svg'
      },
      {
        action: 'dismiss',
        title: 'Descartar',
        icon: '/logo.svg'
      }
    ],
    data: {
      type,
      timestamp: new Date().toISOString(),
      ...options.data
    }
  };

  const notification = new Notification(title, {
    ...defaultOptions,
    ...options,
    body: message,
    priority: 'high',
    silent: false,
  });

  // Configurar eventos de la notificación
  notification.onclick = (event) => {
    event.preventDefault();
    handleNotificationClick(notification, event);
  };

  notification.onaction = (event) => {
    handleNotificationAction(notification, event);
  };

  return notification;
};

// Notificación de vencimiento crítico de contrato
export const createContractExpiryPush = (contractData) => {
  const expiryDate = new Date(contractData.startDate);
  expiryDate.setMonth(expiryDate.getMonth() + parseInt(contractData.duration));
  
  const daysUntilExpiry = Math.ceil((expiryDate - new Date()) / (1000 * 60 * 60 * 24));
  
  if (daysUntilExpiry <= PUSH_CONFIG.criticalThreshold) {
    const urgency = daysUntilExpiry <= PUSH_CONFIG.urgentThreshold ? 'URGENTE' : 'CRÍTICO';
    
    return createCriticalPush(
      PUSH_TYPES.CONTRACT_EXPIRY,
      `⚠️ ${urgency}: Vencimiento de Contrato`,
      `El contrato de ${contractData.tenantName} vence en ${daysUntilExpiry} día${daysUntilExpiry !== 1 ? 's' : ''}`,
      {
        data: {
          contractId: contractData.id,
          tenantName: contractData.tenantName,
          daysUntilExpiry,
          urgency
        }
      }
    );
  }
  
  return null;
};

// Notificación de pago de alquiler vencido
export const createRentPaymentOverduePush = (tenantName, propertyAddress, daysOverdue) => {
  return createCriticalPush(
    PUSH_TYPES.PAYMENT_OVERDUE,
    '🚨 PAGO VENCIDO',
    `Alquiler de ${tenantName} vencido hace ${daysOverdue} día${daysOverdue !== 1 ? 's' : ''}`,
    {
      data: {
        tenantName,
        propertyAddress,
        daysOverdue,
        urgency: 'URGENTE'
      }
    }
  );
};

// Notificación de reparación urgente
export const createUrgentRepairPush = (repairData) => {
  return createCriticalPush(
    PUSH_TYPES.URGENT_REPAIR,
    '🔧 REPARACIÓN URGENTE',
    `Reparación urgente en ${repairData.propertyAddress}: ${repairData.description}`,
    {
      data: {
        repairId: repairData.id,
        propertyAddress: repairData.propertyAddress,
        description: repairData.description,
        urgency: 'URGENTE'
      }
    }
  );
};

// Notificación de alerta del sistema
export const createSystemAlertPush = (title, message, severity = 'warning') => {
  const icons = {
    error: '🚨',
    warning: '⚠️',
    info: 'ℹ️',
    success: '✅'
  };

  return createCriticalPush(
    PUSH_TYPES.SYSTEM_ALERT,
    `${icons[severity]} ${title}`,
    message,
    {
      data: {
        severity,
        timestamp: new Date().toISOString()
      }
    }
  );
};

// ===== MANEJO DE EVENTOS =====

// Manejar clic en notificación
const handleNotificationClick = (notification, event) => {
  const data = notification.data;
  
  switch (data.type) {
    case PUSH_TYPES.CONTRACT_EXPIRY:
      // Abrir página de contratos
      window.location.href = '/contracts';
      break;
    case PUSH_TYPES.PAYMENT_OVERDUE:
      // Abrir página de recibos
      window.location.href = '/receipts';
      break;
    case PUSH_TYPES.URGENT_REPAIR:
      // Abrir página de reparaciones
      window.location.href = '/receipts/reparacion';
      break;
    case PUSH_TYPES.SYSTEM_ALERT:
      // Abrir página principal
      window.location.href = '/';
      break;
    default:
      window.focus();
  }
  
  notification.close();
};

// Manejar acciones de notificación
const handleNotificationAction = (notification, event) => {
  const data = notification.data;
  
  switch (event.action) {
    case 'view':
      handleNotificationClick(notification, event);
      break;
    case 'dismiss':
      notification.close();
      break;
    default:
      break;
  }
};

// ===== PROGRAMACIÓN DE NOTIFICACIONES =====

// Programar notificación push
export const schedulePushNotification = (type, title, message, scheduledTime, options = {}) => {
  const now = new Date();
  const delay = scheduledTime.getTime() - now.getTime();
  
  if (delay <= 0) {
    // Ejecutar inmediatamente si ya pasó el tiempo
    return createCriticalPush(type, title, message, options);
  }
  
  // Programar para el futuro
  return setTimeout(() => {
    createCriticalPush(type, title, message, options);
  }, delay);
};

// Cancelar notificación programada
export const cancelScheduledNotification = (timeoutId) => {
  if (timeoutId) {
    clearTimeout(timeoutId);
  }
};

// ===== VERIFICACIÓN PERIÓDICA =====

// Verificar recordatorios críticos
export const checkCriticalReminders = () => {
  // Obtener contratos próximos a vencer
  const contracts = JSON.parse(localStorage.getItem('konrad_contracts') || '[]');
  const today = new Date();
  
  contracts.forEach(contract => {
    if (contract.status === 'active') {
      const expiryDate = new Date(contract.startDate);
      expiryDate.setMonth(expiryDate.getMonth() + parseInt(contract.duration));
      
      const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
      
      if (daysUntilExpiry <= PUSH_CONFIG.criticalThreshold) {
        createContractExpiryPush(contract);
      }
    }
  });
  
  // Verificar pagos vencidos (simulado)
  const receipts = JSON.parse(localStorage.getItem('konrad_receipts') || '[]');
  const overdueReceipts = receipts.filter(receipt => {
    const paymentDate = new Date(receipt.paymentDate);
    const daysOverdue = Math.ceil((today - paymentDate) / (1000 * 60 * 60 * 24));
    return daysOverdue > 0 && receipt.status !== 'paid';
  });
  
  overdueReceipts.forEach(receipt => {
    const daysOverdue = Math.ceil((today - new Date(receipt.paymentDate)) / (1000 * 60 * 60 * 24));
    createRentPaymentOverduePush(
      receipt.tenantName || receipt.clientName,
      receipt.propertyAddress,
      daysOverdue
    );
  });
};

// ===== INICIALIZACIÓN =====

// Inicializar sistema de notificaciones push
export const initializePushNotifications = async () => {
  // Solicitar permisos al cargar la aplicación
  await requestPushPermission();
  
  // Configurar verificación periódica
  if (isPushAvailable()) {
    // Verificar cada 30 minutos
    setInterval(checkCriticalReminders, 30 * 60 * 1000);
    
    // Verificación inicial
    setTimeout(checkCriticalReminders, 5000);
  }
};

// Inicializar cuando el DOM esté listo
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', initializePushNotifications);
} 