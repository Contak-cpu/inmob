'use client';

import React, { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, Search, Filter, MoreHorizontal } from 'lucide-react';

/**
 * Componente reutilizable para tablas de datos
 * 
 * @param {Object} props - Props del componente
 * @param {Array} props.data - Datos de la tabla
 * @param {Array} props.columns - Configuración de columnas
 * @param {Function} props.onRowClick - Función llamada al hacer click en una fila
 * @param {boolean} props.loading - Estado de carga
 * @param {string} props.emptyMessage - Mensaje cuando no hay datos
 * @param {boolean} props.searchable - Si la tabla tiene búsqueda
 * @param {boolean} props.sortable - Si la tabla es ordenable
 * @param {boolean} props.selectable - Si las filas son seleccionables
 * @returns {JSX.Element} Componente de tabla
 */
export default function DataTable({
  data = [],
  columns = [],
  onRowClick,
  loading = false,
  emptyMessage = 'No hay datos disponibles',
  searchable = true,
  sortable = true,
  selectable = false,
  className = ''
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [selectedRows, setSelectedRows] = useState(new Set());

  // Filtrar datos por término de búsqueda
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    
    return data.filter(item =>
      columns.some(column => {
        const value = item[column.key];
        if (value == null) return false;
        return value.toString().toLowerCase().includes(searchTerm.toLowerCase());
      })
    );
  }, [data, searchTerm, columns]);

  // Ordenar datos
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredData, sortConfig]);

  // Manejar ordenamiento
  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Manejar selección de filas
  const handleRowSelect = (rowId) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(rowId)) {
      newSelected.delete(rowId);
    } else {
      newSelected.add(rowId);
    }
    setSelectedRows(newSelected);
  };

  // Manejar selección de todas las filas
  const handleSelectAll = () => {
    if (selectedRows.size === sortedData.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(sortedData.map(row => row.id)));
    }
  };

  // Obtener icono de ordenamiento
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <ChevronUp className="h-4 w-4 text-neutral-400" />;
    }
    return sortConfig.direction === 'asc' ? 
      <ChevronUp className="h-4 w-4 text-primary-400" /> : 
      <ChevronDown className="h-4 w-4 text-primary-400" />;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Barra de herramientas */}
      {(searchable || selectable) && (
        <div className="flex items-center justify-between">
          {searchable && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          )}
          
          {selectable && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-neutral-400">
                {selectedRows.size} de {sortedData.length} seleccionados
              </span>
            </div>
          )}
        </div>
      )}

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-700">
              {selectable && (
                <th className="text-left p-3">
                  <input
                    type="checkbox"
                    checked={selectedRows.size === sortedData.length && sortedData.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-neutral-600 bg-neutral-700 text-primary-500 focus:ring-primary-500"
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`text-left p-3 text-sm font-medium text-neutral-400 ${
                    sortable && column.sortable !== false ? 'cursor-pointer hover:text-white' : ''
                  }`}
                  onClick={() => sortable && column.sortable !== false && handleSort(column.key)}
                >
                  <div className="flex items-center space-x-2">
                    <span>{column.label}</span>
                    {sortable && column.sortable !== false && getSortIcon(column.key)}
                  </div>
                </th>
              ))}
              <th className="text-left p-3 w-10"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              // Loading skeleton
              Array.from({ length: 5 }).map((_, index) => (
                <tr key={index} className="border-b border-neutral-700/50">
                  {selectable && (
                    <td className="p-3">
                      <div className="animate-pulse">
                        <div className="h-4 w-4 bg-neutral-700 rounded"></div>
                      </div>
                    </td>
                  )}
                  {columns.map((column) => (
                    <td key={column.key} className="p-3">
                      <div className="animate-pulse">
                        <div className="h-4 bg-neutral-700 rounded"></div>
                      </div>
                    </td>
                  ))}
                  <td className="p-3">
                    <div className="animate-pulse">
                      <div className="h-4 w-4 bg-neutral-700 rounded"></div>
                    </div>
                  </td>
                </tr>
              ))
            ) : sortedData.length === 0 ? (
              // Mensaje de tabla vacía
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0) + 1}
                  className="text-center p-8 text-neutral-400"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              // Datos de la tabla
              sortedData.map((row, index) => (
                <tr
                  key={row.id || index}
                  className={`border-b border-neutral-700/50 hover:bg-neutral-700/30 transition-colors ${
                    onRowClick ? 'cursor-pointer' : ''
                  } ${selectedRows.has(row.id) ? 'bg-primary-500/10' : ''}`}
                  onClick={() => onRowClick && onRowClick(row)}
                >
                  {selectable && (
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={selectedRows.has(row.id)}
                        onChange={() => handleRowSelect(row.id)}
                        className="rounded border-neutral-600 bg-neutral-700 text-primary-500 focus:ring-primary-500"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </td>
                  )}
                  {columns.map((column) => (
                    <td key={column.key} className="p-3">
                      {column.render ? (
                        column.render(row[column.key], row)
                      ) : (
                        <span className="text-white">{row[column.key]}</span>
                      )}
                    </td>
                  ))}
                  <td className="p-3">
                    <button className="p-1 hover:bg-neutral-600 rounded transition-colors">
                      <MoreHorizontal className="h-4 w-4 text-neutral-400" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Información de resultados */}
      {!loading && (
        <div className="flex items-center justify-between text-sm text-neutral-400">
          <span>
            Mostrando {sortedData.length} de {data.length} resultados
          </span>
          {searchTerm && (
            <span>
              Filtrado por "{searchTerm}"
            </span>
          )}
        </div>
      )}
    </div>
  );
} 