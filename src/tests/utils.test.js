import { describe, it, expect, mock, spyOn } from '../utils/testRunner';
import securityManager from '../utils/security';
import serverValidation from '../utils/serverValidation';
import smartCache from '../utils/smartCache';
import realtimeSync from '../utils/realtimeSync';

// Tests para SecurityManager
describe('SecurityManager', () => {
  it('debe autenticar usuario válido', async () => {
    const result = await securityManager.authenticateUser('admin@inmobiliaria.com', 'admin123');
    expect(result.success).toBeTruthy();
    expect(result.user.email).toBe('admin@inmobiliaria.com');
  });

  it('debe rechazar credenciales inválidas', async () => {
    try {
      await securityManager.authenticateUser('invalid@email.com', 'wrongpassword');
      throw new Error('Debería haber fallado');
    } catch (error) {
      expect(error.message).toContain('Credenciales inválidas');
    }
  });

  it('debe verificar permisos correctamente', () => {
    // Simular usuario autenticado
    securityManager.currentUser = {
      id: 1,
      email: 'admin@inmobiliaria.com',
      role: 'admin'
    };

    expect(securityManager.hasPermission('contracts:read')).toBeTruthy();
    expect(securityManager.hasPermission('nonexistent:permission')).toBeFalsy();
  });

  it('debe validar entrada de datos', () => {
    expect(securityManager.validateInput('test@email.com', 'email')).toBeTruthy();
    expect(securityManager.validateInput('invalid-email', 'email')).toBeFalsy();
  });

  it('debe detectar ataques XSS', () => {
    const maliciousInput = '<script>alert("xss")</script>';
    expect(securityManager.detectXSS(maliciousInput)).toBeTruthy();
    
    const safeInput = 'Texto normal sin scripts';
    expect(securityManager.detectXSS(safeInput)).toBeFalsy();
  });

  it('debe sanitizar entrada correctamente', () => {
    const input = '<script>alert("xss")</script>Texto normal';
    const sanitized = securityManager.sanitizeInput(input);
    expect(sanitized).toBe('Texto normal');
  });
});

