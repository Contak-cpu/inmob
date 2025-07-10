'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, FileText, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { CONTRACT_TYPES } from '@/lib/config';
import { validateContractData } from '@/utils/validations';
import ContractForm from '@/components/ContractForm';
import PictoNSignature from '@/components/PictoNSignature';

export default function ContractTypePage() {
  const params = useParams();
  const router = useRouter();
  const contractType = params.type;

  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validate contract type
  useEffect(() => {
    if (!CONTRACT_TYPES[contractType]) {
      router.push('/contracts');
    }
  }, [contractType, router]);

  const contract = CONTRACT_TYPES[contractType];

  if (!contract) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-16 w-16 text-error-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Tipo de contrato no válido</h1>
          <p className="text-neutral-400 mb-4">El tipo de contrato seleccionado no existe.</p>
          <button
            onClick={() => router.push('/contracts')}
            className="btn-primary"
          >
            Volver a contratos
          </button>
        </div>
      </div>
    );
  }

  const handleFormChange = (newData) => {
    setFormData(newData);
    
    // Validate form data
    const validationErrors = validateContractData(newData, contractType);
    setErrors(validationErrors);
    
    // Check if form is valid
    const hasErrors = Object.keys(validationErrors).length > 0;
    setIsValid(!hasErrors && Object.keys(newData).length > 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isValid) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Navigate to preview/generation page
      router.push(`/contracts/${contractType}/generate`);
    } catch (error) {
      // Error handling
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900">
      {/* Header */}
      <header className="glass-effect border-b border-neutral-700/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => router.push('/contracts')}
                className="p-2 hover:bg-neutral-700/50 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-neutral-400" />
              </button>
              <FileText className="h-8 w-8 text-primary-400" />
              <div>
                <h1 className="text-xl font-bold text-white">{contract.name}</h1>
                <p className="text-sm text-neutral-400">Completa los datos del contrato</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-neutral-400">Konrad Inversiones + Desarrollos Inmobiliarios</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Step Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-neutral-600 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-neutral-400" />
                </div>
                <span className="text-neutral-400 font-medium">Tipo de Contrato</span>
              </div>
              <div className="w-12 h-0.5 bg-neutral-600"></div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">2</span>
                </div>
                <span className="text-white font-medium">Datos</span>
              </div>
              <div className="w-12 h-0.5 bg-neutral-600"></div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-neutral-600 rounded-full flex items-center justify-center">
                  <span className="text-neutral-400 text-sm font-medium">3</span>
                </div>
                <span className="text-neutral-400 font-medium">Generar</span>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="card">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">
                Datos del {contract.name.toLowerCase()}
              </h2>
              <p className="text-neutral-400">
                Completa todos los campos requeridos para generar el contrato
              </p>
            </div>

            <ContractForm
              contractType={contractType}
              formData={formData}
              errors={errors}
              onChange={handleFormChange}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              isValid={isValid}
            />
          </div>

          {/* Info Section */}
          <div className="mt-8 p-6 glass-effect rounded-xl">
            <div className="flex items-start space-x-4">
              <AlertCircle className="h-6 w-6 text-primary-400 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Información Legal
                </h3>
                <div className="space-y-2 text-sm text-neutral-300">
                  <p>• Este contrato cumple con la legislación argentina vigente</p>
                  <p>• Los datos se procesan de forma segura y confidencial</p>
                  <p>• El contrato generado es válido para uso legal</p>
                  <p>• Se recomienda revisar con un abogado antes de firmar</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="glass-effect border-t border-neutral-700/50 mt-8">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
            <p className="text-xs sm:text-sm text-neutral-400">
              © 2013 Konrad Inversiones + Desarrollos Inmobiliarios. Todos los derechos reservados.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
              <p className="text-[10px] sm:text-xs text-neutral-500">
                Sistema v1.0.0
              </p>
              <PictoNSignature />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 