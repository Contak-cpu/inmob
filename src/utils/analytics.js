// Sistema de análisis y reportes avanzados para Konrad Inmobiliaria

import { getAllContracts, getAllReceipts, getStats } from '@/utils/database';

// Tipos de reportes
export const REPORT_TYPES = {
  CONTRACTS: 'contracts',
  RECEIPTS: 'receipts',
  FINANCIAL: 'financial',
  PERFORMANCE: 'performance',
  TRENDS: 'trends',
};

// Períodos de análisis
export const ANALYSIS_PERIODS = {
  WEEK: 'week',
  MONTH: 'month',
  QUARTER: 'quarter',
  YEAR: 'year',
  CUSTOM: 'custom',
};

// ===== ANÁLISIS DE CONTRATOS =====

// Generar estadísticas de contratos
export const generateContractAnalytics = (period = ANALYSIS_PERIODS.MONTH) => {
  const contracts = getAllContracts();
  const now = new Date();
  const periodStart = getPeriodStart(period);
  
  const filteredContracts = contracts.filter(contract => 
    new Date(contract.createdAt) >= periodStart
  );
  
  // Análisis por tipo de contrato
  const contractsByType = filteredContracts.reduce((acc, contract) => {
    const type = contract.contractType || 'unknown';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});
  
  // Análisis por estado
  const contractsByStatus = filteredContracts.reduce((acc, contract) => {
    const status = contract.status || 'active';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});
  
  // Análisis de valores
  const totalValue = filteredContracts.reduce((sum, contract) => 
    sum + (parseFloat(contract.monthlyPrice) || 0), 0
  );
  
  const averageValue = totalValue / filteredContracts.length || 0;
  
  // Análisis temporal
  const contractsByMonth = groupByMonth(filteredContracts, 'createdAt');
  
  return {
    total: filteredContracts.length,
    byType: contractsByType,
    byStatus: contractsByStatus,
    totalValue,
    averageValue,
    byMonth: contractsByMonth,
    period,
    periodStart,
    periodEnd: now,
  };
};

// ===== ANÁLISIS DE RECIBOS =====

// Generar estadísticas de recibos
export const generateReceiptAnalytics = (period = ANALYSIS_PERIODS.MONTH) => {
  const receipts = getAllReceipts();
  const now = new Date();
  const periodStart = getPeriodStart(period);
  
  const filteredReceipts = receipts.filter(receipt => 
    new Date(receipt.createdAt) >= periodStart
  );
  
  // Análisis por tipo de recibo
  const receiptsByType = filteredReceipts.reduce((acc, receipt) => {
    const type = receipt.receiptType || 'unknown';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});
  
  // Análisis por estado de pago
  const receiptsByStatus = filteredReceipts.reduce((acc, receipt) => {
    const status = receipt.status || 'pending';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});
  
  // Análisis de valores
  const totalAmount = filteredReceipts.reduce((sum, receipt) => 
    sum + (parseFloat(receipt.totalAmount) || 0), 0
  );
  
  const averageAmount = totalAmount / filteredReceipts.length || 0;
  
  // Análisis temporal
  const receiptsByMonth = groupByMonth(filteredReceipts, 'createdAt');
  
  return {
    total: filteredReceipts.length,
    byType: receiptsByType,
    byStatus: receiptsByStatus,
    totalAmount,
    averageAmount,
    byMonth: receiptsByMonth,
    period,
    periodStart,
    periodEnd: now,
  };
};

// ===== ANÁLISIS FINANCIERO =====

// Generar análisis financiero completo
export const generateFinancialAnalytics = (period = ANALYSIS_PERIODS.MONTH) => {
  const contractAnalytics = generateContractAnalytics(period);
  const receiptAnalytics = generateReceiptAnalytics(period);
  
  // Cálculo de ingresos proyectados
  const projectedIncome = contractAnalytics.total * contractAnalytics.averageValue;
  
  // Cálculo de ingresos reales
  const actualIncome = receiptAnalytics.totalAmount;
  
  // Cálculo de eficiencia de cobro
  const collectionEfficiency = projectedIncome > 0 ? (actualIncome / projectedIncome) * 100 : 0;
  
  // Análisis de flujo de caja
  const cashFlow = {
    projected: projectedIncome,
    actual: actualIncome,
    difference: actualIncome - projectedIncome,
    efficiency: collectionEfficiency,
  };
  
  return {
    contracts: contractAnalytics,
    receipts: receiptAnalytics,
    cashFlow,
    period,
  };
};

// ===== ANÁLISIS DE RENDIMIENTO =====

// Generar métricas de rendimiento
export const generatePerformanceAnalytics = (period = ANALYSIS_PERIODS.MONTH) => {
  const contracts = getAllContracts();
  const receipts = getAllReceipts();
  const now = new Date();
  const periodStart = getPeriodStart(period);
  
  // Contratos activos
  const activeContracts = contracts.filter(contract => 
    contract.status === 'active'
  );
  
  // Contratos próximos a vencer
  const expiringContracts = activeContracts.filter(contract => {
    const expiryDate = new Date(contract.startDate);
    expiryDate.setMonth(expiryDate.getMonth() + parseInt(contract.duration));
    const daysUntilExpiry = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30;
  });
  
  // Recibos vencidos
  const overdueReceipts = receipts.filter(receipt => {
    const paymentDate = new Date(receipt.paymentDate);
    const daysOverdue = Math.ceil((now - paymentDate) / (1000 * 60 * 60 * 24));
    return daysOverdue > 0 && receipt.status !== 'paid';
  });
  
  // Métricas de rendimiento
  const performanceMetrics = {
    totalContracts: contracts.length,
    activeContracts: activeContracts.length,
    expiringContracts: expiringContracts.length,
    totalReceipts: receipts.length,
    overdueReceipts: overdueReceipts.length,
    occupancyRate: activeContracts.length / contracts.length * 100,
    collectionRate: (receipts.length - overdueReceipts.length) / receipts.length * 100,
  };
  
  return {
    metrics: performanceMetrics,
    expiringContracts,
    overdueReceipts,
    period,
  };
};

