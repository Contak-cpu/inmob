'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Receipt } from 'lucide-react';
import { RECEIPT_TYPES, COMPANY_CONFIG } from '@/lib/config';
import { ReceiptType, ClientData, ImmobiliaryData, ReceiptItem, FieldValidation, TouchedFields } from '@/types';
import { validateField } from '@/utils/validations';
import { numberToWords, formatDate } from '@/utils/formatters';
import ReceiptForm from '@/components/ReceiptForm';
import ReceiptPreview from '@/components/ReceiptPreview';

interface PageProps {
  params: {
    type: ReceiptType;
  };
}

export default function ReceiptFormPage({ params }: PageProps) {
  const { type } = params;
  const [step, setStep] = useState<'form' | 'preview'>('form');
  const [fieldErrors, setFieldErrors] = useState<FieldValidation>({});
  const [touchedFields, setTouchedFields] = useState<TouchedFields>({});
  const [generatedReceipt, setGeneratedReceipt] = useState('');
  const [receiptDate, setReceiptDate] = useState<string>('2024-01-01');

  // Estado inicial del formulario
  const [clientData, setClientData] = useState<ClientData>({
    name: '',
    dni: '',
    address: '',
    propertyAddress: ''
  });
  const [immobiliaryData] = useState<ImmobiliaryData>({
    name: COMPANY_CONFIG.companyName,
    address: COMPANY_CONFIG.companyAddress,
    phone: COMPANY_CONFIG.companyPhone,
    email: COMPANY_CONFIG.companyEmail,
    cuit: COMPANY_CONFIG.companyCuit
  });
  const [items, setItems] = useState<ReceiptItem[]>([
    { description: '', amount: '', generatedName: '' }
  ]);

  // Manejo de cambios en los campos del cliente
  const handleClientChange = (field: keyof ClientData, value: string) => {
    setClientData(prev => ({ ...prev, [field]: value }));
    setTouchedFields(prev => ({ ...prev, [field]: true }));
    const error = validateField(field, value);
    setFieldErrors(prev => ({ ...prev, [field]: error }));
  };

  // Manejo de cambios en los items
  const handleItemChange = (index: number, field: keyof ReceiptItem, value: string) => {
    setItems(prev => {
      const newItems = [...prev];
      if (newItems[index]) {
        newItems[index][field] = value;
      }
      return newItems;
    });
  };

  // Agregar un nuevo item
  const handleAddItem = () => {
    setItems(prev => [...prev, { description: '', amount: '', generatedName: '' }]);
  };

  // Eliminar un item
  const handleRemoveItem = (index: number) => {
    setItems(prev => prev.length > 1 ? prev.filter((_, i) => i !== index) : prev);
  };

  // Validar el formulario
  const isFormValid = () => {
    return !!(
      clientData.name.trim() &&
      clientData.dni.trim() &&
      clientData.address.trim() &&
      items.every(item => item.description.trim() && item.amount.trim() && !isNaN(Number(item.amount)))
    );
  };

  // Generar el recibo
  const generateReceipt = () => {
    if (!isFormValid()) return;
    const total = items.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
    const formattedDate = formatDate(receiptDate || new Date());
    const receipt = `
╔══════════════════════════════════════════════════════════════════════════════╗
║                                  RECIBO                                    ║
║                          N° ${new Date().getTime()}                        ║
╚══════════════════════════════════════════════════════════════════════════════╝

${immobiliaryData.name}
${immobiliaryData.address}
Tel: ${immobiliaryData.phone} | Email: ${immobiliaryData.email}
CUIT: ${immobiliaryData.cuit}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FECHA: ${formattedDate}

CLIENTE:
Nombre: ${clientData.name}
DNI: ${clientData.dni}
Domicilio: ${clientData.address}
${clientData.propertyAddress ? `Inmueble: ${clientData.propertyAddress}` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DETALLE DE PAGOS:

${items.map((item, index) => `
${index + 1}. ${item.description}
    Importe: $ ${parseFloat(item.amount || '0').toLocaleString('es-AR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}
`).join('')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TOTAL: $ ${total.toLocaleString('es-AR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
})}

SON: ${numberToWords(total)} PESOS

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Recibí de ${clientData.name} la suma de PESOS ${total.toLocaleString('es-AR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
})} (${numberToWords(total)} PESOS) en concepto del detalle mencionado anteriormente.

Santa Rosa, La Pampa, ${formattedDate}

_________________________________
Firma y Aclaración
${immobiliaryData.name}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Este recibo tiene validez legal conforme a las disposiciones vigentes.
Conserve este comprobante para sus registros contables.

═══════════════════════════════════════════════════════════════════════════════
    `;
    setGeneratedReceipt(receipt);
    setStep('preview');
  };



  if (!RECEIPT_TYPES[type]) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Tipo de recibo no válido</h1>
          <Link href="/receipts" className="btn-primary">
            Volver a recibos
          </Link>
        </div>
      </div>
    );
  }

  const receiptType = RECEIPT_TYPES[type];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="glass-effect border-b border-slate-700/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link href="/receipts" className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors">
                <ArrowLeft className="h-5 w-5 text-slate-400" />
              </Link>
              <Receipt className="h-8 w-8 text-green-400" />
              <div>
                <h1 className="text-xl font-bold text-white">{receiptType.name}</h1>
                <p className="text-sm text-slate-400">{receiptType.description}</p>
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
            <ReceiptForm
              clientData={clientData}
              immobiliaryData={immobiliaryData}
              items={items}
              fieldErrors={fieldErrors}
              touchedFields={touchedFields}
              onClientChange={handleClientChange}
              onItemChange={handleItemChange}
              onAddItem={handleAddItem}
              onRemoveItem={handleRemoveItem}
              onGenerate={generateReceipt}
              isFormValid={isFormValid()}
              receiptType={type}
              receiptDate={receiptDate || new Date().toISOString().split('T')[0]}
              onDateChange={setReceiptDate}
            />
          ) : (
            <ReceiptPreview
              receipt={generatedReceipt}
              onBack={() => setStep('form')}
              receiptType={type}
              clientName={clientData.name || ''}
            />
          )}
        </div>
      </main>
    </div>
  );
}

 