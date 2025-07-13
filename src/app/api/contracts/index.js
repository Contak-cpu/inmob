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

let contracts = [];

export async function GET(req) {
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