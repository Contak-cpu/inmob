'use client';

import React, { useState } from 'react';
import { Home, Download, Printer, Share2, FileText, ArrowLeft, Receipt } from 'lucide-react';
import { useRouter } from 'next/navigation';

const testData = {
  tenantName: 'Juan Pérez',
  tenantDocument: '12345678',
  propertyAddress: 'Av. Corrientes 1234, CABA',
  month: 'Enero',
  year: '2024',
  amount: '150000',
  expenses: '5000',
  totalAmount: '155000',
  paymentMethod: 'Transferencia',
  paymentDate: '2024-01-10',
};

const months = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const paymentMethods = [
  'Efectivo', 'Transferencia', 'Cheque', 'Débito Automático'
];

function PreviewTicket({ data }) {
  return (
    <div className="bg-white text-black rounded-xl shadow-lg p-6 max-w-md mx-auto border-2 border-primary-400">
      <div className="flex flex-col items-center mb-4">
        <Home className="h-8 w-8 text-primary-400 mb-2" />
        <h2 className="font-bold text-lg text-primary-600 text-center">Konrad Inversiones + Desarrollos Inmobiliarios</h2>
        <span className="text-xs text-neutral-500">Recibo de Alquiler</span>
      </div>
      <div className="mb-2 text-xs text-neutral-600 text-center">Fecha: {data.paymentDate || '...'}</div>
      <div className="border-b border-neutral-300 mb-2"></div>
      <div className="space-y-1 text-sm">
        <div><b>Inquilino:</b> {data.tenantName || '...'}</div>
        <div><b>DNI:</b> {data.tenantDocument || '...'}</div>
        <div><b>Propiedad:</b> {data.propertyAddress || '...'}</div>
        <div><b>Mes:</b> {data.month || '...'} {data.year || ''}</div>
        <div><b>Monto Alquiler:</b> ${data.amount || '...'}</div>
        <div><b>Gastos:</b> ${data.expenses || '0'}</div>
        <div><b>Total Pagado:</b> <span className="font-bold">${data.totalAmount || '...'}</span></div>
        <div><b>Forma de Pago:</b> {data.paymentMethod || '...'}</div>
      </div>
      <div className="border-t border-neutral-300 mt-4 pt-2 text-xs text-neutral-500 text-center">
        <span>Gracias por su pago</span>
      </div>
    </div>
  );
}

function PreviewDocumento({ data }) {
  return (
    <div className="bg-white text-black rounded-xl shadow-lg p-6 max-w-lg mx-auto border border-neutral-300">
      <div className="flex flex-col items-center mb-4">
        <Receipt className="h-8 w-8 text-primary-400 mb-2" />
        <h2 className="font-bold text-lg text-primary-600 text-center">Konrad Inversiones + Desarrollos Inmobiliarios</h2>
        <span className="text-xs text-neutral-500">Recibo de Alquiler</span>
      </div>
      <div className="mb-4 text-xs text-neutral-600 text-center">Fecha de emisión: {data.paymentDate || '...'}</div>
      <div className="text-sm mb-2">
        Recibí de <b>{data.tenantName || '...'}</b> (DNI {data.tenantDocument || '...'}) la suma de <b>${data.totalAmount || '...'}</b> en concepto de pago de alquiler correspondiente al mes de <b>{data.month || '...'} {data.year || ''}</b> por la propiedad ubicada en <b>{data.propertyAddress || '...'}</b>.
      </div>
      <div className="text-sm mb-2">
        <b>Detalle:</b> Alquiler: ${data.amount || '...'} | Gastos: ${data.expenses || '0'} | Forma de pago: {data.paymentMethod || '...'}
      </div>
      <div className="text-xs text-neutral-500 mt-6 text-center">
        <span>Konrad Inversiones + Desarrollos Inmobiliarios</span>
      </div>
    </div>
  );
}

