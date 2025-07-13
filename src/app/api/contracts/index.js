// src/app/api/contracts/index.js

import { NextResponse } from 'next/server';
// import { supabase } from '@/lib/supabaseClient';

// Estructura recomendada para la tabla contracts en Supabase:
// id: uuid (PK)
// cliente: string
// tipo: string
// fecha_inicio: date
// fecha_fin: date
// monto: number
// estado: string
// observaciones: text
// permisos: text[] (array de roles)
// archivos: jsonb (array de {nombre, url, tipo})
// creado_por: string (user_id)
// fecha_carga: timestamp

// Datos de muestra para contratos
let contracts = [
  {
    id: '1',
    cliente: 'María González',
    tipo: 'Alquiler Comercial',
    fechaInicio: '2024-01-15',
    fechaFin: '2025-01-15',
    monto: 250000,
    estado: 'Vigente',
    observaciones: 'Local comercial en zona céntrica, excelente ubicación',
    permisos: ['admin', 'manager', 'agent'],
    archivos: [
      { nombre: 'contrato_comercial.pdf', url: '#', tipo: 'pdf' },
      { nombre: 'recibo_deposito.pdf', url: '#', tipo: 'pdf' }
    ],
    creadoPor: 'admin',
    fechaCarga: '2024-01-10'
  },
  {
    id: '2',
    cliente: 'Juan Pérez',
    tipo: 'Alquiler Residencial',
    fechaInicio: '2024-02-01',
    fechaFin: '2025-02-01',
    monto: 180000,
    estado: 'Vigente',
    observaciones: 'Departamento 2 ambientes, recién pintado',
    permisos: ['admin', 'manager', 'agent', 'viewer'],
    archivos: [
      { nombre: 'contrato_residencial.pdf', url: '#', tipo: 'pdf' },
      { nombre: 'garantia_propietario.pdf', url: '#', tipo: 'pdf' }
    ],
    creadoPor: 'german',
    fechaCarga: '2024-01-25'
  },
  {
    id: '3',
    cliente: 'Empresa ABC S.A.',
    tipo: 'Alquiler Empresarial',
    fechaInicio: '2024-03-01',
    fechaFin: '2026-03-01',
    monto: 450000,
    estado: 'Vigente',
    observaciones: 'Oficina corporativa, 200m², zona empresarial',
    permisos: ['admin', 'manager'],
    archivos: [
      { nombre: 'contrato_empresarial.pdf', url: '#', tipo: 'pdf' },
      { nombre: 'certificado_empresa.pdf', url: '#', tipo: 'pdf' },
      { nombre: 'balance_empresa.pdf', url: '#', tipo: 'pdf' }
    ],
    creadoPor: 'admin',
    fechaCarga: '2024-02-15'
  },
  {
    id: '4',
    cliente: 'Carlos López',
    tipo: 'Alquiler Residencial',
    fechaInicio: '2023-12-01',
    fechaFin: '2024-12-01',
    monto: 150000,
    estado: 'Vencido',
    observaciones: 'Casa familiar, 3 dormitorios, patio',
    permisos: ['admin', 'manager', 'agent'],
    archivos: [
      { nombre: 'contrato_casa.pdf', url: '#', tipo: 'pdf' },
      { nombre: 'recibo_enero.pdf', url: '#', tipo: 'pdf' }
    ],
    creadoPor: 'agente1',
    fechaCarga: '2023-11-20'
  }
];

export async function GET(req) {
  // Verificar si se solicita modo de prueba
  const { searchParams } = new URL(req.url);
  const testMode = searchParams.get('testMode');
  
  // Si no está en modo de prueba, devolver array vacío
  if (testMode !== 'true') {
    return NextResponse.json({ contracts: [] });
  }
  
  // Ejemplo de consulta a Supabase (descomentar cuando esté listo):
  // const { data, error } = await supabase.from('contracts').select('*');
  // if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  // return NextResponse.json({ contracts: data });
  return NextResponse.json({ contracts });
}

export async function POST(req) {
  const data = await req.json();
  // Ejemplo de inserción en Supabase (descomentar cuando esté listo):
  // const { data: newContract, error } = await supabase.from('contracts').insert([data]).single();
  // if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  // return NextResponse.json({ contract: newContract }, { status: 201 });
  const newContract = { ...data, id: Date.now().toString() };
  contracts.push(newContract);
  return NextResponse.json({ contract: newContract }, { status: 201 });
} 