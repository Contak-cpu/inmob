import { CONTRACT_TYPES, COMPANY_CONFIG } from '@/lib/config';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { saveContract } from '@/utils/database';
import { notifyContractCreated, createContractExpiryReminder } from '@/utils/notifications';

// Función para generar el contrato según el tipo
export const generateContract = (contractData, contractType) => {
  const contract = CONTRACT_TYPES[contractType];
  if (!contract) {
    throw new Error('Tipo de contrato no válido');
  }

  // Determinar qué plantilla usar según el tipo
  let template = '';
  
  switch (contractType) {
    case 'comercial':
      template = generateComercialTemplate(contractData);
      break;
    case 'casa':
      template = generateCasaTemplate(contractData);
      break;
    case 'empresas':
      template = generateEmpresasTemplate(contractData);
      break;
    default:
      throw new Error('Tipo de contrato no soportado');
  }

  return template;
};

// Función para generar y guardar contrato
export const generateAndSaveContract = async (contractData, contractType) => {
  try {
    // Generar el contrato
    const contractText = generateContract(contractData, contractType);
    
    // Preparar datos para guardar
    const contractToSave = {
      ...contractData,
      contractType,
      contractText,
      status: 'active',
    };
    
    // Guardar en la base de datos
    const savedContract = saveContract(contractToSave);
    
    // Crear notificación
    notifyContractCreated(savedContract);
    
    // Crear recordatorio de vencimiento
    createContractExpiryReminder(savedContract);
    
    return {
      success: true,
      contract: savedContract,
      message: 'Contrato generado y guardado exitosamente'
    };
  } catch (error) {
    // Error silencioso en producción
    if (process.env.NODE_ENV !== 'production') {
      console.error('Error al generar y guardar contrato:', error);
    }
    return {
      success: false,
      error: error.message,
      message: 'Error al generar el contrato'
    };
  }
};

// Plantilla para Contrato Comercial
const generateComercialTemplate = (data) => {
  return `
CONTRATO DE LOCACIÓN COMERCIAL

Entre los suscritos:

POR UNA PARTE:
${data.ownerName}, DNI ${data.ownerDocument}, a quien en adelante se denominará "LOCADOR", 
domiciliado en ${data.ownerAddress || 'a convenir'}, 
teléfono ${data.ownerPhone || 'a convenir'}, 
email ${data.ownerEmail || 'a convenir'}.

POR LA OTRA PARTE:
${data.tenantName}, DNI ${data.tenantDocument}, a quien en adelante se denominará "LOCATARIO", 
domiciliado en ${data.tenantAddress || 'a convenir'}, 
teléfono ${data.tenantPhone || 'a convenir'}, 
email ${data.tenantEmail || 'a convenir'}.

CONSIDERANDO:

PRIMERO: Que el LOCADOR es propietario del inmueble ubicado en ${data.propertyAddress}, 
constituido por ${data.propertyType} de ${data.surface || 'superficie a convenir'} m², 
con ${data.rooms || 'cantidad de ambientes a convenir'} ambientes.

SEGUNDO: Que las partes acuerdan celebrar un contrato de locación comercial por el plazo 
de ${data.duration} meses, a partir del ${formatDate(data.startDate)}.

TERCERO: Que el precio mensual acordado es de ${formatCurrency(data.monthlyPrice)} 
(${data.monthlyPrice} pesos), con ajuste según ${data.adjustmentType}.

CLÁUSULAS:

PRIMERA - OBJETO: El LOCADOR cede en locación al LOCATARIO el inmueble descripto, 
para uso exclusivamente comercial.

SEGUNDA - PLAZO: El contrato tendrá una duración de ${data.duration} meses, 
iniciándose el ${formatDate(data.startDate)}.

TERCERA - PRECIO: El precio mensual es de ${formatCurrency(data.monthlyPrice)} 
(${data.monthlyPrice} pesos), pagadero por adelantado, con ajuste según ${data.adjustmentType}.

CUARTA - DEPÓSITO: Se establece un depósito de ${data.deposit} mes(es) 
(${formatCurrency(data.monthlyPrice * data.deposit)}), que será devuelto al finalizar el contrato.

QUINTA - GARANTES: ${data.guarantor1Name ? `Garante 1: ${data.guarantor1Name}, DNI ${data.guarantor1Document}` : 'Sin garantes'}.
${data.guarantor2Name ? `Garante 2: ${data.guarantor2Name}, DNI ${data.guarantor2Document}` : ''}

SEXTA - GASTOS: Los gastos de servicios están incluidos según lo siguiente: ${data.expensesIncluded || 'a convenir'}.

SÉPTIMA - MASCOTAS: ${data.petsAllowed === 'si' ? 'Se permiten mascotas' : data.petsAllowed === 'no' ? 'No se permiten mascotas' : 'Consultar sobre mascotas'}.

OCTAVA - OBSERVACIONES: ${data.observations || 'Sin observaciones especiales'}.

NOVENA - FIRMAS: En prueba de conformidad, se firma el presente contrato en ${data.contractLocation || 'Buenos Aires'} el día ${formatDate(new Date())}.

LOCADOR: _________________     LOCATARIO: _________________
DNI: ${data.ownerDocument}     DNI: ${data.tenantDocument}

${data.guarantor1Name ? `GARANTE 1: _________________` : ''}
${data.guarantor1Name ? `DNI: ${data.guarantor1Document}` : ''}

${data.guarantor2Name ? `GARANTE 2: _________________` : ''}
${data.guarantor2Name ? `DNI: ${data.guarantor2Document}` : ''}

${COMPANY_CONFIG.companyName}
Mat. ${COMPANY_CONFIG.realtorNumber}
  `;
};

