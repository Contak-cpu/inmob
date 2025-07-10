// Función para convertir números a palabras en español
export const numberToWords = (num) => {
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
  
  if (num < 1000000000) {
    const millions = Math.floor(num / 1000000);
    const remainder = num % 1000000;
    let result = '';
    
    if (millions === 1) {
      result = 'UN MILLÓN';
    } else {
      result = numberToWords(millions) + ' MILLONES';
    }
    
    if (remainder > 0) {
      result += ' ' + numberToWords(remainder);
    }
    
    return result;
  }
  
  return 'NÚMERO MUY GRANDE';
};

// Función para formatear moneda argentina
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Función para formatear fechas en español
export const formatDate = (date) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('es-AR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Función para formatear fecha corta
export const formatShortDate = (date) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

// Función para capitalizar texto
export const capitalize = (text) => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

// Función para generar número de recibo
export const generateReceiptNumber = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${year}${month}${day}-${random}`;
};

// Función para generar nombre de item automático
export const generateItemName = (description, type) => {
  const desc = description.toLowerCase().trim();
  
  // Patrones comunes para alquileres
  if (type === 'alquiler' || desc.includes('alquiler') || desc.includes('renta')) {
    if (desc.includes('mes') || desc.includes('mensual')) {
      const month = new Date().toLocaleDateString('es-AR', { month: 'long', year: 'numeric' });
      return `Alquiler mensual - ${month.charAt(0).toUpperCase() + month.slice(1)}`;
    }
    return 'Alquiler de inmueble';
  }
  
  // Patrones para expensas
  if (type === 'expensas' || desc.includes('expensa') || desc.includes('expensas') || desc.includes('consorcio')) {
    const month = new Date().toLocaleDateString('es-AR', { month: 'long', year: 'numeric' });
    return `Expensas - ${month.charAt(0).toUpperCase() + month.slice(1)}`;
  }
  
  // Patrones para reparaciones
  if (type === 'reparacion' || desc.includes('reparac') || desc.includes('arreglo') || desc.includes('mantenimiento')) {
    if (desc.includes('plomería') || desc.includes('cañería') || desc.includes('agua')) {
      return 'Reparación de plomería';
    }
    if (desc.includes('eléctric') || desc.includes('luz') || desc.includes('cable')) {
      return 'Reparación eléctrica';
    }
    if (desc.includes('pintura') || desc.includes('pintar')) {
      return 'Trabajos de pintura';
    }
    if (desc.includes('techo') || desc.includes('goteras')) {
      return 'Reparación de techo';
    }
    if (desc.includes('puerta') || desc.includes('ventana')) {
      return 'Reparación de aberturas';
    }
    return 'Reparación y mantenimiento';
  }
  
  // Patrones para servicios
  if (desc.includes('limpieza')) return 'Servicio de limpieza';
  if (desc.includes('seguridad')) return 'Servicio de seguridad';
  if (desc.includes('jardinería') || desc.includes('jardín')) return 'Servicio de jardinería';
  if (desc.includes('administración')) return 'Gastos de administración';
  
  // Fallback: capitalizar la primera letra
  return description.charAt(0).toUpperCase() + description.slice(1);
};

// Función para limpiar y formatear DNI
export const formatDni = (dni) => {
  return dni.replace(/[^\d]/g, '');
};

// Función para validar y formatear email
export const formatEmail = (email) => {
  return email.toLowerCase().trim();
};

// Función para formatear teléfono
export const formatPhone = (phone) => {
  return phone.replace(/[^\d\s\-\+\(\)]/g, '');
}; 