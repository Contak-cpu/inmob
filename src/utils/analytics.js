// Sistema de análisis y reportes avanzados para Konrad Inmobiliaria

import { getAllContracts, getAllReceipts, getStats } from '@/utils/database';
import { formatCurrency, formatDate } from '@/utils/formatters';

/**
 * Obtiene estadísticas reales del sistema
 */
export const getRealStats = () => {
  const contracts = getAllContracts();
  const receipts = getAllReceipts();
  const stats = getStats();

  // Calcular ingresos totales
  const totalRevenue = receipts.reduce((sum, receipt) => {
    return sum + (parseFloat(receipt.totalAmount) || 0);
  }, 0);

  // Calcular contratos activos
  const activeContracts = contracts.filter(contract => 
    contract.status !== 'cancelled' && contract.status !== 'expired'
  );

  // Calcular crecimiento mensual
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const contractsThisMonth = contracts.filter(contract => {
    const created = new Date(contract.createdAt);
    return created.getMonth() === currentMonth && created.getFullYear() === currentYear;
  });

  const receiptsThisMonth = receipts.filter(receipt => {
    const created = new Date(receipt.createdAt);
    return created.getMonth() === currentMonth && created.getFullYear() === currentYear;
  });

  // Calcular tendencias
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
  
  const contractsLastMonth = contracts.filter(contract => {
    const created = new Date(contract.createdAt);
    return created.getMonth() === lastMonth && created.getFullYear() === lastMonthYear;
  });

  const receiptsLastMonth = receipts.filter(receipt => {
    const created = new Date(receipt.createdAt);
    return created.getMonth() === lastMonth && created.getFullYear() === lastMonthYear;
  });

  // Calcular porcentajes de crecimiento
  const contractsGrowth = contractsLastMonth.length > 0 
    ? ((contractsThisMonth.length - contractsLastMonth.length) / contractsLastMonth.length) * 100
    : contractsThisMonth.length > 0 ? 100 : 0;

  const receiptsGrowth = receiptsLastMonth.length > 0
    ? ((receiptsThisMonth.length - receiptsLastMonth.length) / receiptsLastMonth.length) * 100
    : receiptsThisMonth.length > 0 ? 100 : 0;

  // Calcular usuarios activos (usuarios únicos que han generado contratos o recibos)
  const uniqueUsers = new Set();
  
  // Agregar usuarios de contratos
  contracts.forEach(contract => {
    if (contract.createdBy) uniqueUsers.add(contract.createdBy);
    if (contract.tenantName) uniqueUsers.add(contract.tenantName);
    if (contract.ownerName) uniqueUsers.add(contract.ownerName);
  });
  
  // Agregar usuarios de recibos
  receipts.forEach(receipt => {
    if (receipt.createdBy) uniqueUsers.add(receipt.createdBy);
    if (receipt.tenantName) uniqueUsers.add(receipt.tenantName);
    if (receipt.clientName) uniqueUsers.add(receipt.clientName);
  });

  const totalUsers = uniqueUsers.size;
  const usersGrowth = totalUsers > 0 ? 5.2 : 0; // Simulado por ahora

  return {
    totalRevenue: formatCurrency(totalRevenue),
    totalRevenueRaw: totalRevenue,
    activeContracts: activeContracts.length,
    totalReceipts: receipts.length,
    contractsThisMonth: contractsThisMonth.length,
    receiptsThisMonth: receiptsThisMonth.length,
    contractsGrowth: Math.round(contractsGrowth * 10) / 10,
    receiptsGrowth: Math.round(receiptsGrowth * 10) / 10,
    totalUsers,
    usersGrowth
  };
};

/**
 * Obtiene datos de ingresos por mes
 */
