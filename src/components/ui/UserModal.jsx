'use client';

import React, { useState, useEffect, useRef } from 'react';
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
let modalAlreadyMounted = false;

export default function UserModal({ 
  isOpen, 
  onClose, 
  user = null, 
  onSave 
}) {
  if (modalAlreadyMounted) return null;
  if (!isOpen) return null;
  modalAlreadyMounted = true;

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
  const firstInputRef = useRef(null);

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
      // Enfocar el primer input al abrir
      setTimeout(() => {
        if (firstInputRef.current) firstInputRef.current.focus();
      }, 100);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    return () => { modalAlreadyMounted = false; };
  }, []);

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

  return (
    <div className="modal-overlay fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in transition-opacity duration-300" onClick={handleBackdropClick}>
      <div className="modal-content relative w-full max-w-xl z-[9999] bg-neutral-800 border border-neutral-700 rounded-2xl shadow-2xl mx-auto my-8 p-4 sm:p-8 animate-slide-up transition-transform duration-300 overflow-y-auto max-h-[90vh]" style={{ minHeight: 'auto' }}>
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-neutral-700">
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
        <form onSubmit={handleSubmit} className="pt-6 space-y-6">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1" htmlFor="name">Nombre *</label>
            <input
              ref={firstInputRef}
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className={`input-field w-full ${errors.name ? 'border-error-500' : ''}`}
              placeholder="Ej: Juan Pérez"
              autoComplete="off"
            />
            {errors.name && <p className="text-error-400 text-xs mt-1">{errors.name}</p>}
          </div>
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1" htmlFor="email">Email *</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className={`input-field w-full ${errors.email ? 'border-error-500' : ''}`}
              placeholder="usuario@ejemplo.com"
              autoComplete="off"
            />
            {errors.email && <p className="text-error-400 text-xs mt-1">{errors.email}</p>}
          </div>
          {/* Nombre de usuario */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1" htmlFor="username">Nombre de Usuario *</label>
            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              className={`input-field w-full ${errors.username ? 'border-error-500' : ''}`}
              placeholder="usuario"
              autoComplete="off"
            />
            {errors.username && <p className="text-error-400 text-xs mt-1">{errors.username}</p>}
          </div>
          {/* Contraseña */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1" htmlFor="password">Contraseña {isEditing ? '(dejar en blanco para no cambiar)' : '*'} </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                className={`input-field w-full pr-10 ${errors.password ? 'border-error-500' : ''}`}
                placeholder="******"
                autoComplete="new-password"
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-primary-400"
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={-1}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.password && <p className="text-error-400 text-xs mt-1">{errors.password}</p>}
          </div>
          {/* Rol */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1" htmlFor="role">Rol *</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="input-field w-full"
            >
              <option value={USER_ROLES.ADMIN}>Administrador</option>
              <option value={USER_ROLES.MANAGER}>Gerente</option>
              <option value={USER_ROLES.AGENT}>Agente</option>
              <option value={USER_ROLES.VIEWER}>Visualizador</option>
            </select>
          </div>
          {/* Teléfono */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1" htmlFor="phone">Teléfono</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              className="input-field w-full"
              placeholder="Ej: +54 11 1234-5678"
              autoComplete="off"
            />
          </div>
          {/* Activo */}
          <div className="flex items-center space-x-2">
            <input
              id="active"
              name="active"
              type="checkbox"
              checked={formData.active}
              onChange={handleChange}
              className="form-checkbox h-4 w-4 text-primary-400 border-neutral-500 rounded focus:ring-primary-400"
            />
            <label htmlFor="active" className="text-sm text-neutral-300">Usuario activo</label>
          </div>
          {/* Botones */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary px-5 py-2 rounded-lg"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-primary px-5 py-2 rounded-lg font-semibold"
            >
              {isEditing ? 'Guardar Cambios' : 'Crear Usuario'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 