class ContextualHelpManager {
  constructor() {
    this.helpContent = {
      dashboard: {
        title: 'Dashboard',
        description: 'Vista general del sistema con estadísticas y métricas',
        tips: [
          'Usa los filtros para ver datos específicos',
          'Haz clic en las tarjetas para ver más detalles',
          'Los gráficos son interactivos',
          'Puedes exportar los datos mostrados'
        ],
        shortcuts: [
          { key: 'Ctrl + D', action: 'Ir al Dashboard' },
          { key: 'Ctrl + A', action: 'Ver Analytics' },
          { key: 'Ctrl + S', action: 'Ir a Seguridad' }
        ]
      },
      contracts: {
        title: 'Gestión de Contratos',
        description: 'Crear, editar y gestionar contratos de alquiler y venta',
        tips: [
          'Completa todos los campos obligatorios marcados con *',
          'Guarda borradores para completar después',
          'Revisa el contrato antes de generar el PDF',
          'Puedes duplicar contratos existentes'
        ],
        shortcuts: [
          { key: 'Ctrl + N', action: 'Nuevo Contrato' },
          { key: 'Ctrl + E', action: 'Editar Contrato' },
          { key: 'Ctrl + P', action: 'Imprimir Contrato' }
        ],
        fields: {
          clientName: 'Nombre completo del cliente (obligatorio)',
          clientDNI: 'DNI o documento de identidad',
          clientPhone: 'Teléfono de contacto',
          clientEmail: 'Email para envío de documentos',
          propertyAddress: 'Dirección completa de la propiedad',
          propertyType: 'Tipo de propiedad (casa, departamento, etc.)',
          contractType: 'Tipo de contrato (alquiler o venta)',
          startDate: 'Fecha de inicio del contrato',
          endDate: 'Fecha de finalización del contrato',
          amount: 'Monto del contrato',
          deposit: 'Depósito o señal requerida'
        }
      },
      receipts: {
        title: 'Generación de Recibos',
        description: 'Crear y gestionar recibos de alquiler y servicios',
        tips: [
          'Los recibos se pueden generar automáticamente',
          'Puedes personalizar las plantillas',
          'Guarda una copia digital de cada recibo',
          'Los recibos se pueden enviar por email'
        ],
        shortcuts: [
          { key: 'Ctrl + R', action: 'Nuevo Recibo' },
          { key: 'Ctrl + T', action: 'Plantillas' },
          { key: 'Ctrl + S', action: 'Enviar por Email' }
        ],
        fields: {
          receiptNumber: 'Número automático del recibo',
          clientName: 'Nombre del cliente',
          propertyAddress: 'Dirección de la propiedad',
          amount: 'Monto a cobrar',
          concept: 'Concepto del pago',
          date: 'Fecha de emisión',
          dueDate: 'Fecha de vencimiento'
        }
      },
      users: {
        title: 'Gestión de Usuarios',
        description: 'Administrar usuarios, roles y permisos del sistema',
        tips: [
          'Asigna roles según las responsabilidades',
          'Revisa los permisos antes de crear usuarios',
          'Los cambios de rol requieren confirmación',
          'Mantén las contraseñas seguras'
        ],
        shortcuts: [
          { key: 'Ctrl + U', action: 'Nuevo Usuario' },
          { key: 'Ctrl + R', action: 'Gestionar Roles' },
          { key: 'Ctrl + P', action: 'Ver Permisos' }
        ],
        roles: {
          admin: 'Acceso completo al sistema',
          agent: 'Gestión de contratos y recibos',
          seller: 'Acceso limitado a funciones básicas'
        }
      },
      analytics: {
        title: 'Analytics y Reportes',
        description: 'Ver estadísticas y generar reportes detallados',
        tips: [
          'Los datos se actualizan en tiempo real',
          'Puedes filtrar por fechas específicas',
          'Exporta reportes en múltiples formatos',
          'Comparte reportes con otros usuarios'
        ],
        shortcuts: [
          { key: 'Ctrl + F', action: 'Aplicar Filtros' },
          { key: 'Ctrl + E', action: 'Exportar Reporte' },
          { key: 'Ctrl + S', action: 'Guardar Vista' }
        ]
      },
      security: {
        title: 'Configuración de Seguridad',
        description: 'Gestionar seguridad, roles y auditoría del sistema',
        tips: [
          'Revisa regularmente los logs de auditoría',
          'Configura alertas de seguridad',
          'Mantén actualizados los permisos',
          'Monitorea la actividad sospechosa'
        ],
        shortcuts: [
          { key: 'Ctrl + L', action: 'Ver Logs' },
          { key: 'Ctrl + A', action: 'Configurar Alertas' },
          { key: 'Ctrl + R', action: 'Gestionar Roles' }
        ]
      },
      export: {
        title: 'Exportación de Datos',
        description: 'Exportar información en diferentes formatos',
        tips: [
          'Selecciona solo los datos necesarios',
          'Los archivos grandes pueden tardar en generarse',
          'Verifica el formato antes de exportar',
          'Guarda los archivos en una ubicación segura'
        ],
        formats: {
          pdf: 'Formato ideal para imprimir y compartir',
          excel: 'Perfecto para análisis y cálculos',
          csv: 'Compatible con múltiples sistemas',
          json: 'Para integración con otros sistemas'
        }
      },
      search: {
        title: 'Búsqueda Avanzada',
        description: 'Encontrar información rápidamente en el sistema',
        tips: [
          'Usa comillas para búsquedas exactas',
          'Combina múltiples términos',
          'Usa filtros para refinar resultados',
          'Guarda búsquedas frecuentes'
        ],
        operators: {
          'AND': 'Incluir todos los términos',
          'OR': 'Incluir al menos un término',
          'NOT': 'Excluir términos específicos',
          '"exacto"': 'Buscar frase exacta'
        }
      }
    };

    this.currentContext = null;
    this.helpHistory = [];
    this.setupContextDetection();
  }

