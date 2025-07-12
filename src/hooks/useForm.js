'use client';

import { useState, useCallback } from 'react';
import { useNotifications } from './useNotifications';

/**
 * Hook personalizado para manejar formularios
 * Proporciona funciones para validación, manejo de estado y envío de formularios
 */
export function useForm(initialValues = {}, validationSchema = {}) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValid, setIsValid] = useState(false);
  
  const { showError } = useNotifications();

  // Validar un campo específico
  const validateField = useCallback((name, value) => {
    const fieldSchema = validationSchema[name];
    if (!fieldSchema) return null;

    // Validación requerida
    if (fieldSchema.required && (!value || value.toString().trim() === '')) {
      return fieldSchema.message || `${name} es requerido`;
    }

    // Validación de longitud mínima
    if (fieldSchema.minLength && value && value.toString().length < fieldSchema.minLength) {
      return fieldSchema.message || `${name} debe tener al menos ${fieldSchema.minLength} caracteres`;
    }

    // Validación de longitud máxima
    if (fieldSchema.maxLength && value && value.toString().length > fieldSchema.maxLength) {
      return fieldSchema.message || `${name} debe tener máximo ${fieldSchema.maxLength} caracteres`;
    }

    // Validación de patrón (regex)
    if (fieldSchema.pattern && value && !fieldSchema.pattern.test(value)) {
      return fieldSchema.message || `${name} no tiene el formato correcto`;
    }

    // Validación de valor mínimo
    if (fieldSchema.min !== undefined && value !== undefined && Number(value) < fieldSchema.min) {
      return fieldSchema.message || `${name} debe ser mayor o igual a ${fieldSchema.min}`;
    }

    // Validación de valor máximo
    if (fieldSchema.max !== undefined && value !== undefined && Number(value) > fieldSchema.max) {
      return fieldSchema.message || `${name} debe ser menor o igual a ${fieldSchema.max}`;
    }

    // Validación personalizada
    if (fieldSchema.validate) {
      const customError = fieldSchema.validate(value, values);
      if (customError) {
        return customError;
      }
    }

    return null;
  }, [validationSchema, values]);

  // Validar todo el formulario
  const validateForm = useCallback(() => {
    const newErrors = {};
    let hasErrors = false;

    Object.keys(validationSchema).forEach(fieldName => {
      const error = validateField(fieldName, values[fieldName]);
      if (error) {
        newErrors[fieldName] = error;
        hasErrors = true;
      }
    });

    setErrors(newErrors);
    setIsValid(!hasErrors);
    return !hasErrors;
  }, [validateField, values, validationSchema]);

  // Manejar cambio de valor
  const handleChange = useCallback((name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
    
    // Validar campo si ya ha sido tocado
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  }, [touched, validateField]);

  // Manejar blur (pérdida de foco)
  const handleBlur = useCallback((name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    
    const error = validateField(name, values[name]);
    setErrors(prev => ({ ...prev, [name]: error }));
  }, [validateField, values]);

  // Manejar envío del formulario
  const handleSubmit = useCallback(async (onSubmit) => {
    // Marcar todos los campos como tocados
    const allTouched = {};
    Object.keys(validationSchema).forEach(fieldName => {
      allTouched[fieldName] = true;
    });
    setTouched(allTouched);

    // Validar formulario
    if (!validateForm()) {
      showError('Error de validación', 'Por favor, corrige los errores en el formulario');
      return { success: false, error: 'Errores de validación' };
    }

    try {
      setIsSubmitting(true);
      const result = await onSubmit(values);
      return result;
    } catch (error) {
      const errorMessage = error.message || 'Error al enviar el formulario';
      showError('Error', errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsSubmitting(false);
    }
  }, [values, validateForm, showError]);

  // Resetear formulario
  const resetForm = useCallback((newValues = initialValues) => {
    setValues(newValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
    setIsValid(false);
  }, [initialValues]);

  // Establecer valores
  const setFormValues = useCallback((newValues) => {
    setValues(newValues);
  }, []);

  // Establecer errores
  const setFormErrors = useCallback((newErrors) => {
    setErrors(newErrors);
  }, []);

  // Obtener valor de un campo
  const getValue = useCallback((name) => {
    return values[name];
  }, [values]);

  // Obtener error de un campo
  const getError = useCallback((name) => {
    return errors[name];
  }, [errors]);

  // Verificar si un campo ha sido tocado
  const isTouched = useCallback((name) => {
    return touched[name] || false;
  }, [touched]);

  // Verificar si un campo tiene error
  const hasError = useCallback((name) => {
    return !!errors[name];
  }, [errors]);

  // Verificar si el formulario es válido
  const isFormValid = useCallback(() => {
    return isValid && Object.keys(errors).length === 0;
  }, [isValid, errors]);

  // Obtener todos los valores
  const getValues = useCallback(() => {
    return values;
  }, [values]);

  // Obtener todos los errores
  const getErrors = useCallback(() => {
    return errors;
  }, [errors]);

  return {
    // Estado
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    
    // Funciones de manejo
    handleChange,
    handleBlur,
    handleSubmit,
    
    // Funciones de utilidad
    resetForm,
    setFormValues,
    setFormErrors,
    getValue,
    getError,
    isTouched,
    hasError,
    isFormValid,
    getValues,
    getErrors,
    
    // Funciones de validación
    validateField,
    validateForm,
  };
} 