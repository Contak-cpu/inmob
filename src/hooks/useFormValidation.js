'use client';

import { useState, useCallback } from 'react';

/**
 * Hook para validación en tiempo real de formularios
 */
export function useFormValidation(initialData = {}, validationRules = {}) {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Validar un campo específico
  const validateField = useCallback((name, value) => {
    const rules = validationRules[name];
    if (!rules) return '';

    for (const rule of rules) {
      const error = rule(value, formData);
      if (error) return error;
    }

    return '';
  }, [validationRules, formData]);

  // Validar todo el formulario
  const validateForm = useCallback(() => {
    const newErrors = {};
    let isValid = true;

    Object.keys(validationRules).forEach(fieldName => {
      const error = validateField(fieldName, formData[fieldName]);
      if (error) {
        newErrors[fieldName] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [validateField, formData, validationRules]);

  // Manejar cambios en campos
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;

    setFormData(prev => ({
      ...prev,
      [name]: fieldValue
    }));

    // Validar campo si ya fue tocado
    if (touched[name]) {
      const error = validateField(name, fieldValue);
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  }, [touched, validateField]);

  // Manejar blur (cuando el campo pierde el foco)
  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    const error = validateField(name, formData[name]);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  }, [validateField, formData]);

  // Marcar campo como tocado
  const markAsTouched = useCallback((fieldName) => {
    setTouched(prev => ({
      ...prev,
      [fieldName]: true
    }));
  }, []);

  // Limpiar errores
  const clearErrors = useCallback(() => {
    setErrors({});
    setTouched({});
  }, []);

  // Resetear formulario
  const resetForm = useCallback((newData = initialData) => {
    setFormData(newData);
    setErrors({});
    setTouched({});
  }, [initialData]);

  // Verificar si el formulario es válido
  const isFormValid = useCallback(() => {
    return Object.keys(errors).length === 0 && 
           Object.keys(validationRules).every(field => 
             formData[field] !== undefined && formData[field] !== ''
           );
  }, [errors, validationRules, formData]);

  return {
    formData,
    errors,
    touched,
    handleChange,
    handleBlur,
    markAsTouched,
    validateForm,
    clearErrors,
    resetForm,
    isFormValid,
    setFormData
  };
}

// Reglas de validación predefinidas
export const validationRules = {
  required: (value, fieldName = 'Este campo') => {
    if (!value || (typeof value === 'string' && !value.trim())) {
      return `${fieldName} es obligatorio`;
    }
    return '';
  },

  email: (value) => {
    if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return 'Email inválido';
    }
    return '';
  },

  dni: (value) => {
    if (value && !/^\d{7,8}$/.test(value.replace(/\./g, ''))) {
      return 'DNI debe tener 7 u 8 dígitos';
    }
    return '';
  },

  phone: (value) => {
    if (value && !/^[\d\s\-\+\(\)]+$/.test(value)) {
      return 'Formato de teléfono inválido';
    }
    return '';
  },

  minLength: (min) => (value, fieldName = 'Este campo') => {
    if (value && value.length < min) {
      return `${fieldName} debe tener al menos ${min} caracteres`;
    }
    return '';
  },

  maxLength: (max) => (value, fieldName = 'Este campo') => {
    if (value && value.length > max) {
      return `${fieldName} debe tener máximo ${max} caracteres`;
    }
    return '';
  },

  number: (value, fieldName = 'Este campo') => {
    if (value && isNaN(parseFloat(value))) {
      return `${fieldName} debe ser un número válido`;
    }
    return '';
  },

  positiveNumber: (value, fieldName = 'Este campo') => {
    if (value && (isNaN(parseFloat(value)) || parseFloat(value) <= 0)) {
      return `${fieldName} debe ser un número mayor a 0`;
    }
    return '';
  },

  date: (value, fieldName = 'Este campo') => {
    if (value && new Date(value) < new Date()) {
      return `${fieldName} no puede ser una fecha pasada`;
    }
    return '';
  },

  futureDate: (value, fieldName = 'Este campo') => {
    if (value && new Date(value) <= new Date()) {
      return `${fieldName} debe ser una fecha futura`;
    }
    return '';
  }
}; 