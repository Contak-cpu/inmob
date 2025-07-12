'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, Lock, User, AlertCircle, CheckCircle } from 'lucide-react';
import { login } from '@/utils/auth';
import { notifyError, notifySuccess } from '@/utils/notifications';

export default function LoginForm({ onLoginSuccess }) {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpiar errores cuando el usuario empiece a escribir
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await login(formData.username, formData.password);
      
      if (result.success) {
        setSuccess('Inicio de sesión exitoso');
        notifySuccess('Bienvenido', `Hola ${result.user.name}`);
        
        // Limpiar formulario
        setFormData({ username: '', password: '' });
        
        // Llamar callback de éxito
        if (onLoginSuccess) {
          onLoginSuccess(result.user);
        }
      } else {
        setError(result.error);
        notifyError('Error de autenticación', result.error);
      }
    } catch (error) {
      setError('Error interno del sistema');
      notifyError('Error', 'Error interno del sistema');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (role) => {
    let credentials;
    switch (role) {
      case 'admin':
        credentials = { username: 'admin', password: 'admin123' };
        break;
      case 'manager':
        credentials = { username: 'german', password: 'german123' };
        break;
      case 'agent':
        credentials = { username: 'agente1', password: 'agente123' };
        break;
      default:
        return;
    }
    
    setFormData(credentials);
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="card">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="p-3 bg-primary-500/20 rounded-xl w-fit mx-auto mb-4">
            <Lock className="h-8 w-8 text-primary-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Iniciar Sesión</h2>
          <p className="text-neutral-400">Accede a tu cuenta de Konrad Inmobiliaria</p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Usuario
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
              <input
                type="text"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                className="input-field pl-10"
                placeholder="Ingresa tu usuario"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className="input-field pl-10 pr-10"
                placeholder="Ingresa tu contraseña"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-300"
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center space-x-2 p-3 bg-error-500/10 border border-error-500/20 rounded-lg">
              <AlertCircle className="h-5 w-5 text-error-400" />
              <p className="text-sm text-error-400">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="flex items-center space-x-2 p-3 bg-success-500/10 border border-success-500/20 rounded-lg">
              <CheckCircle className="h-5 w-5 text-success-400" />
              <p className="text-sm text-success-400">{success}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Iniciando sesión...</span>
              </>
            ) : (
              <span>Iniciar Sesión</span>
            )}
          </button>
        </form>

        {/* Demo Accounts */}
        <div className="mt-8 pt-6 border-t border-neutral-700">
          <h3 className="text-sm font-medium text-neutral-300 mb-4 text-center">
            Cuentas de demostración
          </h3>
          <div className="grid grid-cols-1 gap-3">
            <button
              onClick={() => handleDemoLogin('admin')}
              className="btn-secondary text-sm"
              disabled={isLoading}
            >
              <User className="h-4 w-4 mr-2" />
              Administrador (admin/admin123)
            </button>
            <button
              onClick={() => handleDemoLogin('manager')}
              className="btn-secondary text-sm"
              disabled={isLoading}
            >
              <User className="h-4 w-4 mr-2" />
              Gerente (german/german123)
            </button>
            <button
              onClick={() => handleDemoLogin('agent')}
              className="btn-secondary text-sm"
              disabled={isLoading}
            >
              <User className="h-4 w-4 mr-2" />
              Agente (agente1/agente123)
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="mt-6 text-center">
          <p className="text-xs text-neutral-500">
            Sistema de autenticación local para demostración
          </p>
        </div>
      </div>
    </div>
  );
} 