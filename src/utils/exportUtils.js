import { generateReportPDF } from '@/utils/pdfGenerator';
import { getAllContracts, getAllReceipts, getStats } from '@/utils/database';

/**
 * Exporta datos a formato CSV
 */
export const exportToCSV = (data, filename) => {
  try {
    if (!data || data.length === 0) {
      throw new Error('No hay datos para exportar');
    }

    // Obtener headers del primer objeto
    const headers = Object.keys(data[0]);
    
    // Crear contenido CSV
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          // Escapar comillas y envolver en comillas si contiene coma
          const escapedValue = String(value).replace(/"/g, '""');
          return escapedValue.includes(',') ? `"${escapedValue}"` : escapedValue;
        }).join(',')
      )
    ].join('\n');

    // Crear blob y descargar
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);

    return { success: true, filename: `${filename}.csv` };
  } catch (error) {
    console.error('Error exportando a CSV:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Exporta datos a formato Excel (simulado con HTML)
 */
export const exportToExcel = (data, filename) => {
  try {
    if (!data || data.length === 0) {
      throw new Error('No hay datos para exportar');
    }

    // Crear tabla HTML
    const headers = Object.keys(data[0]);
    const tableHTML = `
      <html>
        <head>
          <meta charset="utf-8">
          <title>${filename}</title>
          <style>
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; font-weight: bold; }
          </style>
        </head>
        <body>
          <table>
            <thead>
              <tr>
                ${headers.map(header => `<th>${header}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${data.map(row => 
                `<tr>${headers.map(header => `<td>${row[header] || ''}</td>`).join('')}</tr>`
              ).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;

    // Crear blob y descargar
    const blob = new Blob([tableHTML], { type: 'application/vnd.ms-excel' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}.xls`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);

    return { success: true, filename: `${filename}.xls` };
  } catch (error) {
    console.error('Error exportando a Excel:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Exporta datos a JSON
 */
export const exportToJSON = (data, filename) => {
  try {
    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);

    return { success: true, filename: `${filename}.json` };
  } catch (error) {
    console.error('Error exportando a JSON:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Exporta reporte completo en PDF
 */
export const exportReportToPDF = async (reportType, data) => {
  try {
    const result = await generateReportPDF(data, reportType);
    return result;
  } catch (error) {
    console.error('Error exportando reporte a PDF:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Exporta contratos
 */
export const exportContracts = (format = 'csv') => {
  try {
    const contracts = getAllContracts();
    
    // Preparar datos para exportación
    const exportData = contracts.map(contract => ({
      ID: contract.id,
      Tipo: contract.contractType || 'N/A',
      Inquilino: contract.tenantName || 'N/A',
      DNI: contract.tenantDocument || 'N/A',
      Propietario: contract.ownerName || 'N/A',
      Dirección: contract.propertyAddress || 'N/A',
      Duración: `${contract.duration || 0} meses`,
      'Precio Mensual': `$${contract.monthlyPrice || 0}`,
      'Fecha de Inicio': contract.startDate || 'N/A',
      Estado: contract.status || 'activo',
      'Fecha de Creación': new Date(contract.createdAt).toLocaleDateString('es-AR')
    }));

    const filename = `contratos_konrad_${new Date().toISOString().split('T')[0]}`;

    switch (format.toLowerCase()) {
      case 'csv':
        return exportToCSV(exportData, filename);
      case 'excel':
        return exportToExcel(exportData, filename);
      case 'json':
        return exportToJSON(exportData, filename);
      case 'pdf':
        return exportReportToPDF('contratos', exportData);
      default:
        return exportToCSV(exportData, filename);
    }
  } catch (error) {
    console.error('Error exportando contratos:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Exporta recibos
 */
export const exportReceipts = (format = 'csv') => {
  try {
    const receipts = getAllReceipts();
    
    // Preparar datos para exportación
    const exportData = receipts.map(receipt => ({
      ID: receipt.id,
      Tipo: receipt.receiptType || 'N/A',
      Cliente: receipt.tenantName || receipt.clientName || 'N/A',
      DNI: receipt.tenantDocument || receipt.clientDocument || 'N/A',
      Dirección: receipt.propertyAddress || 'N/A',
      Período: receipt.period || receipt.month || 'N/A',
      'Monto Base': `$${receipt.amount || receipt.baseRent || 0}`,
      'Gastos Adicionales': `$${receipt.expenses || 0}`,
      'Monto Total': `$${receipt.totalAmount || 0}`,
      'Forma de Pago': receipt.paymentMethod || 'N/A',
      'Fecha de Pago': receipt.paymentDate || 'N/A',
      Estado: receipt.status || 'pendiente',
      'Fecha de Creación': new Date(receipt.createdAt).toLocaleDateString('es-AR')
    }));

    const filename = `recibos_konrad_${new Date().toISOString().split('T')[0]}`;

    switch (format.toLowerCase()) {
      case 'csv':
        return exportToCSV(exportData, filename);
      case 'excel':
        return exportToExcel(exportData, filename);
      case 'json':
        return exportToJSON(exportData, filename);
      case 'pdf':
        return exportReportToPDF('recibos', exportData);
      default:
        return exportToCSV(exportData, filename);
    }
  } catch (error) {
    console.error('Error exportando recibos:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Exporta estadísticas
 */
export const exportStats = (format = 'csv') => {
  try {
    const stats = getStats();
    const contracts = getAllContracts();
    const receipts = getAllReceipts();

    // Calcular estadísticas adicionales
    const totalRevenue = receipts.reduce((sum, receipt) => 
      sum + (parseFloat(receipt.totalAmount) || 0), 0
    );

    const activeContracts = contracts.filter(contract => 
      contract.status !== 'cancelled' && contract.status !== 'expired'
    );

    const exportData = [
      {
        Métrica: 'Total de Contratos',
        Valor: stats.totalContracts || 0,
        Descripción: 'Número total de contratos en el sistema'
      },
      {
        Métrica: 'Contratos Activos',
        Valor: activeContracts.length,
        Descripción: 'Contratos actualmente activos'
      },
      {
        Métrica: 'Total de Recibos',
        Valor: stats.totalReceipts || 0,
        Descripción: 'Número total de recibos generados'
      },
      {
        Métrica: 'Ingresos Totales',
        Valor: `$${totalRevenue.toLocaleString()}`,
        Descripción: 'Ingresos totales por recibos'
      },
      {
        Métrica: 'Contratos Este Mes',
        Valor: stats.contractsThisMonth || 0,
        Descripción: 'Contratos creados en el mes actual'
      },
      {
        Métrica: 'Recibos Este Mes',
        Valor: stats.receiptsThisMonth || 0,
        Descripción: 'Recibos generados en el mes actual'
      }
    ];

    const filename = `estadisticas_konrad_${new Date().toISOString().split('T')[0]}`;

    switch (format.toLowerCase()) {
      case 'csv':
        return exportToCSV(exportData, filename);
      case 'excel':
        return exportToExcel(exportData, filename);
      case 'json':
        return exportToJSON(exportData, filename);
      case 'pdf':
        return exportReportToPDF('estadisticas', exportData);
      default:
        return exportToCSV(exportData, filename);
    }
  } catch (error) {
    console.error('Error exportando estadísticas:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Exporta todo el historial
 */
export const exportHistory = (format = 'csv') => {
  try {
    const contracts = getAllContracts();
    const receipts = getAllReceipts();
    
    // Combinar historial
    const history = [
      ...contracts.map(contract => ({
        Tipo: 'Contrato',
        ID: contract.id,
        Descripción: `${contract.contractType} - ${contract.tenantName} - ${contract.propertyAddress}`,
        'Fecha de Creación': new Date(contract.createdAt).toLocaleDateString('es-AR'),
        Estado: contract.status || 'activo',
        Valor: `$${contract.monthlyPrice || 0}`
      })),
      ...receipts.map(receipt => ({
        Tipo: 'Recibo',
        ID: receipt.id,
        Descripción: `${receipt.receiptType || 'Recibo'} - ${receipt.tenantName || receipt.clientName} - $${receipt.totalAmount}`,
        'Fecha de Creación': new Date(receipt.createdAt).toLocaleDateString('es-AR'),
        Estado: receipt.status || 'pendiente',
        Valor: `$${receipt.totalAmount || 0}`
      }))
    ].sort((a, b) => new Date(b['Fecha de Creación']) - new Date(a['Fecha de Creación']));

    const filename = `historial_konrad_${new Date().toISOString().split('T')[0]}`;

    switch (format.toLowerCase()) {
      case 'csv':
        return exportToCSV(history, filename);
      case 'excel':
        return exportToExcel(history, filename);
      case 'json':
        return exportToJSON(history, filename);
      case 'pdf':
        return exportReportToPDF('historial', history);
      default:
        return exportToCSV(history, filename);
    }
  } catch (error) {
    console.error('Error exportando historial:', error);
    return { success: false, error: error.message };
  }
}; 