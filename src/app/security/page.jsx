'use client';

import { useState } from 'react';
import { Shield, Users, FileText, Activity, Settings, AlertTriangle, Lock, Eye } from 'lucide-react';
import RoleManager from '@/components/ui/RoleManager';
import AuditLogs from '@/components/ui/AuditLogs';
import { useSecurity } from '@/hooks/useSecurity';

const SecurityPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { 
    currentUser, 
    isAuthenticated, 
    userPermissions, 
    getSecurityStats,
    canViewSystemLogs,
    isAdmin 
  } = useSecurity();

  const [securityStats, setSecurityStats] = useState({});

  // Cargar estadísticas de seguridad
  useState(() => {
    if (isAuthenticated) {
      setSecurityStats(getSecurityStats());
    }
  });

  const tabs = [
    {
      id: 'overview',
      name: 'Resumen',
      icon: Shield,
      accessible: true
    },
    {
      id: 'roles',
      name: 'Roles y Permisos',
      icon: Users,
      accessible: isAdmin
    },
    {
      id: 'logs',
      name: 'Logs de Auditoría',
      icon: FileText,
      accessible: canViewSystemLogs()
    },
    {
      id: 'activity',
      name: 'Actividad',
      icon: Activity,
      accessible: true
    },
    {
      id: 'settings',
      name: 'Configuración',
      icon: Settings,
      accessible: isAdmin
    }
  ];

  const accessibleTabs = tabs.filter(tab => tab.accessible);

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Estadísticas de Seguridad */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Logs</p>
              <p className="text-2xl font-bold text-gray-900">{securityStats.totalLogs || 0}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Logs (24h)</p>
              <p className="text-2xl font-bold text-gray-900">{securityStats.logsLast24h || 0}</p>
            </div>
            <Activity className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Logins Exitosos</p>
              <p className="text-2xl font-bold text-gray-900">{securityStats.successfulLogins || 0}</p>
            </div>
            <Lock className="w-8 h-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Violaciones</p>
              <p className="text-2xl font-bold text-gray-900">{securityStats.securityViolations || 0}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Información del Usuario Actual */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Información del Usuario</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-600">Nombre</p>
            <p className="text-gray-900">{currentUser?.name || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Email</p>
            <p className="text-gray-900">{currentUser?.email || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Rol</p>
            <p className="text-gray-900">{currentUser?.role || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Permisos</p>
            <p className="text-gray-900">{userPermissions.length} permisos asignados</p>
          </div>
        </div>
      </div>

      {/* Permisos del Usuario */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Permisos Asignados</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {userPermissions.map((permission, index) => (
            <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
              <Eye className="w-4 h-4 text-green-500" />
              <span className="text-sm text-gray-700">{permission}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderActivity = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Actividad Reciente</h3>
        <div className="space-y-4">
          {/* Simular actividad reciente */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Activity className="w-4 h-4 text-green-500" />
            <div>
              <p className="text-sm font-medium text-gray-800">Login exitoso</p>
              <p className="text-xs text-gray-500">Hace 2 minutos</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <FileText className="w-4 h-4 text-blue-500" />
            <div>
              <p className="text-sm font-medium text-gray-800">Contrato creado</p>
              <p className="text-xs text-gray-500">Hace 15 minutos</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Users className="w-4 h-4 text-purple-500" />
            <div>
              <p className="text-sm font-medium text-gray-800">Usuario actualizado</p>
              <p className="text-xs text-gray-500">Hace 1 hora</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Configuración de Seguridad</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-800">Autenticación de dos factores</h4>
              <p className="text-sm text-gray-600">Requerir 2FA para todos los usuarios</p>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Configurar
            </button>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-800">Política de contraseñas</h4>
              <p className="text-sm text-gray-600">Configurar requisitos de contraseñas</p>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Configurar
            </button>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-800">Bloqueo de IP</h4>
              <p className="text-sm text-gray-600">Configurar bloqueo automático de IPs</p>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Configurar
            </button>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-800">Retención de logs</h4>
              <p className="text-sm text-gray-600">Configurar tiempo de retención de logs</p>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Configurar
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'roles':
        return <RoleManager />;
      case 'logs':
        return <AuditLogs />;
      case 'activity':
        return renderActivity();
      case 'settings':
        return renderSettings();
      default:
        return renderOverview();
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Acceso Denegado</h2>
          <p className="text-gray-600">Debes iniciar sesión para acceder a esta página</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-800">Administración de Seguridad</h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {accessibleTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content */}
      <div className="min-h-[600px]">
        {renderContent()}
      </div>
    </div>
  );
};

export default SecurityPage; 