'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText, Download } from 'lucide-react';
import { CONTRACT_TYPES, COMPANY_CONFIG, ADJUSTMENT_TYPES } from '@/lib/config';
import { ContractType, ContractFormData, FieldValidation, TouchedFields } from '@/types';
import { validateField } from '@/utils/validations';
import ContractForm from '@/components/ContractForm';

interface PageProps {
  params: {
    type: ContractType;
  };
}

export default function ContractFormPage({ params }: PageProps) {
  const { type } = params;
  const [step, setStep] = useState<'form' | 'preview'>('form');
  const [fieldErrors, setFieldErrors] = useState<FieldValidation>({});
  const [touchedFields, setTouchedFields] = useState<TouchedFields>({});
  const [generatedContract, setGeneratedContract] = useState('');

  // Estado inicial del formulario
  const [formData, setFormData] = useState<ContractFormData>({
    // Datos del inmueble
    propertyAddress: '',
    propertyDescription: '',
    municipalReference: '',
    parcelNumber: '',
    
    // Datos del locador/vendedor
    ownerName: '',
    ownerDni: '',
    ownerAddress: '',
    ownerEmail: '',
    
    // Datos del locatario/comprador
    tenantName: '',
    tenantDni: '',
    tenantAddress: '',
    tenantEmail: '',
    familyMembers: '',
    
    // Garantes
    guarantor1Name: '',
    guarantor1Dni: '',
    guarantor1Address: '',
    guarantor1Email: '',
    guarantor1Job: '',
    guarantor2Name: '',
    guarantor2Dni: '',
    guarantor2Address: '',
    guarantor2Email: '',
    guarantor2Job: '',
    
    // Condiciones económicas
    monthlyAmount: '',
    depositAmount: '',
    startDate: '',
    endDate: '',
    contractDuration: '36',
    adjustmentType: 'CVS_CER',
    
    // Datos de la inmobiliaria
    realtorName: COMPANY_CONFIG.realtorName,
    realtorNumber: COMPANY_CONFIG.realtorNumber,
    realtyCompany: COMPANY_CONFIG.companyName,
    realtyAddress: COMPANY_CONFIG.companyAddress,
  });

  // Validar que el tipo de contrato sea válido
  useEffect(() => {
    if (!CONTRACT_TYPES[type]) {
      // Redirigir a la página principal si el tipo no es válido
      window.location.href = '/contracts';
    }
  }, [type]);

  // Función para manejar cambios en los campos
  const handleFieldChange = (fieldName: keyof ContractFormData, value: string) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
    
    // Marcar el campo como tocado
    setTouchedFields(prev => ({ ...prev, [fieldName]: true }));
    
    // Validar en tiempo real
    const error = validateField(fieldName, value, type);
    setFieldErrors(prev => ({ ...prev, [fieldName]: error }));
  };

  // Función para verificar si el formulario es válido
  const isFormValid = () => {
    const requiredFields = [
      'propertyAddress', 'ownerName', 'ownerDni', 'tenantName', 
      'tenantDni', 'monthlyAmount', 'depositAmount', 'startDate'
    ];
    
    return requiredFields.every(field => {
      const value = formData[field as keyof ContractFormData];
      return value && value.toString().trim() && !fieldErrors[field];
    });
  };

  // Función para generar el contrato
  const generateContract = () => {
    if (!isFormValid()) return;

    const contract = generateContractText();
    setGeneratedContract(contract);
    setStep('preview');
  };

  // Función para generar el texto del contrato
  const generateContractText = () => {
    const contractType = CONTRACT_TYPES[type];
    const today = new Date().toLocaleDateString('es-AR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return `
CONTRATO DE ${contractType.name.toUpperCase()}

${COMPANY_CONFIG.companyName}
${COMPANY_CONFIG.companyAddress}
Tel: ${COMPANY_CONFIG.companyPhone} | Email: ${COMPANY_CONFIG.companyEmail}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FECHA: ${today}

LOCADOR:
Nombre: ${formData.ownerName}
DNI: ${formData.ownerDni}
Domicilio: ${formData.ownerAddress}
${formData.ownerEmail ? `Email: ${formData.ownerEmail}` : ''}

LOCATARIO:
Nombre: ${formData.tenantName}
DNI: ${formData.tenantDni}
Domicilio: ${formData.tenantAddress}
${formData.tenantEmail ? `Email: ${formData.tenantEmail}` : ''}
${formData.familyMembers ? `Integrantes del grupo familiar: ${formData.familyMembers}` : ''}

INMUEBLE:
Dirección: ${formData.propertyAddress}
${formData.propertyDescription ? `Descripción: ${formData.propertyDescription}` : ''}
${formData.municipalReference ? `Referencia Municipal: ${formData.municipalReference}` : ''}
${formData.parcelNumber ? `Número de Parcela: ${formData.parcelNumber}` : ''}

CONDICIONES ECONÓMICAS:
Monto mensual: $ ${parseFloat(formData.monthlyAmount || '0').toLocaleString('es-AR')}
Depósito: $ ${parseFloat(formData.depositAmount || '0').toLocaleString('es-AR')}
Duración: ${formData.contractDuration} meses
Tipo de ajuste: ${ADJUSTMENT_TYPES[formData.adjustmentType].name}
Fecha de inicio: ${formData.startDate}
${formData.endDate ? `Fecha de finalización: ${formData.endDate}` : ''}

${formData.guarantor1Name ? `
GARANTE 1:
Nombre: ${formData.guarantor1Name}
DNI: ${formData.guarantor1Dni}
Domicilio: ${formData.guarantor1Address}
${formData.guarantor1Email ? `Email: ${formData.guarantor1Email}` : ''}
${formData.guarantor1Job ? `Ocupación: ${formData.guarantor1Job}` : ''}
` : ''}

${formData.guarantor2Name ? `
GARANTE 2:
Nombre: ${formData.guarantor2Name}
DNI: ${formData.guarantor2Dni}
Domicilio: ${formData.guarantor2Address}
${formData.guarantor2Email ? `Email: ${formData.guarantor2Email}` : ''}
${formData.guarantor2Job ? `Ocupación: ${formData.guarantor2Job}` : ''}
` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

INMOBILIARIA:
${formData.realtyCompany}
${formData.realtyAddress}
Martillero: ${formData.realtorName} - Mat. ${formData.realtorNumber}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Este contrato se rige por las leyes vigentes en la República Argentina.
Ambas partes acuerdan las condiciones establecidas anteriormente.

Santa Rosa, La Pampa, ${today}

_________________________________
Firma del Locador

_________________________________
Firma del Locatario

_________________________________
Firma del Martillero
${formData.realtorName} - Mat. ${formData.realtorNumber}
    `;
  };

  // Función para descargar el contrato
  const downloadContract = () => {
    const element = document.createElement('a');
    const file = new Blob([generatedContract], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `contrato-${type}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (!CONTRACT_TYPES[type]) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Tipo de contrato no válido</h1>
          <Link href="/contracts" className="btn-primary">
            Volver a contratos
          </Link>
        </div>
      </div>
    );
  }

  const contractType = CONTRACT_TYPES[type];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="glass-effect border-b border-slate-700/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link href="/contracts" className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors">
                <ArrowLeft className="h-5 w-5 text-slate-400" />
              </Link>
              <FileText className="h-8 w-8 text-primary-400" />
              <div>
                <h1 className="text-xl font-bold text-white">{contractType.name}</h1>
                <p className="text-sm text-slate-400">{contractType.description}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-400">KONRAD Inmobiliaria</p>
              <p className="text-xs text-slate-500">Mat. 573</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {step === 'form' ? (
            <ContractForm 
              formData={formData}
              fieldErrors={fieldErrors}
              touchedFields={touchedFields}
              onFieldChange={handleFieldChange}
              onGenerate={generateContract}
              isFormValid={isFormValid()}
              contractType={type}
            />
          ) : (
            <ContractPreview 
              contract={generatedContract}
              onDownload={downloadContract}
              onBack={() => setStep('form')}
            />
          )}
        </div>
      </main>
    </div>
  );
}

