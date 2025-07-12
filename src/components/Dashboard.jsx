'use client';

import { useState, useEffect } from 'react';
import { 
  generateFullReport, 
  calculateKPIs, 
  ANALYSIS_PERIODS 
} from '@/utils/analytics';
import { 
  initializePushNotifications, 
  isPushAvailable,
  requestPushPermission 
} from '@/utils/pushNotifications';
import { getSyncState } from '@/utils/cloudSync';
import { getAPIState } from '@/utils/externalAPIs';

function getMockDashboardData(period) {
  // Simula datos para el dashboard
  return {
    report: {
      financial: {
        receipts: { totalAmount: 12500000 },
        cashFlow: { efficiency: 92.5 },
      },
      contracts: { active: 18 },
      receipts: { paid: 42 },
    },
    kpis: {
      activeContracts: 18,
      occupancyRate: 97.2,
      paidReceipts: 42,
      collectionRate: 98.5,
      averageContractValue: 695000,
    },
  };
}

export default function Dashboard() {
  const [report, setReport] = useState(null);
  const [kpis, setKpis] = useState({});
  const [period, setPeriod] = useState(ANALYSIS_PERIODS.MONTH);
  const [loading, setLoading] = useState(true);
  const [pushEnabled, setPushEnabled] = useState(false);
  const [syncState, setSyncState] = useState({});
  const [apiState, setApiState] = useState({});
  const [mocked, setMocked] = useState(false);

  useEffect(() => {
    loadDashboardData();
    initializePushNotifications();
    
    // Actualizar estados periódicamente
    const interval = setInterval(() => {
      setSyncState(getSyncState());
      setApiState(getAPIState());
    }, 5000);

    return () => clearInterval(interval);
  }, [period]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const fullReport = generateFullReport(period);
      const kpiData = calculateKPIs();
      const isEmpty =
        !fullReport ||
        !kpiData ||
        Object.values(kpiData).every((v) => !v || v === 0);
      if (isEmpty) {
        const mock = getMockDashboardData(period);
        setReport(mock.report);
        setKpis(mock.kpis);
        setMocked(true);
      } else {
        setReport(fullReport);
        setKpis(kpiData);
        setMocked(false);
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePushPermission = async () => {
    const granted = await requestPushPermission();
    setPushEnabled(granted);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(amount);
  };

  const formatPercentage = (value) => {
    return `${value.toFixed(1)}%`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'text-green-600';
      case 'error': return 'text-red-600';
      case 'warning': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              Dashboard Konrad
              {mocked && (
                <span className="ml-2 px-2 py-1 rounded bg-yellow-100 text-yellow-800 text-xs font-semibold animate-pulse">Datos simulados</span>
              )}
            </h1>
            <p className="text-gray-600">Análisis y reportes en tiempo real</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={ANALYSIS_PERIODS.WEEK}>Última semana</option>
              <option value={ANALYSIS_PERIODS.MONTH}>Último mes</option>
              <option value={ANALYSIS_PERIODS.QUARTER}>Último trimestre</option>
              <option value={ANALYSIS_PERIODS.YEAR}>Último año</option>
            </select>
            
            <button
              onClick={handlePushPermission}
              className={`px-4 py-2 rounded-lg font-medium ${
                pushEnabled 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {pushEnabled ? '🔔 Notificaciones ON' : '🔕 Notificaciones OFF'}
            </button>
          </div>
        </div>

        {/* KPIs Principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Contratos Activos</p>
                <p className="text-2xl font-bold text-gray-900">{kpis.activeContracts || 0}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-gray-500">
                Tasa de ocupación: {formatPercentage(kpis.occupancyRate || 0)}
              </span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ingresos Totales</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(report?.financial?.receipts?.totalAmount || 0)}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-gray-500">
                Eficiencia: {formatPercentage(report?.financial?.cashFlow?.efficiency || 0)}
              </span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Recibos Pagados</p>
                <p className="text-2xl font-bold text-gray-900">{kpis.paidReceipts || 0}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-gray-500">
                Tasa de cobro: {formatPercentage(kpis.collectionRate || 0)}
              </span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Valor Promedio</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(kpis.averageContractValue || 0)}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-gray-500">
                Por contrato activo
              </span>
            </div>
          </div>
        </div>

        {/* Gráficos y Análisis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Análisis de Contratos */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Análisis de Contratos</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total de contratos:</span>
                <span className="font-medium">{report?.financial?.contracts?.total || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Valor promedio:</span>
                <span className="font-medium">
                  {formatCurrency(report?.financial?.contracts?.averageValue || 0)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Valor total:</span>
                <span className="font-medium">
                  {formatCurrency(report?.financial?.contracts?.totalValue || 0)}
                </span>
              </div>
              
              {/* Distribución por tipo */}
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Por Tipo de Contrato</h4>
                <div className="space-y-2">
                  {Object.entries(report?.financial?.contracts?.byType || {}).map(([type, count]) => (
                    <div key={type} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 capitalize">{type}:</span>
                      <span className="font-medium">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Análisis de Recibos */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Análisis de Recibos</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total de recibos:</span>
                <span className="font-medium">{report?.financial?.receipts?.total || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Monto promedio:</span>
                <span className="font-medium">
                  {formatCurrency(report?.financial?.receipts?.averageAmount || 0)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Monto total:</span>
                <span className="font-medium">
                  {formatCurrency(report?.financial?.receipts?.totalAmount || 0)}
                </span>
              </div>
              
              {/* Distribución por estado */}
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Por Estado de Pago</h4>
                <div className="space-y-2">
                  {Object.entries(report?.financial?.receipts?.byStatus || {}).map(([status, count]) => (
                    <div key={status} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 capitalize">{status}:</span>
                      <span className="font-medium">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Estado del Sistema */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Estado de Notificaciones */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Notificaciones Push</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Estado:</span>
                <span className={`text-sm font-medium ${pushEnabled ? 'text-green-600' : 'text-red-600'}`}>
                  {pushEnabled ? 'Habilitado' : 'Deshabilitado'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Permisos:</span>
                <span className="text-sm font-medium">
                  {isPushAvailable() ? 'Concedidos' : 'No concedidos'}
                </span>
              </div>
              <button
                onClick={handlePushPermission}
                className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {pushEnabled ? 'Configurar Notificaciones' : 'Habilitar Notificaciones'}
              </button>
            </div>
          </div>

          {/* Estado de Sincronización */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sincronización en la Nube</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Estado:</span>
                <span className={`text-sm font-medium ${getStatusColor(syncState.status)}`}>
                  {syncState.status || 'Deshabilitado'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Conexión:</span>
                <span className={`text-sm font-medium ${syncState.isOnline ? 'text-green-600' : 'text-red-600'}`}>
                  {syncState.isOnline ? 'En línea' : 'Sin conexión'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Cambios pendientes:</span>
                <span className="text-sm font-medium">
                  {syncState.pendingChanges?.length || 0}
                </span>
              </div>
            </div>
          </div>

          {/* Estado de APIs Externas */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">APIs Externas</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Estado:</span>
                <span className={`text-sm font-medium ${getStatusColor(apiState.status)}`}>
                  {apiState.status || 'Deshabilitado'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Última actualización:</span>
                <span className="text-sm font-medium">
                  {apiState.lastUpdate ? new Date(apiState.lastUpdate).toLocaleDateString() : 'Nunca'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Errores:</span>
                <span className="text-sm font-medium">
                  {apiState.errors?.length || 0}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Acciones Rápidas */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="p-4 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors">
              <div className="text-center">
                <div className="text-2xl mb-2">📊</div>
                <div className="text-sm font-medium">Generar Reporte</div>
              </div>
            </button>
            <button className="p-4 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors">
              <div className="text-center">
                <div className="text-2xl mb-2">🔄</div>
                <div className="text-sm font-medium">Sincronizar</div>
              </div>
            </button>
            <button className="p-4 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 transition-colors">
              <div className="text-center">
                <div className="text-2xl mb-2">📈</div>
                <div className="text-sm font-medium">Actualizar Índices</div>
              </div>
            </button>
            <button className="p-4 bg-purple-100 text-purple-800 rounded-lg hover:bg-purple-200 transition-colors">
              <div className="text-center">
                <div className="text-2xl mb-2">⚙️</div>
                <div className="text-sm font-medium">Configuración</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 