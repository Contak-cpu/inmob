'use client';

import React from 'react';
import { Download, Printer, Share2, ArrowLeft } from 'lucide-react';
import { formatCurrency, formatDate } from '@/utils/formatters';
import PictoNSignature from '@/components/PictoNSignature';

export default function ReceiptPreview({ receiptData, onBack, onDownload, onPrint, onShare }) {
  const calculateTotal = () => {
    const baseRent = parseFloat(receiptData.baseRent) || 0;
    const servicesExpenses = parseFloat(receiptData.servicesExpenses) || 0;
    const adminExpenses = parseFloat(receiptData.adminExpenses) || 0;
    const otherExpenses = parseFloat(receiptData.otherExpenses) || 0;
    
    return baseRent + servicesExpenses + adminExpenses + otherExpenses;
  };

  const total = calculateTotal();

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900">
      {/* Header */}
      <header className="glass-effect border-b border-neutral-700/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={onBack}
                className="p-2 hover:bg-neutral-700/50 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-neutral-400" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-white">Vista Previa del Recibo</h1>
                <p className="text-sm text-neutral-400">Revisa los datos antes de generar</p>
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
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mb-8">
            <button
              onClick={onDownload}
              className="btn-secondary inline-flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Descargar PDF</span>
            </button>
            <button
              onClick={onPrint}
              className="btn-secondary inline-flex items-center space-x-2"
            >
              <Printer className="h-4 w-4" />
              <span>Imprimir</span>
            </button>
            <button
              onClick={onShare}
              className="btn-secondary inline-flex items-center space-x-2"
            >
              <Share2 className="h-4 w-4" />
              <span>Compartir</span>
            </button>
          </div>

          {/* Receipt Preview */}
          <div className="card">
            <div className="bg-white text-black p-8 rounded-lg shadow-lg">
              {/* Header */}
              <div className="text-center mb-8 border-b-2 border-gray-300 pb-4">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">KONRAD Inmobiliaria</h1>
                <p className="text-gray-600">Mat. 573</p>
                <p className="text-gray-600">Sistema de Gestión Inmobiliaria</p>
              </div>

              {/* Receipt Title */}
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">RECIBO DE ALQUILER</h2>
                <p className="text-gray-600">Período: {receiptData.period}</p>
              </div>

              {/* Property Information */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-300 pb-2">
                  Información de la Propiedad
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Dirección:</p>
                    <p className="font-medium">{receiptData.propertyAddress}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Tipo:</p>
                    <p className="font-medium capitalize">{receiptData.propertyType}</p>
                  </div>
                </div>
              </div>

              {/* Tenant Information */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-300 pb-2">
                  Información del Inquilino
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Nombre:</p>
                    <p className="font-medium">{receiptData.tenantName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">DNI/CUIL:</p>
                    <p className="font-medium">{receiptData.tenantDocument}</p>
                  </div>
                </div>
              </div>

              {/* Receipt Details */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-300 pb-2">
                  Detalles del Recibo
                </h3>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Fecha de Emisión:</p>
                    <p className="font-medium">{formatDate(receiptData.issueDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Período:</p>
                    <p className="font-medium">{receiptData.period}</p>
                  </div>
                </div>
              </div>

              {/* Amount Breakdown */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-300 pb-2">
                  Desglose de Montos
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Alquiler Base:</span>
                    <span className="font-medium">{formatCurrency(receiptData.baseRent)}</span>
                  </div>
                  {receiptData.servicesExpenses && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Gastos de Servicios:</span>
                      <span className="font-medium">{formatCurrency(receiptData.servicesExpenses)}</span>
                    </div>
                  )}
                  {receiptData.adminExpenses && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Gastos de Administración:</span>
                      <span className="font-medium">{formatCurrency(receiptData.adminExpenses)}</span>
                    </div>
                  )}
                  {receiptData.otherExpenses && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Otros Gastos:</span>
                      <span className="font-medium">{formatCurrency(receiptData.otherExpenses)}</span>
                    </div>
                  )}
                  <div className="border-t border-gray-300 pt-2 mt-4">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold text-gray-800">TOTAL:</span>
                      <span className="text-lg font-bold text-gray-800">{formatCurrency(total)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              {(receiptData.paymentMethod || receiptData.paymentStatus) && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-300 pb-2">
                    Información de Pago
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {receiptData.paymentMethod && (
                      <div>
                        <p className="text-sm text-gray-600">Forma de Pago:</p>
                        <p className="font-medium capitalize">{receiptData.paymentMethod}</p>
                      </div>
                    )}
                    {receiptData.paymentStatus && (
                      <div>
                        <p className="text-sm text-gray-600">Estado:</p>
                        <p className="font-medium capitalize">{receiptData.paymentStatus}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Observations */}
              {receiptData.observations && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-300 pb-2">
                    Observaciones
                  </h3>
                  <p className="text-gray-700">{receiptData.observations}</p>
                </div>
              )}

              {/* Footer */}
              <div className="text-center pt-6 border-t-2 border-gray-300">
                <p className="text-sm text-gray-600 mb-2">
                  Este recibo es válido para uso contable y legal
                </p>
                <div className="flex justify-center items-center space-x-4">
                  <div className="text-center">
                    <div className="w-24 h-0.5 bg-gray-300 mx-auto mb-2"></div>
                    <p className="text-xs text-gray-500">Firma del Emisor</p>
                  </div>
                  <div className="text-center">
                    <div className="w-24 h-0.5 bg-gray-300 mx-auto mb-2"></div>
                    <p className="text-xs text-gray-500">Firma del Receptor</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Actions */}
          <div className="mt-8 text-center">
            <p className="text-neutral-400 mb-4">
              El recibo ha sido generado exitosamente. Puedes descargarlo, imprimirlo o compartirlo.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={onBack}
                className="btn-secondary"
              >
                Generar Otro Recibo
              </button>
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