// Componente de vista previa del contrato
function ContractPreview({ 
  contract, 
  onDownload, 
  onBack 
}: {
  contract: string;
  onDownload: () => void;
  onBack: () => void;
}) {
  return (
    <div className="space-y-8">
      {/* Step Indicator */}
      <div className="flex items-center justify-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center">
            <span className="text-slate-400 text-sm font-medium">1</span>
          </div>
          <span className="text-slate-400 font-medium">Tipo de Contrato</span>
        </div>
        <div className="w-12 h-0.5 bg-slate-600"></div>
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center">
            <span className="text-slate-400 text-sm font-medium">2</span>
          </div>
          <span className="text-slate-400 font-medium">Datos</span>
        </div>
        <div className="w-12 h-0.5 bg-primary-500"></div>
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">3</span>
          </div>
          <span className="text-white font-medium">Generar</span>
        </div>
      </div>

      {/* Contract Preview */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Vista Previa del Contrato</h3>
          <div className="flex space-x-2">
            <button
              onClick={onBack}
              className="btn-secondary"
            >
              Volver
            </button>
            <button
              onClick={onDownload}
              className="btn-primary inline-flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Descargar</span>
            </button>
          </div>
        </div>
        
        <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6 max-h-96 overflow-y-auto">
          <pre className="text-sm text-slate-300 whitespace-pre-wrap font-mono">
            {contract}
          </pre>
        </div>
      </div>
    </div>
  );
} 