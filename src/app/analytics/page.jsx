'use client';

import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calendar,
  PieChart,
  Activity,
  Users,
  FileText,
  Receipt
} from 'lucide-react';
import { getCurrentUser } from '@/utils/auth';
import Breadcrumbs from '@/components/Breadcrumbs';

export default function AnalyticsPage() {
  const [user, setUser] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  const periodOptions = [
    { value: 'week', label: 'Esta semana' },
    { value: 'month', label: 'Este mes' },
    { value: 'quarter', label: 'Este trimestre' },
    { value: 'year', label: 'Este año' }
  ];

  const revenueData = [
    { month: 'Ene', contracts: 12, receipts: 45, total: 12500 },
    { month: 'Feb', contracts: 15, receipts: 52, total: 13800 },
    { month: 'Mar', contracts: 18, receipts: 48, total: 14200 },
    { month: 'Abr', contracts: 22, receipts: 61, total: 15800 },
    { month: 'May', contracts: 24, receipts: 58, total: 16200 },
    { month: 'Jun', contracts: 28, receipts: 65, total: 17500 }
  ];

  const topProperties = [
    {
      name: 'Av. San Martín 123',
      type: 'Locación',
      revenue: 8500,
      contracts: 3,
      trend: 'up'
    },
    {
      name: 'Belgrano 456',
      type: 'Comercial',
      revenue: 7200,
      contracts: 2,
      trend: 'up'
    },
    {
      name: 'Rivadavia 789',
      type: 'Locación',
      revenue: 6800,
      contracts: 2,
      trend: 'down'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Breadcrumbs />
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">Análisis Avanzado</h1>
            <p className="text-neutral-400">
              Estadísticas detalladas y métricas de rendimiento
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="bg-neutral-700 border border-neutral-600 text-white rounded-lg px-3 py-2 text-sm"
            >
              {periodOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="p-3 bg-primary-500/20 rounded-xl">
              <BarChart3 className="h-6 w-6 text-primary-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-400">Ingresos Totales</p>
              <p className="text-2xl font-bold text-white">$89,800</p>
              <div className="flex items-center space-x-1 mt-1">
                <TrendingUp className="h-4 w-4 text-success-400" />
                <span className="text-xs text-success-400">+15.2%</span>
              </div>
            </div>
            <div className="p-3 bg-success-500/20 rounded-xl">
              <DollarSign className="h-6 w-6 text-success-400" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-400">Contratos Activos</p>
              <p className="text-2xl font-bold text-white">24</p>
              <div className="flex items-center space-x-1 mt-1">
                <TrendingUp className="h-4 w-4 text-success-400" />
                <span className="text-xs text-success-400">+8.5%</span>
              </div>
            </div>
            <div className="p-3 bg-primary-500/20 rounded-xl">
              <FileText className="h-6 w-6 text-primary-400" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-400">Recibos Generados</p>
              <p className="text-2xl font-bold text-white">156</p>
              <div className="flex items-center space-x-1 mt-1">
                <TrendingUp className="h-4 w-4 text-success-400" />
                <span className="text-xs text-success-400">+12.3%</span>
              </div>
            </div>
            <div className="p-3 bg-warning-500/20 rounded-xl">
              <Receipt className="h-6 w-6 text-warning-400" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-400">Clientes Activos</p>
              <p className="text-2xl font-bold text-white">89</p>
              <div className="flex items-center space-x-1 mt-1">
                <TrendingDown className="h-4 w-4 text-error-400" />
                <span className="text-xs text-error-400">-2.1%</span>
              </div>
            </div>
            <div className="p-3 bg-info-500/20 rounded-xl">
              <Users className="h-6 w-6 text-info-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de ingresos */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Evolución de Ingresos</h3>
            <TrendingUp className="h-5 w-5 text-neutral-400" />
          </div>
          <div className="space-y-3">
            {revenueData.map((data, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-neutral-700/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-white">{data.month}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-neutral-400">{data.contracts} contratos</span>
                    <span className="text-xs text-neutral-400">{data.receipts} recibos</span>
                  </div>
                </div>
                <span className="text-sm font-medium text-white">${data.total.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Propiedades top */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Propiedades Top</h3>
            <Activity className="h-5 w-5 text-neutral-400" />
          </div>
          <div className="space-y-3">
            {topProperties.map((property, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-neutral-700/30 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{property.name}</p>
                  <p className="text-xs text-neutral-400">{property.type} • {property.contracts} contratos</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-white">${property.revenue.toLocaleString()}</span>
                  {property.trend === 'up' ? (
                    <TrendingUp className="h-4 w-4 text-success-400" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-error-400" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Análisis detallado */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Distribución por Tipo</h3>
            <PieChart className="h-5 w-5 text-neutral-400" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-primary-500/10 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-primary-400 rounded-full"></div>
                <span className="text-sm text-white">Contratos de Locación</span>
              </div>
              <span className="text-sm font-medium text-white">65%</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-success-500/10 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-success-400 rounded-full"></div>
                <span className="text-sm text-white">Contratos Comerciales</span>
              </div>
              <span className="text-sm font-medium text-white">25%</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-warning-500/10 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-warning-400 rounded-full"></div>
                <span className="text-sm text-white">Otros Servicios</span>
              </div>
              <span className="text-sm font-medium text-white">10%</span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Actividad Reciente</h3>
            <Calendar className="h-5 w-5 text-neutral-400" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-neutral-700/30 rounded-lg">
              <div className="w-2 h-2 bg-success-400 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">Nuevo contrato comercial</p>
                <p className="text-xs text-neutral-400">Hace 2 horas • $2,500</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-neutral-700/30 rounded-lg">
              <div className="w-2 h-2 bg-primary-400 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">Recibo de alquiler generado</p>
                <p className="text-xs text-neutral-400">Hace 4 horas • $1,200</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-neutral-700/30 rounded-lg">
              <div className="w-2 h-2 bg-warning-400 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">Renovación de contrato</p>
                <p className="text-xs text-neutral-400">Hace 6 horas • $1,800</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 