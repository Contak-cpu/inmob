"use client";
import React, { useState } from 'react';
import { FileText, Eye, Download, Plus, Lock, Unlock, FilePlus, Upload } from 'lucide-react';
import { getCurrentUser, USER_ROLES } from '@/utils/auth';
import { CONTRACT_TYPES } from '@/lib/config';
import Breadcrumbs from '@/components/Breadcrumbs';
import { useRouter } from 'next/navigation';
import { useTest } from '@/contexts/TestContext';

export default function ImportedContractsPage() {
  const user = getCurrentUser();
  const router = useRouter();
  const { isTestMode } = useTest();
  const [contracts, setContracts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Cargar contratos desde la API al montar
  React.useEffect(() => {
    if (isTestMode) {
      setContracts([
        {
          id: 'c1',
          cliente: 'Juan Pérez',
          tipo: 'Alquiler',
          fechaInicio: '2024-01-01',
          fechaFin: '2025-01-01',
          monto: 150000,
          estado: 'Activo',
          observaciones: 'Contrato de alquiler anual.',
          archivos: [
            { nombre: 'Contrato.pdf', url: '#', tipo: 'pdf' }
          ],
          permisos: [USER_ROLES.ADMIN, USER_ROLES.MANAGER, USER_ROLES.AGENT, USER_ROLES.VIEWER],
          creadoPor: 'admin',
          fechaCarga: '2024-01-01',
        },
        {
          id: 'c2',
          cliente: 'María González',
          tipo: 'Comercial',
          fechaInicio: '2023-06-01',
          fechaFin: '2024-06-01',
          monto: 250000,
          estado: 'Finalizado',
          observaciones: 'Contrato comercial de local.',
          archivos: [],
          permisos: [USER_ROLES.ADMIN, USER_ROLES.MANAGER],
          creadoPor: 'german',
          fechaCarga: '2023-06-01',
        }
      ]);
    } else {
      fetch(`/api/contracts?testMode=${isTestMode}`)
        .then(res => res.json())
        .then(data => setContracts(data.contracts || []));
    }
  }, [isTestMode]);

  // Filtrar contratos según permisos del usuario
  const filteredContracts = contracts.filter(c => c.permisos?.includes(user?.role));

  // Manejar importación de contrato
  const handleImport = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    // Subir archivos
    const archivos = [];
    for (const file of formData.getAll('archivos')) {
      if (file && file.size > 0) {
        const uploadData = new FormData();
        uploadData.append('file', file);
        const res = await fetch('/api/contracts/upload', { method: 'POST', body: uploadData });
        const fileInfo = await res.json();
        archivos.push(fileInfo);
      }
    }
    // Guardar contrato
    const contrato = {
      cliente: formData.get('cliente'),
      tipo: formData.get('tipo'),
      fechaInicio: formData.get('fechaInicio'),
      fechaFin: formData.get('fechaFin'),
      monto: Number(formData.get('monto')),
      estado: formData.get('estado'),
      observaciones: formData.get('observaciones'),
      archivos,
      permisos: formData.getAll('permisos'),
      creadoPor: user?.username,
      fechaCarga: new Date().toISOString().slice(0, 10),
    };
    await fetch('/api/contracts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contrato),
    });
    setShowImportModal(false);
    // Refrescar lista
    fetch('/api/contracts')
      .then(res => res.json())
      .then(data => setContracts(data.contracts || []));
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Gestión de Contratos</h1>
          <p className="text-neutral-400">Crea nuevos contratos o visualiza los existentes</p>
        </div>
        <div className="flex gap-3">
          {(user?.role === USER_ROLES.ADMIN || user?.role === USER_ROLES.MANAGER || user?.role === USER_ROLES.AGENT) && (
            <button
              className="btn-primary flex items-center gap-2"
              onClick={() => setShowCreateModal(true)}
            >
              <FilePlus className="h-5 w-5" /> Crear Contrato
            </button>
          )}
          {(user?.role === USER_ROLES.ADMIN || user?.role === USER_ROLES.MANAGER) && (
            <button
              className="btn-secondary flex items-center gap-2"
              onClick={() => setShowImportModal(true)}
            >
              <Upload className="h-5 w-5" /> Importar
            </button>
          )}
        </div>
      </div>

      {/* Lista de contratos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredContracts.map(contract => (
          <div key={contract.id} className="card flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary-400" />
              <span className="font-semibold text-white">{contract.cliente}</span>
              {contract.permisos.length < 4 ? (
                <Lock className="h-4 w-4 text-error-400 ml-1" title="Acceso restringido" />
              ) : (
                <Unlock className="h-4 w-4 text-success-400 ml-1" title="Acceso total" />
              )}
            </div>
            <div className="text-sm text-neutral-400">{contract.tipo} | {contract.estado}</div>
            <div className="text-xs text-neutral-500">Inicio: {contract.fechaInicio} | Fin: {contract.fechaFin}</div>
            <div className="flex items-center gap-2 mt-2">
              <button
                className="btn-secondary flex items-center gap-1 text-xs"
                onClick={() => setSelected(contract)}
              >
                <Eye className="h-4 w-4" /> Ver Detalle
              </button>
              {contract.archivos?.map(a => (
                <a
                  key={a.nombre}
                  href={a.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary flex items-center gap-1 text-xs"
                  download
                >
                  <Download className="h-4 w-4" /> {a.tipo?.toUpperCase()}
                </a>
              ))}
            </div>
          </div>
        ))}
        {filteredContracts.length === 0 && (
          <div className="col-span-full text-center text-neutral-400 py-12">
            No tienes contratos para visualizar.
          </div>
        )}
      </div>

      {/* Modal de detalle */}
      {selected && (
        <div className="modal-overlay" onClick={e => { if (e.target.classList.contains('modal-overlay')) setSelected(null); }}>
          <div className="modal-content max-w-lg w-full mx-auto p-6 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Contrato de {selected.cliente}</h2>
              <button className="btn-secondary" onClick={() => setSelected(null)}>Cerrar</button>
            </div>
            <div className="space-y-2">
              <div><b>Tipo:</b> {selected.tipo}</div>
              <div><b>Estado:</b> {selected.estado}</div>
              <div><b>Fechas:</b> {selected.fechaInicio} a {selected.fechaFin}</div>
              <div><b>Monto:</b> ${selected.monto}</div>
              <div><b>Observaciones:</b> {selected.observaciones}</div>
              <div><b>Archivos:</b> {selected.archivos?.map(a => (
                <a key={a.nombre} href={a.url} target="_blank" rel="noopener noreferrer" className="underline text-primary-400 ml-2">{a.nombre}</a>
              ))}</div>
              <div><b>Permisos:</b> {selected.permisos?.map(r => r.charAt(0).toUpperCase() + r.slice(1)).join(', ')}</div>
              <div className="text-xs text-neutral-500">Cargado por: {selected.creadoPor} el {selected.fechaCarga}</div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de importación */}
      {showImportModal && (
        <div className="modal-overlay" onClick={e => { if (e.target.classList.contains('modal-overlay')) setShowImportModal(false); }}>
          <div className="modal-content max-w-lg w-full mx-auto p-6 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Importar Contrato</h2>
              <button className="btn-secondary" onClick={() => setShowImportModal(false)}>Cerrar</button>
            </div>
            <form className="space-y-4" onSubmit={handleImport}>
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1">Cliente</label>
                <input className="input-field" name="cliente" placeholder="Nombre del cliente" required />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-1">Tipo</label>
                  <select className="input-field" name="tipo" required>
                    <option>Alquiler</option>
                    <option>Comercial</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-1">Monto</label>
                  <input className="input-field" name="monto" type="number" placeholder="$" required />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-1">Fecha Inicio</label>
                  <input className="input-field" name="fechaInicio" type="date" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-1">Fecha Fin</label>
                  <input className="input-field" name="fechaFin" type="date" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1">Estado</label>
                <select className="input-field" name="estado" required>
                  <option>Vigente</option>
                  <option>Vencido</option>
                  <option>Rescindido</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1">Observaciones</label>
                <textarea className="input-field" name="observaciones" rows={2} />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1">Archivos Adjuntos</label>
                <input className="input-field" name="archivos" type="file" multiple accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" />
                <p className="text-xs text-neutral-400 mt-1">PDF, Word, imágenes escaneadas, etc.</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1">Permisos de Visualización</label>
                <div className="flex flex-wrap gap-3">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="form-checkbox" name="permisos" value="admin" defaultChecked /> Administrador
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="form-checkbox" name="permisos" value="manager" defaultChecked /> Gerente
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="form-checkbox" name="permisos" value="agent" defaultChecked /> Agente
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="form-checkbox" name="permisos" value="viewer" /> Visualizador
                  </label>
                </div>
                <p className="text-xs text-neutral-400 mt-1">Solo los roles seleccionados podrán ver este contrato.</p>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" className="btn-secondary" onClick={() => setShowImportModal(false)}>Cancelar</button>
                <button type="submit" className="btn-primary">Importar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para crear nuevo contrato */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={e => { if (e.target.classList.contains('modal-overlay')) setShowCreateModal(false); }}>
          <div className="modal-content max-w-2xl w-full mx-auto p-6 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Crear Nuevo Contrato</h2>
              <button className="btn-secondary" onClick={() => setShowCreateModal(false)}>Cerrar</button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(CONTRACT_TYPES).map(([key, contract]) => (
                <div
                  key={key}
                  className="card card-hover cursor-pointer p-4 text-center"
                  onClick={() => {
                    setShowCreateModal(false);
                    router.push(`/contracts/${key}`);
                  }}
                >
                  <div className="mb-3">
                    <div className={`w-12 h-12 mx-auto rounded-xl flex items-center justify-center bg-${contract.color}-500/20 border border-${contract.color}-500/30`}>
                      <FileText className={`h-6 w-6 text-${contract.color}-400`} />
                    </div>
                  </div>
                  <h3 className="font-semibold text-white mb-2">{contract.name}</h3>
                  <p className="text-sm text-neutral-400 mb-3">{contract.description}</p>
                  <div className="text-xs text-neutral-500">
                    Ajuste: {contract.adjustmentType}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-neutral-800/50 rounded-xl">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary-400 rounded-full mt-2 flex-shrink-0"></div>
                <div className="text-sm text-neutral-300">
                  <p className="font-medium mb-1">¿Qué tipo de contrato necesitas?</p>
                  <p className="text-neutral-400">Selecciona el tipo de contrato que mejor se adapte a tus necesidades. Cada tipo tiene sus propias características y cláusulas específicas.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 