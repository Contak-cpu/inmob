// Tipos para el generador de contratos
export interface ContractFormData {
  // Datos del inmueble
  propertyAddress: string;
  propertyDescription: string;
  municipalReference: string;
  parcelNumber: string;
  
  // Datos del locador/vendedor
  ownerName: string;
  ownerDni: string;
  ownerAddress: string;
  ownerEmail: string;
  
  // Datos del locatario/comprador
  tenantName: string;
  tenantDni: string;
  tenantAddress: string;
  tenantEmail: string;
  familyMembers: string;
  
  // Garantes
  guarantor1Name: string;
  guarantor1Dni: string;
  guarantor1Address: string;
  guarantor1Email: string;
  guarantor1Job: string;
  guarantor2Name: string;
  guarantor2Dni: string;
  guarantor2Address: string;
  guarantor2Email: string;
  guarantor2Job: string;
  
  // Condiciones económicas
  monthlyAmount: string;
  depositAmount: string;
  startDate: string;
  endDate: string;
  contractDuration: string;
  adjustmentType: 'CVS_CER' | 'CVS_ICL' | 'DNU_IPC' | 'DNU_ICL';
  
  // Datos de la inmobiliaria
  realtorName: string;
  realtorNumber: string;
  realtyCompany: string;
  realtyAddress: string;
}

export type ContractType = 'locacion' | 'comercial';

export interface FieldValidation {
  [key: string]: string;
}

export interface TouchedFields {
  [key: string]: boolean;
}

// Tipos para el generador de recibos
export interface ReceiptItem {
  description: string;
  amount: string;
  generatedName: string;
}

export interface ClientData {
  name: string;
  dni: string;
  address: string;
  propertyAddress: string;
}

export interface ImmobiliaryData {
  name: string;
  address: string;
  phone: string;
  email: string;
  cuit: string;
}

export type ReceiptType = 'alquiler' | 'expensas' | 'reparacion' | 'servicios' | 'otros';

// Tipos para validaciones
export interface ValidationResult {
  isValid: boolean;
  errors: FieldValidation;
}

// Tipos para el estado de la aplicación
export interface AppState {
  currentStep: string;
  isLoading: boolean;
  error: string | null;
}

// Tipos para archivos
export interface FileUpload {
  file: File;
  name: string;
  size: number;
  type: string;
}

// Tipos para configuración
export interface AppConfig {
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;
  companyCuit: string;
  realtorName: string;
  realtorNumber: string;
} 