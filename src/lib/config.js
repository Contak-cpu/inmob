// Configuración de la empresa
export const COMPANY_CONFIG = {
  companyName: 'KONRAD Inversiones + Desarrollos Inmobiliarios',
  companyAddress: 'calle AMEGHINO Nº 602, Santa Rosa, La Pampa',
  companyPhone: '+54 2954 123456',
  companyEmail: 'info@konradinmobiliaria.com',
  companyCuit: '20-12345678-9',
  realtorName: 'Germán E. Konrad',
  realtorNumber: '573',
};

// Configuración de tipos de contratos
export const CONTRACT_TYPES = {
  locacion: {
    name: 'Contrato de Locación',
    description: 'Alquiler de vivienda familiar',
    icon: 'Building',
  },
  comercial: {
    name: 'Contrato Comercial',
    description: 'Alquiler para uso comercial',
    icon: 'Store',
  },
};

// Configuración de tipos de recibos
export const RECEIPT_TYPES = {
  alquiler: {
    name: 'Alquiler',
    description: 'Recibo de alquiler mensual',
    icon: 'Home',
  },
  expensas: {
    name: 'Expensas',
    description: 'Recibo de expensas',
    icon: 'Building',
  },
  reparacion: {
    name: 'Reparación',
    description: 'Recibo de reparaciones',
    icon: 'Wrench',
  },
  servicios: {
    name: 'Servicios',
    description: 'Recibo de servicios',
    icon: 'Settings',
  },
  otros: {
    name: 'Otros',
    description: 'Otros conceptos',
    icon: 'FileText',
  },
};

// Configuración de ajustes de contrato
export const ADJUSTMENT_TYPES = {
  CVS_CER: {
    name: 'CVS CER',
    description: 'Coeficiente de Variación Salarial CER',
  },
  CVS_ICL: {
    name: 'CVS ICL',
    description: 'Coeficiente de Variación Salarial ICL',
  },
  DNU_IPC: {
    name: 'DNU IPC',
    description: 'Decreto de Necesidad y Urgencia IPC',
  },
  DNU_ICL: {
    name: 'DNU ICL',
    description: 'Decreto de Necesidad y Urgencia ICL',
  },
};

// Configuración de duración de contratos
export const CONTRACT_DURATIONS = [
  { value: '12', label: '12 meses' },
  { value: '24', label: '24 meses' },
  { value: '36', label: '36 meses' },
  { value: '48', label: '48 meses' },
  { value: '60', label: '60 meses' },
];

// Configuración de validaciones
export const VALIDATION_CONFIG = {
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedFileTypes: ['.docx', '.doc', '.pdf'],
  maxItemsPerReceipt: 10,
  maxDescriptionLength: 500,
};

// Configuración de seguridad
export const SECURITY_CONFIG = {
  maxLoginAttempts: 3,
  sessionTimeout: 30 * 60 * 1000, // 30 minutos
  passwordMinLength: 8,
  requireSpecialChars: true,
};

// Configuración de la aplicación
export const APP_CONFIG = {
  name: 'KONRAD Inmobiliaria',
  version: '1.0.0',
  environment: process.env.NODE_ENV || 'development',
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  maxUploadSize: 10 * 1024 * 1024, // 10MB
  supportedLanguages: ['es'],
  defaultLanguage: 'es',
}; 