'use client';

import { useCallback, useState } from 'react';
import { useApp } from '@/contexts/AppContext';

/**
 * Hook personalizado para manejar la interfaz de usuario
 * Proporciona funciones para controlar elementos de UI como modales, sidebars, etc.
 */
export function useUI() {
  const { sidebarOpen, toggleSidebar, closeSidebar } = useApp();
  const [modals, setModals] = useState({});
  const [tooltips, setTooltips] = useState({});

  // Funciones para manejar modales
  const openModal = useCallback((modalId) => {
    setModals(prev => ({ ...prev, [modalId]: true }));
  }, []);

  const closeModal = useCallback((modalId) => {
    setModals(prev => ({ ...prev, [modalId]: false }));
  }, []);

  const isModalOpen = useCallback((modalId) => {
    return modals[modalId] || false;
  }, [modals]);

  // Funciones para manejar tooltips
  const showTooltip = useCallback((tooltipId) => {
    setTooltips(prev => ({ ...prev, [tooltipId]: true }));
  }, []);

  const hideTooltip = useCallback((tooltipId) => {
    setTooltips(prev => ({ ...prev, [tooltipId]: false }));
  }, []);

  const isTooltipVisible = useCallback((tooltipId) => {
    return tooltips[tooltipId] || false;
  }, [tooltips]);

  // Funciones para manejar dropdowns
  const [dropdowns, setDropdowns] = useState({});

  const openDropdown = useCallback((dropdownId) => {
    setDropdowns(prev => ({ ...prev, [dropdownId]: true }));
  }, []);

  const closeDropdown = useCallback((dropdownId) => {
    setDropdowns(prev => ({ ...prev, [dropdownId]: false }));
  }, []);

  const isDropdownOpen = useCallback((dropdownId) => {
    return dropdowns[dropdownId] || false;
  }, [dropdowns]);

  const toggleDropdown = useCallback((dropdownId) => {
    setDropdowns(prev => ({ 
      ...prev, 
      [dropdownId]: !prev[dropdownId] 
    }));
  }, []);

  // Funciones para manejar tabs
  const [activeTabs, setActiveTabs] = useState({});

  const setActiveTab = useCallback((tabGroupId, tabId) => {
    setActiveTabs(prev => ({ ...prev, [tabGroupId]: tabId }));
  }, []);

  const getActiveTab = useCallback((tabGroupId) => {
    return activeTabs[tabGroupId] || null;
  }, [activeTabs]);

  // Funciones para manejar formularios
  const [formStates, setFormStates] = useState({});

  const setFormState = useCallback((formId, state) => {
    setFormStates(prev => ({ ...prev, [formId]: state }));
  }, []);

  const getFormState = useCallback((formId) => {
    return formStates[formId] || {};
  }, [formStates]);

  // Funciones para manejar loading states
  const [loadingStates, setLoadingStates] = useState({});

  const setLoading = useCallback((loadingId, isLoading) => {
    setLoadingStates(prev => ({ ...prev, [loadingId]: isLoading }));
  }, []);

  const isLoading = useCallback((loadingId) => {
    return loadingStates[loadingId] || false;
  }, [loadingStates]);

  // Funciones para manejar errores de UI
  const [uiErrors, setUiErrors] = useState({});

  const setUIError = useCallback((errorId, error) => {
    setUiErrors(prev => ({ ...prev, [errorId]: error }));
  }, []);

  const clearUIError = useCallback((errorId) => {
    setUiErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[errorId];
      return newErrors;
    });
  }, []);

  const getUIError = useCallback((errorId) => {
    return uiErrors[errorId] || null;
  }, [uiErrors]);

  // Funciones para manejar confirmaciones
  const [confirmations, setConfirmations] = useState({});

  const showConfirmation = useCallback((confirmationId, config) => {
    setConfirmations(prev => ({ 
      ...prev, 
      [confirmationId]: { ...config, visible: true } 
    }));
  }, []);

  const hideConfirmation = useCallback((confirmationId) => {
    setConfirmations(prev => {
      const newConfirmations = { ...prev };
      if (newConfirmations[confirmationId]) {
        newConfirmations[confirmationId].visible = false;
      }
      return newConfirmations;
    });
  }, []);

  const getConfirmation = useCallback((confirmationId) => {
    return confirmations[confirmationId] || null;
  }, [confirmations]);

  return {
    // Sidebar
    sidebarOpen,
    toggleSidebar,
    closeSidebar,
    
    // Modales
    openModal,
    closeModal,
    isModalOpen,
    
    // Tooltips
    showTooltip,
    hideTooltip,
    isTooltipVisible,
    
    // Dropdowns
    openDropdown,
    closeDropdown,
    isDropdownOpen,
    toggleDropdown,
    
    // Tabs
    setActiveTab,
    getActiveTab,
    
    // Formularios
    setFormState,
    getFormState,
    
    // Loading states
    setLoading,
    isLoading,
    
    // UI Errors
    setUIError,
    clearUIError,
    getUIError,
    
    // Confirmaciones
    showConfirmation,
    hideConfirmation,
    getConfirmation,
  };
} 