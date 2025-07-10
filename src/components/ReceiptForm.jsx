'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, User, Building, DollarSign, Receipt, AlertCircle } from 'lucide-react';
import { RECEIPT_TYPES } from '@/lib/config';
import { formatCurrency, formatDate } from '@/utils/formatters';

export default function ReceiptForm({
  receiptType,
  formData,
  errors,
  onChange,
  onSubmit,
  isSubmitting,
  isValid
}) {
  const [localFormData, setLocalFormData] = useState({});
  const receipt = RECEIPT_TYPES[receiptType];

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

  if (!receipt) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="h-12 w-12 text-error-400 mx-auto mb-4" />
        <p className="text-neutral-400">Tipo de recibo no válido</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Property Information */}
      <div className="space-y-6">
        <div className="flex items-center space-x-3 mb-6">
          <Building className="h-6 w-6 text-secondary-400" />
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
        </div>
      </div>

      {/* Receipt Information */}
      <div className="space-y-6">
        <div className="flex items-center space-x-3 mb-6">
          <Receipt className="h-6 w-6 text-secondary-400" />
          <h3 className="text-xl font-semibold text-white">Información del Recibo</h3>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Período *
            </label>
            <input
              type="text"
              value={localFormData.period || ''}
              onChange={(e) => handleInputChange('period', e.target.value)}
              className={`input-field ${errors.period ? 'border-error-500' : ''}`}
              placeholder="Ej: Enero 2024"
            />
            {errors.period && (
              <p className="text-error-400 text-sm mt-1">{errors.period}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Fecha de Emisión *
            </label>
            <input
              type="date"
              value={localFormData.issueDate || ''}
              onChange={(e) => handleInputChange('issueDate', e.target.value)}
              className={`input-field ${errors.issueDate ? 'border-error-500' : ''}`}
            />
            {errors.issueDate && (
              <p className="text-error-400 text-sm mt-1">{errors.issueDate}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Alquiler Base *
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <input
                type="number"
                value={localFormData.baseRent || ''}
                onChange={(e) => handleInputChange('baseRent', e.target.value)}
                className={`input-field pl-10 ${errors.baseRent ? 'border-error-500' : ''}`}
                placeholder="Ej: 150000"
                min="0"
                step="0.01"
              />
            </div>
            {errors.baseRent && (
              <p className="text-error-400 text-sm mt-1">{errors.baseRent}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Gastos de Servicios
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <input
                type="number"
                value={localFormData.servicesExpenses || ''}
                onChange={(e) => handleInputChange('servicesExpenses', e.target.value)}
                className="input-field pl-10"
                placeholder="Ej: 25000"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Gastos de Administración
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <input
                type="number"
                value={localFormData.adminExpenses || ''}
                onChange={(e) => handleInputChange('adminExpenses', e.target.value)}
                className="input-field pl-10"
                placeholder="Ej: 15000"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Otros Gastos
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <input
                type="number"
                value={localFormData.otherExpenses || ''}
                onChange={(e) => handleInputChange('otherExpenses', e.target.value)}
                className="input-field pl-10"
                placeholder="Ej: 5000"
                min="0"
                step="0.01"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="space-y-6">
        <div className="flex items-center space-x-3 mb-6">
          <AlertCircle className="h-6 w-6 text-secondary-400" />
          <h3 className="text-xl font-semibold text-white">Información Adicional</h3>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Forma de Pago
            </label>
            <select
              value={localFormData.paymentMethod || ''}
              onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
              className="input-field"
            >
              <option value="">Seleccionar</option>
              <option value="efectivo">Efectivo</option>
              <option value="transferencia">Transferencia</option>
              <option value="cheque">Cheque</option>
              <option value="tarjeta">Tarjeta</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Estado del Pago
            </label>
            <select
              value={localFormData.paymentStatus || ''}
              onChange={(e) => handleInputChange('paymentStatus', e.target.value)}
              className="input-field"
            >
              <option value="">Seleccionar</option>
              <option value="pendiente">Pendiente</option>
              <option value="pagado">Pagado</option>
              <option value="parcial">Parcial</option>
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
          className={`btn-secondary ${!isValid || isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isSubmitting ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Generando...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Receipt className="h-4 w-4" />
              <span>Generar Recibo</span>
            </div>
          )}
        </button>
      </div>
    </form>
  );
} 