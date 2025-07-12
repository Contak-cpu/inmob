'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Download, Printer, Share2, FileText, CheckCircle, AlertCircle, Brain } from 'lucide-react';
import { CONTRACT_TYPES, ADJUSTMENT_TYPES } from '@/lib/config';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { generateContract, downloadContract } from '@/utils/contractGenerator';
import { saveContract } from '@/utils/database';
import { aiAnalyzer } from '@/utils/aiContractAnalyzer';
import { notifySuccess, notifyError } from '@/utils/notifications';
import PictoNSignature from '@/components/PictoNSignature';
import Breadcrumbs from '@/components/Breadcrumbs';

export default function ContractGeneratePage() {
  const params = useParams();
  const router = useRouter();
  const contractType = params.type;

  const [contractData, setContractData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    // Simular datos del contrato (en un caso real vendrían de la página anterior)
    setContractData({
      propertyAddress: 'Av. Corrientes 1234, CABA',
      propertyType: 'departamento',
      surface: '80',
      rooms: '3',
      ownerName: 'Juan Pérez',
      ownerDocument: '12345678',
      ownerPhone: '+54 11 1234-5678',
      ownerEmail: 'juan@email.com',
      tenantName: 'María González',
      tenantDocument: '87654321',
      tenantPhone: '+54 11 8765-4321',
      tenantEmail: 'maria@email.com',
      startDate: '2024-01-01',
      duration: '12',
      monthlyPrice: '150000',
      deposit: '1',
      adjustmentType: 'CVS_CER',
      expensesIncluded: 'todos',
      petsAllowed: 'consultar',
      guarantor1Name: 'Carlos López',
      guarantor1Document: '11223344',
      guarantor1Phone: '+54 11 1122-3344',
      guarantor1Email: 'carlos@email.com',
      guarantor2Name: 'Ana Martínez',
      guarantor2Document: '44332211',
      guarantor2Phone: '+54 11 4433-2211',
      guarantor2Email: 'ana@email.com',
      observations: 'Departamento en excelente estado, recién pintado.'
    });
  }, []);

  const contract = CONTRACT_TYPES[contractType];

  if (!contract) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-error-400 mx-auto mb-4" />
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

  const handleGenerate = async () => {
    setIsGenerating(true);
    setIsAnalyzing(true);
    
    try {
      // Simular generación del contrato
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generar contrato
      const contractText = generateContract(contractData, contractType);
      
      // Guardar contrato en el historial
      const contractToSave = {
        ...contractData,
        contractType,
        contractText,
        status: 'active',
        generatedAt: new Date().toISOString(),
      };
      
      // Guardar usando la función de la base de datos
      const savedContract = saveContract(contractToSave);
      
      // Analizar con IA
      const analysis = await aiAnalyzer.compareWithRealTemplate(contractText, contractType);
      setAiAnalysis(analysis);
      
      setIsGenerated(true);
      
      // Mostrar notificación de éxito
      notifySuccess('Contrato Generado', 'Contrato generado y guardado en el historial exitosamente');
    } catch (error) {
      console.error('Error al generar contrato:', error);
      notifyError('Error al Generar', 'Error al generar el contrato');
    } finally {
      setIsGenerating(false);
      setIsAnalyzing(false);
    }
  };

  const handleDownload = () => {
    try {
      const contractText = generateContract(contractData, contractType);
      const fileName = `Contrato_${contract.name.replace(/\s+/g, '_')}_${formatDate(new Date()).replace(/\//g, '-')}.pdf`;
      
      // Crear contenido HTML para PDF
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Contrato - ${contract.name}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
            .section { margin-bottom: 20px; }
            .signature-section { margin-top: 40px; border-top: 1px solid #ccc; padding-top: 20px; }
            .signature-line { border-bottom: 1px solid #000; display: inline-block; width: 200px; margin: 0 20px; }
            .company-info { text-align: center; margin-top: 40px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${contract.name.toUpperCase()}</h1>
            <p>Konrad Inversiones + Desarrollos Inmobiliarios</p>
          </div>
          <div class="content">
            ${contractText.replace(/\n/g, '<br>')}
          </div>
          <div class="signature-section">
            <p>En prueba de conformidad, se firma el presente contrato:</p>
            <div style="margin-top: 30px;">
              <span>LOCADOR: <span class="signature-line"></span></span>
              <span>LOCATARIO: <span class="signature-line"></span></span>
            </div>
          </div>
          <div class="company-info">
            <p>Konrad Inversiones + Desarrollos Inmobiliarios</p>
            <p>Mat. 12345</p>
          </div>
        </body>
        </html>
      `;
      
      // Crear blob con contenido HTML
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      // Mostrar notificación de éxito
              notifySuccess('Contrato Descargado', 'Contrato descargado exitosamente');
      } catch (error) {
        console.error('Error al descargar:', error);
        notifyError('Error al Descargar', 'Error al descargar el contrato');
      }
  };

  const handlePrint = () => {
    try {
      const contractText = generateContract(contractData, contractType);
      
      // Crear ventana de impresión con formato
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Imprimir Contrato - ${contract.name}</title>
          <style>
            @media print {
              body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
              .no-print { display: none; }
            }
            body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
            .content { margin-bottom: 30px; }
            .signature-section { margin-top: 40px; border-top: 1px solid #ccc; padding-top: 20px; }
            .signature-line { border-bottom: 1px solid #000; display: inline-block; width: 200px; margin: 0 20px; }
            .company-info { text-align: center; margin-top: 40px; font-size: 12px; color: #666; }
            .print-button { 
              position: fixed; top: 20px; right: 20px; 
              padding: 10px 20px; background: #007bff; color: white; 
              border: none; border-radius: 5px; cursor: pointer;
            }
          </style>
        </head>
        <body>
          <button class="print-button no-print" onclick="window.print()">Imprimir</button>
          <div class="header">
            <h1>${contract.name.toUpperCase()}</h1>
            <p>Konrad Inversiones + Desarrollos Inmobiliarios</p>
          </div>
          <div class="content">
            ${contractText.replace(/\n/g, '<br>')}
          </div>
          <div class="signature-section">
            <p>En prueba de conformidad, se firma el presente contrato:</p>
            <div style="margin-top: 30px;">
              <span>LOCADOR: <span class="signature-line"></span></span>
              <span>LOCATARIO: <span class="signature-line"></span></span>
            </div>
          </div>
          <div class="company-info">
            <p>Konrad Inversiones + Desarrollos Inmobiliarios</p>
            <p>Mat. 12345</p>
          </div>
        </body>
        </html>
      `);
      printWindow.document.close();
      
      // Esperar a que se cargue y luego imprimir
      printWindow.onload = () => {
        printWindow.print();
      };
            } catch (error) {
          console.error('Error al imprimir:', error);
          notifyError('Error al Imprimir', 'Error al imprimir el contrato');
        }
  };

  const handleShare = () => {
    try {
      const contractText = generateContract(contractData, contractType);
      const fileName = `Contrato_${contract.name.replace(/\s+/g, '_')}_${formatDate(new Date()).replace(/\//g, '-')}.txt`;
      
      // Crear opciones de compartir
      const shareOptions = [
        {
          name: 'Email',
          icon: '📧',
          action: () => {
            const subject = encodeURIComponent(`Contrato ${contract.name} - Konrad Inversiones`);
            const body = encodeURIComponent(`Adjunto el contrato ${contract.name} generado.\n\n${contractText}`);
            window.open(`mailto:?subject=${subject}&body=${body}`);
          }
        },
        {
          name: 'WhatsApp',
          icon: '📱',
          action: () => {
            const text = encodeURIComponent(`Contrato ${contract.name} generado por Konrad Inversiones:\n\n${contractText.substring(0, 500)}...`);
            window.open(`https://wa.me/?text=${text}`);
          }
        },
        {
          name: 'Copiar Texto',
          icon: '📋',
          action: () => {
            navigator.clipboard.writeText(contractText).then(() => {
              notifySuccess('Texto Copiado', 'Texto del contrato copiado al portapapeles');
            }).catch(() => {
              // Fallback para navegadores que no soportan clipboard API
              const textArea = document.createElement('textarea');
              textArea.value = contractText;
              document.body.appendChild(textArea);
              textArea.select();
              document.execCommand('copy');
              document.body.removeChild(textArea);
              notifySuccess('Texto Copiado', 'Texto del contrato copiado al portapapeles');
            });
          }
        },
        {
          name: 'Descargar',
          icon: '💾',
          action: () => {
            const blob = new Blob([contractText], { type: 'text/plain;charset=utf-8' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
          }
        }
      ];
      
      // Mostrar menú de opciones
      const option = prompt(
        'Selecciona una opción para compartir:\n' +
        shareOptions.map((opt, index) => `${index + 1}. ${opt.icon} ${opt.name}`).join('\n') +
        '\n\nIngresa el número de la opción:'
      );
      
      const selectedIndex = parseInt(option) - 1;
      if (selectedIndex >= 0 && selectedIndex < shareOptions.length) {
        shareOptions[selectedIndex].action();
      } else if (option !== null) {
        notifyError('Opción Inválida', 'Opción no válida');
      }
    } catch (error) {
      console.error('Error al compartir:', error);
      notifyError('Error al Compartir', 'Error al compartir el contrato');
    }
  };

  const handleTestContract = () => {
    // Generar datos de prueba según el tipo de contrato
    const testData = {
      propertyAddress: 'Av. Test 123, CABA',
      propertyType: contractType.includes('comercial') ? 'local' : 'casa',
      surface: '100',
      rooms: '4',
      ownerName: 'Juan Pérez Test',
      ownerDocument: '12345678',
      ownerPhone: '+54 11 1234-5678',
      ownerEmail: 'juan.test@email.com',
      tenantName: 'María González Test',
      tenantDocument: '87654321',
      tenantPhone: '+54 11 8765-4321',
      tenantEmail: 'maria.test@email.com',
      startDate: '2024-01-01',
      duration: '12',
      monthlyPrice: '150000',
      deposit: '1',
      adjustmentType: contract?.adjustmentType || 'IPC',
      expensesIncluded: 'todos',
      petsAllowed: 'consultar',
      guarantor1Name: 'Carlos López Test',
      guarantor1Document: '11223344',
      guarantor1Phone: '+54 11 1122-3344',
      guarantor1Email: 'carlos.test@email.com',
      guarantor2Name: 'Ana Martínez Test',
      guarantor2Document: '44332211',
      guarantor2Phone: '+54 11 4433-2211',
      guarantor2Email: 'ana.test@email.com',
      observations: 'Contrato de prueba generado automáticamente.'
    };

    setContractData(testData);
    setIsGenerated(false);
  };

  const getAdjustmentTypeName = (type) => {
    return ADJUSTMENT_TYPES[type]?.name || type;
  };

  const calculateTotalDeposit = () => {
    const monthlyPrice = parseFloat(contractData?.monthlyPrice) || 0;
    const depositMonths = parseFloat(contractData?.deposit) || 0;
    return monthlyPrice * depositMonths;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900">
      {/* Header */}
      <header className="glass-effect border-b border-neutral-700/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => router.push(`/contracts/${contractType}`)}
                className="p-2 hover:bg-neutral-700/50 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-neutral-400" />
              </button>
              <FileText className="h-8 w-8 text-primary-400" />
              <div>
                <h1 className="text-xl font-bold text-white">Generar {contract.name}</h1>
                <p className="text-sm text-neutral-400">Revisa y genera el contrato</p>
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
          {/* Breadcrumbs */}
          <Breadcrumbs 
            items={[
              { label: 'Contratos', href: '/contracts' },
              { label: contract?.name || 'Contrato', href: `/contracts/${contractType}` },
              { label: 'Generar' }
            ]} 
          />
          
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
                <div className="w-8 h-8 bg-neutral-600 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-neutral-400" />
                </div>
                <span className="text-neutral-400 font-medium">Datos</span>
              </div>
              <div className="w-12 h-0.5 bg-neutral-600"></div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">3</span>
                </div>
                <span className="text-white font-medium">Generar</span>
              </div>
            </div>
          </div>

          {!isGenerated ? (
            /* Contract Preview */
            <div className="card">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">
                  Vista Previa del Contrato
                </h2>
                <p className="text-neutral-400">
                  Revisa los datos antes de generar el contrato
                </p>
              </div>

              {contractData && (
                <div className="space-y-6">
                  {/* Property Information */}
                  <div className="p-6 bg-neutral-800/50 rounded-xl">
                    <h3 className="text-lg font-semibold text-white mb-4 border-b border-neutral-700 pb-2">
                      Información de la Propiedad
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-neutral-400">Dirección:</p>
                        <p className="font-medium text-white">{contractData.propertyAddress}</p>
                      </div>
                      <div>
                        <p className="text-sm text-neutral-400">Tipo:</p>
                        <p className="font-medium text-white capitalize">{contractData.propertyType}</p>
                      </div>
                      {contractData.surface && (
                        <div>
                          <p className="text-sm text-neutral-400">Superficie:</p>
                          <p className="font-medium text-white">{contractData.surface} m²</p>
                        </div>
                      )}
                      {contractData.rooms && (
                        <div>
                          <p className="text-sm text-neutral-400">Ambientes:</p>
                          <p className="font-medium text-white">{contractData.rooms}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Owner Information */}
                  <div className="p-6 bg-neutral-800/50 rounded-xl">
                    <h3 className="text-lg font-semibold text-white mb-4 border-b border-neutral-700 pb-2">
                      Información del Propietario
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-neutral-400">Nombre:</p>
                        <p className="font-medium text-white">{contractData.ownerName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-neutral-400">DNI:</p>
                        <p className="font-medium text-white">{contractData.ownerDocument}</p>
                      </div>
                      {contractData.ownerPhone && (
                        <div>
                          <p className="text-sm text-neutral-400">Teléfono:</p>
                          <p className="font-medium text-white">{contractData.ownerPhone}</p>
                        </div>
                      )}
                      {contractData.ownerEmail && (
                        <div>
                          <p className="text-sm text-neutral-400">Email:</p>
                          <p className="font-medium text-white">{contractData.ownerEmail}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Tenant Information */}
                  <div className="p-6 bg-neutral-800/50 rounded-xl">
                    <h3 className="text-lg font-semibold text-white mb-4 border-b border-neutral-700 pb-2">
                      Información del Inquilino
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-neutral-400">Nombre:</p>
                        <p className="font-medium text-white">{contractData.tenantName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-neutral-400">DNI:</p>
                        <p className="font-medium text-white">{contractData.tenantDocument}</p>
                      </div>
                      {contractData.tenantPhone && (
                        <div>
                          <p className="text-sm text-neutral-400">Teléfono:</p>
                          <p className="font-medium text-white">{contractData.tenantPhone}</p>
                        </div>
                      )}
                      {contractData.tenantEmail && (
                        <div>
                          <p className="text-sm text-neutral-400">Email:</p>
                          <p className="font-medium text-white">{contractData.tenantEmail}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Contract Terms */}
                  <div className="p-6 bg-neutral-800/50 rounded-xl">
                    <h3 className="text-lg font-semibold text-white mb-4 border-b border-neutral-700 pb-2">
                      Términos del Contrato
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-neutral-400">Fecha de Inicio:</p>
                        <p className="font-medium text-white">{formatDate(contractData.startDate)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-neutral-400">Duración:</p>
                        <p className="font-medium text-white">{contractData.duration} meses</p>
                      </div>
                      <div>
                        <p className="text-sm text-neutral-400">Precio Mensual:</p>
                        <p className="font-medium text-white">{formatCurrency(contractData.monthlyPrice)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-neutral-400">Depósito:</p>
                        <p className="font-medium text-white">{contractData.deposit} mes(es) - {formatCurrency(calculateTotalDeposit())}</p>
                      </div>
                      <div>
                        <p className="text-sm text-neutral-400">Tipo de Ajuste:</p>
                        <p className="font-medium text-white">{getAdjustmentTypeName(contractData.adjustmentType)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Guarantors Information */}
                  {(contractData.guarantor1Name || contractData.guarantor2Name) && (
                    <div className="p-6 bg-neutral-800/50 rounded-xl">
                      <h3 className="text-lg font-semibold text-white mb-4 border-b border-neutral-700 pb-2">
                        Información de Garantes
                      </h3>
                      <div className="space-y-4">
                        {contractData.guarantor1Name && (
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-neutral-400">Garante 1:</p>
                              <p className="font-medium text-white">{contractData.guarantor1Name} - DNI: {contractData.guarantor1Document}</p>
                            </div>
                            {contractData.guarantor1Phone && (
                              <div>
                                <p className="text-sm text-neutral-400">Teléfono:</p>
                                <p className="font-medium text-white">{contractData.guarantor1Phone}</p>
                              </div>
                            )}
                          </div>
                        )}
                        {contractData.guarantor2Name && (
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-neutral-400">Garante 2:</p>
                              <p className="font-medium text-white">{contractData.guarantor2Name} - DNI: {contractData.guarantor2Document}</p>
                            </div>
                            {contractData.guarantor2Phone && (
                              <div>
                                <p className="text-sm text-neutral-400">Teléfono:</p>
                                <p className="font-medium text-white">{contractData.guarantor2Phone}</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Additional Information */}
                  <div className="p-6 bg-neutral-800/50 rounded-xl">
                    <h3 className="text-lg font-semibold text-white mb-4 border-b border-neutral-700 pb-2">
                      Información Adicional
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {contractData.expensesIncluded && (
                        <div>
                          <p className="text-sm text-neutral-400">Gastos Incluidos:</p>
                          <p className="font-medium text-white capitalize">{contractData.expensesIncluded}</p>
                        </div>
                      )}
                      {contractData.petsAllowed && (
                        <div>
                          <p className="text-sm text-neutral-400">Mascotas:</p>
                          <p className="font-medium text-white capitalize">{contractData.petsAllowed}</p>
                        </div>
                      )}
                    </div>
                    {contractData.observations && (
                      <div className="mt-4">
                        <p className="text-sm text-neutral-400">Observaciones:</p>
                        <p className="font-medium text-white">{contractData.observations}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Generate Buttons */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-neutral-700">
                <button
                  onClick={handleTestContract}
                  className="btn-secondary"
                >
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4" />
                    <span>Test Contrato</span>
                  </div>
                </button>
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className={`btn-primary ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isGenerating ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>{isAnalyzing ? 'Analizando con IA...' : 'Generando...'}</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Brain className="h-4 w-4" />
                      <span>Generar y Analizar</span>
                    </div>
                  )}
                </button>
              </div>
            </div>
          ) : (
            /* Generated Contract */
            <div className="card">
              <div className="text-center mb-8">
                <CheckCircle className="h-16 w-16 text-success-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">
                  ¡Contrato Generado Exitosamente!
                </h2>
                <p className="text-neutral-400">
                  El contrato ha sido generado y está listo para descargar
                </p>
              </div>

              {/* AI Analysis Section */}
              {aiAnalysis && (
                <div className="mb-8 p-6 bg-neutral-800 rounded-lg border border-neutral-700">
                  <div className="flex items-center space-x-2 mb-4">
                    <Brain className="h-5 w-5 text-blue-400" />
                    <h3 className="text-lg font-semibold text-white">Análisis de IA</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="text-center p-3 bg-neutral-700 rounded-lg">
                      <div className="text-2xl font-bold text-white mb-1">
                        {Math.max(0, Math.min(100, Math.round(aiAnalysis.confidence * 100)))}%
                      </div>
                      <div className="text-sm text-neutral-400">Confianza</div>
                      <div className="w-full bg-neutral-600 rounded-full h-2 mt-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
                          style={{ 
                            width: `${Math.max(0, Math.min(100, Math.round(aiAnalysis.confidence * 100)))}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                    <div className="text-center p-3 bg-neutral-700 rounded-lg">
                      <div className="text-2xl font-bold text-white mb-1">
                        {aiAnalysis.analysis.score}/{aiAnalysis.analysis.maxScore}
                      </div>
                      <div className="text-sm text-neutral-400">Puntuación</div>
                    </div>
                    <div className="text-center p-3 bg-neutral-700 rounded-lg">
                      <div className={`text-2xl font-bold mb-1 ${
                        aiAnalysis.status === 'APPROVED' ? 'text-green-400' : 'text-yellow-400'
                      }`}>
                        {aiAnalysis.status === 'APPROVED' ? '✓' : '⚠'}
                      </div>
                      <div className="text-sm text-neutral-400">Estado</div>
                    </div>
                  </div>

                  {aiAnalysis.analysis.issues.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-red-400 mb-2">Problemas Detectados:</h4>
                      <ul className="space-y-1">
                        {aiAnalysis.analysis.issues.map((issue, index) => (
                          <li key={`issue-${index}`} className="text-sm text-neutral-300 flex items-start space-x-2">
                            <span className="text-red-400 mt-1">•</span>
                            <span>{issue}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {aiAnalysis.analysis.suggestions.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-blue-400 mb-2">Sugerencias:</h4>
                      <ul className="space-y-1">
                        {aiAnalysis.analysis.suggestions.map((suggestion, index) => (
                          <li key={`suggestion-${index}`} className="text-sm text-neutral-300 flex items-start space-x-2">
                            <span className="text-blue-400 mt-1">•</span>
                            <span>{suggestion}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {aiAnalysis.recommendations.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-yellow-400 mb-2">Recomendaciones:</h4>
                      <ul className="space-y-1">
                        {aiAnalysis.recommendations.map((recommendation, index) => (
                          <li key={`recommendation-${index}`} className="text-sm text-neutral-300 flex items-start space-x-2">
                            <span className="text-yellow-400 mt-1">•</span>
                            <span>{recommendation}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 justify-center mb-8">
                <button
                  onClick={handleDownload}
                  className="btn-primary inline-flex items-center space-x-2"
                >
                  <Download className="h-4 w-4" />
                  <span>Descargar PDF</span>
                </button>
                <button
                  onClick={handlePrint}
                  className="btn-primary inline-flex items-center space-x-2"
                >
                  <Printer className="h-4 w-4" />
                  <span>Imprimir</span>
                </button>
                <button
                  onClick={handleShare}
                  className="btn-primary inline-flex items-center space-x-2"
                >
                  <Share2 className="h-4 w-4" />
                  <span>Compartir</span>
                </button>
              </div>

              {/* Additional Actions */}
              <div className="text-center">
                <button
                  onClick={() => router.push('/contracts')}
                  className="btn-secondary"
                >
                  Generar Otro Contrato
                </button>
              </div>
            </div>
          )}

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