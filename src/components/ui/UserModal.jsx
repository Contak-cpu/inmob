'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  Shield, 
  Building, 
  Clock,
  Eye,
  EyeOff
} from 'lucide-react';
import { USER_ROLES } from '@/utils/auth';

/**
 * Modal para crear/editar usuarios
 */
export default function UserModal({ 
  isOpen, 
  onClose, 
  user = null, 
  onSave 
}) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    role: USER_ROLES.AGENT,
    phone: '',
    active: true
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const isEditing = !!user;

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        username: user.username || '',
        password: '', // No mostrar contraseña existente
        role: user.role || USER_ROLES.AGENT,
        phone: user.phone || '',
        active: user.active !== false
      });
    } else {
      setFormData({
        name: '',
        email: '',
        username: '',
        password: '',
        role: USER_ROLES.AGENT,
        phone: '',
        active: true
      });
    }
    setErrors({});
  }, [user, isOpen]);

  // Bloquear scroll del body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Cerrar modal con click fuera
  const handleBackdropClick = (e) => {
    if (e.target.classList.contains('modal-overlay')) {
      onClose();
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.username.trim()) {
      newErrors.username = 'El nombre de usuario es obligatorio';
    }

    if (!isEditing && !formData.password.trim()) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (formData.password && formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const userData = {
      ...formData,
      id: user?.id || undefined
    };

    // No enviar contraseña si está vacía (edición)
    if (isEditing && !formData.password.trim()) {
      delete userData.password;
    }

    onSave(userData);
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case USER_ROLES.ADMIN:
        return <Shield className="h-4 w-4" />;
      case USER_ROLES.MANAGER:
        return <Building className="h-4 w-4" />;
      case USER_ROLES.AGENT:
        return <User className="h-4 w-4" />;
      case USER_ROLES.VIEWER:
        return <Clock className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case USER_ROLES.ADMIN:
        return 'Administrador';
      case USER_ROLES.MANAGER:
        return 'Gerente';
      case USER_ROLES.AGENT:
        return 'Agente';
      case USER_ROLES.VIEWER:
        return 'Visualizador';
      default:
        return 'Usuario';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleBackdropClick}>
      <div className="modal-content relative w-full max-w-md sm:max-w-lg bg-neutral-800 border border-neutral-700 rounded-2xl shadow-2xl mx-auto my-8 p-4 sm:p-8 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-700">
          <div className="flex items-center space-x-3">
            <User className="h-5 w-5 text-primary-400" />
            <h3 className="text-lg font-semibold text-white">
              {isEditing ? 'Editar Usuario' : 'Nuevo Usuario'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-700 rounded-xl transition-colors touch-manipulation"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5 text-neutral-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="pt-4 space-y-4">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1">
              Nombre Completo *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`input-field ${errors.name ? 'input-field-error' : ''}`}
              placeholder="Ingrese el nombre completo"
              autoFocus
            />
            {errors.name && (
              <p className="text-error-400 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1">
              Email *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`input-field pl-10 ${errors.email ? 'input-field-error' : ''}`}
                placeholder="usuario@ejemplo.com"
              />
            </div>
            {errors.email && (
              <p className="text-error-400 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1">
              Nombre de Usuario *
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={`input-field ${errors.username ? 'input-field-error' : ''}`}
              placeholder="usuario"
            />
            {errors.username && (
              <p className="text-error-400 text-xs mt-1">{errors.username}</p>
            )}
          </div>

          {/* Contraseña */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1">
              Contraseña {isEditing ? '(dejar vacío para mantener)' : '*'}
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`input-field pr-10 ${errors.password ? 'input-field-error' : ''}`}
                placeholder="••••••••"
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-primary-400"
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={-1}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-error-400 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          {/* Rol */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1">
              Rol *
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="input-field"
            >
              <option value={USER_ROLES.ADMIN}>Administrador</option>
              <option value={USER_ROLES.MANAGER}>Gerente</option>
              <option value={USER_ROLES.AGENT}>Agente</option>
              <option value={USER_ROLES.VIEWER}>Visualizador</option>
            </select>
          </div>

          {/* Teléfono */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1">
              Teléfono
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="input-field pl-10"
                placeholder="Ej: +54 11 1234-5678"
              />
            </div>
          </div>

          {/* Activo */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="active"
              checked={formData.active}
              onChange={handleChange}
              id="active-user-checkbox"
              className="form-checkbox h-4 w-4 text-primary-600"
            />
            <label htmlFor="active-user-checkbox" className="text-sm text-neutral-300">
              Usuario activo
            </label>
          </div>

          {/* Botones */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="submit"
              className="btn-primary flex-1 py-4 sm:py-3 text-base font-semibold touch-manipulation"
            >
              {isEditing ? 'Guardar Cambios' : 'Crear Usuario'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary py-4 sm:py-3 text-base font-semibold touch-manipulation"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 