'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  X, 
  ChevronDown, 
  Calendar,
  User,
  Building,
  DollarSign,
  FileText,
  Receipt
} from 'lucide-react';

/**
 * Componente de búsqueda y filtros avanzados
 */
export default function SearchAndFilters({
  onSearch,
  onFilter,
  filters = [],
  placeholder = 'Buscar...',
  showFilters = true,
  showSearch = true
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState({});
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // Aplicar búsqueda con debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSearch(searchTerm);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, onSearch]);

  // Aplicar filtros cuando cambien
  useEffect(() => {
    onFilter(activeFilters);
  }, [activeFilters, onFilter]);

  const handleFilterChange = (filterKey, value) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterKey]: value
    }));
  };

  const clearFilter = (filterKey) => {
    setActiveFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[filterKey];
      return newFilters;
    });
  };

  const clearAllFilters = () => {
    setActiveFilters({});
  };

  const getActiveFiltersCount = () => {
    return Object.keys(activeFilters).filter(key => activeFilters[key] !== '' && activeFilters[key] !== null).length;
  };

  return (
    <div className="space-y-4">
      {/* Barra de búsqueda */}
      {showSearch && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-10 pr-4 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-neutral-600 rounded"
            >
              <X className="h-4 w-4 text-neutral-400" />
            </button>
          )}
        </div>
      )}

      {/* Filtros */}
      {showFilters && filters.length > 0 && (
        <div className="space-y-3">
          {/* Botón de filtros */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
              className="flex items-center space-x-2 px-3 py-2 bg-neutral-700 hover:bg-neutral-600 rounded-lg transition-colors"
            >
              <Filter className="h-4 w-4 text-neutral-400" />
              <span className="text-sm text-white">Filtros</span>
              {getActiveFiltersCount() > 0 && (
                <span className="px-2 py-1 bg-primary-500 text-white text-xs rounded-full">
                  {getActiveFiltersCount()}
                </span>
              )}
              <ChevronDown className={`h-4 w-4 text-neutral-400 transition-transform ${
                isFiltersOpen ? 'rotate-180' : ''
              }`} />
            </button>

            {getActiveFiltersCount() > 0 && (
              <button
                onClick={clearAllFilters}
                className="text-xs text-neutral-400 hover:text-white transition-colors"
              >
                Limpiar todos
              </button>
            )}
          </div>

          {/* Panel de filtros */}
          {isFiltersOpen && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-neutral-800 border border-neutral-700 rounded-lg">
              {filters.map((filter) => (
                <div key={filter.key} className="space-y-2">
                  <label className="block text-sm font-medium text-white">
                    {filter.label}
                  </label>
                  
                  {filter.type === 'select' && (
                    <select
                      value={activeFilters[filter.key] || ''}
                      onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                      className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">Todos</option>
                      {filter.options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  )}

                  {filter.type === 'date' && (
                    <input
                      type="date"
                      value={activeFilters[filter.key] || ''}
                      onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                      className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  )}

                  {filter.type === 'range' && (
                    <div className="flex space-x-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={activeFilters[`${filter.key}_min`] || ''}
                        onChange={(e) => handleFilterChange(`${filter.key}_min`, e.target.value)}
                        className="flex-1 px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={activeFilters[`${filter.key}_max`] || ''}
                        onChange={(e) => handleFilterChange(`${filter.key}_max`, e.target.value)}
                        className="flex-1 px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  )}

                  {filter.type === 'checkbox' && (
                    <div className="space-y-2">
                      {filter.options.map((option) => (
                        <label key={option.value} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={activeFilters[filter.key]?.includes(option.value) || false}
                            onChange={(e) => {
                              const currentValues = activeFilters[filter.key] || [];
                              const newValues = e.target.checked
                                ? [...currentValues, option.value]
                                : currentValues.filter(v => v !== option.value);
                              handleFilterChange(filter.key, newValues);
                            }}
                            className="rounded border-neutral-600 bg-neutral-700 text-primary-500 focus:ring-primary-500"
                          />
                          <span className="text-sm text-neutral-300">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Filtros activos */}
          {getActiveFiltersCount() > 0 && (
            <div className="flex flex-wrap gap-2">
              {Object.entries(activeFilters).map(([key, value]) => {
                if (!value || value === '') return null;
                
                const filter = filters.find(f => f.key === key);
                if (!filter) return null;

                let displayValue = value;
                if (filter.type === 'select') {
                  const option = filter.options.find(opt => opt.value === value);
                  displayValue = option?.label || value;
                }

                return (
                  <div
                    key={key}
                    className="flex items-center space-x-2 px-3 py-1 bg-primary-500/20 border border-primary-500/30 rounded-lg"
                  >
                    <span className="text-xs text-primary-400">{filter.label}:</span>
                    <span className="text-xs text-white">{displayValue}</span>
                    <button
                      onClick={() => clearFilter(key)}
                      className="p-1 hover:bg-primary-500/20 rounded"
                    >
                      <X className="h-3 w-3 text-primary-400" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Configuraciones predefinidas de filtros
export const filterConfigs = {
  contracts: [
    {
      key: 'type',
      label: 'Tipo de Contrato',
      type: 'select',
      options: [
        { value: 'locacion', label: 'Locación' },
        { value: 'comercial', label: 'Comercial' },
        { value: 'venta', label: 'Venta' }
      ]
    },
    {
      key: 'status',
      label: 'Estado',
      type: 'select',
      options: [
        { value: 'active', label: 'Activo' },
        { value: 'expired', label: 'Vencido' },
        { value: 'cancelled', label: 'Cancelado' }
      ]
    },
    {
      key: 'price',
      label: 'Precio Mensual',
      type: 'range'
    },
    {
      key: 'startDate',
      label: 'Fecha de Inicio',
      type: 'date'
    }
  ],
  receipts: [
    {
      key: 'type',
      label: 'Tipo de Recibo',
      type: 'select',
      options: [
        { value: 'alquiler', label: 'Alquiler' },
        { value: 'servicios', label: 'Servicios' },
        { value: 'otros', label: 'Otros' }
      ]
    },
    {
      key: 'status',
      label: 'Estado',
      type: 'select',
      options: [
        { value: 'paid', label: 'Pagado' },
        { value: 'pending', label: 'Pendiente' },
        { value: 'overdue', label: 'Vencido' }
      ]
    },
    {
      key: 'amount',
      label: 'Monto',
      type: 'range'
    },
    {
      key: 'paymentDate',
      label: 'Fecha de Pago',
      type: 'date'
    }
  ],
  users: [
    {
      key: 'role',
      label: 'Rol',
      type: 'select',
      options: [
        { value: 'admin', label: 'Administrador' },
        { value: 'agent', label: 'Agente' },
        { value: 'user', label: 'Usuario' }
      ]
    },
    {
      key: 'status',
      label: 'Estado',
      type: 'select',
      options: [
        { value: 'active', label: 'Activo' },
        { value: 'inactive', label: 'Inactivo' }
      ]
    }
  ]
}; 