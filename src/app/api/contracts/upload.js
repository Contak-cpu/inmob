// src/app/api/contracts/upload.js

import { NextResponse } from 'next/server';
// import { supabase } from '@/lib/supabaseClient';

// Estructura recomendada para el bucket de archivos en Supabase:
// Bucket: contracts
// Cada archivo se sube con un nombre único (por ejemplo, contractId/nombre.pdf)
// Guardar la URL pública en la tabla contracts.archivos

export async function POST(req) {
  // Ejemplo de subida a Supabase Storage (descomentar cuando esté listo):
  // const formData = await req.formData();
  // const file = formData.get('file');
  // const { data, error } = await supabase.storage.from('contracts').upload(`contractId/${file.name}`, file);
  // if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  // const url = supabase.storage.from('contracts').getPublicUrl(`contractId/${file.name}`).publicURL;
  // return NextResponse.json({ url, nombre: file.name, tipo: file.type }, { status: 201 });

  // Simulación:
  return NextResponse.json({
    url: '/mock/archivo-subido.pdf',
    nombre: 'archivo-subido.pdf',
    tipo: 'pdf',
  }, { status: 201 });
} 