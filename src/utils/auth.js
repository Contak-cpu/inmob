// Sistema de autenticación para Konrad Inmobiliaria

// Sistema de logging silencioso en producción
const logError = (message, error) => {
  if (process.env.NODE_ENV !== 'production') {
    console.error(message, error);
  }
};

const logInfo = (message) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(message);
  }
};

// Tipos de usuarios
export const USER_ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  AGENT: 'agent',
  VIEWER: 'viewer',
};

// Permisos por rol
export const ROLE_PERMISSIONS = {
  [USER_ROLES.ADMIN]: {
    canCreateContracts: true,
    canEditContracts: true,
    canDeleteContracts: true,
    canCreateReceipts: true,
    canEditReceipts: true,
    canDeleteReceipts: true,
    canViewHistory: true,
    canExportData: true,
    canManageUsers: true,
    canViewStats: true,
    canViewDashboard: true,
    canViewAnalytics: true,
  },
  [USER_ROLES.MANAGER]: {
    canCreateContracts: true,
    canEditContracts: true,
    canDeleteContracts: false,
    canCreateReceipts: true,
    canEditReceipts: true,
    canDeleteReceipts: false,
    canViewHistory: true,
    canExportData: true,
    canManageUsers: false,
    canViewStats: true,
    canViewDashboard: true,
    canViewAnalytics: true,
  },
  [USER_ROLES.AGENT]: {
    canCreateContracts: true,
    canEditContracts: false,
    canDeleteContracts: false,
    canCreateReceipts: true,
    canEditReceipts: false,
    canDeleteReceipts: false,
    canViewHistory: true,
    canExportData: false,
    canManageUsers: false,
    canViewStats: false,
    canViewDashboard: true,
    canViewAnalytics: false,
  },
  [USER_ROLES.VIEWER]: {
    canCreateContracts: false,
    canEditContracts: false,
    canDeleteContracts: false,
    canCreateReceipts: false,
    canEditReceipts: false,
    canDeleteReceipts: false,
    canViewHistory: true,
    canExportData: false,
    canManageUsers: false,
    canViewStats: true,
    canViewDashboard: true,
    canViewAnalytics: false,
  },
};

// Usuarios por defecto (en producción esto vendría de una base de datos)
const DEFAULT_USERS = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123', // En producción usar hash
    name: 'Administrador',
    email: 'admin@konradinmobiliaria.com',
    role: USER_ROLES.ADMIN,
    active: true,
    createdAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: '2',
    username: 'german',
    password: 'german123',
    name: 'Germán E. Konrad',
    email: 'german@konradinmobiliaria.com',
    role: USER_ROLES.MANAGER,
    active: true,
    createdAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: '3',
    username: 'agente1',
    password: 'agente123',
    name: 'Agente Inmobiliario',
    email: 'agente@konradinmobiliaria.com',
    role: USER_ROLES.AGENT,
    active: true,
    createdAt: '2024-01-01T00:00:00.000Z',
  },
];

// Claves para localStorage
const AUTH_KEYS = {
  USERS: 'konrad_users',
  SESSION: 'konrad_session',
  SETTINGS: 'konrad_auth_settings',
};

// Estado de autenticación
let currentUser = null;
let sessionTimeout = null;

// ===== GESTIÓN DE USUARIOS =====

// Inicializar usuarios por defecto
const initializeUsers = () => {
  const existingUsers = getFromStorage(AUTH_KEYS.USERS);
  if (!existingUsers || existingUsers.length === 0) {
    saveToStorage(AUTH_KEYS.USERS, DEFAULT_USERS);
  }
};

// Obtener todos los usuarios
export const getAllUsers = () => {
  return getFromStorage(AUTH_KEYS.USERS);
};

// Obtener usuario por ID
export const getUserById = (id) => {
  const users = getAllUsers();
  return users.find(user => user.id === id);
};

// Obtener usuario por username
export const getUserByUsername = (username) => {
  const users = getAllUsers();
  return users.find(user => user.username === username);
};

// Crear nuevo usuario
export const createUser = (userData) => {
  const users = getAllUsers();
  const newUser = {
    id: generateId(),
    ...userData,
    active: true,
    createdAt: new Date().toISOString(),
  };
  
  users.push(newUser);
  saveToStorage(AUTH_KEYS.USERS, users);
  
  return newUser;
};

// Actualizar usuario
export const updateUser = (id, updatedData) => {
  const users = getAllUsers();
  const index = users.findIndex(user => user.id === id);
  
  if (index !== -1) {
    users[index] = {
      ...users[index],
      ...updatedData,
      updatedAt: new Date().toISOString(),
    };
    saveToStorage(AUTH_KEYS.USERS, users);
    return users[index];
  }
  
  return null;
};

