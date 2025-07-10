'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Receipt, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { RECEIPT_TYPES } from '@/lib/config';
import { validateReceiptData } from '@/utils/validations';
import ReceiptForm from '@/components/ReceiptForm';
import PictoNSignature from '@/components/PictoNSignature';

export default function ReceiptTypePage() {
  const params = useParams();
  const router = useRouter();
  const receiptType = params.type;

  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validate receipt type
  useEffect(() => {
    if (!RECEIPT_TYPES[receiptType]) {
      router.push('/receipts');
    }
  }, [receiptType, router]);

  const receipt = RECEIPT_TYPES[receiptType];

  if (!receipt) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-16 w-16 text-error-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Tipo de recibo no válido</h1>
          <p className="text-neutral-400 mb-4">El tipo de recibo seleccionado no existe.</p>
          <button
            onClick={() => router.push('/receipts')}
            className="btn-secondary"
          >
            Volver a recibos
          </button>
        </div>
      </div>
    );
  }

  const handleFormChange = (newData) => {
    setFormData(newData);
    
    // Validate form data
    const validationErrors = validateReceiptData(newData, receiptType);
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
      router.push(`/receipts/${receiptType}/generate`);
    } catch (error) {
      console.error('Error submitting form:', error);
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
                onClick={() => router.push('/receipts')}
                className="p-2 hover:bg-neutral-700/50 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-neutral-400" />
              </button>
              <Receipt className="h-8 w-8 text-secondary-400" />
              <div>
                <h1 className="text-xl font-bold text-white">{receipt.name}</h1>
                <p className="text-sm text-neutral-400">Completa los datos del recibo</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-neutral-400">KONRAD Inmobiliaria</p>
              <p className="text-xs text-neutral-500">Mat. 573</p>
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
                <span className="text-neutral-400 font-medium">Tipo de Recibo</span>
              </div>
              <div className="w-12 h-0.5 bg-neutral-600"></div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-secondary-500 rounded-full flex items-center justify-center">
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
                Datos del {receipt.name.toLowerCase()}
              </h2>
              <p className="text-neutral-400">
                Completa todos los campos requeridos para generar el recibo
              </p>
            </div>

            <ReceiptForm
              receiptType={receiptType}
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
              <AlertCircle className="h-6 w-6 text-secondary-400 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Información del Recibo
                </h3>
                <div className="space-y-2 text-sm text-neutral-300">
                  <p>• Los cálculos se realizan automáticamente</p>
                  <p>• El recibo incluye todos los detalles requeridos</p>
                  <p>• Puedes descargar el recibo en formato PDF</p>
                  <p>• El recibo es válido para uso contable</p>
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
              © 2024 KONRAD Inmobiliaria. Todos los derechos reservados.
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