'use client';

import React, { useState, useRef } from 'react';
import { Download, Printer, Mail, FileText, X, CheckCircle } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface ReceiptPreviewProps {
  receipt: string;
  onBack: () => void;
  receiptType: string;
  clientName: string;
}

export default function ReceiptPreview({
  receipt,
  onBack,
  receiptType,
  clientName
}: ReceiptPreviewProps) {
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailData, setEmailData] = useState({
    email: '',
    subject: `Recibo ${receiptType} - ${clientName}`,
    message: `Adjunto el recibo ${receiptType} correspondiente a ${clientName}.`
  });
  const [isSending, setIsSending] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const receiptRef = useRef<HTMLDivElement>(null);

  // Descargar como TXT
  const downloadAsTxt = () => {
    const element = document.createElement('a');
    const file = new Blob([receipt], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `recibo-${receiptType}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Generar y descargar PDF
  const downloadAsPDF = async () => {
    if (!receiptRef.current) return;
    
    setIsGeneratingPDF(true);
    try {
      const canvas = await html2canvas(receiptRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`recibo-${receiptType}-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Error generando PDF:', error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // Imprimir recibo
  const printReceipt = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Recibo ${receiptType}</title>
            <style>
              body { font-family: 'Courier New', monospace; margin: 20px; }
              pre { white-space: pre-wrap; font-size: 12px; }
              @media print {
                body { margin: 0; }
                .no-print { display: none; }
              }
            </style>
          </head>
          <body>
            <div class="no-print">
              <button onclick="window.print()">Imprimir</button>
              <button onclick="window.close()">Cerrar</button>
            </div>
            <pre>${receipt}</pre>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  // Enviar por email
  const sendEmail = async () => {
    if (!emailData.email) return;
    
    setIsSending(true);
    try {
      // Simular envío de email (en producción usarías un servicio real)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Aquí iría la lógica real de envío de email
      // console.log('Enviando email a:', emailData.email);
      
      setShowEmailModal(false);
      setEmailData({ email: '', subject: '', message: '' });
      
      // Mostrar mensaje de éxito
      // alert('Email enviado correctamente');
    } catch (error) {
      // console.error('Error enviando email:', error);
      // alert('Error al enviar el email');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Step Indicator */}
      <div className="flex items-center justify-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center">
            <span className="text-slate-400 text-sm font-medium">1</span>
          </div>
          <span className="text-slate-400 font-medium">Tipo de Recibo</span>
        </div>
        <div className="w-12 h-0.5 bg-slate-600"></div>
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center">
            <span className="text-slate-400 text-sm font-medium">2</span>
          </div>
          <span className="text-slate-400 font-medium">Datos</span>
        </div>
        <div className="w-12 h-0.5 bg-green-500"></div>
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">3</span>
          </div>
          <span className="text-white font-medium">Generar</span>
        </div>
      </div>

      {/* Receipt Preview */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Vista Previa del Recibo</h3>
          <button
            onClick={onBack}
            className="btn-secondary"
          >
            Volver
          </button>
        </div>
        
        {/* Opciones de descarga */}
        <div className="mb-6 p-4 bg-slate-700/30 rounded-xl">
          <h4 className="text-white font-medium mb-4">Opciones de Descarga y Envío</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button
              onClick={downloadAsTxt}
              className="btn-secondary flex items-center justify-center space-x-2"
            >
              <FileText className="h-4 w-4" />
              <span>TXT</span>
            </button>
            <button
              onClick={downloadAsPDF}
              disabled={isGeneratingPDF}
              className="btn-primary flex items-center justify-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>{isGeneratingPDF ? 'Generando...' : 'PDF'}</span>
            </button>
            <button
              onClick={printReceipt}
              className="btn-secondary flex items-center justify-center space-x-2"
            >
              <Printer className="h-4 w-4" />
              <span>Imprimir</span>
            </button>
            <button
              onClick={() => setShowEmailModal(true)}
              className="btn-secondary flex items-center justify-center space-x-2"
            >
              <Mail className="h-4 w-4" />
              <span>Email</span>
            </button>
          </div>
        </div>

        {/* Vista previa del recibo */}
        <div 
          ref={receiptRef}
          className="bg-white text-black p-6 rounded-xl max-h-96 overflow-y-auto"
        >
          <pre className="text-sm whitespace-pre-wrap font-mono">
            {receipt}
          </pre>
        </div>
      </div>

      {/* Modal de Email */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Enviar por Email</h3>
              <button
                onClick={() => setShowEmailModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Email del destinatario *
                </label>
                <input
                  type="email"
                  value={emailData.email}
                  onChange={(e) => setEmailData(prev => ({ ...prev, email: e.target.value }))}
                  className="input-field"
                  placeholder="ejemplo@email.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Asunto
                </label>
                <input
                  type="text"
                  value={emailData.subject}
                  onChange={(e) => setEmailData(prev => ({ ...prev, subject: e.target.value }))}
                  className="input-field"
                  placeholder="Asunto del email"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Mensaje
                </label>
                <textarea
                  value={emailData.message}
                  onChange={(e) => setEmailData(prev => ({ ...prev, message: e.target.value }))}
                  className="input-field h-24 resize-none"
                  placeholder="Mensaje opcional..."
                />
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowEmailModal(false)}
                className="btn-secondary flex-1"
              >
                Cancelar
              </button>
              <button
                onClick={sendEmail}
                disabled={!emailData.email || isSending}
                className="btn-primary flex-1 inline-flex items-center justify-center space-x-2"
              >
                {isSending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Enviando...</span>
                  </>
                ) : (
                  <>
                    <Mail className="h-4 w-4" />
                    <span>Enviar</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 