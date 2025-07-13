"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FileText, Receipt, Building, Home, Settings, ArrowRight, History, Bell, TrendingUp, Users, BarChart3 } from 'lucide-react';
import { getCurrentUser, isAuthenticated } from '@/utils/auth';
import Breadcrumbs from '@/components/Breadcrumbs';

export default function HomePage() {
  const [user, setUser] = useState(null);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = isAuthenticated();
      setIsAuth(authenticated);
      if (authenticated) {
        setUser(getCurrentUser());
      }
    };

    checkAuth();
  }, []);

  const quickActions = [
    {
      name: 'Generar Contrato',
      href: '/contracts',
      icon: FileText,
      color: 'primary',
      description: 'Crear nuevo contrato de locación o comercial'
    },
    {
      name: 'Generar Recibo',
      href: '/receipts',
      icon: Receipt,
      color: 'success',
      description: 'Crear recibo de alquiler o servicios'
    },
    {
      name: 'Ver Historial',
      href: '/history',
      icon: History,
      color: 'warning',
      description: 'Revisar documentos generados'
    },
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: BarChart3,
      color: 'info',
      description: 'Ver estadísticas y reportes'
    }
  ];

  const getColorClasses = (color) => {
    switch (color) {
      case 'primary':
        return 'bg-primary-500/20 text-primary-400 border-primary-500/30';
      case 'success':
        return 'bg-success-500/20 text-success-400 border-success-500/30';
      case 'warning':
        return 'bg-warning-500/20 text-warning-400 border-warning-500/30';
      case 'info':
        return 'bg-info-500/20 text-info-400 border-info-500/30';
      default:
        return 'bg-neutral-500/20 text-neutral-400 border-neutral-500/30';
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header con breadcrumbs - Mejorado para móviles */}
      <div className="space-y-3 sm:space-y-4">
        <Breadcrumbs />
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl font-bold text-white mb-1 sm:mb-2">
              Bienvenido, {user?.name || 'Usuario'}
            </h1>
            <p className="text-sm sm:text-base text-neutral-400">
              Sistema de gestión de Konrad Inmobiliaria
            </p>
          </div>
          <div className="flex items-center justify-center sm:justify-end">
            <div className="p-3 sm:p-4 bg-primary-500/20 rounded-xl">
              <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-primary-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Acciones rápidas - Mejoradas para móviles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <Link key={action.href} href={action.href} className="group">
              <div className={`card card-hover group-hover:scale-105 border transition-all duration-300 touch-manipulation ${getColorClasses(action.color)}`}>
                <div className="flex items-center space-x-3 sm:space-x-4 mb-3 sm:mb-4">
                  <div className={`p-2 sm:p-3 rounded-xl ${getColorClasses(action.color)}`}>
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white text-sm sm:text-base truncate">{action.name}</h3>
                    <p className="text-xs text-neutral-400 line-clamp-2">{action.description}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-neutral-300">Acceso directo</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Estadísticas rápidas - Mejoradas para móviles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <div className="card">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="p-2 sm:p-3 bg-primary-500/20 rounded-xl flex-shrink-0">
              <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-primary-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm text-neutral-400">Contratos</p>
              <p className="text-xl sm:text-2xl font-bold text-white">24</p>
              <p className="text-xs text-success-400">+12% este mes</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="p-2 sm:p-3 bg-success-500/20 rounded-xl flex-shrink-0">
              <Receipt className="h-5 w-5 sm:h-6 sm:w-6 text-success-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm text-neutral-400">Recibos</p>
              <p className="text-xl sm:text-2xl font-bold text-white">156</p>
              <p className="text-xs text-success-400">+8% este mes</p>
            </div>
          </div>
        </div>

        <div className="card sm:col-span-2 lg:col-span-1">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="p-2 sm:p-3 bg-warning-500/20 rounded-xl flex-shrink-0">
              <Users className="h-5 w-5 sm:h-6 sm:w-6 text-warning-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm text-neutral-400">Clientes</p>
              <p className="text-xl sm:text-2xl font-bold text-white">89</p>
              <p className="text-xs text-success-400">+5% este mes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Información de la empresa - Mejorada para móviles */}
      <div className="card">
        <div className="text-center space-y-3 sm:space-y-4">
          <Building className="h-6 w-6 sm:h-8 sm:w-8 text-primary-400 mx-auto" />
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-white mb-2">
              KONRAD Inversiones + Desarrollos Inmobiliarios
            </h3>
            <p className="text-sm sm:text-base text-neutral-400 mb-2">
              Ameghino Nº 602, Santa Rosa, La Pampa
            </p>
            <div className="flex flex-col sm:flex-row sm:justify-center sm:space-x-4 text-xs sm:text-sm text-neutral-500 space-y-1 sm:space-y-0">
              <span>Tel: +54 2954 123456</span>
              <span>Email: info@konradinmobiliaria.com</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 