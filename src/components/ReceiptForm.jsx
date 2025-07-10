'use client';

import { useState } from 'react';
import { Receipt, Download, Printer, Share2 } from 'lucide-react';

const ReceiptForm = ({ receiptType }) => {
  const [receiptData, setReceiptData] = useState({});
  const [isGenerated, setIsGenerated] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Configuración específica por tipo de recibo
  const receiptConfigs = {
    alquiler: {
      title: 'Recibo de Alquiler',
      fields: [
        { name: 'tenantName', label: 'Nombre del Inquilino', type: 'text', required: true },
        { name: 'tenantDocument', label: 'DNI del Inquilino', type: 'text', required: true },
        { name: 'propertyAddress', label: 'Dirección del Inmueble', type: 'text', required: true },
        { name: 'month', label: 'Mes', type: 'select', options: [
          'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
          'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ], required: true },
        { name: 'year', label: 'Año', type: 'number', required: true },
        { name: 'amount', label: 'Monto del Alquiler', type: 'number', required: true },
        { name: 'expenses', label: 'Gastos Adicionales', type: 'number', required: false },
        { name: 'totalAmount', label: 'Monto Total', type: 'number', required: true },
        { name: 'paymentMethod', label: 'Forma de Pago', type: 'select', options: [
          'Efectivo', 'Transferencia', 'Cheque', 'Débito Automático'
        ], required: true },
        { name: 'paymentDate', label: 'Fecha de Pago', type: 'date', required: true }
      ]
    },
    servicios: {
      title: 'Recibo de Servicios',
      fields: [
        { name: 'clientName', label: 'Nombre del Cliente', type: 'text', required: true },
        { name: 'clientDocument', label: 'DNI del Cliente', type: 'text', required: true },
        { name: 'serviceType', label: 'Tipo de Servicio', type: 'select', options: [
          'Limpieza', 'Mantenimiento', 'Seguridad', 'Jardinería', 'Otros'
        ], required: true },
        { name: 'propertyAddress', label: 'Dirección del Inmueble', type: 'text', required: true },
        { name: 'serviceDate', label: 'Fecha del Servicio', type: 'date', required: true },
        { name: 'serviceDescription', label: 'Descripción del Servicio', type: 'textarea', required: true },
        { name: 'serviceHours', label: 'Horas de Servicio', type: 'number', required: false },
        { name: 'hourlyRate', label: 'Tarifa por Hora', type: 'number', required: false },
        { name: 'totalAmount', label: 'Monto Total', type: 'number', required: true },
        { name: 'paymentStatus', label: 'Estado de Pago', type: 'select', options: [
          'Pagado', 'Pendiente', 'Parcial'
        ], required: true }
      ]
    },
    reparaciones: {
      title: 'Recibo de Reparaciones',
      fields: [
        { name: 'clientName', label: 'Nombre del Cliente', type: 'text', required: true },
        { name: 'clientDocument', label: 'DNI del Cliente', type: 'text', required: true },
        { name: 'propertyAddress', label: 'Dirección del Inmueble', type: 'text', required: true },
        { name: 'repairType', label: 'Tipo de Reparación', type: 'select', options: [
          'Plomería', 'Electricidad', 'Albañilería', 'Carpintería', 'Pintura', 'Otros'
        ], required: true },
        { name: 'repairDate', label: 'Fecha de Reparación', type: 'date', required: true },
        { name: 'repairDescription', label: 'Descripción de la Reparación', type: 'textarea', required: true },
        { name: 'materialsUsed', label: 'Materiales Utilizados', type: 'textarea', required: false },
        { name: 'laborHours', label: 'Horas de Trabajo', type: 'number', required: false },
        { name: 'materialsCost', label: 'Costo de Materiales', type: 'number', required: false },
        { name: 'laborCost', label: 'Costo de Mano de Obra', type: 'number', required: false },
        { name: 'totalAmount', label: 'Monto Total', type: 'number', required: true },
        { name: 'warranty', label: 'Garantía (días)', type: 'number', required: false }
      ]
    },
    comisiones: {
      title: 'Recibo de Comisiones',
      fields: [
        { name: 'agentName', label: 'Nombre del Agente', type: 'text', required: true },
        { name: 'agentDocument', label: 'DNI del Agente', type: 'text', required: true },
        { name: 'transactionType', label: 'Tipo de Transacción', type: 'select', options: [
          'Venta', 'Alquiler', 'Administración', 'Otros'
        ], required: true },
        { name: 'propertyAddress', label: 'Dirección del Inmueble', type: 'text', required: true },
        { name: 'transactionDate', label: 'Fecha de Transacción', type: 'date', required: true },
        { name: 'transactionValue', label: 'Valor de la Transacción', type: 'number', required: true },
        { name: 'commissionPercentage', label: 'Porcentaje de Comisión', type: 'number', required: true },
        { name: 'commissionAmount', label: 'Monto de Comisión', type: 'number', required: true },
        { name: 'bonus', label: 'Bonificación Adicional', type: 'number', required: false },
        { name: 'totalAmount', label: 'Monto Total', type: 'number', required: true },
        { name: 'paymentMethod', label: 'Forma de Pago', type: 'select', options: [
          'Efectivo', 'Transferencia', 'Cheque'
        ], required: true }
      ]
    }
  };

  const config = receiptConfigs[receiptType] || receiptConfigs.alquiler;

  const handleInputChange = (name, value) => {
    setReceiptData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    // Simular generación
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsGenerating(false);
    setIsGenerated(true);
  };

  const handleTestReceipt = () => {
    // Generar datos de prueba según el tipo de recibo
    const testData = {};
    
    config.fields.forEach(field => {
      switch (field.name) {
        case 'tenantName':
        case 'clientName':
        case 'agentName':
          testData[field.name] = 'Juan Pérez Test';
          break;
        case 'tenantDocument':
        case 'clientDocument':
        case 'agentDocument':
          testData[field.name] = '12345678';
          break;
        case 'propertyAddress':
          testData[field.name] = 'Av. Test 123, CABA';
          break;
        case 'month':
          testData[field.name] = 'Enero';
          break;
        case 'year':
          testData[field.name] = '2024';
          break;
        case 'amount':
        case 'totalAmount':
        case 'commissionAmount':
          testData[field.name] = '150000';
          break;
        case 'expenses':
          testData[field.name] = '15000';
          break;
        case 'paymentMethod':
          testData[field.name] = 'Transferencia';
          break;
        case 'paymentDate':
        case 'serviceDate':
        case 'repairDate':
        case 'transactionDate':
          testData[field.name] = '2024-01-15';
          break;
        case 'serviceType':
          testData[field.name] = 'Limpieza';
          break;
        case 'repairType':
          testData[field.name] = 'Plomería';
          break;
        case 'transactionType':
          testData[field.name] = 'Venta';
          break;
        case 'serviceDescription':
        case 'repairDescription':
          testData[field.name] = 'Servicio de prueba generado automáticamente';
          break;
        case 'materialsUsed':
          testData[field.name] = 'Materiales de prueba';
          break;
        case 'serviceHours':
        case 'laborHours':
          testData[field.name] = '8';
          break;
        case 'hourlyRate':
          testData[field.name] = '5000';
          break;
        case 'materialsCost':
          testData[field.name] = '25000';
          break;
        case 'laborCost':
          testData[field.name] = '40000';
          break;
        case 'commissionPercentage':
          testData[field.name] = '3';
          break;
        case 'bonus':
          testData[field.name] = '10000';
          break;
        case 'warranty':
          testData[field.name] = '30';
          break;
        case 'paymentStatus':
          testData[field.name] = 'Pagado';
          break;
        default:
          testData[field.name] = 'Valor de prueba';
      }
    });

    setReceiptData(testData);
    setIsGenerated(false);
  };

  const handleDownload = () => {
    // Simular descarga
    // Download functionality
  };

  const handlePrint = () => {
    // Simular impresión
    // Print functionality
  };

  const handleShare = () => {
    // Simular compartir
    // Share functionality
  };

  const renderField = (field) => {
    const value = receiptData[field.name] || '';

    switch (field.type) {
      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            className="w-full px-3 py-2 bg-neutral-800 border border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required={field.required}
          >
            <option value="">Seleccionar...</option>
            {field.options.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );
      
      case 'textarea':
        return (
          <textarea
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            className="w-full px-3 py-2 bg-neutral-800 border border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
            required={field.required}
          />
        );
      
      default:
        return (
          <input
            type={field.type}
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            className="w-full px-3 py-2 bg-neutral-800 border border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required={field.required}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">{config.title}</h1>
            <p className="text-neutral-400">Complete los datos para generar el recibo</p>
          </div>

          {!isGenerated ? (
            <div className="bg-neutral-800 rounded-lg p-6 shadow-lg">
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {config.fields.map((field) => (
                    <div key={field.name} className="space-y-2">
                      <label className="block text-sm font-medium text-neutral-300">
                        {field.label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                      </label>
                      {renderField(field)}
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-4 pt-6 border-t border-neutral-700">
                  <button
                    type="button"
                    onClick={handleTestReceipt}
                    className="btn-secondary"
                  >
                    <div className="flex items-center space-x-2">
                      <Receipt className="h-4 w-4" />
                      <span>Test Recibo</span>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className={`btn-primary ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isGenerating ? (
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
            </div>
          ) : (
            <div className="bg-neutral-800 rounded-lg p-6 shadow-lg">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <Receipt className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Recibo Generado</h2>
                <p className="text-neutral-400">El recibo ha sido generado exitosamente</p>
              </div>

              {/* Preview */}
              <div className="bg-white text-black p-6 rounded-lg mb-6">
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold">KONRAD INVERSIONES + DESARROLLOS INMOBILIARIOS</h3>
                  <p className="text-sm text-gray-600">Recibo de {config.title}</p>
                </div>
                
                <div className="space-y-2 text-sm">
                  {config.fields.map((field) => (
                    <div key={field.name} className="flex justify-between">
                      <span className="font-medium">{field.label}:</span>
                      <span>{receiptData[field.name] || 'No especificado'}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center space-x-4">
                <button
                  onClick={handleDownload}
                  className="btn-secondary"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Descargar
                </button>
                <button
                  onClick={handlePrint}
                  className="btn-secondary"
                >
                  <Printer className="h-4 w-4 mr-2" />
                  Imprimir
                </button>
                <button
                  onClick={handleShare}
                  className="btn-secondary"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Compartir
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReceiptForm; 