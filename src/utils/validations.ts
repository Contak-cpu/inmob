import { FieldValidation } from '@/types';

// Validadores básicos
export const validators = {
  required: (value: string, fieldName: string): string => {
    if (!value || !value.toString().trim()) {
      return `${fieldName} es obligatorio`;
    }
    return '';
  },
  
  email: (value: string): string => {
    if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return 'Formato de email inválido';
    }
    return '';
  },
  
  dni: (value: string): string => {
    if (value && !/^\d{7,8}$/.test(value.replace(/\./g, ''))) {
      return 'DNI debe tener 7 u 8 dígitos';
    }
    return '';
  },
  
  name: (value: string, fieldName: string): string => {
    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    if (value && !nameRegex.test(value)) {
      return `${fieldName} solo puede contener letras y espacios`;
    }
    if (value && value.trim().length < 2) {
      return `${fieldName} debe tener al menos 2 caracteres`;
    }
    return '';
  },
  
  amount: (value: string): string => {
    if (value && (isNaN(parseFloat(value)) || parseFloat(value) <= 0)) {
      return 'Debe ser un monto válido mayor a 0';
    }
    return '';
  },
  
  date: (value: string): string => {
    if (value && new Date(value) < new Date()) {
      return 'La fecha no puede ser anterior a hoy';
    }
    return '';
  },
  
  phone: (value: string): string => {
    if (value && !/^[\d\s\-\+\(\)]+$/.test(value)) {
      return 'Formato de teléfono inválido';
    }
    return '';
  },
  
  cuit: (value: string): string => {
    if (value && !/^\d{2}-\d{8}-\d{1}$/.test(value)) {
      return 'CUIT debe tener formato XX-XXXXXXXX-X';
    }
    return '';
  }
};

// Función para validar un campo específico
export const validateField = (fieldName: string, value: string, contractType?: string): string => {
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
export const validateForm = (formData: Record<string, string>, contractType?: string): FieldValidation => {
  const errors: FieldValidation = {};
  
  Object.keys(formData).forEach(fieldName => {
    const error = validateField(fieldName, formData[fieldName], contractType);
    if (error) {
      errors[fieldName] = error;
    }
  });
  
  return errors;
};

// Función para verificar si el formulario es válido
export const isFormValid = (errors: FieldValidation): boolean => {
  return Object.keys(errors).length === 0;
};

// Función para obtener el estado visual del campo
export const getFieldStatus = (
  fieldName: string, 
  errors: FieldValidation, 
  touchedFields: Record<string, boolean>, 
  formData: Record<string, string>
): 'error' | 'success' | 'default' => {
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
export const getFieldClasses = (status: 'error' | 'success' | 'default'): string => {
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