  // Configurar detección de contexto
  setupContextDetection() {
    if (typeof window !== 'undefined') {
      // Detectar cambios de ruta
      window.addEventListener('popstate', () => {
        this.updateContext();
      });

      // Detectar cambios en el DOM
      const observer = new MutationObserver(() => {
        this.updateContext();
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    }
  }

  // Actualizar contexto basado en la página actual
  updateContext() {
    const path = window.location.pathname;
    let context = 'dashboard';

    if (path.includes('/contracts')) {
      context = 'contracts';
    } else if (path.includes('/receipts')) {
      context = 'receipts';
    } else if (path.includes('/users')) {
      context = 'users';
    } else if (path.includes('/analytics')) {
      context = 'analytics';
    } else if (path.includes('/security')) {
      context = 'security';
    }

    this.setContext(context);
  }

  // Establecer contexto actual
  setContext(context) {
    if (this.currentContext !== context) {
      this.currentContext = context;
      this.recordHelpUsage(context);
    }
  }

  // Obtener ayuda para el contexto actual
  getCurrentHelp() {
    if (!this.currentContext) {
      this.updateContext();
    }

    return this.helpContent[this.currentContext] || this.helpContent.dashboard;
  }

  // Obtener ayuda específica
  getHelp(context) {
    return this.helpContent[context] || null;
  }

  // Obtener ayuda para un campo específico
  getFieldHelp(context, fieldName) {
    const help = this.getHelp(context);
    if (!help || !help.fields) return null;

    return help.fields[fieldName];
  }

  // Obtener ayuda para un elemento específico
  getElementHelp(elementId) {
    const context = this.currentContext;
    const help = this.getHelp(context);

    if (!help) return null;

    // Buscar ayuda específica para el elemento
    const elementHelp = {
      'new-contract-btn': 'Crear un nuevo contrato',
      'edit-contract-btn': 'Editar el contrato seleccionado',
      'delete-contract-btn': 'Eliminar el contrato (acción irreversible)',
      'export-btn': 'Exportar datos en diferentes formatos',
      'search-input': 'Buscar contratos por cliente o propiedad',
      'filter-select': 'Filtrar contratos por estado o tipo',
      'save-btn': 'Guardar cambios realizados',
      'cancel-btn': 'Cancelar cambios sin guardar',
      'print-btn': 'Imprimir documento actual',
      'email-btn': 'Enviar documento por email'
    };

    return elementHelp[elementId] || null;
  }

  // Obtener atajos de teclado para el contexto actual
  getCurrentShortcuts() {
    const help = this.getCurrentHelp();
    return help?.shortcuts || [];
  }

  // Obtener consejos para el contexto actual
  getCurrentTips() {
    const help = this.getCurrentHelp();
    return help?.tips || [];
  }

  // Registrar uso de ayuda
  recordHelpUsage(context) {
    const timestamp = Date.now();
    this.helpHistory.push({
      context,
      timestamp,
      url: window.location.pathname
    });

    // Mantener solo los últimos 50 registros
    if (this.helpHistory.length > 50) {
      this.helpHistory = this.helpHistory.slice(-50);
    }
  }

  // Obtener historial de ayuda
  getHelpHistory() {
    return this.helpHistory;
  }

  // Obtener secciones más visitadas
  getMostVisitedSections() {
    const visits = {};
    
    this.helpHistory.forEach(record => {
      visits[record.context] = (visits[record.context] || 0) + 1;
    });

    return Object.entries(visits)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([context, count]) => ({
        context,
        count,
        help: this.getHelp(context)
      }));
  }

  // Buscar en la ayuda
  searchHelp(query) {
    const results = [];
    const searchTerm = query.toLowerCase();

    Object.entries(this.helpContent).forEach(([context, help]) => {
      const searchText = `
        ${help.title} ${help.description} 
        ${help.tips?.join(' ')} 
        ${help.shortcuts?.map(s => s.action).join(' ')}
      `.toLowerCase();

      if (searchText.includes(searchTerm)) {
        results.push({
          context,
          help,
          relevance: this.calculateSearchRelevance(searchTerm, searchText)
        });
      }
    });

    return results.sort((a, b) => b.relevance - a.relevance);
  }

  // Calcular relevancia de búsqueda
  calculateSearchRelevance(searchTerm, text) {
    let relevance = 0;
    
    if (text.includes(searchTerm)) {
      relevance += 10;
    }
    
    const words = searchTerm.split(' ');
    words.forEach(word => {
      if (text.includes(word)) {
        relevance += 2;
      }
    });
    
    return relevance;
  }

  // Obtener sugerencias de ayuda
  getHelpSuggestions(query) {
    if (!query || query.length < 2) return [];
    
    const suggestions = [];
    const searchTerm = query.toLowerCase();
    
    Object.entries(this.helpContent).forEach(([context, help]) => {
      if (help.title.toLowerCase().includes(searchTerm) ||
          help.description.toLowerCase().includes(searchTerm)) {
        suggestions.push({
          context,
          title: help.title,
          description: help.description
        });
      }
    });
    
    return suggestions.slice(0, 5);
  }

  // Mostrar tooltip de ayuda
  showTooltip(element, message, position = 'top') {
    const tooltip = document.createElement('div');
    tooltip.className = 'help-tooltip';
    tooltip.textContent = message;
    tooltip.style.cssText = `
      position: absolute;
      background: #1f2937;
      color: white;
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 12px;
      z-index: 1000;
      max-width: 200px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    `;

    document.body.appendChild(tooltip);

    // Posicionar tooltip
    const rect = element.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();

    let left, top;
    switch (position) {
      case 'top':
        left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
        top = rect.top - tooltipRect.height - 8;
        break;
      case 'bottom':
        left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
        top = rect.bottom + 8;
        break;
      case 'left':
        left = rect.left - tooltipRect.width - 8;
        top = rect.top + (rect.height / 2) - (tooltipRect.height / 2);
        break;
      case 'right':
        left = rect.right + 8;
        top = rect.top + (rect.height / 2) - (tooltipRect.height / 2);
        break;
    }

    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;

    // Remover tooltip después de 3 segundos
    setTimeout(() => {
      if (tooltip.parentNode) {
        tooltip.parentNode.removeChild(tooltip);
      }
    }, 3000);

    return tooltip;
  }

  // Mostrar ayuda contextual para un elemento
  showContextualHelp(element, context = null) {
    const elementId = element.id || element.className;
    const help = this.getElementHelp(elementId);
    
    if (help) {
      this.showTooltip(element, help);
    }
  }

  // Generar reporte de uso de ayuda
  generateHelpReport() {
    const mostVisited = this.getMostVisitedSections();
    const totalVisits = this.helpHistory.length;
    
    return {
      totalVisits,
      mostVisited,
      recentActivity: this.helpHistory.slice(-10),
      suggestions: this.generateHelpSuggestions()
    };
  }

  // Generar sugerencias de mejora
  generateHelpSuggestions() {
    const suggestions = [];
    
    // Analizar patrones de uso
    const contextCounts = {};
    this.helpHistory.forEach(record => {
      contextCounts[record.context] = (contextCounts[record.context] || 0) + 1;
    });

    // Sugerir mejoras basadas en uso
    Object.entries(contextCounts).forEach(([context, count]) => {
      if (count > 10) {
        suggestions.push({
          type: 'frequent_use',
          context,
          message: `Considerar agregar más ayuda para ${context}`,
          priority: 'medium'
        });
      }
    });

    return suggestions;
  }

  // Exportar datos de ayuda
  exportHelpData() {
    return {
      helpContent: this.helpContent,
      helpHistory: this.helpHistory,
      currentContext: this.currentContext,
      report: this.generateHelpReport()
    };
  }
}

// Instancia singleton
const contextualHelpManager = new ContextualHelpManager();

export default contextualHelpManager; 