import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Genera un PDF a partir de un elemento HTML
 */
export const generatePDFFromElement = async (element, filename = 'documento.pdf', options = {}) => {
  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      ...options
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 295; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    // Add first page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Add additional pages if needed
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(filename);
    return { success: true, filename };
  } catch (error) {
    console.error('Error generando PDF:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Genera un PDF de contrato
 */
export const generateContractPDF = async (contractData, contractType) => {
  try {
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    // Configuración de fuentes
    pdf.setFont('helvetica');
    pdf.setFontSize(12);
    
    // Título
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.text('KONRAD INMOBILIARIA', 105, 20, { align: 'center' });
    
    pdf.setFontSize(14);
    pdf.text('CONTRATO DE LOCACIÓN', 105, 30, { align: 'center' });
    
    // Información del contrato
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    
    let yPosition = 50;
    
    // Datos del inquilino
    pdf.setFont('helvetica', 'bold');
    pdf.text('DATOS DEL INQUILINO:', 20, yPosition);
    yPosition += 10;
    
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Nombre: ${contractData.tenantName || 'N/A'}`, 20, yPosition);
    yPosition += 7;
    pdf.text(`DNI: ${contractData.tenantDocument || 'N/A'}`, 20, yPosition);
    yPosition += 7;
    pdf.text(`Teléfono: ${contractData.tenantPhone || 'N/A'}`, 20, yPosition);
    yPosition += 15;
    
    // Datos del propietario
    pdf.setFont('helvetica', 'bold');
    pdf.text('DATOS DEL PROPIETARIO:', 20, yPosition);
    yPosition += 10;
    
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Nombre: ${contractData.ownerName || 'N/A'}`, 20, yPosition);
    yPosition += 7;
    pdf.text(`DNI: ${contractData.ownerDocument || 'N/A'}`, 20, yPosition);
    yPosition += 15;
    
    // Datos del inmueble
    pdf.setFont('helvetica', 'bold');
    pdf.text('DATOS DEL INMUEBLE:', 20, yPosition);
    yPosition += 10;
    
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Dirección: ${contractData.propertyAddress || 'N/A'}`, 20, yPosition);
    yPosition += 7;
    pdf.text(`Tipo: ${contractType || 'N/A'}`, 20, yPosition);
    yPosition += 15;
    
    // Términos del contrato
    pdf.setFont('helvetica', 'bold');
    pdf.text('TÉRMINOS DEL CONTRATO:', 20, yPosition);
    yPosition += 10;
    
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Duración: ${contractData.duration || 'N/A'} meses`, 20, yPosition);
    yPosition += 7;
    pdf.text(`Precio mensual: $${contractData.monthlyPrice || 'N/A'}`, 20, yPosition);
    yPosition += 7;
    pdf.text(`Fecha de inicio: ${contractData.startDate || 'N/A'}`, 20, yPosition);
    yPosition += 15;
    
    // Pie de página
    pdf.setFontSize(10);
    pdf.text('KONRAD Inversiones + Desarrollos Inmobiliarios', 105, 280, { align: 'center' });
    pdf.text('Mat. 573 - Sistema de Gestión Inmobiliaria', 105, 285, { align: 'center' });
    
    const filename = `contrato_${contractData.tenantName?.replace(/\s+/g, '_') || 'konrad'}_${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(filename);
    
    return { success: true, filename };
  } catch (error) {
    console.error('Error generando PDF del contrato:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Genera un PDF de recibo
 */
export const generateReceiptPDF = async (receiptData, receiptType) => {
  try {
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    // Configuración de fuentes
    pdf.setFont('helvetica');
    pdf.setFontSize(12);
    
    // Título
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.text('KONRAD INMOBILIARIA', 105, 20, { align: 'center' });
    
    pdf.setFontSize(14);
    pdf.text('RECIBO DE PAGO', 105, 30, { align: 'center' });
    
    // Información del recibo
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    
    let yPosition = 50;
    
    // Datos del cliente
    pdf.setFont('helvetica', 'bold');
    pdf.text('DATOS DEL CLIENTE:', 20, yPosition);
    yPosition += 10;
    
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Nombre: ${receiptData.tenantName || receiptData.clientName || 'N/A'}`, 20, yPosition);
    yPosition += 7;
    pdf.text(`DNI: ${receiptData.tenantDocument || receiptData.clientDocument || 'N/A'}`, 20, yPosition);
    yPosition += 15;
    
    // Datos del recibo
    pdf.setFont('helvetica', 'bold');
    pdf.text('DETALLES DEL RECIBO:', 20, yPosition);
    yPosition += 10;
    
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Tipo: ${receiptType || 'N/A'}`, 20, yPosition);
    yPosition += 7;
    pdf.text(`Período: ${receiptData.period || receiptData.month || 'N/A'} ${receiptData.year || 'N/A'}`, 20, yPosition);
    yPosition += 7;
    pdf.text(`Dirección: ${receiptData.propertyAddress || 'N/A'}`, 20, yPosition);
    yPosition += 15;
    
    // Montos
    pdf.setFont('helvetica', 'bold');
    pdf.text('DETALLE DE MONTOS:', 20, yPosition);
    yPosition += 10;
    
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Monto base: $${receiptData.amount || receiptData.baseRent || '0'}`, 20, yPosition);
    yPosition += 7;
    
    if (receiptData.expenses) {
      pdf.text(`Gastos adicionales: $${receiptData.expenses}`, 20, yPosition);
      yPosition += 7;
    }
    
    pdf.setFont('helvetica', 'bold');
    pdf.text(`TOTAL: $${receiptData.totalAmount || '0'}`, 20, yPosition);
    yPosition += 15;
    
    // Información adicional
    if (receiptData.paymentMethod) {
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Forma de pago: ${receiptData.paymentMethod}`, 20, yPosition);
      yPosition += 7;
    }
    
    if (receiptData.paymentDate) {
      pdf.text(`Fecha de pago: ${receiptData.paymentDate}`, 20, yPosition);
      yPosition += 7;
    }
    
    // Pie de página
    pdf.setFontSize(10);
    pdf.text('KONRAD Inversiones + Desarrollos Inmobiliarios', 105, 280, { align: 'center' });
    pdf.text('Mat. 573 - Sistema de Gestión Inmobiliaria', 105, 285, { align: 'center' });
    
    const filename = `recibo_${receiptData.tenantName?.replace(/\s+/g, '_') || 'konrad'}_${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(filename);
    
    return { success: true, filename };
  } catch (error) {
    console.error('Error generando PDF del recibo:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Genera un PDF de reporte/estadísticas
 */
export const generateReportPDF = async (data, reportType) => {
  try {
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    // Configuración de fuentes
    pdf.setFont('helvetica');
    pdf.setFontSize(12);
    
    // Título
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.text('KONRAD INMOBILIARIA', 105, 20, { align: 'center' });
    
    pdf.setFontSize(14);
    pdf.text(`REPORTE DE ${reportType.toUpperCase()}`, 105, 30, { align: 'center' });
    
    // Información del reporte
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    
    let yPosition = 50;
    
    // Fecha del reporte
    pdf.text(`Fecha: ${new Date().toLocaleDateString('es-AR')}`, 20, yPosition);
    yPosition += 15;
    
    // Contenido del reporte
    if (data && typeof data === 'object') {
      Object.entries(data).forEach(([key, value]) => {
        if (yPosition > 250) {
          pdf.addPage();
          yPosition = 20;
        }
        
        pdf.setFont('helvetica', 'bold');
        pdf.text(`${key}:`, 20, yPosition);
        yPosition += 7;
        
        pdf.setFont('helvetica', 'normal');
        pdf.text(`${value}`, 30, yPosition);
        yPosition += 10;
      });
    }
    
    // Pie de página
    pdf.setFontSize(10);
    pdf.text('KONRAD Inversiones + Desarrollos Inmobiliarios', 105, 280, { align: 'center' });
    pdf.text('Mat. 573 - Sistema de Gestión Inmobiliaria', 105, 285, { align: 'center' });
    
    const filename = `reporte_${reportType}_${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(filename);
    
    return { success: true, filename };
  } catch (error) {
    console.error('Error generando PDF del reporte:', error);
    return { success: false, error: error.message };
  }
}; 