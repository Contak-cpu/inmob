'use client';

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  FileText, 
  Receipt, 
  Users, 
  DollarSign, 
  Calendar,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';
import { getCurrentUser } from '@/utils/auth';
import Breadcrumbs from '@/components/Breadcrumbs';
import StatsCard from '@/components/ui/StatsCard';
import { useNotifications } from '@/hooks/useNotifications';
import Button from '@/components/ui/Button';

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const { showSuccess, showError, showWarning, showInfo } = useNotifications();

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  // Función para probar las notificaciones
  const testNotifications = () => {
    showSuccess('Éxito', 'Operación completada correctamente');
    setTimeout(() => showError('Error', 'Algo salió mal'), 1000);
    setTimeout(() => showWarning('Advertencia', 'Revisa los datos ingresados'), 2000);
    setTimeout(() => showInfo('Información', 'Nuevas actualizaciones disponibles'), 3000);
  };

  const stats = [
    {
      name: 'Contratos Activos',
      value: '24',
      change: '+12%',
      changeType: 'positive',
      icon: FileText,
      color: 'primary'
    },
    {
      name: 'Recibos Generados',
      value: '156',
      change: '+8%',
      changeType: 'positive',
      icon: Receipt,
      color: 'success'
    },
    {
      name: 'Clientes Activos',
      value: '89',
      change: '+5%',
      changeType: 'positive',
      icon: Users,
      color: 'warning'
    },
    {
      name: 'Ingresos Mensuales',
      value: '$45,230',
      change: '+15%',
      changeType: 'positive',
      icon: DollarSign,
      color: 'info'
    }
  ];



  const recentActivity = [
    {
      type: 'contract',
      title: 'Nuevo contrato generado',
      description: 'Contrato de locación para Av. San Martín 123',
      time: 'Hace 2 horas',
      user: 'Germán Konrad'
    },
    {
      type: 'receipt',
      title: 'Recibo de alquiler creado',
      description: 'Recibo mensual para propiedad en Belgrano 456',
      time: 'Hace 4 horas',
      user: 'Agente Inmobiliario'
    },
    {
      type: 'client',
      title: 'Nuevo cliente registrado',
      description: 'María González - Propiedad en venta',
      time: 'Hace 6 horas',
      user: 'Germán Konrad'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Breadcrumbs />
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">Dashboard</h1>
            <p className="text-neutral-400">
              Análisis y estadísticas del sistema
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={testNotifications}
            >
              Probar Notificaciones
            </Button>
            <div className="p-3 bg-primary-500/20 rounded-xl">
              <BarChart3 className="h-6 w-6 text-primary-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatsCard
            key={stat.name}
            title={stat.name}
            value={stat.value}
            change={stat.change}
            changeType={stat.changeType}
            icon={stat.icon}
            color={stat.color}
          />
        ))}
      </div>

      {/* Gráficos y análisis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de actividad */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Actividad Reciente</h3>
            <Activity className="h-5 w-5 text-neutral-400" />
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-neutral-700/30 rounded-lg">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'contract' ? 'bg-primary-400' :
                  activity.type === 'receipt' ? 'bg-success-400' :
                  'bg-warning-400'
                }`}></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{activity.title}</p>
                  <p className="text-xs text-neutral-400">{activity.description}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs text-neutral-500">{activity.user}</span>
                    <span className="text-xs text-neutral-500">•</span>
                    <span className="text-xs text-neutral-500">{activity.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gráfico de distribución */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Distribución de Documentos</h3>
            <PieChart className="h-5 w-5 text-neutral-400" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-primary-500/10 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-primary-400 rounded-full"></div>
                <span className="text-sm text-white">Contratos</span>
              </div>
              <span className="text-sm font-medium text-white">45%</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-success-500/10 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-success-400 rounded-full"></div>
                <span className="text-sm text-white">Recibos</span>
              </div>
              <span className="text-sm font-medium text-white">35%</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-warning-500/10 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-warning-400 rounded-full"></div>
                <span className="text-sm text-white">Otros</span>
              </div>
              <span className="text-sm font-medium text-white">20%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Información adicional */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Próximos Vencimientos</h3>
            <Calendar className="h-5 w-5 text-neutral-400" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-warning-500/10 rounded-lg">
              <div>
                <p className="text-sm font-medium text-white">Contrato Av. San Martín</p>
                <p className="text-xs text-neutral-400">Vence en 15 días</p>
              </div>
              <span className="text-xs text-warning-400">15 días</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-error-500/10 rounded-lg">
              <div>
                <p className="text-sm font-medium text-white">Recibo Belgrano 456</p>
                <p className="text-xs text-neutral-400">Vence en 3 días</p>
              </div>
              <span className="text-xs text-error-400">3 días</span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Rendimiento del Sistema</h3>
            <TrendingUp className="h-5 w-5 text-neutral-400" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-400">Uptime</span>
              <span className="text-sm font-medium text-success-400">99.9%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-400">Documentos generados hoy</span>
              <span className="text-sm font-medium text-white">12</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-400">Usuarios activos</span>
              <span className="text-sm font-medium text-white">3</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 