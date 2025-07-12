import { COMPANY_CONFIG } from '@/lib/config';

// Mapeo de tipos de contrato a plantillas existentes
export const TEMPLATE_MAPPING = {
  comercial: 'CONTRATO COMERCIAL- IPC.docx',
  casa: 'CONTRATO - CASA DNU ICL.docx',
  empresas: 'CONTRATO 2023- CASA para EMPRESAS.docx',
};

// Función para obtener la plantilla correspondiente
export const getTemplatePath = (contractType) => {
  return TEMPLATE_MAPPING[contractType] || null;
};

// Función para validar si existe la plantilla
export const validateTemplate = (contractType) => {
  return TEMPLATE_MAPPING.hasOwnProperty(contractType);
};

// Función para generar nombre de archivo
export const generateFileName = (contractType, data) => {
  const date = new Date().toISOString().split('T')[0];
  const tenantName = data.tenantName?.replace(/[^a-zA-Z0-9]/g, '_') || 'inquilino';
  const propertyAddress = data.propertyAddress?.replace(/[^a-zA-Z0-9]/g, '_') || 'propiedad';
  
  return `CONTRATO_${contractType.toUpperCase()}_${tenantName}_${propertyAddress}_${date}.docx`;
};

// Función para preparar datos para la plantilla
export const prepareTemplateData = (contractData, contractType) => {
  const baseData = {
    // Datos de la empresa
    companyName: COMPANY_CONFIG.companyName,
    companyAddress: COMPANY_CONFIG.companyAddress,
    companyPhone: COMPANY_CONFIG.companyPhone,
    companyEmail: COMPANY_CONFIG.companyEmail,
    realtorName: COMPANY_CONFIG.realtorName,
    
    // Datos del contrato
    contractType: contractType,
    contractDate: new Date().toLocaleDateString('es-AR'),
    
    // Datos de la propiedad
    propertyAddress: contractData.propertyAddress,
    propertyType: contractData.propertyType,
    surface: contractData.surface,
    rooms: contractData.rooms,
    
    // Datos del propietario
    ownerName: contractData.ownerName,
    ownerDocument: contractData.ownerDocument,
    ownerPhone: contractData.ownerPhone,
    ownerEmail: contractData.ownerEmail,
    ownerAddress: contractData.ownerAddress,
    
    // Datos del inquilino
    tenantName: contractData.tenantName,
    tenantDocument: contractData.tenantDocument,
    tenantPhone: contractData.tenantPhone,
    tenantEmail: contractData.tenantEmail,
    tenantAddress: contractData.tenantAddress,
    
    // Datos del contrato
    duration: contractData.duration,
    startDate: contractData.startDate,
    monthlyPrice: contractData.monthlyPrice,
    deposit: contractData.deposit,
    adjustmentType: contractData.adjustmentType,
    
    // Garantes
    guarantor1Name: contractData.guarantor1Name,
    guarantor1Document: contractData.guarantor1Document,
    guarantor2Name: contractData.guarantor2Name,
    guarantor2Document: contractData.guarantor2Document,
    
    // Otros datos
    expensesIncluded: contractData.expensesIncluded,
    petsAllowed: contractData.petsAllowed,
    observations: contractData.observations,
    contractLocation: contractData.contractLocation,
  };
  
  return baseData;
};

// Función para validar datos requeridos para la plantilla
export const validateTemplateData = (data, contractType) => {
  const requiredFields = [
    'propertyAddress',
    'propertyType',
    'ownerName',
    'ownerDocument',
    'tenantName',
    'tenantDocument',
    'duration',
    'startDate',
    'monthlyPrice',
    'deposit',
    'adjustmentType'
  ];
  
  const missingFields = requiredFields.filter(field => !data[field]);
  
  if (missingFields.length > 0) {
    return {
      isValid: false,
      missingFields,
      message: `Faltan los siguientes campos: ${missingFields.join(', ')}`
    };
  }
  
  return {
    isValid: true,
    missingFields: [],
    message: 'Datos válidos para la plantilla'
  };
}; 