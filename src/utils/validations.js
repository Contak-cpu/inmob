// Validadores básicos
export const validators = {
  required: (value, fieldName) => {
    if (!value || !value.toString().trim()) {
      return `${fieldName} es obligatorio`;
    }
    return '';
  },
  
  email: (value) => {
    if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return 'Formato de email inválido';
    }
    return '';
  },
  
  dni: (value) => {
    if (value && !/^\d{7,8}$/.test(value.replace(/\./g, ''))) {
      return 'DNI debe tener 7 u 8 dígitos';
    }
    return '';
  },
  
  name: (value, fieldName) => {
    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    if (value && !nameRegex.test(value)) {
      return `${fieldName} solo puede contener letras y espacios`;
    }
    if (value && value.trim().length < 2) {
      return `${fieldName} debe tener al menos 2 caracteres`;
    }
    return '';
  },
  
  amount: (value) => {
    if (value && (isNaN(parseFloat(value)) || parseFloat(value) <= 0)) {
      return 'Debe ser un monto válido mayor a 0';
    }
    return '';
  },
  
  date: (value) => {
    if (value && new Date(value) < new Date()) {
      return 'La fecha no puede ser anterior a hoy';
    }
    return '';
  },
  
  phone: (value) => {
    if (value && !/^[\d\s\-\+\(\)]+$/.test(value)) {
      return 'Formato de teléfono inválido';
    }
    return '';
  },
  
  cuit: (value) => {
    if (value && !/^\d{2}-\d{8}-\d{1}$/.test(value)) {
      return 'CUIT debe tener formato XX-XXXXXXXX-X';
    }
    return '';
  }
};

// Función para validar un campo específico
export const validateField = (fieldName, value, contractType) => {
  let error = '';
  
  // Validaciones específicas por campo
  switch (fieldName) {
    case 'ownerName':
    case 'tenantName':
    case 'guarantor1Name':
    case 'guarantor2Name':
    case 'name':
      error = validators.required(value, 'Nombre') || validators.name(value, 'Nombre');
      break;
      
    case 'ownerDni':
    case 'tenantDni':
    case 'guarantor1Dni':
    case 'guarantor2Dni':
    case 'dni':
      error = validators.required(value, 'DNI') || validators.dni(value);
      break;
      
    case 'ownerEmail':
    case 'tenantEmail':
    case 'guarantor1Email':
    case 'guarantor2Email':
    case 'email':
      error = validators.email(value);
      break;
      
    case 'propertyAddress':
    case 'address':
      error = validators.required(value, 'Dirección');
      break;
      
    case 'monthlyAmount':
    case 'amount':
      error = validators.required(value, 'Monto') || validators.amount(value);
      break;
      
    case 'depositAmount':
      if (contractType !== 'compraventa') {
        error = validators.required(value, 'Depósito') || validators.amount(value);
      }
      break;
      
    case 'startDate':
      error = validators.required(value, 'Fecha de inicio') || validators.date(value);
      break;
      
    case 'phone':
      error = validators.phone(value);
      break;
      
    case 'cuit':
      error = validators.cuit(value);
      break;
      
    default:
      break;
  }
  
  return error;
};

// Función para validar todo el formulario
export const validateForm = (formData, contractType) => {
  const errors = {};
  
  Object.keys(formData).forEach(fieldName => {
    const error = validateField(fieldName, formData[fieldName], contractType);
    if (error) {
      errors[fieldName] = error;
    }
  });
  
  return errors;
};

// Función para verificar si el formulario es válido
export const isFormValid = (errors) => {
  return Object.keys(errors).length === 0;
};

// Función para obtener el estado visual del campo
export const getFieldStatus = (fieldName, errors, touchedFields, formData) => {
  const hasError = errors[fieldName];
  const isTouched = touchedFields[fieldName];
  const hasValue = formData[fieldName];
  
  if (hasError && isTouched) {
    return 'error';
  }
  if (!hasError && isTouched && hasValue) {
    return 'success';
  }
  return 'default';
};

// Función para obtener clases CSS según el estado del campo
export const getFieldClasses = (status) => {
  const baseClasses = "w-full px-4 py-3 bg-slate-700/50 border rounded-xl focus:outline-none transition-all text-white placeholder-slate-400";
  
  switch (status) {
    case 'error':
      return `${baseClasses} border-red-500 focus:ring-2 focus:ring-red-400 focus:border-red-400`;
    case 'success':
      return `${baseClasses} border-green-500 focus:ring-2 focus:ring-green-400 focus:border-green-400`;
    default:
      return `${baseClasses} border-slate-600 focus:ring-2 focus:ring-primary-500 focus:border-primary-500`;
  }
};

// Función para validar datos de contrato
export const validateContractData = (data, contractType) => {
  const errors = {};
  
  // Validaciones básicas
  if (!data.propertyAddress) {
    errors.propertyAddress = 'La dirección de la propiedad es obligatoria';
  }
  
  if (!data.propertyType) {
    errors.propertyType = 'El tipo de propiedad es obligatorio';
  }
  
  if (!data.ownerName) {
    errors.ownerName = 'El nombre del propietario es obligatorio';
  }
  
  if (!data.ownerDocument) {
    errors.ownerDocument = 'El DNI del propietario es obligatorio';
  }
  
  if (!data.tenantName) {
    errors.tenantName = 'El nombre del inquilino es obligatorio';
  }
  
  if (!data.tenantDocument) {
    errors.tenantDocument = 'El DNI del inquilino es obligatorio';
  }
  
  if (!data.startDate) {
    errors.startDate = 'La fecha de inicio es obligatoria';
  }
  
  if (!data.duration) {
    errors.duration = 'La duración es obligatoria';
  }
  
  if (!data.monthlyPrice) {
    errors.monthlyPrice = 'El precio mensual es obligatorio';
  }
  
  if (!data.deposit) {
    errors.deposit = 'El depósito es obligatorio';
  }
  
  if (!data.adjustmentType) {
    errors.adjustmentType = 'El tipo de ajuste es obligatorio';
  }
  
  return errors;
};

// Función para validar datos de recibo
export const validateReceiptData = (data, receiptType) => {
  const errors = {};
  
  // Validaciones básicas
  if (!data.propertyAddress) {
    errors.propertyAddress = 'La dirección de la propiedad es obligatoria';
  }
  
  if (!data.propertyType) {
    errors.propertyType = 'El tipo de propiedad es obligatorio';
  }
  
  if (!data.tenantName) {
    errors.tenantName = 'El nombre del inquilino es obligatorio';
  }
  
  if (!data.tenantDocument) {
    errors.tenantDocument = 'El DNI del inquilino es obligatorio';
  }
  
  if (!data.period) {
    errors.period = 'El período es obligatorio';
  }
  
  if (!data.issueDate) {
    errors.issueDate = 'La fecha de emisión es obligatoria';
  }
  
  if (!data.baseRent) {
    errors.baseRent = 'El alquiler base es obligatorio';
  }
  
  return errors;
}; 