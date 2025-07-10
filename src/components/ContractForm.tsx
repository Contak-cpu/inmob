'use client';

import React from 'react';
import { Building, CheckCircle, FileText } from 'lucide-react';
import { ContractFormData, FieldValidation, TouchedFields, ContractType } from '@/types';
import { getFieldStatus, getFieldClasses } from '@/utils/validations';
import { CONTRACT_DURATIONS, ADJUSTMENT_TYPES } from '@/lib/config';

interface ContractFormProps {
  formData: ContractFormData;
  fieldErrors: FieldValidation;
  touchedFields: TouchedFields;
  onFieldChange: (field: keyof ContractFormData, value: string) => void;
  onGenerate: () => void;
  isFormValid: boolean;
  contractType: ContractType;
}

export default function ContractForm({ 
  formData, 
  fieldErrors, 
  touchedFields, 
  onFieldChange, 
  onGenerate, 
  isFormValid,
  contractType 
}: ContractFormProps) {
  return (
    <div className="space-y-8">
      {/* Step Indicator */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-slate-600 rounded-full flex items-center justify-center">
            <span className="text-slate-400 text-xs sm:text-sm font-medium">1</span>
          </div>
          <span className="text-slate-400 font-medium text-xs sm:text-sm">Tipo de Contrato</span>
        </div>
        <div className="w-8 sm:w-12 h-0.5 bg-primary-500"></div>
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-primary-500 rounded-full flex items-center justify-center">
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

      {/* Form Sections */}
      <div className="space-y-6 sm:space-y-8">
        {/* Datos del Inmueble */}
        <div className="card p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center">
            <Building className="h-5 w-5 mr-2" />
            Datos del Inmueble
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Dirección del Inmueble *
              </label>
              <input
                type="text"
                value={formData.propertyAddress}
                onChange={(e) => onFieldChange('propertyAddress', e.target.value)}
                className={getFieldClasses(getFieldStatus('propertyAddress', fieldErrors, touchedFields, formData))}
                placeholder="Ej: Av. San Martín 1234"
              />
              {fieldErrors.propertyAddress && touchedFields.propertyAddress && (
                <p className="text-red-400 text-sm mt-1">{fieldErrors.propertyAddress}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Descripción
              </label>
              <input
                type="text"
                value={formData.propertyDescription}
                onChange={(e) => onFieldChange('propertyDescription', e.target.value)}
                className="input-field"
                placeholder="Ej: Casa de 3 dormitorios"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Referencia Municipal
              </label>
              <input
                type="text"
                value={formData.municipalReference}
                onChange={(e) => onFieldChange('municipalReference', e.target.value)}
                className="input-field"
                placeholder="Ej: RM-2024-001"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Número de Parcela
              </label>
              <input
                type="text"
                value={formData.parcelNumber}
                onChange={(e) => onFieldChange('parcelNumber', e.target.value)}
                className="input-field"
                placeholder="Ej: 12345"
              />
            </div>
          </div>
        </div>

        {/* Datos del Locador */}
        <div className="card p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center">
            <CheckCircle className="h-5 w-5 mr-2" />
            Datos del Locador
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Nombre Completo *
              </label>
              <input
                type="text"
                value={formData.ownerName}
                onChange={(e) => onFieldChange('ownerName', e.target.value)}
                className={getFieldClasses(getFieldStatus('ownerName', fieldErrors, touchedFields, formData))}
                placeholder="Ej: Juan Pérez"
              />
              {fieldErrors.ownerName && touchedFields.ownerName && (
                <p className="text-red-400 text-sm mt-1">{fieldErrors.ownerName}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                DNI *
              </label>
              <input
                type="text"
                value={formData.ownerDni}
                onChange={(e) => onFieldChange('ownerDni', e.target.value)}
                className={getFieldClasses(getFieldStatus('ownerDni', fieldErrors, touchedFields, formData))}
                placeholder="Ej: 12345678"
              />
              {fieldErrors.ownerDni && touchedFields.ownerDni && (
                <p className="text-red-400 text-sm mt-1">{fieldErrors.ownerDni}</p>
              )}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Domicilio *
              </label>
              <input
                type="text"
                value={formData.ownerAddress}
                onChange={(e) => onFieldChange('ownerAddress', e.target.value)}
                className={getFieldClasses(getFieldStatus('ownerAddress', fieldErrors, touchedFields, formData))}
                placeholder="Ej: Av. San Martín 1234, Santa Rosa, La Pampa"
              />
              {fieldErrors.ownerAddress && touchedFields.ownerAddress && (
                <p className="text-red-400 text-sm mt-1">{fieldErrors.ownerAddress}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.ownerEmail}
                onChange={(e) => onFieldChange('ownerEmail', e.target.value)}
                className={getFieldClasses(getFieldStatus('ownerEmail', fieldErrors, touchedFields, formData))}
                placeholder="Ej: juan@email.com"
              />
              {fieldErrors.ownerEmail && touchedFields.ownerEmail && (
                <p className="text-red-400 text-sm mt-1">{fieldErrors.ownerEmail}</p>
              )}
            </div>
          </div>
        </div>

        {/* Datos del Locatario */}
        <div className="card p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center">
            <CheckCircle className="h-5 w-5 mr-2" />
            Datos del Locatario
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Nombre Completo *
              </label>
              <input
                type="text"
                value={formData.tenantName}
                onChange={(e) => onFieldChange('tenantName', e.target.value)}
                className={getFieldClasses(getFieldStatus('tenantName', fieldErrors, touchedFields, formData))}
                placeholder="Ej: María González"
              />
              {fieldErrors.tenantName && touchedFields.tenantName && (
                <p className="text-red-400 text-sm mt-1">{fieldErrors.tenantName}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                DNI *
              </label>
              <input
                type="text"
                value={formData.tenantDni}
                onChange={(e) => onFieldChange('tenantDni', e.target.value)}
                className={getFieldClasses(getFieldStatus('tenantDni', fieldErrors, touchedFields, formData))}
                placeholder="Ej: 87654321"
              />
              {fieldErrors.tenantDni && touchedFields.tenantDni && (
                <p className="text-red-400 text-sm mt-1">{fieldErrors.tenantDni}</p>
              )}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Domicilio *
              </label>
              <input
                type="text"
                value={formData.tenantAddress}
                onChange={(e) => onFieldChange('tenantAddress', e.target.value)}
                className={getFieldClasses(getFieldStatus('tenantAddress', fieldErrors, touchedFields, formData))}
                placeholder="Ej: Calle 25 de Mayo 567, Santa Rosa, La Pampa"
              />
              {fieldErrors.tenantAddress && touchedFields.tenantAddress && (
                <p className="text-red-400 text-sm mt-1">{fieldErrors.tenantAddress}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.tenantEmail}
                onChange={(e) => onFieldChange('tenantEmail', e.target.value)}
                className={getFieldClasses(getFieldStatus('tenantEmail', fieldErrors, touchedFields, formData))}
                placeholder="Ej: maria@email.com"
              />
              {fieldErrors.tenantEmail && touchedFields.tenantEmail && (
                <p className="text-red-400 text-sm mt-1">{fieldErrors.tenantEmail}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Integrantes del Grupo Familiar
              </label>
              <input
                type="text"
                value={formData.familyMembers}
                onChange={(e) => onFieldChange('familyMembers', e.target.value)}
                className="input-field"
                placeholder="Ej: Cónyuge e hijos"
              />
            </div>
          </div>
        </div>

        {/* Condiciones Económicas */}
        <div className="card p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center">
            <CheckCircle className="h-5 w-5 mr-2" />
            Condiciones Económicas
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Monto Mensual *
              </label>
              <input
                type="number"
                value={formData.monthlyAmount}
                onChange={(e) => onFieldChange('monthlyAmount', e.target.value)}
                className={getFieldClasses(getFieldStatus('monthlyAmount', fieldErrors, touchedFields, formData))}
                placeholder="Ej: 150000"
              />
              {fieldErrors.monthlyAmount && touchedFields.monthlyAmount && (
                <p className="text-red-400 text-sm mt-1">{fieldErrors.monthlyAmount}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Depósito *
              </label>
              <input
                type="number"
                value={formData.depositAmount}
                onChange={(e) => onFieldChange('depositAmount', e.target.value)}
                className={getFieldClasses(getFieldStatus('depositAmount', fieldErrors, touchedFields, formData))}
                placeholder="Ej: 150000"
              />
              {fieldErrors.depositAmount && touchedFields.depositAmount && (
                <p className="text-red-400 text-sm mt-1">{fieldErrors.depositAmount}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Fecha de Inicio *
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => onFieldChange('startDate', e.target.value)}
                className={getFieldClasses(getFieldStatus('startDate', fieldErrors, touchedFields, formData))}
              />
              {fieldErrors.startDate && touchedFields.startDate && (
                <p className="text-red-400 text-sm mt-1">{fieldErrors.startDate}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Fecha de Finalización
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => onFieldChange('endDate', e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Duración del Contrato
              </label>
              <select
                value={formData.contractDuration}
                onChange={(e) => onFieldChange('contractDuration', e.target.value)}
                className="input-field"
              >
                {CONTRACT_DURATIONS.map(duration => (
                  <option key={duration.value} value={duration.value}>
                    {duration.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Tipo de Ajuste
              </label>
              <select
                value={formData.adjustmentType}
                onChange={(e) => onFieldChange('adjustmentType', e.target.value)}
                className="input-field"
              >
                {Object.entries(ADJUSTMENT_TYPES).map(([key, adjustment]) => (
                  <option key={key} value={key}>
                    {adjustment.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Garantes (Opcional) */}
        <div className="card p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center">
            <CheckCircle className="h-5 w-5 mr-2" />
            Garantes (Opcional)
          </h3>
          <div className="space-y-6">
            {/* Garante 1 */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Nombre del Garante 1
                </label>
                <input
                  type="text"
                  value={formData.guarantor1Name}
                  onChange={(e) => onFieldChange('guarantor1Name', e.target.value)}
                  className={getFieldClasses(getFieldStatus('guarantor1Name', fieldErrors, touchedFields, formData))}
                  placeholder="Ej: Pedro Rodríguez"
                />
                {fieldErrors.guarantor1Name && touchedFields.guarantor1Name && (
                  <p className="text-red-400 text-sm mt-1">{fieldErrors.guarantor1Name}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  DNI del Garante 1
                </label>
                <input
                  type="text"
                  value={formData.guarantor1Dni}
                  onChange={(e) => onFieldChange('guarantor1Dni', e.target.value)}
                  className={getFieldClasses(getFieldStatus('guarantor1Dni', fieldErrors, touchedFields, formData))}
                  placeholder="Ej: 11222333"
                />
                {fieldErrors.guarantor1Dni && touchedFields.guarantor1Dni && (
                  <p className="text-red-400 text-sm mt-1">{fieldErrors.guarantor1Dni}</p>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Domicilio del Garante 1
                </label>
                <input
                  type="text"
                  value={formData.guarantor1Address}
                  onChange={(e) => onFieldChange('guarantor1Address', e.target.value)}
                  className={getFieldClasses(getFieldStatus('guarantor1Address', fieldErrors, touchedFields, formData))}
                  placeholder="Ej: Av. Rivadavia 789, Santa Rosa, La Pampa"
                />
                {fieldErrors.guarantor1Address && touchedFields.guarantor1Address && (
                  <p className="text-red-400 text-sm mt-1">{fieldErrors.guarantor1Address}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Email del Garante 1
                </label>
                <input
                  type="email"
                  value={formData.guarantor1Email}
                  onChange={(e) => onFieldChange('guarantor1Email', e.target.value)}
                  className={getFieldClasses(getFieldStatus('guarantor1Email', fieldErrors, touchedFields, formData))}
                  placeholder="Ej: pedro@email.com"
                />
                {fieldErrors.guarantor1Email && touchedFields.guarantor1Email && (
                  <p className="text-red-400 text-sm mt-1">{fieldErrors.guarantor1Email}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Ocupación del Garante 1
                </label>
                <input
                  type="text"
                  value={formData.guarantor1Job}
                  onChange={(e) => onFieldChange('guarantor1Job', e.target.value)}
                  className="input-field"
                  placeholder="Ej: Empleado"
                />
              </div>
            </div>

            {/* Garante 2 */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Nombre del Garante 2
                </label>
                <input
                  type="text"
                  value={formData.guarantor2Name}
                  onChange={(e) => onFieldChange('guarantor2Name', e.target.value)}
                  className={getFieldClasses(getFieldStatus('guarantor2Name', fieldErrors, touchedFields, formData))}
                  placeholder="Ej: Ana López"
                />
                {fieldErrors.guarantor2Name && touchedFields.guarantor2Name && (
                  <p className="text-red-400 text-sm mt-1">{fieldErrors.guarantor2Name}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  DNI del Garante 2
                </label>
                <input
                  type="text"
                  value={formData.guarantor2Dni}
                  onChange={(e) => onFieldChange('guarantor2Dni', e.target.value)}
                  className={getFieldClasses(getFieldStatus('guarantor2Dni', fieldErrors, touchedFields, formData))}
                  placeholder="Ej: 44555666"
                />
                {fieldErrors.guarantor2Dni && touchedFields.guarantor2Dni && (
                  <p className="text-red-400 text-sm mt-1">{fieldErrors.guarantor2Dni}</p>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Domicilio del Garante 2
                </label>
                <input
                  type="text"
                  value={formData.guarantor2Address}
                  onChange={(e) => onFieldChange('guarantor2Address', e.target.value)}
                  className={getFieldClasses(getFieldStatus('guarantor2Address', fieldErrors, touchedFields, formData))}
                  placeholder="Ej: Calle 9 de Julio 321, Santa Rosa, La Pampa"
                />
                {fieldErrors.guarantor2Address && touchedFields.guarantor2Address && (
                  <p className="text-red-400 text-sm mt-1">{fieldErrors.guarantor2Address}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Email del Garante 2
                </label>
                <input
                  type="email"
                  value={formData.guarantor2Email}
                  onChange={(e) => onFieldChange('guarantor2Email', e.target.value)}
                  className={getFieldClasses(getFieldStatus('guarantor2Email', fieldErrors, touchedFields, formData))}
                  placeholder="Ej: ana@email.com"
                />
                {fieldErrors.guarantor2Email && touchedFields.guarantor2Email && (
                  <p className="text-red-400 text-sm mt-1">{fieldErrors.guarantor2Email}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Ocupación del Garante 2
                </label>
                <input
                  type="text"
                  value={formData.guarantor2Job}
                  onChange={(e) => onFieldChange('guarantor2Job', e.target.value)}
                  className="input-field"
                  placeholder="Ej: Docente"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Generate Button */}
      <div className="text-center pt-8">
        <button
          onClick={onGenerate}
          disabled={!isFormValid}
          className={`btn-primary inline-flex items-center space-x-2 ${
            !isFormValid ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <span>Generar Contrato</span>
          <FileText className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
} 