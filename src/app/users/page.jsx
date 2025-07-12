'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  Edit, 
  Trash2, 
  Shield, 
  Building, 
  User, 
  Clock,
  Mail,
  Phone,
  Calendar
} from 'lucide-react';
import { getCurrentUser, getAllUsers, hasPermission, USER_ROLES } from '@/utils/auth';
import Breadcrumbs from '@/components/Breadcrumbs';

export default function UsersPage() {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedRole, setSelectedRole] = useState('all');

  useEffect(() => {
    setUser(getCurrentUser());
    setUsers(getAllUsers());
  }, []);

  const getRoleLabel = (role) => {
    switch (role) {
      case USER_ROLES.ADMIN:
        return 'Administrador';
      case USER_ROLES.MANAGER:
        return 'Gerente';
      case USER_ROLES.AGENT:
        return 'Agente';
      case USER_ROLES.VIEWER:
        return 'Visualizador';
      default:
        return 'Usuario';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case USER_ROLES.ADMIN:
        return 'text-error-400 bg-error-500/10 border-error-500/20';
      case USER_ROLES.MANAGER:
        return 'text-warning-400 bg-warning-500/10 border-warning-500/20';
      case USER_ROLES.AGENT:
        return 'text-success-400 bg-success-500/10 border-success-500/20';
      case USER_ROLES.VIEWER:
        return 'text-info-400 bg-info-500/10 border-info-500/20';
      default:
        return 'text-neutral-400 bg-neutral-500/10 border-neutral-500/20';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case USER_ROLES.ADMIN:
        return <Shield className="h-4 w-4" />;
      case USER_ROLES.MANAGER:
        return <Building className="h-4 w-4" />;
      case USER_ROLES.AGENT:
        return <User className="h-4 w-4" />;
      case USER_ROLES.VIEWER:
        return <Clock className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const filteredUsers = selectedRole === 'all' 
    ? users 
    : users.filter(user => user.role === selectedRole);

  const roleOptions = [
    { value: 'all', label: 'Todos los roles' },
    { value: USER_ROLES.ADMIN, label: 'Administradores' },
    { value: USER_ROLES.MANAGER, label: 'Gerentes' },
    { value: USER_ROLES.AGENT, label: 'Agentes' },
    { value: USER_ROLES.VIEWER, label: 'Visualizadores' }
  ];

  const stats = [
    {
      name: 'Total Usuarios',
      value: users.length,
      icon: Users,
      color: 'primary'
    },
    {
      name: 'Administradores',
      value: users.filter(u => u.role === USER_ROLES.ADMIN).length,
      icon: Shield,
      color: 'error'
    },
    {
      name: 'Gerentes',
      value: users.filter(u => u.role === USER_ROLES.MANAGER).length,
      icon: Building,
      color: 'warning'
    },
    {
      name: 'Agentes',
      value: users.filter(u => u.role === USER_ROLES.AGENT).length,
      icon: User,
      color: 'success'
    }
  ];

  const getColorClasses = (color) => {
    switch (color) {
      case 'primary':
        return 'bg-primary-500/20 text-primary-400 border-primary-500/30';
      case 'error':
        return 'bg-error-500/20 text-error-400 border-error-500/30';
      case 'warning':
        return 'bg-warning-500/20 text-warning-400 border-warning-500/30';
      case 'success':
        return 'bg-success-500/20 text-success-400 border-success-500/30';
      default:
        return 'bg-neutral-500/20 text-neutral-400 border-neutral-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Breadcrumbs />
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">Gestión de Usuarios</h1>
            <p className="text-neutral-400">
              Administra usuarios y permisos del sistema
            </p>
          </div>
          <div className="flex items-center space-x-3">
            {hasPermission('canManageUsers') && (
              <button className="btn-primary flex items-center space-x-2">
                <UserPlus className="h-4 w-4" />
                <span>Nuevo Usuario</span>
              </button>
            )}
            <div className="p-3 bg-primary-500/20 rounded-xl">
              <Users className="h-6 w-6 text-primary-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-400">{stat.name}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl ${getColorClasses(stat.color)}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filtros */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Usuarios del Sistema</h3>
          <div className="flex items-center space-x-3">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="bg-neutral-700 border border-neutral-600 text-white rounded-lg px-3 py-2 text-sm"
            >
              {roleOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Lista de usuarios */}
        <div className="space-y-3">
          {filteredUsers.map((userItem) => (
            <div key={userItem.id} className="flex items-center justify-between p-4 bg-neutral-700/30 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h4 className="font-medium text-white">{userItem.name}</h4>
                    <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs border ${getRoleColor(userItem.role)}`}>
                      {getRoleIcon(userItem.role)}
                      <span>{getRoleLabel(userItem.role)}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-neutral-400">
                    <div className="flex items-center space-x-1">
                      <Mail className="h-3 w-3" />
                      <span>{userItem.email}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(userItem.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {hasPermission('canManageUsers') && (
                  <>
                    <button className="p-2 hover:bg-neutral-600 rounded-lg transition-colors">
                      <Edit className="h-4 w-4 text-neutral-400" />
                    </button>
                    <button className="p-2 hover:bg-error-500/10 rounded-lg transition-colors">
                      <Trash2 className="h-4 w-4 text-error-400" />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Información adicional */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Distribución por Roles</h3>
            <Users className="h-5 w-5 text-neutral-400" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-error-500/10 rounded-lg">
              <div className="flex items-center space-x-3">
                <Shield className="h-4 w-4 text-error-400" />
                <span className="text-sm text-white">Administradores</span>
              </div>
              <span className="text-sm font-medium text-white">
                {users.filter(u => u.role === USER_ROLES.ADMIN).length}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-warning-500/10 rounded-lg">
              <div className="flex items-center space-x-3">
                <Building className="h-4 w-4 text-warning-400" />
                <span className="text-sm text-white">Gerentes</span>
              </div>
              <span className="text-sm font-medium text-white">
                {users.filter(u => u.role === USER_ROLES.MANAGER).length}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-success-500/10 rounded-lg">
              <div className="flex items-center space-x-3">
                <User className="h-4 w-4 text-success-400" />
                <span className="text-sm text-white">Agentes</span>
              </div>
              <span className="text-sm font-medium text-white">
                {users.filter(u => u.role === USER_ROLES.AGENT).length}
              </span>
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
                <p className="text-sm font-medium text-white">Usuario activo</p>
                <p className="text-xs text-neutral-400">Germán Konrad • Hace 2 horas</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-neutral-700/30 rounded-lg">
              <div className="w-2 h-2 bg-primary-400 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">Nuevo contrato generado</p>
                <p className="text-xs text-neutral-400">Agente Inmobiliario • Hace 4 horas</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-neutral-700/30 rounded-lg">
              <div className="w-2 h-2 bg-warning-400 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">Recibo creado</p>
                <p className="text-xs text-neutral-400">Germán Konrad • Hace 6 horas</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 