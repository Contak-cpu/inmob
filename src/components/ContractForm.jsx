'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, User, Building, DollarSign, FileText, AlertCircle } from 'lucide-react';
import { CONTRACT_TYPES } from '@/lib/config';
import { formatCurrency, formatDate } from '@/utils/formatters';

export default function ContractForm({
  contractType,
  formData,
  errors,
  onChange,
  onSubmit,
  isSubmitting,
  isValid
}) {
  const [localFormData, setLocalFormData] = useState({});
  const contract = CONTRACT_TYPES[contractType];

  useEffect(() => {
    setLocalFormData(formData);
  }, [formData]);

  const handleInputChange = (field, value) => {
    const newData = { ...localFormData, [field]: value };
    setLocalFormData(newData);
    onChange(newData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(e);
    }
  };

  if (!contract) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="h-12 w-12 text-error-400 mx-auto mb-4" />
        <p className="text-neutral-400">Tipo de contrato no válido</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Property Information */}
      <div className="space-y-6">
        <div className="flex items-center space-x-3 mb-6">
          <Building className="h-6 w-6 text-primary-400" />
          <h3 className="text-xl font-semibold text-white">Información de la Propiedad</h3>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Dirección de la Propiedad *
            </label>
            <input
              type="text"
              value={localFormData.propertyAddress || ''}
              onChange={(e) => handleInputChange('propertyAddress', e.target.value)}
              className={`input-field ${errors.propertyAddress ? 'border-error-500' : ''}`}
              placeholder="Ej: Av. Corrientes 1234, CABA"
            />
            {errors.propertyAddress && (
              <p className="text-error-400 text-sm mt-1">{errors.propertyAddress}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Tipo de Propiedad *
            </label>
            <select
              value={localFormData.propertyType || ''}
              onChange={(e) => handleInputChange('propertyType', e.target.value)}
              className={`input-field ${errors.propertyType ? 'border-error-500' : ''}`}
            >
              <option value="">Seleccionar tipo</option>
              <option value="departamento">Departamento</option>
              <option value="casa">Casa</option>
              <option value="local">Local Comercial</option>
              <option value="oficina">Oficina</option>
              <option value="terreno">Terreno</option>
            </select>
            {errors.propertyType && (
              <p className="text-error-400 text-sm mt-1">{errors.propertyType}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Superficie (m²)
            </label>
            <input
              type="number"
              value={localFormData.surface || ''}
              onChange={(e) => handleInputChange('surface', e.target.value)}
              className="input-field"
              placeholder="Ej: 80"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Cantidad de Ambientes
            </label>
            <input
              type="number"
              value={localFormData.rooms || ''}
              onChange={(e) => handleInputChange('rooms', e.target.value)}
              className="input-field"
              placeholder="Ej: 3"
            />
          </div>
        </div>
      </div>

      {/* Owner Information */}
      <div className="space-y-6">
        <div className="flex items-center space-x-3 mb-6">
          <User className="h-6 w-6 text-primary-400" />
          <h3 className="text-xl font-semibold text-white">Información del Propietario</h3>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Nombre Completo *
            </label>
            <input
              type="text"
              value={localFormData.ownerName || ''}
              onChange={(e) => handleInputChange('ownerName', e.target.value)}
              className={`input-field ${errors.ownerName ? 'border-error-500' : ''}`}
              placeholder="Ej: Juan Pérez"
            />
            {errors.ownerName && (
              <p className="text-error-400 text-sm mt-1">{errors.ownerName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              DNI/CUIL *
            </label>
            <input
              type="text"
              value={localFormData.ownerDocument || ''}
              onChange={(e) => handleInputChange('ownerDocument', e.target.value)}
              className={`input-field ${errors.ownerDocument ? 'border-error-500' : ''}`}
              placeholder="Ej: 12345678"
            />
            {errors.ownerDocument && (
              <p className="text-error-400 text-sm mt-1">{errors.ownerDocument}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Teléfono
            </label>
            <input
              type="tel"
              value={localFormData.ownerPhone || ''}
              onChange={(e) => handleInputChange('ownerPhone', e.target.value)}
              className="input-field"
              placeholder="Ej: +54 11 1234-5678"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Email
            </label>
            <input
              type="email"
              value={localFormData.ownerEmail || ''}
              onChange={(e) => handleInputChange('ownerEmail', e.target.value)}
              className="input-field"
              placeholder="Ej: juan@email.com"
            />
          </div>
        </div>
      </div>

      {/* Tenant Information */}
      <div className="space-y-6">
        <div className="flex items-center space-x-3 mb-6">
          <User className="h-6 w-6 text-secondary-400" />
          <h3 className="text-xl font-semibold text-white">Información del Inquilino</h3>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Nombre Completo *
            </label>
            <input
              type="text"
              value={localFormData.tenantName || ''}
              onChange={(e) => handleInputChange('tenantName', e.target.value)}
              className={`input-field ${errors.tenantName ? 'border-error-500' : ''}`}
              placeholder="Ej: María González"
            />
            {errors.tenantName && (
              <p className="text-error-400 text-sm mt-1">{errors.tenantName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              DNI/CUIL *
            </label>
            <input
              type="text"
              value={localFormData.tenantDocument || ''}
              onChange={(e) => handleInputChange('tenantDocument', e.target.value)}
              className={`input-field ${errors.tenantDocument ? 'border-error-500' : ''}`}
              placeholder="Ej: 87654321"
            />
            {errors.tenantDocument && (
              <p className="text-error-400 text-sm mt-1">{errors.tenantDocument}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Teléfono
            </label>
            <input
              type="tel"
              value={localFormData.tenantPhone || ''}
              onChange={(e) => handleInputChange('tenantPhone', e.target.value)}
              className="input-field"
              placeholder="Ej: +54 11 8765-4321"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Email
            </label>
            <input
              type="email"
              value={localFormData.tenantEmail || ''}
              onChange={(e) => handleInputChange('tenantEmail', e.target.value)}
              className="input-field"
              placeholder="Ej: maria@email.com"
            />
          </div>
        </div>
      </div>

      {/* Contract Terms */}
      <div className="space-y-6">
        <div className="flex items-center space-x-3 mb-6">
          <FileText className="h-6 w-6 text-primary-400" />
          <h3 className="text-xl font-semibold text-white">Términos del Contrato</h3>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Fecha de Inicio *
            </label>
            <input
              type="date"
              value={localFormData.startDate || ''}
              onChange={(e) => handleInputChange('startDate', e.target.value)}
              className={`input-field ${errors.startDate ? 'border-error-500' : ''}`}
            />
            {errors.startDate && (
              <p className="text-error-400 text-sm mt-1">{errors.startDate}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Duración (meses) *
            </label>
            <input
              type="number"
              value={localFormData.duration || ''}
              onChange={(e) => handleInputChange('duration', e.target.value)}
              className={`input-field ${errors.duration ? 'border-error-500' : ''}`}
              placeholder="Ej: 12"
              min="1"
            />
            {errors.duration && (
              <p className="text-error-400 text-sm mt-1">{errors.duration}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Precio Mensual *
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <input
                type="number"
                value={localFormData.monthlyPrice || ''}
                onChange={(e) => handleInputChange('monthlyPrice', e.target.value)}
                className={`input-field pl-10 ${errors.monthlyPrice ? 'border-error-500' : ''}`}
                placeholder="Ej: 150000"
                min="0"
                step="0.01"
              />
            </div>
            {errors.monthlyPrice && (
              <p className="text-error-400 text-sm mt-1">{errors.monthlyPrice}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Depósito (meses) *
            </label>
            <input
              type="number"
              value={localFormData.deposit || ''}
              onChange={(e) => handleInputChange('deposit', e.target.value)}
              className={`input-field ${errors.deposit ? 'border-error-500' : ''}`}
              placeholder="Ej: 1"
              min="0"
              max="3"
            />
            {errors.deposit && (
              <p className="text-error-400 text-sm mt-1">{errors.deposit}</p>
            )}
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="space-y-6">
        <div className="flex items-center space-x-3 mb-6">
          <AlertCircle className="h-6 w-6 text-primary-400" />
          <h3 className="text-xl font-semibold text-white">Información Adicional</h3>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Gastos Incluidos
            </label>
            <select
              value={localFormData.expensesIncluded || ''}
              onChange={(e) => handleInputChange('expensesIncluded', e.target.value)}
              className="input-field"
            >
              <option value="">Seleccionar</option>
              <option value="ninguno">Ninguno</option>
              <option value="agua">Agua</option>
              <option value="luz">Luz</option>
              <option value="gas">Gas</option>
              <option value="todos">Todos</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Mascotas Permitidas
            </label>
            <select
              value={localFormData.petsAllowed || ''}
              onChange={(e) => handleInputChange('petsAllowed', e.target.value)}
              className="input-field"
            >
              <option value="">Seleccionar</option>
              <option value="si">Sí</option>
              <option value="no">No</option>
              <option value="consultar">Consultar</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">
            Observaciones
          </label>
          <textarea
            value={localFormData.observations || ''}
            onChange={(e) => handleInputChange('observations', e.target.value)}
            className="input-field h-24 resize-none"
            placeholder="Información adicional relevante..."
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end pt-6 border-t border-neutral-700">
        <button
          type="submit"
          disabled={!isValid || isSubmitting}
          className={`btn-primary ${!isValid || isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isSubmitting ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Generando...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Generar Contrato</span>
            </div>
          )}
        </button>
      </div>
    </form>
  );
} 