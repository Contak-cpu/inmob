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
  Activity,
  TestTube,
  Zap,
  Eye
} from 'lucide-react';
import { getCurrentUser } from '@/utils/auth';
import Breadcrumbs from '@/components/Breadcrumbs';
import StatsCard from '@/components/ui/StatsCard';
import { useNotifications } from '@/hooks/useNotifications';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { useTest } from '@/contexts/TestContext';


export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const { showSuccess, showError, showWarning, showInfo } = useNotifications();
  const { isTestMode } = useTest();

  // Estadísticas y actividad de prueba
  const testStats = [
    {
      name: 'Contratos Activos',
      value: '99',
      change: '+20%',
      changeType: 'positive',
      icon: FileText,
      color: 'primary'
    },
    {
      name: 'Recibos Generados',
      value: '320',
      change: '+15%',
      changeType: 'positive',
      icon: Receipt,
      color: 'success'
    },
    {
      name: 'Clientes Activos',
      value: '200',
      change: '+10%',
      changeType: 'positive',
      icon: Users,
      color: 'warning'
    },
    {
      name: 'Ingresos Mensuales',
      value: '$120,000',
      change: '+30%',
      changeType: 'positive',
      icon: DollarSign,
      color: 'info'
    }
  ];

  const testRecentActivity = [
    {
      type: 'contract',
      title: 'Contrato de prueba generado',
      description: 'Contrato de locación para Av. Ficticia 123',
      time: 'Hace 1 hora',
      user: 'Test Admin'
    },
    {
      type: 'receipt',
      title: 'Recibo de prueba creado',
      description: 'Recibo mensual para propiedad en Calle Demo 456',
      time: 'Hace 2 horas',
      user: 'Test Agente'
    },
    {
      type: 'client',
      title: 'Cliente ficticio registrado',
      description: 'Juan Test - Propiedad en testeo',
      time: 'Hace 3 horas',
      user: 'Test Admin'
    }
  ];

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  // Función para probar las notificaciones
  const testNotifications = () => {
    showSuccess('Sistema Funcional', 'Todas las funcionalidades están operativas');
    setTimeout(() => showInfo('Actualización', 'Nuevas características disponibles'), 1000);
    setTimeout(() => showWarning('Recordatorio', 'Revisa los contratos próximos a vencer'), 2000);
    setTimeout(() => showError('Error Simulado', 'Esta es una notificación de prueba'), 3000);
  };

  // Generar notificaciones reales del sistema
  useEffect(() => {
    if (user) {
      // Notificación de bienvenida
      setTimeout(() => {
        showSuccess('Bienvenido', `Hola ${user.name}, el sistema está listo para usar`);
      }, 1000);

      // Notificación de estadísticas
      setTimeout(() => {
        showInfo('Estadísticas Actualizadas', 'Los datos del dashboard están actualizados');
      }, 3000);
    }
  }, [user, showSuccess, showInfo]);

  const stats = isTestMode ? testStats : [
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

  const recentActivity = isTestMode ? testRecentActivity : [
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
              title="Generar notificaciones de prueba"
            >
              Probar Sistema
            </Button>
            <Link href="/analytics" title="Ver Estadísticas">
              <div className="p-3 bg-primary-500/20 rounded-xl cursor-pointer hover:bg-primary-500/40 transition-colors">
                <BarChart3 className="h-6 w-6 text-primary-400" />
              </div>
            </Link>
            <Link href="/security" title="Configuración de Seguridad">
              <div className="p-3 bg-warning-500/20 rounded-xl cursor-pointer hover:bg-warning-500/40 transition-colors">
                <Eye className="h-6 w-6 text-warning-400" />
              </div>
            </Link>
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