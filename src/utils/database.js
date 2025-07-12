// Sistema de base de datos local usando localStorage

// Claves para localStorage
const STORAGE_KEYS = {
  CONTRACTS: 'konrad_contracts',
  RECEIPTS: 'konrad_receipts',
  SETTINGS: 'konrad_settings',
  HISTORY: 'konrad_history',
};

// Función para obtener datos del localStorage
const getFromStorage = (key, defaultValue = []) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (error) {
    console.error(`Error al leer de localStorage (${key}):`, error);
    return defaultValue;
  }
};

// Función para guardar datos en localStorage
const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error(`Error al guardar en localStorage (${key}):`, error);
    return false;
  }
};

// ===== GESTIÓN DE CONTRATOS =====

// Guardar contrato
export const saveContract = (contractData) => {
  const contracts = getFromStorage(STORAGE_KEYS.CONTRACTS);
  const newContract = {
    id: generateId(),
    ...contractData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  contracts.push(newContract);
  saveToStorage(STORAGE_KEYS.CONTRACTS, contracts);
  
  // Agregar al historial
  addToHistory('contract', newContract);
  
  return newContract;
};

// Obtener todos los contratos
export const getAllContracts = () => {
  return getFromStorage(STORAGE_KEYS.CONTRACTS);
};

// Obtener contrato por ID
export const getContractById = (id) => {
  const contracts = getAllContracts();
  return contracts.find(contract => contract.id === id);
};

// Actualizar contrato
export const updateContract = (id, updatedData) => {
  const contracts = getAllContracts();
  const index = contracts.findIndex(contract => contract.id === id);
  
  if (index !== -1) {
    contracts[index] = {
      ...contracts[index],
      ...updatedData,
      updatedAt: new Date().toISOString(),
    };
    saveToStorage(STORAGE_KEYS.CONTRACTS, contracts);
    return contracts[index];
  }
  
  return null;
};

// Eliminar contrato
export const deleteContract = (id) => {
  const contracts = getAllContracts();
  const filteredContracts = contracts.filter(contract => contract.id !== id);
  saveToStorage(STORAGE_KEYS.CONTRACTS, filteredContracts);
  return true;
};

// Buscar contratos
export const searchContracts = (query) => {
  const contracts = getAllContracts();
  const searchTerm = query.toLowerCase();
  
  return contracts.filter(contract => 
    contract.tenantName?.toLowerCase().includes(searchTerm) ||
    contract.ownerName?.toLowerCase().includes(searchTerm) ||
    contract.propertyAddress?.toLowerCase().includes(searchTerm) ||
    contract.contractType?.toLowerCase().includes(searchTerm)
  );
};

// ===== GESTIÓN DE RECIBOS =====

// Guardar recibo
export const saveReceipt = (receiptData) => {
  const receipts = getFromStorage(STORAGE_KEYS.RECEIPTS);
  const newReceipt = {
    id: generateId(),
    ...receiptData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  receipts.push(newReceipt);
  saveToStorage(STORAGE_KEYS.RECEIPTS, receipts);
  
  // Agregar al historial
  addToHistory('receipt', newReceipt);
  
  return newReceipt;
};

// Obtener todos los recibos
export const getAllReceipts = () => {
  return getFromStorage(STORAGE_KEYS.RECEIPTS);
};

// Obtener recibo por ID
export const getReceiptById = (id) => {
  const receipts = getAllReceipts();
  return receipts.find(receipt => receipt.id === id);
};

// Actualizar recibo
export const updateReceipt = (id, updatedData) => {
  const receipts = getAllReceipts();
  const index = receipts.findIndex(receipt => receipt.id === id);
  
  if (index !== -1) {
    receipts[index] = {
      ...receipts[index],
      ...updatedData,
      updatedAt: new Date().toISOString(),
    };
    saveToStorage(STORAGE_KEYS.RECEIPTS, receipts);
    return receipts[index];
  }
  
  return null;
};

// Eliminar recibo
export const deleteReceipt = (id) => {
  const receipts = getAllReceipts();
  const filteredReceipts = receipts.filter(receipt => receipt.id !== id);
  saveToStorage(STORAGE_KEYS.RECEIPTS, filteredReceipts);
  return true;
};

// Buscar recibos
export const searchReceipts = (query) => {
  const receipts = getAllReceipts();
  const searchTerm = query.toLowerCase();
  
  return receipts.filter(receipt => 
    receipt.tenantName?.toLowerCase().includes(searchTerm) ||
    receipt.clientName?.toLowerCase().includes(searchTerm) ||
    receipt.propertyAddress?.toLowerCase().includes(searchTerm) ||
    receipt.receiptType?.toLowerCase().includes(searchTerm)
  );
};

// ===== HISTORIAL =====

// Agregar al historial
const addToHistory = (type, data) => {
  const history = getFromStorage(STORAGE_KEYS.HISTORY);
  const historyEntry = {
    id: generateId(),
    type,
    dataId: data.id,
    action: 'created',
    timestamp: new Date().toISOString(),
    summary: generateSummary(type, data),
  };
  
  history.unshift(historyEntry);
  
  // Mantener solo los últimos 100 registros
  if (history.length > 100) {
    history.splice(100);
  }
  
  saveToStorage(STORAGE_KEYS.HISTORY, history);
};

// Obtener historial
export const getHistory = (limit = 50) => {
  const history = getFromStorage(STORAGE_KEYS.HISTORY);
  return history.slice(0, limit);
};

// Generar resumen para el historial
const generateSummary = (type, data) => {
  if (type === 'contract') {
    return `${data.contractType} - ${data.tenantName} - ${data.propertyAddress}`;
  } else if (type === 'receipt') {
    return `${data.receiptType} - ${data.tenantName || data.clientName} - $${data.totalAmount}`;
  }
  return 'Documento generado';
};

// ===== UTILIDADES =====

// Generar ID único
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Obtener estadísticas
export const getStats = () => {
  const contracts = getAllContracts();
  const receipts = getAllReceipts();
  
  return {
    totalContracts: contracts.length,
    totalReceipts: receipts.length,
    contractsThisMonth: contracts.filter(c => {
      const created = new Date(c.createdAt);
      const now = new Date();
      return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
    }).length,
    receiptsThisMonth: receipts.filter(r => {
      const created = new Date(r.createdAt);
      const now = new Date();
      return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
    }).length,
  };
};

// Exportar todos los datos
export const exportAllData = () => {
  return {
    contracts: getAllContracts(),
    receipts: getAllReceipts(),
    history: getHistory(),
    stats: getStats(),
    exportedAt: new Date().toISOString(),
  };
};

// Importar datos
export const importData = (data) => {
  if (data.contracts) {
    saveToStorage(STORAGE_KEYS.CONTRACTS, data.contracts);
  }
  if (data.receipts) {
    saveToStorage(STORAGE_KEYS.RECEIPTS, data.receipts);
  }
  if (data.history) {
    saveToStorage(STORAGE_KEYS.HISTORY, data.history);
  }
  return true;
};

// Limpiar todos los datos
export const clearAllData = () => {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
  return true;
}; 