// Eliminar usuario
export const deleteUser = (id) => {
  const users = getAllUsers();
  const filteredUsers = users.filter(user => user.id !== id);
  saveToStorage(AUTH_KEYS.USERS, filteredUsers);
  return true;
};

// ===== AUTENTICACIÓN =====

// Iniciar sesión
export const login = (username, password) => {
  const user = getUserByUsername(username);
  
  if (!user) {
    return {
      success: false,
      error: 'Usuario no encontrado'
    };
  }
  
  if (!user.active) {
    return {
      success: false,
      error: 'Usuario inactivo'
    };
  }
  
  if (user.password !== password) {
    return {
      success: false,
      error: 'Contraseña incorrecta'
    };
  }
  
  // Crear sesión
  const session = {
    userId: user.id,
    username: user.username,
    role: user.role,
    loginTime: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(), // 8 horas
  };
  
  currentUser = user;
  saveToStorage(AUTH_KEYS.SESSION, session);
  
  // Configurar timeout de sesión
  setupSessionTimeout(session.expiresAt);
  
  return {
    success: true,
    user: {
      id: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    session
  };
};

// Cerrar sesión
export const logout = () => {
  currentUser = null;
  localStorage.removeItem(AUTH_KEYS.SESSION);
  
  if (sessionTimeout) {
    clearTimeout(sessionTimeout);
    sessionTimeout = null;
  }
  
  return {
    success: true,
    message: 'Sesión cerrada exitosamente'
  };
};

// Verificar si el usuario está autenticado
export const isAuthenticated = () => {
  if (currentUser) {
    return true;
  }
  
  const session = getFromStorage(AUTH_KEYS.SESSION);
  if (!session) {
    return false;
  }
  
  // Verificar si la sesión ha expirado
  if (new Date() > new Date(session.expiresAt)) {
    logout();
    return false;
  }
  
  // Cargar usuario actual
  const user = getUserById(session.userId);
  if (!user || !user.active) {
    logout();
    return false;
  }
  
  currentUser = user;
  setupSessionTimeout(session.expiresAt);
  
  return true;
};

// Obtener usuario actual
export const getCurrentUser = () => {
  if (!isAuthenticated()) {
    return null;
  }
  
  return {
    id: currentUser.id,
    username: currentUser.username,
    name: currentUser.name,
    email: currentUser.email,
    role: currentUser.role,
  };
};

// Verificar permisos
export const hasPermission = (permission) => {
  const user = getCurrentUser();
  if (!user) {
    return false;
  }
  
  const permissions = ROLE_PERMISSIONS[user.role];
  return permissions && permissions[permission];
};

// Verificar rol
export const hasRole = (role) => {
  const user = getCurrentUser();
  return user && user.role === role;
};

// ===== GESTIÓN DE SESIONES =====

// Configurar timeout de sesión
const setupSessionTimeout = (expiresAt) => {
  if (sessionTimeout) {
    clearTimeout(sessionTimeout);
  }
  
  const timeUntilExpiry = new Date(expiresAt) - new Date();
  
  if (timeUntilExpiry > 0) {
    sessionTimeout = setTimeout(() => {
      logout();
      // Mostrar notificación de sesión expirada
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('sessionExpired'));
      }
    }, timeUntilExpiry);
  }
};

// Renovar sesión
export const renewSession = () => {
  const session = getFromStorage(AUTH_KEYS.SESSION);
  if (!session) {
    return false;
  }
  
  const newExpiresAt = new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString();
  const updatedSession = {
    ...session,
    expiresAt: newExpiresAt,
  };
  
  saveToStorage(AUTH_KEYS.SESSION, updatedSession);
  setupSessionTimeout(newExpiresAt);
  
  return true;
};

// ===== UTILIDADES =====

// Generar ID único
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Función para obtener datos del localStorage
const getFromStorage = (key, defaultValue = null) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (error) {
    logError(`Error al leer de localStorage (${key}):`, error);
    return defaultValue;
  }
};

// Función para guardar datos en localStorage
const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    logError(`Error al guardar en localStorage (${key}):`, error);
    return false;
  }
};

// ===== INICIALIZACIÓN =====

// Inicializar sistema de autenticación
// Verificar sesión existente
const checkSession = () => {
  if (isAuthenticated()) {
    logInfo('Usuario autenticado:', getCurrentUser());
  }
  
  // Configurar listener para sesión expirada
  if (typeof window !== 'undefined') {
    window.addEventListener('sessionExpired', () => {
      // Notificación de sesión expirada se maneja en el componente
    });
  }
};

export const initializeAuth = () => {
  initializeUsers();
  checkSession();
  logInfo('Sistema de autenticación inicializado');
};

// Inicializar cuando el DOM esté listo
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', initializeAuth);
} 