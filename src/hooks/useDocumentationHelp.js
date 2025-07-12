import { useState, useEffect, useCallback } from 'react';
import documentationManager from '../utils/documentation';
import contextualHelpManager from '../utils/contextualHelp';

export const useDocumentationHelp = () => {
  const [currentContext, setCurrentContext] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('gettingStarted');
  const [selectedSection, setSelectedSection] = useState(null);
  const [showHelp, setShowHelp] = useState(false);
  const [helpHistory, setHelpHistory] = useState([]);
  const [readingProgress, setReadingProgress] = useState(null);

  // Cargar estado inicial
  useEffect(() => {
    loadInitialState();
  }, []);

  const loadInitialState = useCallback(() => {
    // Cargar contexto actual
    const context = contextualHelpManager.getCurrentHelp();
    setCurrentContext(context);

    // Cargar progreso de lectura
    const progress = documentationManager.getReadingProgress();
    setReadingProgress(progress);

    // Cargar historial de ayuda
    const history = contextualHelpManager.getHelpHistory();
    setHelpHistory(history);
  }, []);

  // Buscar en documentación
  const searchDocumentation = useCallback((query) => {
    setSearchQuery(query);
    
    if (query.length >= 2) {
      const results = documentationManager.search(query);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, []);

  // Obtener sugerencias de búsqueda
  const getSearchSuggestions = useCallback((query) => {
    return documentationManager.getSearchSuggestions(query);
  }, []);

  // Seleccionar categoría
  const selectCategory = useCallback((categoryId) => {
    setSelectedCategory(categoryId);
    setSelectedSection(null);
  }, []);

  // Seleccionar sección
  const selectSection = useCallback((sectionId) => {
    setSelectedSection(sectionId);
    documentationManager.markAsRead(selectedCategory, sectionId);
    
    // Actualizar progreso
    const progress = documentationManager.getReadingProgress();
    setReadingProgress(progress);
  }, [selectedCategory]);

  // Obtener contenido actual
  const getCurrentContent = useCallback(() => {
    if (searchResults.length > 0) {
      return searchResults[0];
    }

    if (selectedSection) {
      return documentationManager.getSection(selectedCategory, selectedSection);
    }

    return null;
  }, [searchResults, selectedCategory, selectedSection]);

  // Obtener ayuda contextual
  const getContextualHelp = useCallback((context = null) => {
    if (context) {
      return contextualHelpManager.getHelp(context);
    }
    return contextualHelpManager.getCurrentHelp();
  }, []);

  // Obtener ayuda para un campo específico
  const getFieldHelp = useCallback((context, fieldName) => {
    return contextualHelpManager.getFieldHelp(context, fieldName);
  }, []);

  // Mostrar tooltip de ayuda
  const showHelpTooltip = useCallback((element, message, position = 'top') => {
    return contextualHelpManager.showTooltip(element, message, position);
  }, []);

  // Mostrar ayuda contextual para un elemento
  const showContextualHelp = useCallback((element) => {
    contextualHelpManager.showContextualHelp(element);
  }, []);

  // Obtener atajos de teclado actuales
  const getCurrentShortcuts = useCallback(() => {
    return contextualHelpManager.getCurrentShortcuts();
  }, []);

  // Obtener consejos actuales
  const getCurrentTips = useCallback(() => {
    return contextualHelpManager.getCurrentTips();
  }, []);

  // Obtener secciones más visitadas
  const getMostVisitedSections = useCallback(() => {
    return contextualHelpManager.getMostVisitedSections();
  }, []);

  // Obtener categorías de documentación
  const getDocumentationCategories = useCallback(() => {
    return documentationManager.getCategories();
  }, []);

  // Obtener secciones populares
  const getPopularSections = useCallback(() => {
    return documentationManager.getPopularSections();
  }, []);

  // Obtener tabla de contenidos
  const getTableOfContents = useCallback(() => {
    return documentationManager.generateTableOfContents();
  }, []);

  // Exportar documentación
  const exportDocumentation = useCallback((format = 'json') => {
    return documentationManager.exportDocumentation(format);
  }, []);

  // Exportar datos de ayuda
  const exportHelpData = useCallback(() => {
    return contextualHelpManager.exportHelpData();
  }, []);

  // Generar reporte de ayuda
  const generateHelpReport = useCallback(() => {
    return contextualHelpManager.generateHelpReport();
  }, []);

  // Buscar en ayuda contextual
  const searchHelp = useCallback((query) => {
    return contextualHelpManager.searchHelp(query);
  }, []);

  // Obtener sugerencias de ayuda
  const getHelpSuggestions = useCallback((query) => {
    return contextualHelpManager.getHelpSuggestions(query);
  }, []);

  // Marcar sección como leída
  const markSectionAsRead = useCallback((categoryId, sectionId) => {
    documentationManager.markAsRead(categoryId, sectionId);
    
    // Actualizar progreso
    const progress = documentationManager.getReadingProgress();
    setReadingProgress(progress);
  }, []);

  // Obtener secciones leídas
  const getReadSections = useCallback(() => {
    return documentationManager.getReadSections();
  }, []);

  // Obtener progreso de lectura
  const getReadingProgress = useCallback(() => {
    return documentationManager.getReadingProgress();
  }, []);

  // Actualizar contexto
  const updateContext = useCallback(() => {
    contextualHelpManager.updateContext();
    const context = contextualHelpManager.getCurrentHelp();
    setCurrentContext(context);
  }, []);

  // Mostrar/ocultar ayuda
  const toggleHelp = useCallback(() => {
    setShowHelp(prev => !prev);
  }, []);

  // Obtener ayuda para el contexto actual
  const getCurrentHelp = useCallback(() => {
    return contextualHelpManager.getCurrentHelp();
  }, []);

  // Obtener ayuda específica
  const getHelp = useCallback((context) => {
    return contextualHelpManager.getHelp(context);
  }, []);

  // Obtener historial de ayuda
  const getHelpHistory = useCallback(() => {
    return contextualHelpManager.getHelpHistory();
  }, []);

  // Obtener secciones más visitadas de ayuda
  const getMostVisitedHelpSections = useCallback(() => {
    return contextualHelpManager.getMostVisitedSections();
  }, []);

  // Generar reporte completo
  const generateCompleteReport = useCallback(() => {
    const documentationReport = {
      categories: documentationManager.getCategories(),
      popularSections: documentationManager.getPopularSections(),
      readingProgress: documentationManager.getReadingProgress(),
      tableOfContents: documentationManager.generateTableOfContents()
    };

    const helpReport = contextualHelpManager.generateHelpReport();

    return {
      timestamp: Date.now(),
      documentation: documentationReport,
      help: helpReport,
      searchResults,
      currentContext,
      selectedCategory,
      selectedSection
    };
  }, [searchResults, currentContext, selectedCategory, selectedSection]);

  // Descargar reporte completo
  const downloadCompleteReport = useCallback(() => {
    try {
      const report = generateCompleteReport();
      const blob = new Blob([JSON.stringify(report, null, 2)], {
        type: 'application/json'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `documentacion-ayuda-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error descargando reporte:', error);
      throw error;
    }
  }, [generateCompleteReport]);

  // Obtener estadísticas de uso
  const getUsageStats = useCallback(() => {
    const helpHistory = contextualHelpManager.getHelpHistory();
    const readSections = documentationManager.getReadSections();
    const readingProgress = documentationManager.getReadingProgress();

    return {
      totalHelpVisits: helpHistory.length,
      totalSectionsRead: readSections.length,
      readingProgressPercentage: readingProgress.percentage,
      mostVisitedHelp: contextualHelpManager.getMostVisitedSections(),
      recentActivity: helpHistory.slice(-10)
    };
  }, []);

  // Obtener recomendaciones
  const getRecommendations = useCallback(() => {
    const recommendations = [];
    
    // Recomendaciones basadas en progreso de lectura
    if (readingProgress && readingProgress.percentage < 30) {
      recommendations.push({
        type: 'reading_progress',
        message: 'Considera leer más secciones de la documentación',
        priority: 'medium'
      });
    }

    // Recomendaciones basadas en uso de ayuda
    const helpHistory = contextualHelpManager.getHelpHistory();
    if (helpHistory.length > 20) {
      recommendations.push({
        type: 'frequent_help_use',
        message: 'Has usado la ayuda frecuentemente. Considera revisar las guías completas',
        priority: 'low'
      });
    }

    return recommendations;
  }, [readingProgress]);

  return {
    // Estado
    currentContext,
    searchQuery,
    searchResults,
    selectedCategory,
    selectedSection,
    showHelp,
    helpHistory,
    readingProgress,

    // Acciones de documentación
    searchDocumentation,
    getSearchSuggestions,
    selectCategory,
    selectSection,
    getCurrentContent,
    getDocumentationCategories,
    getPopularSections,
    getTableOfContents,
    exportDocumentation,
    markSectionAsRead,
    getReadSections,
    getReadingProgress,

    // Acciones de ayuda contextual
    getContextualHelp,
    getFieldHelp,
    showHelpTooltip,
    showContextualHelp,
    getCurrentShortcuts,
    getCurrentTips,
    getMostVisitedSections,
    getHelp,
    getCurrentHelp,
    getHelpHistory,
    getMostVisitedHelpSections,
    searchHelp,
    getHelpSuggestions,
    exportHelpData,
    generateHelpReport,

    // Utilidades
    updateContext,
    toggleHelp,
    generateCompleteReport,
    downloadCompleteReport,
    getUsageStats,
    getRecommendations
  };
}; 