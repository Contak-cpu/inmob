import { saveReceipt } from '@/utils/database';
import { notifyReceiptCreated } from '@/utils/notifications';
import { formatCurrency, formatDate } from '@/utils/formatters';

// Función para generar recibo de alquiler
export const generateRentReceipt = (receiptData) => {
  const {
    tenantName,
    tenantDocument,
    propertyAddress,
    month,
    year,
    amount,
    expenses = 0,
    totalAmount,
    paymentMethod,
    paymentDate,
  } = receiptData;

  const total = parseFloat(amount) + parseFloat(expenses);

  return `
RECIBO DE ALQUILER

Konrad Inversiones + Desarrollos Inmobiliarios
Ameghino Nº 602, Santa Rosa, La Pampa
Tel: +54 2954 123456

Fecha: ${formatDate(paymentDate)}
Recibo Nº: ${generateReceiptNumber()}

Recibí de ${tenantName} (DNI ${tenantDocument}) la suma de ${formatCurrency(total)} 
(${numberToWords(total)} pesos) en concepto de pago de alquiler correspondiente al mes de 
${month} ${year} por la propiedad ubicada en ${propertyAddress}.

Detalle:
- Alquiler: ${formatCurrency(amount)}
- Gastos: ${formatCurrency(expenses)}
- Total: ${formatCurrency(total)}

Forma de pago: ${paymentMethod}

Firma: _________________
Germán E. Konrad
Konrad Inversiones + Desarrollos Inmobiliarios
  `;
};

// Función para generar recibo de reparación
export const generateRepairReceipt = (receiptData) => {
  const {
    clientName,
    clientDocument,
    propertyAddress,
    repairType,
    repairDate,
    repairDescription,
    materialsUsed,
    laborHours,
    materialsCost,
    laborCost,
    totalAmount,
    paymentMethod,
    warranty,
  } = receiptData;

  const total = parseFloat(materialsCost) + parseFloat(laborCost);

  return `
RECIBO DE REPARACIÓN

Konrad Inversiones + Desarrollos Inmobiliarios
Ameghino Nº 602, Santa Rosa, La Pampa
Tel: +54 2954 123456

Fecha: ${formatDate(repairDate)}
Recibo Nº: ${generateReceiptNumber()}

Recibí de ${clientName} (DNI ${clientDocument}) la suma de ${formatCurrency(total)} 
(${numberToWords(total)} pesos) en concepto de reparación realizada en la propiedad 
ubicada en ${propertyAddress}.

Detalle de la reparación:
- Tipo: ${repairType}
- Descripción: ${repairDescription}
- Materiales utilizados: ${materialsUsed}
- Horas de mano de obra: ${laborHours}
- Costo materiales: ${formatCurrency(materialsCost)}
- Costo mano de obra: ${formatCurrency(laborCost)}
- Total: ${formatCurrency(total)}

Forma de pago: ${paymentMethod}
Garantía: ${warranty} días

Firma: _________________
Germán E. Konrad
Konrad Inversiones + Desarrollos Inmobiliarios
  `;
};

// Función para generar recibo de servicios
export const generateServiceReceipt = (receiptData) => {
  const {
    clientName,
    clientDocument,
    propertyAddress,
    serviceType,
    serviceDate,
    serviceDescription,
    totalAmount,
    paymentMethod,
  } = receiptData;

  return `
RECIBO DE SERVICIOS

Konrad Inversiones + Desarrollos Inmobiliarios
Ameghino Nº 602, Santa Rosa, La Pampa
Tel: +54 2954 123456

Fecha: ${formatDate(serviceDate)}
Recibo Nº: ${generateReceiptNumber()}

Recibí de ${clientName} (DNI ${clientDocument}) la suma de ${formatCurrency(totalAmount)} 
(${numberToWords(totalAmount)} pesos) en concepto de servicios prestados en la propiedad 
ubicada en ${propertyAddress}.

Detalle del servicio:
- Tipo de servicio: ${serviceType}
- Descripción: ${serviceDescription}
- Total: ${formatCurrency(totalAmount)}

Forma de pago: ${paymentMethod}

Firma: _________________
Germán E. Konrad
Konrad Inversiones + Desarrollos Inmobiliarios
  `;
};

// Función para generar y guardar recibo
export const generateAndSaveReceipt = async (receiptData, receiptType) => {
  try {
    let receiptText = '';
    
    // Generar el recibo según el tipo
    switch (receiptType) {
      case 'alquiler':
        receiptText = generateRentReceipt(receiptData);
        break;
      case 'reparacion':
        receiptText = generateRepairReceipt(receiptData);
        break;
      case 'servicios':
        receiptText = generateServiceReceipt(receiptData);
        break;
      default:
        throw new Error('Tipo de recibo no soportado');
    }
    
    // Preparar datos para guardar
    const receiptToSave = {
      ...receiptData,
      receiptType,
      receiptText,
      status: 'active',
    };
    
    // Guardar en la base de datos
    const savedReceipt = saveReceipt(receiptToSave);
    
    // Crear notificación
    notifyReceiptCreated(savedReceipt);
    
    return {
      success: true,
      receipt: savedReceipt,
      message: 'Recibo generado y guardado exitosamente'
    };
  } catch (error) {
    // Error silencioso en producción
    if (process.env.NODE_ENV !== 'production') {
      console.error('Error al generar y guardar recibo:', error);
    }
    return {
      success: false,
      error: error.message,
      message: 'Error al generar el recibo'
    };
  }
};

// Función para generar número de recibo
const generateReceiptNumber = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${year}${month}${day}-${random}`;
};

// Función para convertir números a palabras
const numberToWords = (num) => {
  if (num === 0) return 'CERO';
  
  const ones = ['', 'UNO', 'DOS', 'TRES', 'CUATRO', 'CINCO', 'SEIS', 'SIETE', 'OCHO', 'NUEVE'];
  const teens = ['DIEZ', 'ONCE', 'DOCE', 'TRECE', 'CATORCE', 'QUINCE', 'DIECISÉIS', 'DIECISIETE', 'DIECIOCHO', 'DIECINUEVE'];
  const tens = ['', '', 'VEINTE', 'TREINTA', 'CUARENTA', 'CINCUENTA', 'SESENTA', 'SETENTA', 'OCHENTA', 'NOVENTA'];
  const hundreds = ['', 'CIENTO', 'DOSCIENTOS', 'TRESCIENTOS', 'CUATROCIENTOS', 'QUINIENTOS', 'SEISCIENTOS', 'SETECIENTOS', 'OCHOCIENTOS', 'NOVECIENTOS'];
  
  if (num < 10) return ones[num];
  if (num < 20) return teens[num - 10];
  if (num < 100) {
    return tens[Math.floor(num / 10)] + (num % 10 > 0 ? ' Y ' + ones[num % 10] : '');
  }
  if (num < 1000) {
    if (num === 100) return 'CIEN';
    return hundreds[Math.floor(num / 100)] + (num % 100 > 0 ? ' ' + numberToWords(num % 100) : '');
  }
  if (num < 1000000) {
    const thousands = Math.floor(num / 1000);
    const remainder = num % 1000;
    let result = '';
    
    if (thousands === 1) {
      result = 'MIL';
    } else {
      result = numberToWords(thousands) + ' MIL';
    }
    
    if (remainder > 0) {
      result += ' ' + numberToWords(remainder);
    }
    
    return result;
  }
  
  return 'NÚMERO MUY GRANDE';
}; 