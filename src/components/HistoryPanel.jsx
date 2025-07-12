'use client';

import React, { useState, useEffect } from 'react';
import { FileText, Receipt, Clock, Search, Filter, Download, Trash2, Eye } from 'lucide-react';
import { getHistory, getAllContracts, getAllReceipts, getStats } from '@/utils/database';
import { formatDate, formatCurrency } from '@/utils/formatters';

export default function HistoryPanel() {
  const [activeTab, setActiveTab] = useState('history');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [history, setHistory] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [receipts, setReceipts] = useState([]);
  const [stats, setStats] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setHistory(getHistory());
    setContracts(getAllContracts());
    setReceipts(getAllReceipts());
    setStats(getStats());
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'contract':
        return <FileText className="h-4 w-4 text-primary-400" />;
      case 'receipt':
        return <Receipt className="h-4 w-4 text-success-400" />;
      default:
        return <Clock className="h-4 w-4 text-neutral-400" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'contract':
        return 'border-primary-500 bg-primary-500/10';
      case 'receipt':
        return 'border-success-500 bg-success-500/10';
      default:
        return 'border-neutral-500 bg-neutral-500/10';
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'contract':
        return 'Contrato';
      case 'receipt':
        return 'Recibo';
      default:
        return 'Documento';
    }
  };

  const filteredHistory = history.filter(item => {
    const matchesSearch = item.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || item.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const handleExport = () => {
    const data = {
      history,
      contracts,
      receipts,
      stats,
      exportedAt: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `konrad_historial_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleClearHistory = () => {
    if (confirm('¿Estás seguro de que quieres limpiar todo el historial? Esta acción no se puede deshacer.')) {
      localStorage.removeItem('konrad_history');
      localStorage.removeItem('konrad_contracts');
      localStorage.removeItem('konrad_receipts');
      loadData();
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Historial y Estadísticas</h2>
          <p className="text-neutral-400">Gestiona tus contratos y recibos generados</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleExport}
            className="btn-secondary flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Exportar</span>
          </button>
          <button
            onClick={handleClearHistory}
            className="btn-secondary flex items-center space-x-2 text-error-400 hover:text-error-300"
          >
            <Trash2 className="h-4 w-4" />
            <span>Limpiar</span>
          </button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card text-center">
          <div className="p-3 bg-primary-500/20 rounded-xl w-fit mx-auto mb-3">
            <FileText className="h-6 w-6 text-primary-400" />
          </div>
          <h3 className="text-2xl font-bold text-white">{stats.totalContracts || 0}</h3>
          <p className="text-sm text-neutral-400">Contratos Totales</p>
        </div>
        
        <div className="card text-center">
          <div className="p-3 bg-success-500/20 rounded-xl w-fit mx-auto mb-3">
            <Receipt className="h-6 w-6 text-success-400" />
          </div>
          <h3 className="text-2xl font-bold text-white">{stats.totalReceipts || 0}</h3>
          <p className="text-sm text-neutral-400">Recibos Totales</p>
        </div>
        
        <div className="card text-center">
          <div className="p-3 bg-secondary-500/20 rounded-xl w-fit mx-auto mb-3">
            <Clock className="h-6 w-6 text-secondary-400" />
          </div>
          <h3 className="text-2xl font-bold text-white">{stats.contractsThisMonth || 0}</h3>
          <p className="text-sm text-neutral-400">Contratos Este Mes</p>
        </div>
        
        <div className="card text-center">
          <div className="p-3 bg-warning-500/20 rounded-xl w-fit mx-auto mb-3">
            <Receipt className="h-6 w-6 text-warning-400" />
          </div>
          <h3 className="text-2xl font-bold text-white">{stats.receiptsThisMonth || 0}</h3>
          <p className="text-sm text-neutral-400">Recibos Este Mes</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6">
        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'history'
              ? 'bg-primary-600 text-white'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-700'
          }`}
        >
          Historial
        </button>
        <button
          onClick={() => setActiveTab('contracts')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'contracts'
              ? 'bg-primary-600 text-white'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-700'
          }`}
        >
          Contratos
        </button>
        <button
          onClick={() => setActiveTab('receipts')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'receipts'
              ? 'bg-primary-600 text-white'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-700'
          }`}
        >
          Recibos
        </button>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Buscar en el historial..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10"
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-neutral-400" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="input-field"
          >
            <option value="all">Todos</option>
            <option value="contract">Contratos</option>
            <option value="receipt">Recibos</option>
          </select>
        </div>
      </div>

      {/* Contenido */}
      <div className="space-y-4">
        {activeTab === 'history' && (
          <div>
            {filteredHistory.length === 0 ? (
              <div className="text-center py-12">
                <Clock className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
                <p className="text-neutral-400">No hay elementos en el historial</p>
              </div>
            ) : (
              filteredHistory.map((item) => (
                <div
                  key={item.id}
                  className={`card border-l-4 ${getTypeColor(item.type)}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getTypeIcon(item.type)}
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-white">
                            {getTypeLabel(item.type)}
                          </span>
                          <span className="text-xs text-neutral-400">
                            {formatDate(item.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm text-neutral-300 mt-1">{item.summary}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 hover:bg-neutral-700 rounded-lg transition-colors">
                        <Eye className="h-4 w-4 text-neutral-400" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'contracts' && (
          <div>
            {contracts.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
                <p className="text-neutral-400">No hay contratos guardados</p>
              </div>
            ) : (
              contracts.map((contract) => (
                <div key={contract.id} className="card border-l-4 border-primary-500">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-primary-400" />
                      <div>
                        <h4 className="font-medium text-white">{contract.tenantName}</h4>
                        <p className="text-sm text-neutral-400">{contract.propertyAddress}</p>
                        <p className="text-xs text-neutral-500">
                          {contract.contractType} • {formatDate(contract.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-primary-400">
                        ${contract.monthlyPrice}
                      </span>
                      <button className="p-2 hover:bg-neutral-700 rounded-lg transition-colors">
                        <Eye className="h-4 w-4 text-neutral-400" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'receipts' && (
          <div>
            {receipts.length === 0 ? (
              <div className="text-center py-12">
                <Receipt className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
                <p className="text-neutral-400">No hay recibos guardados</p>
              </div>
            ) : (
              receipts.map((receipt) => (
                <div key={receipt.id} className="card border-l-4 border-success-500">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Receipt className="h-5 w-5 text-success-400" />
                      <div>
                        <h4 className="font-medium text-white">
                          {receipt.tenantName || receipt.clientName}
                        </h4>
                        <p className="text-sm text-neutral-400">{receipt.propertyAddress}</p>
                        <p className="text-xs text-neutral-500">
                          {receipt.receiptType} • {formatDate(receipt.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-success-400">
                        ${receipt.totalAmount}
                      </span>
                      <button className="p-2 hover:bg-neutral-700 rounded-lg transition-colors">
                        <Eye className="h-4 w-4 text-neutral-400" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
} 