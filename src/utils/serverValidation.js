class ServerValidation {
  constructor() {
    this.validationRules = {
      // Validaciones de contrato
      contract: {
        title: {
          required: true,
          minLength: 3,
          maxLength: 200,
          pattern: /^[a-zA-Z0-9\s\-_.,()]+$/
        },
        client: {
          required: true,
          minLength: 2,
          maxLength: 100,
          pattern: /^[a-zA-Z\s]+$/
        },
        amount: {
          required: true,
          type: 'number',
          min: 0,
          max: 999999999
        },
        startDate: {
          required: true,
          type: 'date',
          minDate: new Date(),
          maxDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 año
        },
        endDate: {
          required: true,
          type: 'date',
          minDate: new Date(),
          maxDate: new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000) // 10 años
        },
        propertyAddress: {
          required: true,
          minLength: 10,
          maxLength: 500,
          pattern: /^[a-zA-Z0-9\s\-_.,()#]+$/
        }
      },

      // Validaciones de recibo
      receipt: {
        number: {
          required: true,
          pattern: /^R-\d{4,6}$/
        },
        amount: {
          required: true,
          type: 'number',
          min: 0,
          max: 999999999
        },
        date: {
          required: true,
          type: 'date',
          maxDate: new Date()
        },
        description: {
          required: true,
          minLength: 5,
          maxLength: 500,
          pattern: /^[a-zA-Z0-9\s\-_.,()]+$/
        }
      },

      // Validaciones de usuario
      user: {
        name: {
          required: true,
          minLength: 2,
          maxLength: 100,
          pattern: /^[a-zA-Z\s]+$/
        },
        email: {
          required: true,
          pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        },
        role: {
          required: true,
          enum: ['admin', 'manager', 'agent', 'viewer']
        },
        password: {
          required: true,
          minLength: 8,
          pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/
        }
      }
    };

    this.securityPatterns = {
      xss: [
        /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        /javascript:/gi,
        /on\w+\s*=/gi,
        /vbscript:/gi,
        /data:/gi,
        /<iframe/gi,
        /<object/gi,
        /<embed/gi
      ],
      sqlInjection: [
        /(\b(union|select|insert|update|delete|drop|create|alter)\b)/gi,
        /(\b(or|and)\b\s+\d+\s*[=<>])/gi,
        /(--|\/\*|\*\/)/gi,
        /(\b(exec|execute)\b)/gi
      ],
      pathTraversal: [
        /\.\.\//gi,
        /\.\.\\/gi,
        /\/etc\/passwd/gi,
        /\/windows\/system32/gi
      ],
      commandInjection: [
        /(\b(cmd|command|exec|system|eval)\b)/gi,
        /[;&|`$()]/g
      ]
    };
  }

  // Validar datos según reglas
  validate(data, type) {
    const rules = this.validationRules[type];
    if (!rules) {
      throw new Error(`Tipo de validación no soportado: ${type}`);
    }

    const errors = [];
    const sanitizedData = {};

    // Verificar ataques de seguridad primero
    for (const [field, value] of Object.entries(data)) {
      if (typeof value === 'string') {
        const securityIssues = this.detectSecurityIssues(value);
        if (securityIssues.length > 0) {
          errors.push({
            field,
            type: 'security',
            message: `Detección de seguridad: ${securityIssues.join(', ')}`
          });
          continue;
        }

        // Sanitizar entrada
        sanitizedData[field] = this.sanitizeInput(value);
      } else {
        sanitizedData[field] = value;
      }
    }

    // Aplicar reglas de validación
    for (const [field, rule] of Object.entries(rules)) {
      const value = sanitizedData[field];

      // Verificar si es requerido
      if (rule.required && (value === undefined || value === null || value === '')) {
        errors.push({
          field,
          type: 'required',
          message: `El campo ${field} es requerido`
        });
        continue;
      }

      // Si no es requerido y está vacío, continuar
      if (!rule.required && (value === undefined || value === null || value === '')) {
        continue;
      }

      // Validar tipo
      if (rule.type) {
        const typeError = this.validateType(value, rule.type);
        if (typeError) {
          errors.push({
            field,
            type: 'type',
            message: typeError
          });
          continue;
        }
      }

      // Validar longitud mínima
      if (rule.minLength && typeof value === 'string' && value.length < rule.minLength) {
        errors.push({
          field,
          type: 'minLength',
          message: `El campo ${field} debe tener al menos ${rule.minLength} caracteres`
        });
      }

      // Validar longitud máxima
      if (rule.maxLength && typeof value === 'string' && value.length > rule.maxLength) {
        errors.push({
          field,
          type: 'maxLength',
          message: `El campo ${field} debe tener máximo ${rule.maxLength} caracteres`
        });
      }

      // Validar valor mínimo
      if (rule.min !== undefined && typeof value === 'number' && value < rule.min) {
        errors.push({
          field,
          type: 'min',
          message: `El campo ${field} debe ser mayor o igual a ${rule.min}`
        });
      }

      // Validar valor máximo
      if (rule.max !== undefined && typeof value === 'number' && value > rule.max) {
        errors.push({
          field,
          type: 'max',
          message: `El campo ${field} debe ser menor o igual a ${rule.max}`
        });
      }

      // Validar fecha mínima
      if (rule.minDate && value instanceof Date && value < rule.minDate) {
        errors.push({
          field,
          type: 'minDate',
          message: `El campo ${field} debe ser posterior a ${rule.minDate.toLocaleDateString()}`
        });
      }

      // Validar fecha máxima
      if (rule.maxDate && value instanceof Date && value > rule.maxDate) {
        errors.push({
          field,
          type: 'maxDate',
          message: `El campo ${field} debe ser anterior a ${rule.maxDate.toLocaleDateString()}`
        });
      }

      // Validar patrón
      if (rule.pattern && typeof value === 'string' && !rule.pattern.test(value)) {
        errors.push({
          field,
          type: 'pattern',
          message: `El campo ${field} no cumple con el formato requerido`
        });
      }

      // Validar enumeración
      if (rule.enum && !rule.enum.includes(value)) {
        errors.push({
          field,
          type: 'enum',
          message: `El campo ${field} debe ser uno de: ${rule.enum.join(', ')}`
        });
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedData
    };
  }

  // Validar tipo de dato
  validateType(value, type) {
    switch (type) {
      case 'string':
        return typeof value === 'string' ? null : 'Debe ser una cadena de texto';
      case 'number':
        return !isNaN(value) && isFinite(value) ? null : 'Debe ser un número';
      case 'date':
        const date = new Date(value);
        return !isNaN(date.getTime()) ? null : 'Debe ser una fecha válida';
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value) ? null : 'Debe ser un email válido';
      default:
        return null;
    }
  }

  // Detectar problemas de seguridad
  detectSecurityIssues(input) {
    const issues = [];

    // Detectar XSS
    if (this.securityPatterns.xss.some(pattern => pattern.test(input))) {
      issues.push('XSS');
    }

    // Detectar SQL Injection
    if (this.securityPatterns.sqlInjection.some(pattern => pattern.test(input))) {
      issues.push('SQL Injection');
    }

    // Detectar Path Traversal
    if (this.securityPatterns.pathTraversal.some(pattern => pattern.test(input))) {
      issues.push('Path Traversal');
    }

    // Detectar Command Injection
    if (this.securityPatterns.commandInjection.some(pattern => pattern.test(input))) {
      issues.push('Command Injection');
    }

    return issues;
  }

  // Sanitizar entrada
  sanitizeInput(input) {
    if (typeof input !== 'string') return input;

    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<[^>]*>/g, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .replace(/vbscript:/gi, '')
      .replace(/data:/gi, '')
      .trim();
  }

  // Validar contrato
  validateContract(contractData) {
    return this.validate(contractData, 'contract');
  }

  // Validar recibo
  validateReceipt(receiptData) {
    return this.validate(receiptData, 'receipt');
  }

  // Validar usuario
  validateUser(userData) {
    return this.validate(userData, 'user');
  }

  // Validar credenciales de login
  validateLoginCredentials(email, password) {
    const errors = [];

    // Validar email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push({
        field: 'email',
        type: 'invalid',
        message: 'Email inválido'
      });
    }

    // Validar password
    if (!password || password.length < 6) {
      errors.push({
        field: 'password',
        type: 'invalid',
        message: 'La contraseña debe tener al menos 6 caracteres'
      });
    }

    // Detectar ataques
    const emailIssues = this.detectSecurityIssues(email);
    const passwordIssues = this.detectSecurityIssues(password);

    if (emailIssues.length > 0) {
      errors.push({
        field: 'email',
        type: 'security',
        message: `Detección de seguridad en email: ${emailIssues.join(', ')}`
      });
    }

    if (passwordIssues.length > 0) {
      errors.push({
        field: 'password',
        type: 'security',
        message: `Detección de seguridad en contraseña: ${passwordIssues.join(', ')}`
      });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Validar archivo
  validateFile(file, allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'], maxSize = 5 * 1024 * 1024) {
    const errors = [];

    // Validar tipo de archivo
    if (!allowedTypes.includes(file.type)) {
      errors.push({
        field: 'file',
        type: 'fileType',
        message: `Tipo de archivo no permitido. Tipos permitidos: ${allowedTypes.join(', ')}`
      });
    }

    // Validar tamaño
    if (file.size > maxSize) {
      errors.push({
        field: 'file',
        type: 'fileSize',
        message: `El archivo es demasiado grande. Tamaño máximo: ${Math.round(maxSize / 1024 / 1024)}MB`
      });
    }

    // Validar nombre del archivo
    const fileNameIssues = this.detectSecurityIssues(file.name);
    if (fileNameIssues.length > 0) {
      errors.push({
        field: 'file',
        type: 'security',
        message: `Nombre de archivo sospechoso: ${fileNameIssues.join(', ')}`
      });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Validar datos de búsqueda
  validateSearchQuery(query, maxLength = 100) {
    const errors = [];

    if (typeof query !== 'string') {
      errors.push({
        field: 'query',
        type: 'type',
        message: 'La consulta debe ser una cadena de texto'
      });
      return { isValid: false, errors };
    }

    if (query.length > maxLength) {
      errors.push({
        field: 'query',
        type: 'maxLength',
        message: `La consulta no puede tener más de ${maxLength} caracteres`
      });
    }

    const securityIssues = this.detectSecurityIssues(query);
    if (securityIssues.length > 0) {
      errors.push({
        field: 'query',
        type: 'security',
        message: `Detección de seguridad: ${securityIssues.join(', ')}`
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedQuery: this.sanitizeInput(query)
    };
  }
}

// Instancia singleton
const serverValidation = new ServerValidation();

export default serverValidation; 