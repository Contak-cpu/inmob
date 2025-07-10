'use client';

import React from 'react';
import { Receipt, CheckCircle, FileText, Plus, Trash2 } from 'lucide-react';
import { ClientData, ImmobiliaryData, ReceiptItem, ReceiptType, FieldValidation, TouchedFields } from '@/types';
import { getFieldStatus, getFieldClasses } from '@/utils/validations';

interface ReceiptFormProps {
  clientData: ClientData;
  immobiliaryData: ImmobiliaryData;
  items: ReceiptItem[];
  fieldErrors: FieldValidation;
  touchedFields: TouchedFields;
  onClientChange: (field: keyof ClientData, value: string) => void;
  onItemChange: (index: number, field: keyof ReceiptItem, value: string) => void;
  onAddItem: () => void;
  onRemoveItem: (index: number) => void;
  onGenerate: () => void;
  isFormValid: boolean;
  receiptType: ReceiptType;
  receiptDate?: string;
  onDateChange: (date: string) => void;
}

export default function ReceiptForm({
  clientData,
  immobiliaryData,
  items,
  fieldErrors,
  touchedFields,
  onClientChange,
  onItemChange,
  onAddItem,
  onRemoveItem,
  onGenerate,
  isFormValid,
  receiptType,
  receiptDate,
  onDateChange
}: ReceiptFormProps) {
  return (
    <div className="space-y-8">
      {/* Step Indicator */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-slate-600 rounded-full flex items-center justify-center">
            <span className="text-slate-400 text-xs sm:text-sm font-medium">1</span>
          </div>
          <span className="text-slate-400 font-medium text-xs sm:text-sm">Tipo de Recibo</span>
        </div>
        <div className="w-8 sm:w-12 h-0.5 bg-green-500"></div>
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs sm:text-sm font-medium">2</span>
          </div>
          <span className="text-white font-medium text-xs sm:text-sm">Datos</span>
        </div>
        <div className="w-8 sm:w-12 h-0.5 bg-slate-600"></div>
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-slate-600 rounded-full flex items-center justify-center">
            <span className="text-slate-400 text-xs sm:text-sm font-medium">3</span>
          </div>
          <span className="text-slate-400 font-medium text-xs sm:text-sm">Generar</span>
        </div>
      </div>

      {/* Formulario de datos del cliente */}
      <div className="card p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center">
          <Receipt className="h-5 w-5 mr-2" />
          Datos del Cliente
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Nombre Completo *
            </label>
            <input
              type="text"
              value={clientData.name}
              onChange={e => onClientChange('name', e.target.value)}
              className={getFieldClasses(getFieldStatus('name', fieldErrors, touchedFields, clientData))}
              placeholder="Ej: Juan Pérez"
            />
            {fieldErrors.name && touchedFields.name && (
              <p className="text-red-400 text-sm mt-1">{fieldErrors.name}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              DNI *
            </label>
            <input
              type="text"
              value={clientData.dni}
              onChange={e => onClientChange('dni', e.target.value)}
              className={getFieldClasses(getFieldStatus('dni', fieldErrors, touchedFields, clientData))}
              placeholder="Ej: 12345678"
            />
            {fieldErrors.dni && touchedFields.dni && (
              <p className="text-red-400 text-sm mt-1">{fieldErrors.dni}</p>
            )}
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Domicilio *
            </label>
            <input
              type="text"
              value={clientData.address}
              onChange={e => onClientChange('address', e.target.value)}
              className={getFieldClasses(getFieldStatus('address', fieldErrors, touchedFields, clientData))}
              placeholder="Ej: Av. San Martín 1234, Santa Rosa, La Pampa"
            />
            {fieldErrors.address && touchedFields.address && (
              <p className="text-red-400 text-sm mt-1">{fieldErrors.address}</p>
            )}
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Dirección del Inmueble
            </label>
            <input
              type="text"
              value={clientData.propertyAddress}
              onChange={e => onClientChange('propertyAddress', e.target.value)}
              className="input-field"
              placeholder="Ej: Calle 25 de Mayo 567"
            />
          </div>
        </div>
      </div>

      {/* Formulario de items/conceptos */}
      <div className="card p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center">
          <FileText className="h-5 w-5 mr-2" />
          Detalle de Pagos
        </h3>
        <div className="space-y-4">
          {items.map((item, idx) => (
            <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Descripción *
                </label>
                <input
                  type="text"
                  value={item.description}
                  onChange={e => onItemChange(idx, 'description', e.target.value)}
                  className="input-field"
                  placeholder="Ej: Alquiler mensual mayo 2024"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Importe *
                </label>
                <input
                  type="number"
                  value={item.amount}
                  onChange={e => onItemChange(idx, 'amount', e.target.value)}
                  className="input-field"
                  placeholder="Ej: 150000"
                />
              </div>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={onAddItem}
                  className="btn-secondary flex items-center justify-center"
                  title="Agregar concepto"
                >
                  <Plus className="h-4 w-4" />
                </button>
                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => onRemoveItem(idx)}
                    className="btn-secondary flex items-center justify-center"
                    title="Eliminar concepto"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fecha del recibo */}
      <div className="card p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center">
          <CheckCircle className="h-5 w-5 mr-2" />
          Fecha del Recibo
        </h3>
        <input
          type="date"
          value={receiptDate || ''}
          onChange={e => onDateChange(e.target.value)}
          className="input-field w-60"
        />
      </div>

      {/* Botón de generar */}
      <div className="text-center pt-8">
        <button
          onClick={onGenerate}
          disabled={!isFormValid}
          className={`btn-primary inline-flex items-center space-x-2 ${
            !isFormValid ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <span>Generar Recibo</span>
          <Receipt className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
} 