// Plantilla para Contrato Casa
const generateCasaTemplate = (data) => {
  return `
CONTRATO DE LOCACIÓN DE VIVIENDA FAMILIAR

Entre los suscritos:

POR UNA PARTE:
${data.ownerName}, DNI ${data.ownerDocument}, a quien en adelante se denominará "LOCADOR", 
domiciliado en ${data.ownerAddress || 'a convenir'}, 
teléfono ${data.ownerPhone || 'a convenir'}, 
email ${data.ownerEmail || 'a convenir'}.

POR LA OTRA PARTE:
${data.tenantName}, DNI ${data.tenantDocument}, a quien en adelante se denominará "LOCATARIO", 
domiciliado en ${data.tenantAddress || 'a convenir'}, 
teléfono ${data.tenantPhone || 'a convenir'}, 
email ${data.tenantEmail || 'a convenir'}.

CONSIDERANDO:

PRIMERO: Que el LOCADOR es propietario del inmueble ubicado en ${data.propertyAddress}, 
constituido por ${data.propertyType} de ${data.surface || 'superficie a convenir'} m², 
con ${data.rooms || 'cantidad de ambientes a convenir'} ambientes.

SEGUNDO: Que las partes acuerdan celebrar un contrato de locación de vivienda familiar 
por el plazo de ${data.duration} meses, a partir del ${formatDate(data.startDate)}.

TERCERO: Que el precio mensual acordado es de ${formatCurrency(data.monthlyPrice)} 
(${data.monthlyPrice} pesos), con ajuste según ${data.adjustmentType}.

CLÁUSULAS:

PRIMERA - OBJETO: El LOCADOR cede en locación al LOCATARIO el inmueble descripto, 
para uso exclusivamente familiar.

SEGUNDA - PLAZO: El contrato tendrá una duración de ${data.duration} meses, 
iniciándose el ${formatDate(data.startDate)}.

TERCERA - PRECIO: El precio mensual es de ${formatCurrency(data.monthlyPrice)} 
(${data.monthlyPrice} pesos), pagadero por adelantado, con ajuste según ${data.adjustmentType}.

CUARTA - DEPÓSITO: Se establece un depósito de ${data.deposit} mes(es) 
(${formatCurrency(data.monthlyPrice * data.deposit)}), que será devuelto al finalizar el contrato.

QUINTA - GARANTES: ${data.guarantor1Name ? `Garante 1: ${data.guarantor1Name}, DNI ${data.guarantor1Document}` : 'Sin garantes'}.
${data.guarantor2Name ? `Garante 2: ${data.guarantor2Name}, DNI ${data.guarantor2Document}` : ''}

SEXTA - GASTOS: Los gastos de servicios están incluidos según lo siguiente: ${data.expensesIncluded || 'a convenir'}.

SÉPTIMA - MASCOTAS: ${data.petsAllowed === 'si' ? 'Se permiten mascotas' : data.petsAllowed === 'no' ? 'No se permiten mascotas' : 'Consultar sobre mascotas'}.

OCTAVA - OBSERVACIONES: ${data.observations || 'Sin observaciones especiales'}.

NOVENA - FIRMAS: En prueba de conformidad, se firma el presente contrato en ${data.contractLocation || 'Buenos Aires'} el día ${formatDate(new Date())}.

LOCADOR: _________________     LOCATARIO: _________________
DNI: ${data.ownerDocument}     DNI: ${data.tenantDocument}

${data.guarantor1Name ? `GARANTE 1: _________________` : ''}
${data.guarantor1Name ? `DNI: ${data.guarantor1Document}` : ''}

${data.guarantor2Name ? `GARANTE 2: _________________` : ''}
${data.guarantor2Name ? `DNI: ${data.guarantor2Document}` : ''}

${COMPANY_CONFIG.companyName}
Mat. ${COMPANY_CONFIG.realtorNumber}
  `;
};

