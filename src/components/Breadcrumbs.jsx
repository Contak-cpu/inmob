'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

export default function Breadcrumbs() {
  const pathname = usePathname();

  const generateBreadcrumbs = () => {
    const segments = pathname.split('/').filter(segment => segment !== '');
    
    if (segments.length === 0) {
      return [];
    }

    const breadcrumbs = [];
    let currentPath = '';

    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      
      // Mapear nombres amigables
      let name = segment;
      switch (segment) {
        case 'dashboard':
          name = 'Dashboard';
          break;
        case 'contracts':
          name = 'Contratos';
          break;
        case 'receipts':
          name = 'Recibos';
          break;
        case 'history':
          name = 'Historial';
          break;
        case 'analytics':
          name = 'Estadísticas';
          break;
        case 'users':
          name = 'Usuarios';
          break;
        case 'generate':
          name = 'Generar';
          break;
        case 'locacion':
          name = 'Locación';
          break;
        case 'comercial':
          name = 'Comercial';
          break;
        case 'alquiler':
          name = 'Alquiler';
          break;
        case 'servicios':
          name = 'Servicios';
          break;
        default:
          // Capitalizar primera letra
          name = segment.charAt(0).toUpperCase() + segment.slice(1);
      }

      breadcrumbs.push({
        name,
        path: currentPath,
        isLast: index === segments.length - 1
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  if (breadcrumbs.length === 0) {
    return null;
  }

  return (
    <nav className="flex items-center space-x-2 text-sm text-neutral-400 mb-6">
      <Link
        href="/"
        className="flex items-center space-x-1 hover:text-white transition-colors"
      >
        <Home className="h-4 w-4" />
        <span>Inicio</span>
      </Link>
      
      {breadcrumbs.map((breadcrumb, index) => (
        <React.Fragment key={breadcrumb.path}>
          <ChevronRight className="h-4 w-4" />
          {breadcrumb.isLast ? (
            <span className="text-white font-medium">{breadcrumb.name}</span>
          ) : (
            <Link
              href={breadcrumb.path}
              className="hover:text-white transition-colors"
            >
              {breadcrumb.name}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
} 