// Tests para ServerValidation
describe('ServerValidation', () => {
  it('debe validar contrato correctamente', () => {
    const validContract = {
      title: 'Contrato de Alquiler',
      client: 'Juan Pérez',
      amount: 50000,
      startDate: new Date(),
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      propertyAddress: 'Av. Corrientes 1234, Buenos Aires'
    };

    const result = serverValidation.validateContract(validContract);
    expect(result.isValid).toBeTruthy();
    expect(result.errors).toHaveLength(0);
  });

  it('debe rechazar contrato inválido', () => {
    const invalidContract = {
      title: '', // Campo requerido vacío
      client: 'Juan Pérez',
      amount: -1000, // Valor negativo
      startDate: new Date(),
      endDate: new Date()
    };

    const result = serverValidation.validateContract(invalidContract);
    expect(result.isValid).toBeFalsy();
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it('debe validar recibo correctamente', () => {
    const validReceipt = {
      number: 'R-0001',
      amount: 5000,
      date: new Date(),
      description: 'Pago de alquiler mensual'
    };

    const result = serverValidation.validateReceipt(validReceipt);
    expect(result.isValid).toBeTruthy();
  });

  it('debe validar usuario correctamente', () => {
    const validUser = {
      name: 'María García',
      email: 'maria@example.com',
      role: 'agent',
      password: 'SecurePass123!'
    };

    const result = serverValidation.validateUser(validUser);
    expect(result.isValid).toBeTruthy();
  });

  it('debe detectar problemas de seguridad en datos', () => {
    const maliciousData = {
      name: 'Juan Pérez',
      email: 'juan@example.com<script>alert("xss")</script>'
    };

    const issues = serverValidation.detectSecurityIssues(maliciousData.email);
    expect(issues.length).toBeGreaterThan(0);
    expect(issues).toContain('XSS');
  });
});

// Tests para SmartCache
describe('SmartCache', () => {
  beforeEach(() => {
    smartCache.clear();
  });

  it('debe guardar y recuperar datos', () => {
    const testData = { id: 1, name: 'Test' };
    smartCache.set('test-key', testData);
    
    const retrieved = smartCache.get('test-key');
    expect(retrieved).toEqual(testData);
  });

  it('debe respetar TTL', () => {
    const testData = { id: 1, name: 'Test' };
    smartCache.set('test-key', testData, { ttl: 100 }); // 100ms
    
    // Esperar que expire
    setTimeout(() => {
      const retrieved = smartCache.get('test-key');
      expect(retrieved).toBeNull();
    }, 150);
  });

  it('debe manejar prioridades correctamente', () => {
    smartCache.set('high-priority', 'high', { priority: 'high' });
    smartCache.set('low-priority', 'low', { priority: 'low' });
    
    const stats = smartCache.getStats();
    expect(stats.byPriority.high).toBe(1);
    expect(stats.byPriority.low).toBe(1);
  });

  it('debe limpiar elementos expirados', () => {
    smartCache.set('expired', 'data', { ttl: 1 }); // 1ms
    smartCache.set('valid', 'data', { ttl: 60000 }); // 1 minuto
    
    setTimeout(() => {
      smartCache.cleanup();
      const stats = smartCache.getStats();
      expect(stats.expiredItems).toBe(0);
    }, 10);
  });
});

// Tests para RealtimeSync
describe('RealtimeSync', () => {
  beforeEach(() => {
    realtimeSync.disconnect();
  });

  it('debe manejar conexión correctamente', () => {
    const mockWebSocket = {
      onopen: null,
      onmessage: null,
      onclose: null,
      onerror: null,
      send: jest.fn(),
      close: jest.fn()
    };

    // Mock WebSocket
    global.WebSocket = jest.fn(() => mockWebSocket);
    
    realtimeSync.connect();
    expect(global.WebSocket).toHaveBeenCalled();
  });

  it('debe suscribirse a eventos', () => {
    const callback = jest.fn();
    const unsubscribe = realtimeSync.subscribe('test-event', callback);
    
    expect(typeof unsubscribe).toBe('function');
  });

  it('debe enviar mensajes correctamente', () => {
    const message = { type: 'test', data: 'test-data' };
    realtimeSync.sendMessage(message);
    
    // Verificar que se agregó a actualizaciones pendientes
    const status = realtimeSync.getConnectionStatus();
    expect(status.isConnected).toBeFalsy();
  });
});

// Tests de integración
describe('Integración', () => {
  it('debe integrar seguridad con validación', () => {
    const testData = {
      name: 'Juan Pérez',
      email: 'juan@example.com'
    };

    // Validar con ServerValidation
    const validation = serverValidation.validateUser(testData);
    expect(validation.isValid).toBeFalsy(); // Falta password

    // Registrar en auditoría
    securityManager.auditLog('TEST_ACTION', testData);
    const logs = securityManager.getAuditLogs();
    expect(logs.length).toBeGreaterThan(0);
  });

  it('debe manejar caché con sincronización', () => {
    const testData = { id: 1, name: 'Test' };
    
    // Guardar en caché
    smartCache.set('sync-test', testData, { tags: ['sync'] });
    
    // Simular sincronización
    realtimeSync.sendMessage({
      type: 'data_update',
      payload: { entity: 'test', data: testData, operation: 'create' }
    });

    const cached = smartCache.get('sync-test');
    expect(cached).toEqual(testData);
  });
});

// Tests de rendimiento
describe('Rendimiento', () => {
  it('debe manejar múltiples operaciones de caché eficientemente', () => {
    const startTime = Date.now();
    
    // Realizar 1000 operaciones
    for (let i = 0; i < 1000; i++) {
      smartCache.set(`key-${i}`, `value-${i}`);
    }
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    expect(duration).toBeLessThan(1000); // Debe completarse en menos de 1 segundo
  });

  it('debe validar datos rápidamente', () => {
    const testData = {
      title: 'Contrato Test',
      client: 'Cliente Test',
      amount: 50000,
      startDate: new Date(),
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      propertyAddress: 'Dirección de prueba 123'
    };

    const startTime = Date.now();
    const result = serverValidation.validateContract(testData);
    const endTime = Date.now();
    
    expect(result.isValid).toBeTruthy();
    expect(endTime - startTime).toBeLessThan(50); // Debe validar en menos de 50ms
  });
});

// Tests de casos edge
describe('Casos Edge', () => {
  it('debe manejar datos nulos o indefinidos', () => {
    expect(securityManager.validateInput(null, 'string')).toBeFalsy();
    expect(securityManager.validateInput(undefined, 'string')).toBeFalsy();
    expect(securityManager.validateInput('', 'string')).toBeTruthy();
  });

  it('debe manejar strings muy largos', () => {
    const longString = 'a'.repeat(2000);
    expect(securityManager.validateInput(longString, 'string')).toBeFalsy();
  });

  it('debe manejar caracteres especiales', () => {
    const specialChars = 'áéíóúñüç';
    expect(securityManager.validateInput(specialChars, 'string')).toBeTruthy();
  });

  it('debe manejar números extremos', () => {
    expect(serverValidation.validateInput(Number.MAX_SAFE_INTEGER, 'number')).toBeTruthy();
    expect(serverValidation.validateInput(Number.MIN_SAFE_INTEGER, 'number')).toBeTruthy();
  });
});

export default {
  runAllTests: async () => {
    console.log('🧪 Ejecutando todos los tests...\n');
    return await runTests();
  }
}; 