// ===== ANÁLISIS DE TENDENCIAS =====

// Generar análisis de tendencias
export const generateTrendAnalytics = (period = ANALYSIS_PERIODS.YEAR) => {
  const contracts = getAllContracts();
  const receipts = getAllReceipts();
  
  // Agrupar por mes para análisis de tendencias
  const contractsByMonth = groupByMonth(contracts, 'createdAt');
  const receiptsByMonth = groupByMonth(receipts, 'createdAt');
  
  // Calcular tendencias
  const contractTrend = calculateTrend(Object.values(contractsByMonth));
  const receiptTrend = calculateTrend(Object.values(receiptsByMonth));
  
  // Análisis de estacionalidad
  const seasonality = analyzeSeasonality(contracts, receipts);
  
  return {
    contractsByMonth,
    receiptsByMonth,
    contractTrend,
    receiptTrend,
    seasonality,
    period,
  };
};

// ===== UTILIDADES DE ANÁLISIS =====

// Obtener fecha de inicio del período
const getPeriodStart = (period) => {
  const now = new Date();
  
  switch (period) {
    case ANALYSIS_PERIODS.WEEK:
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    case ANALYSIS_PERIODS.MONTH:
      return new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    case ANALYSIS_PERIODS.QUARTER:
      return new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
    case ANALYSIS_PERIODS.YEAR:
      return new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
    default:
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  }
};

// Agrupar datos por mes
const groupByMonth = (data, dateField) => {
  const grouped = {};
  
  data.forEach(item => {
    const date = new Date(item[dateField]);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!grouped[monthKey]) {
      grouped[monthKey] = 0;
    }
    grouped[monthKey]++;
  });
  
  return grouped;
};

// Calcular tendencia
const calculateTrend = (values) => {
  if (values.length < 2) return 0;
  
  const n = values.length;
  const sumX = (n * (n - 1)) / 2;
  const sumY = values.reduce((sum, val) => sum + val, 0);
  const sumXY = values.reduce((sum, val, index) => sum + (index * val), 0);
  const sumX2 = values.reduce((sum, val, index) => sum + (index * index), 0);
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  return slope;
};

// Analizar estacionalidad
const analyzeSeasonality = (contracts, receipts) => {
  const monthlyData = {};
  
  // Agrupar por mes
  [...contracts, ...receipts].forEach(item => {
    const date = new Date(item.createdAt);
    const month = date.getMonth();
    
    if (!monthlyData[month]) {
      monthlyData[month] = 0;
    }
    monthlyData[month]++;
  });
  
  // Encontrar meses con mayor actividad
  const sortedMonths = Object.entries(monthlyData)
    .sort(([,a], [,b]) => b - a);
  
  return {
    peakMonth: parseInt(sortedMonths[0]?.[0]) + 1,
    lowMonth: parseInt(sortedMonths[sortedMonths.length - 1]?.[0]) + 1,
    monthlyDistribution: monthlyData,
  };
};

// ===== GENERACIÓN DE REPORTES =====

// Generar reporte completo
export const generateFullReport = (period = ANALYSIS_PERIODS.MONTH) => {
  const financial = generateFinancialAnalytics(period);
  const performance = generatePerformanceAnalytics(period);
  const trends = generateTrendAnalytics(period);
  
  return {
    financial,
    performance,
    trends,
    generatedAt: new Date().toISOString(),
    period,
  };
};

// Exportar reporte como JSON
export const exportReport = (report) => {
  const dataStr = JSON.stringify(report, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  
  const link = document.createElement('a');
  link.href = URL.createObjectURL(dataBlob);
  link.download = `konrad_report_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
};

// ===== MÉTRICAS KPI =====

// Calcular KPIs principales
export const calculateKPIs = () => {
  const stats = getStats();
  const contracts = getAllContracts();
  const receipts = getAllReceipts();
  
  const activeContracts = contracts.filter(c => c.status === 'active');
  const paidReceipts = receipts.filter(r => r.status === 'paid');
  
  return {
    totalContracts: stats.totalContracts,
    activeContracts: activeContracts.length,
    totalReceipts: stats.totalReceipts,
    paidReceipts: paidReceipts.length,
    occupancyRate: contracts.length > 0 ? (activeContracts.length / contracts.length) * 100 : 0,
    collectionRate: receipts.length > 0 ? (paidReceipts.length / receipts.length) * 100 : 0,
    averageContractValue: activeContracts.length > 0 ? 
      activeContracts.reduce((sum, c) => sum + (parseFloat(c.monthlyPrice) || 0), 0) / activeContracts.length : 0,
    averageReceiptValue: receipts.length > 0 ? 
      receipts.reduce((sum, r) => sum + (parseFloat(r.totalAmount) || 0), 0) / receipts.length : 0,
  };
}; 