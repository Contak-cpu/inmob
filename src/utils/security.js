class SecurityManager {
  constructor() {
    this.roles = {
      admin: {
        name: 'Administrador',
        permissions: ['*'], // Todos los permisos
        level: 100
      },
      manager: {
        name: 'Gerente',
        permissions: [
          'contracts:read', 'contracts:write', 'contracts:delete',
          'receipts:read', 'receipts:write', 'receipts:delete',
          'users:read', 'users:write',
          'analytics:read',
          'export:all'
        ],
        level: 80
      },
      agent: {
        name: 'Agente',
        permissions: [
          'contracts:read', 'contracts:write',
          'receipts:read', 'receipts:write',
          'users:read',
          'analytics:read',
          'export:limited'
        ],
        level: 60
      },
      viewer: {
        name: 'Visualizador',
        permissions: [
          'contracts:read',
          'receipts:read',
          'analytics:read'
        ],
        level: 40
      }
    };

    this.permissions = {
      // Contratos
      'contracts:read': 'Ver contratos',
      'contracts:write': 'Crear/editar contratos',
      'contracts:delete': 'Eliminar contratos',
      'contracts:approve': 'Aprobar contratos',
      
      // Recibos
      'receipts:read': 'Ver recibos',
      'receipts:write': 'Crear/editar recibos',
      'receipts:delete': 'Eliminar recibos',
      'receipts:approve': 'Aprobar recibos',
      
      // Usuarios
      'users:read': 'Ver usuarios',
      'users:write': 'Crear/editar usuarios',
      'users:delete': 'Eliminar usuarios',
      'users:manage_roles': 'Gestionar roles de usuarios',
      
      // Analytics
      'analytics:read': 'Ver analytics',
      'analytics:export': 'Exportar analytics',
      
      // Exportación
      'export:all': 'Exportar todos los datos',
      'export:limited': 'Exportar datos limitados',
      
      // Sistema
      'system:settings': 'Configurar sistema',
      'system:logs': 'Ver logs del sistema',
      'system:backup': 'Realizar backups'
    };

    this.currentUser = null;
    this.sessionToken = null;
    this.loginAttempts = new Map();
    this.blockedIPs = new Set();
  }

  // Autenticar usuario
  async authenticateUser(email, password) {
    try {
      // Verificar intentos de login
      if (this.isIPBlocked()) {
        throw new Error('IP bloqueada por múltiples intentos fallidos');
      }

      // Simular validación de credenciales
      const user = await this.validateCredentials(email, password);
      
      if (!user) {
        this.recordFailedLogin();
        throw new Error('Credenciales inválidas');
      }

      // Generar token de sesión
      const token = this.generateSessionToken(user);
      
      // Establecer usuario actual
      this.currentUser = user;
      this.sessionToken = token;
      
      // Registrar login exitoso
      this.recordSuccessfulLogin(user);
      
      // Limpiar intentos fallidos
      this.clearFailedAttempts();

      return { success: true, user, token };
    } catch (error) {
      console.error('Error en autenticación:', error);
      throw error;
    }
  }

  // Validar credenciales (simulado)
  async validateCredentials(email, password) {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Usuarios de prueba
    const users = {
      'admin@inmobiliaria.com': {
        id: 1,
        email: 'admin@inmobiliaria.com',
        name: 'Administrador',
        role: 'admin',
        password: 'admin123' // En producción usar hash
      },
      'gerente@inmobiliaria.com': {
        id: 2,
        email: 'gerente@inmobiliaria.com',
        name: 'Gerente',
        role: 'manager',
        password: 'gerente123'
      },
      'agente@inmobiliaria.com': {
        id: 3,
        email: 'agente@inmobiliaria.com',
        name: 'Agente',
        role: 'agent',
        password: 'agente123'
      },
      'viewer@inmobiliaria.com': {
        id: 4,
        email: 'viewer@inmobiliaria.com',
        name: 'Visualizador',
        role: 'viewer',
        password: 'viewer123'
      }
    };

    const user = users[email];
    if (user && user.password === password) {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }

    return null;
  }

  // Generar token de sesión
  generateSessionToken(user) {
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      iat: Date.now(),
      exp: Date.now() + (24 * 60 * 60 * 1000) // 24 horas
    };

    // En producción usar JWT
    return btoa(JSON.stringify(payload));
  }

  // Verificar token de sesión
  verifySessionToken(token) {
    try {
      const payload = JSON.parse(atob(token));
      
      if (payload.exp < Date.now()) {
        return null; // Token expirado
      }

      return payload;
    } catch (error) {
      return null;
    }
  }

  // Verificar permiso
  hasPermission(permission) {
    if (!this.currentUser) return false;
    
    const userRole = this.roles[this.currentUser.role];
    if (!userRole) return false;

    // Admin tiene todos los permisos
    if (userRole.permissions.includes('*')) return true;
    
    return userRole.permissions.includes(permission);
  }

  // Verificar múltiples permisos
  hasAnyPermission(permissions) {
    return permissions.some(permission => this.hasPermission(permission));
  }

  // Verificar todos los permisos
  hasAllPermissions(permissions) {
    return permissions.every(permission => this.hasPermission(permission));
  }

  // Verificar nivel de acceso
  hasAccessLevel(requiredLevel) {
    if (!this.currentUser) return false;
    
    const userRole = this.roles[this.currentUser.role];
    if (!userRole) return false;

    return userRole.level >= requiredLevel;
  }

  // Obtener permisos del usuario actual
  getUserPermissions() {
    if (!this.currentUser) return [];
    
    const userRole = this.roles[this.currentUser.role];
    if (!userRole) return [];

    return userRole.permissions;
  }

  // Registrar intento de login fallido
  recordFailedLogin() {
    const ip = this.getClientIP();
    const attempts = this.loginAttempts.get(ip) || 0;
    this.loginAttempts.set(ip, attempts + 1);

    // Bloquear IP después de 5 intentos fallidos
    if (attempts + 1 >= 5) {
      this.blockedIPs.add(ip);
      setTimeout(() => {
        this.blockedIPs.delete(ip);
        this.loginAttempts.delete(ip);
      }, 30 * 60 * 1000); // 30 minutos
    }
  }

  // Registrar login exitoso
  recordSuccessfulLogin(user) {
    this.auditLog('LOGIN_SUCCESS', {
      userId: user.id,
      email: user.email,
      role: user.role,
      timestamp: new Date().toISOString()
    });
  }

  // Limpiar intentos fallidos
  clearFailedAttempts() {
    const ip = this.getClientIP();
    this.loginAttempts.delete(ip);
  }

  // Verificar si IP está bloqueada
  isIPBlocked() {
    const ip = this.getClientIP();
    return this.blockedIPs.has(ip);
  }

  // Obtener IP del cliente (simulado)
  getClientIP() {
    // En producción obtener IP real
    return '127.0.0.1';
  }

  // Log de auditoría
  auditLog(action, data) {
    const logEntry = {
      action,
      data,
      timestamp: new Date().toISOString(),
      userId: this.currentUser?.id,
      userEmail: this.currentUser?.email,
      userRole: this.currentUser?.role,
      sessionId: this.sessionToken,
      userAgent: navigator.userAgent,
      ip: this.getClientIP()
    };

    // Guardar en localStorage (en producción enviar a servidor)
    try {
      const logs = JSON.parse(localStorage.getItem('audit_logs') || '[]');
      logs.push(logEntry);
      
      // Mantener solo los últimos 1000 logs
      if (logs.length > 1000) {
        logs.splice(0, logs.length - 1000);
      }
      
      localStorage.setItem('audit_logs', JSON.stringify(logs));
    } catch (error) {
      console.error('Error guardando log de auditoría:', error);
    }

    console.log('Audit Log:', logEntry);
  }

  // Obtener logs de auditoría
  getAuditLogs(filters = {}) {
    try {
      const logs = JSON.parse(localStorage.getItem('audit_logs') || '[]');
      
      let filteredLogs = logs;

      // Aplicar filtros
      if (filters.action) {
        filteredLogs = filteredLogs.filter(log => log.action === filters.action);
      }
      
      if (filters.userId) {
        filteredLogs = filteredLogs.filter(log => log.userId === filters.userId);
      }
      
      if (filters.startDate) {
        filteredLogs = filteredLogs.filter(log => new Date(log.timestamp) >= new Date(filters.startDate));
      }
      
      if (filters.endDate) {
        filteredLogs = filteredLogs.filter(log => new Date(log.timestamp) <= new Date(filters.endDate));
      }

      return filteredLogs;
    } catch (error) {
      console.error('Error obteniendo logs de auditoría:', error);
      return [];
    }
  }

  // Validar entrada de datos
  validateInput(input, type = 'string') {
    const validators = {
      string: (value) => {
        if (typeof value !== 'string') return false;
        if (value.length > 1000) return false; // Límite de longitud
        return true;
      },
      email: (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
      },
      number: (value) => {
        return !isNaN(value) && isFinite(value);
      },
      date: (value) => {
        const date = new Date(value);
        return !isNaN(date.getTime());
      },
      url: (value) => {
        try {
          new URL(value);
          return true;
        } catch {
          return false;
        }
      }
    };

    const validator = validators[type];
    return validator ? validator(input) : true;
  }

  // Sanitizar entrada de datos
  sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    
    // Remover scripts y tags HTML
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<[^>]*>/g, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .trim();
  }

  // Verificar si es un ataque XSS
  detectXSS(input) {
    const xssPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /vbscript:/gi,
      /data:/gi,
      /<iframe/gi,
      /<object/gi,
      /<embed/gi
    ];

    return xssPatterns.some(pattern => pattern.test(input));
  }

  // Verificar si es un ataque SQL Injection
  detectSQLInjection(input) {
    const sqlPatterns = [
      /(\b(union|select|insert|update|delete|drop|create|alter)\b)/gi,
      /(\b(or|and)\b\s+\d+\s*[=<>])/gi,
      /(--|\/\*|\*\/)/gi,
      /(\b(exec|execute)\b)/gi
    ];

    return sqlPatterns.some(pattern => pattern.test(input));
  }

  // Cerrar sesión
  logout() {
    if (this.currentUser) {
      this.auditLog('LOGOUT', {
        userId: this.currentUser.id,
        email: this.currentUser.email
      });
    }

    this.currentUser = null;
    this.sessionToken = null;
  }

  // Obtener usuario actual
  getCurrentUser() {
    return this.currentUser;
  }

  // Verificar si está autenticado
  isAuthenticated() {
    return this.currentUser !== null && this.sessionToken !== null;
  }

  // Obtener roles disponibles
  getAvailableRoles() {
    return Object.keys(this.roles).map(key => ({
      key,
      ...this.roles[key]
    }));
  }

  // Obtener permisos disponibles
  getAvailablePermissions() {
    return this.permissions;
  }
}

// Instancia singleton
const securityManager = new SecurityManager();

export default securityManager; 