// Plantilla para Contrato Empresarial
const generateEmpresasTemplate = (data) => {
  return `
CONTRATO DE LOCACIÓN EMPRESARIAL

Entre los suscritos:

POR UNA PARTE:
${data.ownerName}, DNI ${data.ownerDocument}, a quien en adelante se denominará "LOCADOR", 
domiciliado en ${data.ownerAddress || 'a convenir'}, 
teléfono ${data.ownerPhone || 'a convenir'}, 
email ${data.ownerEmail || 'a convenir'}.

POR LA OTRA PARTE:
${data.tenantName}, DNI ${data.tenantDocument}, a quien en adelante se denominará "LOCATARIO", 
domiciliado en ${data.tenantAddress || 'a convenir'}, 
teléfono ${data.tenantPhone || 'a convenir'}, 
email ${data.tenantEmail || 'a convenir'}.

CONSIDERANDO:

PRIMERO: Que el LOCADOR es propietario del inmueble ubicado en ${data.propertyAddress}, 
constituido por ${data.propertyType} de ${data.surface || 'superficie a convenir'} m², 
con ${data.rooms || 'cantidad de ambientes a convenir'} ambientes.

SEGUNDO: Que las partes acuerdan celebrar un contrato de locación empresarial 
por el plazo de ${data.duration} meses, a partir del ${formatDate(data.startDate)}.

TERCERO: Que el precio mensual acordado es de ${formatCurrency(data.monthlyPrice)} 
(${data.monthlyPrice} pesos), con ajuste según ${data.adjustmentType}.

CLÁUSULAS:

PRIMERA - OBJETO: El LOCADOR cede en locación al LOCATARIO el inmueble descripto, 
para uso exclusivamente empresarial.

SEGUNDA - PLAZO: El contrato tendrá una duración de ${data.duration} meses, 
iniciándose el ${formatDate(data.startDate)}.

TERCERA - PRECIO: El precio mensual es de ${formatCurrency(data.monthlyPrice)} 
(${data.monthlyPrice} pesos), pagadero por adelantado, con ajuste según ${data.adjustmentType}.

CUARTA - DEPÓSITO: Se establece un depósito de ${data.deposit} mes(es) 
(${formatCurrency(data.monthlyPrice * data.deposit)}), que será devuelto al finalizar el contrato.

QUINTA - GARANTES: ${data.guarantor1Name ? `Garante 1: ${data.guarantor1Name}, DNI ${data.guarantor1Document}` : 'Sin garantes'}.
${data.guarantor2Name ? `Garante 2: ${data.guarantor2Name}, DNI ${data.guarantor2Document}` : ''}

SEXTA - GASTOS: Los gastos de servicios están incluidos según lo siguiente: ${data.expensesIncluded || 'a convenir'}.

SÉPTIMA - MASCOTAS: ${data.petsAllowed === 'si' ? 'Se permiten mascotas' : data.petsAllowed === 'no' ? 'No se permiten mascotas' : 'Consultar sobre mascotas'}.

OCTAVA - OBSERVACIONES: ${data.observations || 'Sin observaciones especiales'}.

NOVENA - FIRMAS: En prueba de conformidad, se firma el presente contrato en ${data.contractLocation || 'Buenos Aires'} el día ${formatDate(new Date())}.

LOCADOR: _________________     LOCATARIO: _________________
DNI: ${data.ownerDocument}     DNI: ${data.tenantDocument}

${data.guarantor1Name ? `GARANTE 1: _________________` : ''}
${data.guarantor1Name ? `DNI: ${data.guarantor1Document}` : ''}

${data.guarantor2Name ? `GARANTE 2: _________________` : ''}
${data.guarantor2Name ? `DNI: ${data.guarantor2Document}` : ''}

${COMPANY_CONFIG.companyName}
Mat. ${COMPANY_CONFIG.realtorNumber}
  `;
};



// Función para descargar el contrato como archivo
export const downloadContract = (contractText, fileName) => {
  const blob = new Blob([contractText], { type: 'text/plain;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}; 