export default function ReceiptForm({ receiptType }) {
  const router = useRouter();
  const [form, setForm] = useState({});
  const [showPreview, setShowPreview] = useState('ticket');

  if (receiptType !== 'alquiler') {
    return <div className="text-center text-neutral-400 py-12">(Próximamente: diseño específico para este tipo de recibo)</div>;
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleTest = () => {
    setForm(testData);
  };

  const handleBack = () => {
    router.push('/receipts');
  };

  return (
    <div className="max-w-3xl mx-auto bg-neutral-900 rounded-xl shadow-lg p-6 mt-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button onClick={handleBack} className="btn-secondary flex items-center space-x-2">
          <ArrowLeft className="h-4 w-4" />
          <span>Volver</span>
        </button>
        <div className="flex items-center space-x-3">
          <Home className="h-7 w-7 text-primary-400" />
          <h2 className="text-xl font-bold text-white">Recibo de Alquiler</h2>
        </div>
        <button onClick={handleTest} className="btn-secondary flex items-center space-x-2">
          <FileText className="h-4 w-4" />
          <span>Test Recibo</span>
        </button>
      </div>

      {/* Formulario */}
      <form className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-1">Nombre del Inquilino *</label>
          <input name="tenantName" value={form.tenantName || ''} onChange={handleChange} className="input-field" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-1">DNI del Inquilino *</label>
          <input name="tenantDocument" value={form.tenantDocument || ''} onChange={handleChange} className="input-field" required />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-neutral-300 mb-1">Dirección del Inmueble *</label>
          <input name="propertyAddress" value={form.propertyAddress || ''} onChange={handleChange} className="input-field" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-1">Mes *</label>
          <select name="month" value={form.month || ''} onChange={handleChange} className="input-field" required>
            <option value="">Seleccionar mes</option>
            {months.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-1">Año *</label>
          <input name="year" type="number" value={form.year || ''} onChange={handleChange} className="input-field" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-1">Monto del Alquiler *</label>
          <input name="amount" type="number" value={form.amount || ''} onChange={handleChange} className="input-field" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-1">Gastos Adicionales</label>
          <input name="expenses" type="number" value={form.expenses || ''} onChange={handleChange} className="input-field" />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-1">Total Pagado *</label>
          <input name="totalAmount" type="number" value={form.totalAmount || ''} onChange={handleChange} className="input-field" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-1">Forma de Pago *</label>
          <select name="paymentMethod" value={form.paymentMethod || ''} onChange={handleChange} className="input-field" required>
            <option value="">Seleccionar</option>
            {paymentMethods.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-1">Fecha de Pago *</label>
          <input name="paymentDate" type="date" value={form.paymentDate || ''} onChange={handleChange} className="input-field" required />
        </div>
      </form>

      {/* Selector de preview */}
      <div className="flex items-center justify-center mb-6 space-x-4">
        <button
          type="button"
          className={`btn-secondary ${showPreview === 'ticket' ? 'ring-2 ring-primary-400' : ''}`}
          onClick={() => setShowPreview('ticket')}
        >
          <Receipt className="h-4 w-4 mr-1" /> Ticket
        </button>
        <button
          type="button"
          className={`btn-secondary ${showPreview === 'documento' ? 'ring-2 ring-primary-400' : ''}`}
          onClick={() => setShowPreview('documento')}
        >
          <FileText className="h-4 w-4 mr-1" /> Documento
        </button>
      </div>

      {/* Preview */}
      <div className="mb-8">
        {showPreview === 'ticket' ? (
          <PreviewTicket data={form} />
        ) : (
          <PreviewDocumento data={form} />
        )}
      </div>

      {/* Acciones */}
      <div className="flex justify-center space-x-4">
        <button className="btn-primary flex items-center space-x-2">
          <Download className="h-4 w-4" />
          <span>Descargar</span>
        </button>
        <button className="btn-primary flex items-center space-x-2">
          <Printer className="h-4 w-4" />
          <span>Imprimir</span>
        </button>
        <button className="btn-primary flex items-center space-x-2">
          <Share2 className="h-4 w-4" />
          <span>Compartir</span>
        </button>
      </div>
    </div>
  );
} 