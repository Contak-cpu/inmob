# 🏠 Konrad Inmobiliaria - Generador de Contratos y Recibos

Aplicación web moderna para la gestión de contratos inmobiliarios y generación de recibos de pago. Desarrollada con Next.js 14, TypeScript y Tailwind CSS.

## ✨ Características

- **Generador de Contratos**: Creación automática de contratos inmobiliarios
- **Generador de Recibos**: Sistema de recibos de pago profesional
- **Diseño Responsivo**: Optimizado para todos los dispositivos
- **Interfaz Moderna**: UI/UX intuitiva y profesional
- **Exportación PDF**: Generación de documentos en formato PDF
- **Colores Sólidos**: Paleta de colores estable sin gradientes

## 🚀 Tecnologías

- **Framework**: Next.js 14
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS
- **PDF**: jsPDF + html2canvas
- **Iconos**: Lucide React
- **Deploy**: Vercel

## 🎨 Paleta de Colores

- **Primario**: Azul marino (#1e3a8a)
- **Secundario**: Dorado (#f59e0b)
- **Éxito**: Verde (#10b981)
- **Error**: Rojo (#ef4444)
- **Neutral**: Grises sólidos

## 📦 Instalación

```bash
# Clonar el repositorio
git clone https://github.com/Contak-cpu/inmob.git
cd inmob

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev
```

## 🔧 Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Construcción para producción
npm run start        # Servidor de producción
npm run lint         # Verificación de código
npm run type-check   # Verificación de tipos TypeScript
```

## 🌐 Despliegue en Vercel

El proyecto está configurado para despliegue automático en Vercel:

1. **Push a `develop`**: Ejecuta tests y despliega automáticamente
2. **Push a `main`**: Despliegue de producción
3. **Configuración automática**: Next.js detectado automáticamente

### Variables de Entorno

```env
# Configuración de producción
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://tu-dominio.vercel.app
```

## 📁 Estructura del Proyecto

```
src/
├── app/                    # App Router de Next.js 14
│   ├── contracts/         # Páginas de contratos
│   ├── receipts/          # Páginas de recibos
│   ├── globals.css        # Estilos globales
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Página principal
├── components/            # Componentes reutilizables
│   ├── ContractForm.tsx   # Formulario de contratos
│   ├── ReceiptForm.tsx    # Formulario de recibos
│   ├── ReceiptPreview.tsx # Vista previa de recibos
│   └── PictoNSignature.tsx # Firma pictoN
├── lib/                   # Utilidades y configuración
│   └── config.ts          # Configuración de la app
├── types/                 # Definiciones de tipos TypeScript
│   └── index.ts           # Tipos principales
└── utils/                 # Funciones utilitarias
    ├── formatters.ts      # Formateo de datos
    └── validations.ts     # Validaciones
```

## 🎯 Funcionalidades Principales

### Generador de Contratos
- Formularios dinámicos según tipo de contrato
- Validación en tiempo real
- Vista previa antes de generar
- Exportación a PDF profesional

### Generador de Recibos
- Múltiples tipos de recibos
- Cálculos automáticos
- Diseño profesional
- Firma digital pictoN

## 🔒 Seguridad

- Validación de entrada en cliente y servidor
- Sanitización de datos
- Configuración segura para producción

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints optimizados
- Touch-friendly interfaces
- Accesibilidad mejorada

## 🚀 Performance

- Optimización de imágenes
- Lazy loading de componentes
- Bundle splitting automático
- Caching optimizado

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es propiedad de Konrad Inmobiliaria. Todos los derechos reservados.

## 👨‍💻 Desarrollo

**Desarrollador**: pictoN  
**Cliente**: Konrad Inmobiliaria  
**Tecnología**: Next.js 14 + TypeScript + Tailwind CSS

---

⭐ Si este proyecto te ayuda, considera darle una estrella en GitHub!
