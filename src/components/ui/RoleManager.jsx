'use client';

import { useState, useEffect } from 'react';
import { Shield, Users, Eye, EyeOff, Check, X, Edit, Trash2, Plus } from 'lucide-react';
import securityManager from '../../utils/security';

const RoleManager = () => {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState({});
  const [selectedRole, setSelectedRole] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRole, setNewRole] = useState({
    key: '',
    name: '',
    permissions: [],
    level: 50
  });

  useEffect(() => {
    loadRolesAndPermissions();
  }, []);

  const loadRolesAndPermissions = () => {
    const availableRoles = securityManager.getAvailableRoles();
    const availablePermissions = securityManager.getAvailablePermissions();
    
    setRoles(availableRoles);
    setPermissions(availablePermissions);
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setIsEditing(false);
  };

  const handlePermissionToggle = (permission) => {
    if (!selectedRole) return;

    const updatedRole = { ...selectedRole };
    const permissionIndex = updatedRole.permissions.indexOf(permission);

    if (permissionIndex > -1) {
      updatedRole.permissions.splice(permissionIndex, 1);
    } else {
      updatedRole.permissions.push(permission);
    }

    setSelectedRole(updatedRole);
  };

  const handleSaveRole = () => {
    if (!selectedRole) return;

    // En producción, esto se enviaría al servidor
    console.log('Guardando rol:', selectedRole);
    
    // Simular actualización
    const updatedRoles = roles.map(role => 
      role.key === selectedRole.key ? selectedRole : role
    );
    setRoles(updatedRoles);
    setIsEditing(false);

    // Registrar en auditoría
    securityManager.auditLog('ROLE_UPDATED', {
      roleKey: selectedRole.key,
      roleName: selectedRole.name,
      permissions: selectedRole.permissions,
      level: selectedRole.level
    });
  };

  const handleCreateRole = () => {
    if (!newRole.key || !newRole.name) return;

    const role = {
      ...newRole,
      permissions: newRole.permissions || []
    };

    // En producción, esto se enviaría al servidor
    console.log('Creando nuevo rol:', role);
    
    setRoles([...roles, role]);
    setShowCreateModal(false);
    setNewRole({ key: '', name: '', permissions: [], level: 50 });

    // Registrar en auditoría
    securityManager.auditLog('ROLE_CREATED', {
      roleKey: role.key,
      roleName: role.name,
      permissions: role.permissions,
      level: role.level
    });
  };

  const handleDeleteRole = (roleKey) => {
    if (roleKey === 'admin') {
      alert('No se puede eliminar el rol de administrador');
      return;
    }

    if (confirm('¿Estás seguro de que quieres eliminar este rol?')) {
      const updatedRoles = roles.filter(role => role.key !== roleKey);
      setRoles(updatedRoles);
      
      if (selectedRole?.key === roleKey) {
        setSelectedRole(null);
      }

      // Registrar en auditoría
      securityManager.auditLog('ROLE_DELETED', {
        roleKey,
        roleName: roles.find(r => r.key === roleKey)?.name
      });
    }
  };

  const getPermissionCategory = (permission) => {
    const categories = {
      'contracts': 'Contratos',
      'receipts': 'Recibos',
      'users': 'Usuarios',
      'analytics': 'Analytics',
      'export': 'Exportación',
      'system': 'Sistema'
    };

    const category = permission.split(':')[0];
    return categories[category] || 'Otros';
  };

  const groupedPermissions = Object.entries(permissions).reduce((acc, [key, value]) => {
    const category = getPermissionCategory(key);
    if (!acc[category]) acc[category] = [];
    acc[category].push({ key, value });
    return acc;
  }, {});

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">Gestión de Roles y Permisos</h2>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nuevo Rol
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de Roles */}
        <div className="lg:col-span-1">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Roles Disponibles</h3>
          <div className="space-y-2">
            {roles.map((role) => (
              <div
                key={role.key}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedRole?.key === role.key
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleRoleSelect(role)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-800">{role.name}</h4>
                    <p className="text-sm text-gray-500">
                      {role.permissions.length} permisos • Nivel {role.level}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {role.key !== 'admin' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteRole(role.key);
                        }}
                        className="p-1 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detalles del Rol */}
        <div className="lg:col-span-2">
          {selectedRole ? (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-700">
                  Configurar: {selectedRole.name}
                </h3>
                <div className="flex items-center gap-2">
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleSaveRole}
                        className="flex items-center gap-2 px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Check className="w-4 h-4" />
                        Guardar
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="flex items-center gap-2 px-3 py-1 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                      Editar
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                {/* Información del Rol */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Clave del Rol
                    </label>
                    <input
                      type="text"
                      value={selectedRole.key}
                      disabled={!isEditing || selectedRole.key === 'admin'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nivel de Acceso
                    </label>
                    <input
                      type="number"
                      value={selectedRole.level}
                      disabled={!isEditing}
                      min="1"
                      max="100"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100"
                      onChange={(e) => setSelectedRole({
                        ...selectedRole,
                        level: parseInt(e.target.value)
                      })}
                    />
                  </div>
                </div>

                {/* Permisos */}
                <div>
                  <h4 className="text-md font-medium text-gray-700 mb-3">Permisos</h4>
                  <div className="space-y-4">
                    {Object.entries(groupedPermissions).map(([category, perms]) => (
                      <div key={category} className="border border-gray-200 rounded-lg p-4">
                        <h5 className="font-medium text-gray-800 mb-3">{category}</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {perms.map(({ key, value }) => (
                            <label
                              key={key}
                              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                                selectedRole.permissions.includes(key)
                                  ? 'border-green-500 bg-green-50'
                                  : 'border-gray-200 hover:border-gray-300'
                              } ${!isEditing ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                              <input
                                type="checkbox"
                                checked={selectedRole.permissions.includes(key)}
                                disabled={!isEditing}
                                onChange={() => handlePermissionToggle(key)}
                                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                              />
                              <div>
                                <div className="font-medium text-gray-800">{value}</div>
                                <div className="text-sm text-gray-500">{key}</div>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              <div className="text-center">
                <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p>Selecciona un rol para configurar sus permisos</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal para Crear Rol */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Crear Nuevo Rol</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Clave del Rol
                </label>
                <input
                  type="text"
                  value={newRole.key}
                  onChange={(e) => setNewRole({ ...newRole, key: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="ej: supervisor"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre del Rol
                </label>
                <input
                  type="text"
                  value={newRole.name}
                  onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Supervisor"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nivel de Acceso
                </label>
                <input
                  type="number"
                  value={newRole.level}
                  onChange={(e) => setNewRole({ ...newRole, level: parseInt(e.target.value) })}
                  min="1"
                  max="100"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateRole}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Crear Rol
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleManager; 