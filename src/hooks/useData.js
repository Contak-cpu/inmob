'use client';

import { useState, useCallback, useEffect } from 'react';
import { useNotifications } from './useNotifications';

/**
 * Hook personalizado para manejar datos y operaciones CRUD
 * Proporciona funciones para cargar, crear, actualizar y eliminar datos
 */
export function useData(initialData = []) {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});
  const [sorting, setSorting] = useState({ field: null, direction: 'asc' });
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });
  
  const { showSuccess, showError } = useNotifications();

  // Cargar datos
  const loadData = useCallback(async (loaderFunction, options = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await loaderFunction(options);
      
      if (result.success) {
        setData(result.data);
        if (result.pagination) {
          setPagination(result.pagination);
        }
        return result;
      } else {
        setError(result.error);
        showError('Error al cargar datos', result.error);
        return result;
      }
    } catch (err) {
      const errorMessage = err.message || 'Error interno del sistema';
      setError(errorMessage);
      showError('Error al cargar datos', errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [showError]);

  // Crear nuevo elemento
  const createItem = useCallback(async (creatorFunction, itemData) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await creatorFunction(itemData);
      
      if (result.success) {
        setData(prev => [result.data, ...prev]);
        showSuccess('Elemento creado', 'El elemento se ha creado exitosamente');
        return result;
      } else {
        setError(result.error);
        showError('Error al crear', result.error);
        return result;
      }
    } catch (err) {
      const errorMessage = err.message || 'Error interno del sistema';
      setError(errorMessage);
      showError('Error al crear', errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [showSuccess, showError]);

  // Actualizar elemento
  const updateItem = useCallback(async (updaterFunction, itemId, itemData) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await updaterFunction(itemId, itemData);
      
      if (result.success) {
        setData(prev => prev.map(item => 
          item.id === itemId ? { ...item, ...result.data } : item
        ));
        showSuccess('Elemento actualizado', 'El elemento se ha actualizado exitosamente');
        return result;
      } else {
        setError(result.error);
        showError('Error al actualizar', result.error);
        return result;
      }
    } catch (err) {
      const errorMessage = err.message || 'Error interno del sistema';
      setError(errorMessage);
      showError('Error al actualizar', errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [showSuccess, showError]);

  // Eliminar elemento
  const deleteItem = useCallback(async (deleterFunction, itemId) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await deleterFunction(itemId);
      
      if (result.success) {
        setData(prev => prev.filter(item => item.id !== itemId));
        showSuccess('Elemento eliminado', 'El elemento se ha eliminado exitosamente');
        return result;
      } else {
        setError(result.error);
        showError('Error al eliminar', result.error);
        return result;
      }
    } catch (err) {
      const errorMessage = err.message || 'Error interno del sistema';
      setError(errorMessage);
      showError('Error al eliminar', errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [showSuccess, showError]);

  // Aplicar filtros
  const applyFilters = useCallback((newFilters) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 })); // Resetear a primera página
  }, []);

  // Aplicar ordenamiento
  const applySorting = useCallback((field, direction = 'asc') => {
    setSorting({ field, direction });
  }, []);

  // Cambiar página
  const changePage = useCallback((page) => {
    setPagination(prev => ({ ...prev, page }));
  }, []);

  // Cambiar límite de elementos por página
  const changeLimit = useCallback((limit) => {
    setPagination(prev => ({ ...prev, limit, page: 1 }));
  }, []);

  // Buscar elementos
  const searchItems = useCallback((searchTerm) => {
    setFilters(prev => ({ ...prev, search: searchTerm }));
    setPagination(prev => ({ ...prev, page: 1 }));
  }, []);

  // Limpiar filtros
  const clearFilters = useCallback(() => {
    setFilters({});
    setSorting({ field: null, direction: 'asc' });
    setPagination(prev => ({ ...prev, page: 1 }));
  }, []);

  // Obtener datos filtrados y ordenados
  const getFilteredData = useCallback(() => {
    let filteredData = [...data];

    // Aplicar filtros
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== '') {
        filteredData = filteredData.filter(item => {
          if (key === 'search') {
            // Búsqueda general en todos los campos de texto
            return Object.values(item).some(val => 
              val && val.toString().toLowerCase().includes(value.toLowerCase())
            );
          }
          return item[key] === value;
        });
      }
    });

    // Aplicar ordenamiento
    if (sorting.field) {
      filteredData.sort((a, b) => {
        const aValue = a[sorting.field];
        const bValue = b[sorting.field];
        
        if (aValue < bValue) return sorting.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sorting.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filteredData;
  }, [data, filters, sorting]);

  // Obtener datos paginados
  const getPaginatedData = useCallback(() => {
    const filteredData = getFilteredData();
    const startIndex = (pagination.page - 1) * pagination.limit;
    const endIndex = startIndex + pagination.limit;
    
    return filteredData.slice(startIndex, endIndex);
  }, [getFilteredData, pagination]);

  // Refrescar datos
  const refreshData = useCallback(async (loaderFunction, options = {}) => {
    return await loadData(loaderFunction, options);
  }, [loadData]);

  // Limpiar error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Limpiar datos
  const clearData = useCallback(() => {
    setData([]);
    setError(null);
    setFilters({});
    setSorting({ field: null, direction: 'asc' });
    setPagination({ page: 1, limit: 10, total: 0 });
  }, []);

  return {
    // Estado
    data,
    loading,
    error,
    filters,
    sorting,
    pagination,
    
    // Datos procesados
    filteredData: getFilteredData(),
    paginatedData: getPaginatedData(),
    
    // Funciones CRUD
    loadData,
    createItem,
    updateItem,
    deleteItem,
    refreshData,
    
    // Funciones de filtrado y ordenamiento
    applyFilters,
    applySorting,
    searchItems,
    clearFilters,
    
    // Funciones de paginación
    changePage,
    changeLimit,
    
    // Funciones de utilidad
    clearError,
    clearData,
  };
} 