export const getRevenueData = () => {
  const receipts = getAllReceipts();
  const months = [
    'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
    'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
  ];

  const currentYear = new Date().getFullYear();
  const revenueByMonth = {};

  // Inicializar todos los meses con 0
  months.forEach((month, index) => {
    revenueByMonth[index] = {
      month,
      contracts: 0,
      receipts: 0,
      total: 0
    };
  });

  // Procesar contratos
  const contracts = getAllContracts();
  contracts.forEach(contract => {
    const created = new Date(contract.createdAt);
    if (created.getFullYear() === currentYear) {
      const monthIndex = created.getMonth();
      revenueByMonth[monthIndex].contracts++;
      revenueByMonth[monthIndex].total += parseFloat(contract.monthlyPrice) || 0;
    }
  });

  // Procesar recibos
  receipts.forEach(receipt => {
    const created = new Date(receipt.createdAt);
    if (created.getFullYear() === currentYear) {
      const monthIndex = created.getMonth();
      revenueByMonth[monthIndex].receipts++;
      revenueByMonth[monthIndex].total += parseFloat(receipt.totalAmount) || 0;
    }
  });

  return Object.values(revenueByMonth);
};

/**
 * Obtiene propiedades top por ingresos
 */
export const getTopProperties = () => {
  const contracts = getAllContracts();
  const receipts = getAllReceipts();

  // Agrupar por dirección
  const propertyStats = {};

  // Procesar contratos
  contracts.forEach(contract => {
    const address = contract.propertyAddress;
    if (!propertyStats[address]) {
      propertyStats[address] = {
        name: address,
        type: contract.contractType || 'Locación',
        revenue: 0,
        contracts: 0,
        trend: 'up'
      };
    }
    propertyStats[address].revenue += parseFloat(contract.monthlyPrice) || 0;
    propertyStats[address].contracts++;
  });

  // Procesar recibos
  receipts.forEach(receipt => {
    const address = receipt.propertyAddress;
    if (!propertyStats[address]) {
      propertyStats[address] = {
        name: address,
        type: receipt.receiptType || 'Recibo',
        revenue: 0,
        contracts: 0,
        trend: 'up'
      };
    }
    propertyStats[address].revenue += parseFloat(receipt.totalAmount) || 0;
  });

  // Ordenar por ingresos y tomar top 5
  return Object.values(propertyStats)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);
};

/**
 * Obtiene distribución por tipo de documento
 */
export const getDocumentDistribution = () => {
  const contracts = getAllContracts();
  const receipts = getAllReceipts();

  const total = contracts.length + receipts.length;
  
  if (total === 0) {
    return [
      { type: 'Contratos', percentage: 0, count: 0 },
      { type: 'Recibos', percentage: 0, count: 0 }
    ];
  }

  const contractsPercentage = Math.round((contracts.length / total) * 100);
  const receiptsPercentage = 100 - contractsPercentage;

  return [
    { 
      type: 'Contratos', 
      percentage: contractsPercentage, 
      count: contracts.length 
    },
    { 
      type: 'Recibos', 
      percentage: receiptsPercentage, 
      count: receipts.length 
    }
  ];
};

/**
 * Obtiene actividad reciente
 */
export const getRecentActivity = () => {
  const contracts = getAllContracts();
  const receipts = getAllReceipts();

  // Combinar y ordenar por fecha
  const allActivities = [
    ...contracts.map(contract => ({
      type: 'contract',
      title: 'Nuevo contrato generado',
      description: `${contract.contractType} - ${contract.tenantName} - ${contract.propertyAddress}`,
      time: formatRelativeTime(new Date(contract.createdAt)),
      user: contract.createdBy || 'Sistema',
      timestamp: new Date(contract.createdAt)
    })),
    ...receipts.map(receipt => ({
      type: 'receipt',
      title: 'Recibo generado',
      description: `${receipt.receiptType || 'Recibo'} - ${receipt.tenantName || receipt.clientName} - $${receipt.totalAmount}`,
      time: formatRelativeTime(new Date(receipt.createdAt)),
      user: receipt.createdBy || 'Sistema',
      timestamp: new Date(receipt.createdAt)
    }))
  ];

  return allActivities
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 10);
};

/**
 * Formatea tiempo relativo
 */
function formatRelativeTime(date) {
  if (!date) return 'Fecha no disponible';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Verificar si la fecha es válida
  if (isNaN(dateObj.getTime())) {
    return 'Fecha inválida';
  }
  
  const now = new Date();
  const diffInSeconds = Math.floor((now - dateObj) / 1000);

  if (diffInSeconds < 60) {
    return 'Hace un momento';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `Hace ${minutes} minuto${minutes !== 1 ? 's' : ''}`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `Hace ${hours} hora${hours !== 1 ? 's' : ''}`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `Hace ${days} día${days !== 1 ? 's' : ''}`;
  }
} 