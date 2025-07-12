'use client';

import { useState, useEffect } from 'react';
import { FileText, Filter, Download, Search, Calendar, User, Activity, AlertTriangle } from 'lucide-react';
import securityManager from '../../utils/security';

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [filters, setFilters] = useState({
    action: '',
    userId: '',
    startDate: '',
    endDate: '',
    search: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadLogs();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [logs, filters]);

  const loadLogs = () => {
    setIsLoading(true);
    
    // Simular carga de logs
    setTimeout(() => {
      const auditLogs = securityManager.getAuditLogs();
      setLogs(auditLogs);
      setIsLoading(false);
    }, 500);
  };

  const applyFilters = () => {
    let filtered = [...logs];

    // Filtro por acción
    if (filters.action) {
      filtered = filtered.filter(log => 
        log.action.toLowerCase().includes(filters.action.toLowerCase())
      );
    }

    // Filtro por usuario
    if (filters.userId) {
      filtered = filtered.filter(log => 
        log.userId?.toString().includes(filters.userId) ||
        log.userEmail?.toLowerCase().includes(filters.userId.toLowerCase())
      );
    }

    // Filtro por fecha
    if (filters.startDate) {
      filtered = filtered.filter(log => 
        new Date(log.timestamp) >= new Date(filters.startDate)
      );
    }

    if (filters.endDate) {
      filtered = filtered.filter(log => 
        new Date(log.timestamp) <= new Date(filters.endDate)
      );
    }

    // Filtro por búsqueda general
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(log => 
        log.action.toLowerCase().includes(searchTerm) ||
        log.userEmail?.toLowerCase().includes(searchTerm) ||
        log.userRole?.toLowerCase().includes(searchTerm) ||
        JSON.stringify(log.data).toLowerCase().includes(searchTerm)
      );
    }

    setFilteredLogs(filtered);
  };

  const clearFilters = () => {
    setFilters({
      action: '',
      userId: '',
      startDate: '',
      endDate: '',
      search: ''
    });
  };

  const exportLogs = () => {
    const csvContent = generateCSV(filteredLogs);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `audit_logs_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateCSV = (logs) => {
    const headers = ['Timestamp', 'Action', 'User', 'Role', 'IP', 'User Agent', 'Data'];
    const rows = logs.map(log => [
      new Date(log.timestamp).toLocaleString(),
      log.action,
      log.userEmail || 'N/A',
      log.userRole || 'N/A',
      log.ip || 'N/A',
      log.userAgent || 'N/A',
      JSON.stringify(log.data)
    ]);

    return [headers, ...rows].map(row => 
      row.map(field => `"${field}"`).join(',')
    ).join('\n');
  };

  const getActionIcon = (action) => {
    const icons = {
      'LOGIN_SUCCESS': <Activity className="w-4 h-4 text-green-500" />,
      'LOGOUT': <Activity className="w-4 h-4 text-blue-500" />,
      'ROLE_CREATED': <User className="w-4 h-4 text-purple-500" />,
      'ROLE_UPDATED': <User className="w-4 h-4 text-orange-500" />,
      'ROLE_DELETED': <User className="w-4 h-4 text-red-500" />,
      'CONTRACT_CREATED': <FileText className="w-4 h-4 text-green-500" />,
      'CONTRACT_UPDATED': <FileText className="w-4 h-4 text-blue-500" />,
      'CONTRACT_DELETED': <FileText className="w-4 h-4 text-red-500" />,
      'RECEIPT_CREATED': <FileText className="w-4 h-4 text-green-500" />,
      'RECEIPT_UPDATED': <FileText className="w-4 h-4 text-blue-500" />,
      'RECEIPT_DELETED': <FileText className="w-4 h-4 text-red-500" />,
      'SECURITY_VIOLATION': <AlertTriangle className="w-4 h-4 text-red-500" />
    };

    return icons[action] || <Activity className="w-4 h-4 text-gray-500" />;
  };

  const getActionColor = (action) => {
    const colors = {
      'LOGIN_SUCCESS': 'text-green-600',
      'LOGOUT': 'text-blue-600',
      'ROLE_CREATED': 'text-purple-600',
      'ROLE_UPDATED': 'text-orange-600',
      'ROLE_DELETED': 'text-red-600',
      'CONTRACT_CREATED': 'text-green-600',
      'CONTRACT_UPDATED': 'text-blue-600',
      'CONTRACT_DELETED': 'text-red-600',
      'RECEIPT_CREATED': 'text-green-600',
      'RECEIPT_UPDATED': 'text-blue-600',
      'RECEIPT_DELETED': 'text-red-600',
      'SECURITY_VIOLATION': 'text-red-600'
    };

    return colors[action] || 'text-gray-600';
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getActionDescription = (action) => {
    const descriptions = {
      'LOGIN_SUCCESS': 'Inicio de sesión exitoso',
      'LOGOUT': 'Cierre de sesión',
      'ROLE_CREATED': 'Rol creado',
      'ROLE_UPDATED': 'Rol actualizado',
      'ROLE_DELETED': 'Rol eliminado',
      'CONTRACT_CREATED': 'Contrato creado',
      'CONTRACT_UPDATED': 'Contrato actualizado',
      'CONTRACT_DELETED': 'Contrato eliminado',
      'RECEIPT_CREATED': 'Recibo creado',
      'RECEIPT_UPDATED': 'Recibo actualizado',
      'RECEIPT_DELETED': 'Recibo eliminado',
      'SECURITY_VIOLATION': 'Violación de seguridad'
    };

    return descriptions[action] || action;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FileText className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">Logs de Auditoría</h2>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Filter className="w-4 h-4" />
            Filtros
          </button>
          <button
            onClick={exportLogs}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Exportar
          </button>
        </div>
      </div>

      {/* Filtros */}
      {showFilters && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Búsqueda
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  placeholder="Buscar en logs..."
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Acción
              </label>
              <input
                type="text"
                value={filters.action}
                onChange={(e) => setFilters({ ...filters, action: e.target.value })}
                placeholder="Filtrar por acción..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Usuario
              </label>
              <input
                type="text"
                value={filters.userId}
                onChange={(e) => setFilters({ ...filters, userId: e.target.value })}
                placeholder="Filtrar por usuario..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha Desde
              </label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha Hasta
              </label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <div className="flex items-center justify-between mt-4">
            <span className="text-sm text-gray-600">
              {filteredLogs.length} de {logs.length} logs encontrados
            </span>
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Limpiar filtros
            </button>
          </div>
        </div>
      )}

      {/* Lista de Logs */}
      <div className="space-y-2">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p>No se encontraron logs que coincidan con los filtros</p>
          </div>
        ) : (
          filteredLogs.map((log, index) => (
            <div
              key={index}
              className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors cursor-pointer"
              onClick={() => setSelectedLog(log)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getActionIcon(log.action)}
                  <div>
                    <h4 className={`font-medium ${getActionColor(log.action)}`}>
                      {getActionDescription(log.action)}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {log.userEmail} ({log.userRole}) • {formatTimestamp(log.timestamp)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">{log.ip}</p>
                  <p className="text-xs text-gray-500">
                    {log.userAgent?.substring(0, 50)}...
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal de Detalles del Log */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Detalles del Log</h3>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Acción</label>
                  <p className="text-sm text-gray-900">{selectedLog.action}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Timestamp</label>
                  <p className="text-sm text-gray-900">{formatTimestamp(selectedLog.timestamp)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Usuario</label>
                  <p className="text-sm text-gray-900">{selectedLog.userEmail}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Rol</label>
                  <p className="text-sm text-gray-900">{selectedLog.userRole}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">IP</label>
                  <p className="text-sm text-gray-900">{selectedLog.ip}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Session ID</label>
                  <p className="text-sm text-gray-900 font-mono text-xs">
                    {selectedLog.sessionId?.substring(0, 20)}...
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">User Agent</label>
                <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded font-mono text-xs">
                  {selectedLog.userAgent}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Datos</label>
                <pre className="text-sm text-gray-900 bg-gray-50 p-3 rounded font-mono text-xs overflow-x-auto">
                  {JSON.stringify(selectedLog.data, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditLogs; 