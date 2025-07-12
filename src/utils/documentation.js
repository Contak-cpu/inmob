class DocumentationManager {
  constructor() {
    this.documentation = {
      gettingStarted: {
        title: 'Primeros Pasos',
        icon: '🚀',
        sections: [
          {
            id: 'welcome',
            title: 'Bienvenido al Sistema',
            content: `
              <h2>Bienvenido al Sistema Inmobiliario</h2>
              <p>Este sistema te permite gestionar contratos, recibos y clientes de manera eficiente.</p>
              
              <h3>Características Principales</h3>
              <ul>
                <li><strong>Gestión de Contratos:</strong> Crear, editar y gestionar contratos de alquiler y venta</li>
                <li><strong>Generación de Recibos:</strong> Crear recibos automáticos y manuales</li>
                <li><strong>Gestión de Usuarios:</strong> Administrar usuarios y permisos</li>
                <li><strong>Analytics:</strong> Ver estadísticas y reportes en tiempo real</li>
                <li><strong>Exportación:</strong> Exportar datos en múltiples formatos</li>
              </ul>
              
              <h3>Navegación Rápida</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div class="p-4 bg-blue-50 rounded-lg">
                  <h4 class="font-semibold text-blue-800">Dashboard</h4>
                  <p class="text-sm text-blue-600">Vista general del sistema y estadísticas</p>
                </div>
                <div class="p-4 bg-green-50 rounded-lg">
                  <h4 class="font-semibold text-green-800">Contratos</h4>
                  <p class="text-sm text-green-600">Gestionar contratos de alquiler y venta</p>
                </div>
                <div class="p-4 bg-purple-50 rounded-lg">
                  <h4 class="font-semibold text-purple-800">Recibos</h4>
                  <p class="text-sm text-purple-600">Crear y gestionar recibos</p>
                </div>
                <div class="p-4 bg-orange-50 rounded-lg">
                  <h4 class="font-semibold text-orange-800">Usuarios</h4>
                  <p class="text-sm text-orange-600">Administrar usuarios del sistema</p>
                </div>
              </div>
            `
          },
          {
            id: 'quickStart',
            title: 'Inicio Rápido',
            content: `
              <h2>Inicio Rápido</h2>
              <p>Sigue estos pasos para comenzar a usar el sistema:</p>
              
              <div class="space-y-4">
                <div class="flex items-start space-x-3">
                  <div class="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span class="text-blue-600 font-semibold">1</span>
                  </div>
                  <div>
                    <h3 class="font-semibold">Crear tu primer contrato</h3>
                    <p class="text-sm text-gray-600">Ve a la sección "Contratos" y haz clic en "Nuevo Contrato"</p>
                  </div>
                </div>
                
                <div class="flex items-start space-x-3">
                  <div class="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span class="text-green-600 font-semibold">2</span>
                  </div>
                  <div>
                    <h3 class="font-semibold">Generar un recibo</h3>
                    <p class="text-sm text-gray-600">En "Recibos" crea recibos automáticos o manuales</p>
                  </div>
                </div>
                
                <div class="flex items-start space-x-3">
                  <div class="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <span class="text-purple-600 font-semibold">3</span>
                  </div>
                  <div>
                    <h3 class="font-semibold">Ver estadísticas</h3>
                    <p class="text-sm text-gray-600">Revisa el dashboard para ver métricas en tiempo real</p>
                  </div>
                </div>
                
                <div class="flex items-start space-x-3">
                  <div class="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <span class="text-orange-600 font-semibold">4</span>
                  </div>
                  <div>
                    <h3 class="font-semibold">Exportar datos</h3>
                    <p class="text-sm text-gray-600">Usa la función de exportación para respaldar información</p>
                  </div>
                </div>
              </div>
            `
          }
        ]
      },
      contracts: {
        title: 'Contratos',
        icon: '📄',
        sections: [
          {
            id: 'createContract',
            title: 'Crear Contrato',
            content: `
              <h2>Crear un Nuevo Contrato</h2>
              <p>Sigue estos pasos para crear un contrato:</p>
              
              <h3>Paso 1: Seleccionar Tipo</h3>
              <ul>
                <li>Ve a la sección "Contratos"</li>
                <li>Haz clic en "Nuevo Contrato"</li>
                <li>Selecciona el tipo: Alquiler o Venta</li>
              </ul>
              
              <h3>Paso 2: Completar Información</h3>
              <ul>
                <li><strong>Datos del Cliente:</strong> Nombre, DNI, teléfono, email</li>
                <li><strong>Datos de la Propiedad:</strong> Dirección, tipo, características</li>
                <li><strong>Condiciones:</strong> Precio, duración, términos especiales</li>
                <li><strong>Fechas:</strong> Inicio y fin del contrato</li>
              </ul>
              
              <h3>Paso 3: Revisar y Generar</h3>
              <ul>
                <li>Revisa toda la información</li>
                <li>Haz clic en "Generar Contrato"</li>
                <li>Descarga el PDF generado</li>
              </ul>
              
              <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                <h4 class="font-semibold text-yellow-800">💡 Consejo</h4>
                <p class="text-sm text-yellow-700">Guarda una copia digital del contrato en el sistema para fácil acceso.</p>
              </div>
            `
          },
          {
            id: 'editContract',
            title: 'Editar Contrato',
            content: `
              <h2>Editar Contrato Existente</h2>
              <p>Para editar un contrato existente:</p>
              
              <h3>Acceso a Edición</h3>
              <ul>
                <li>Ve a la lista de contratos</li>
                <li>Haz clic en el botón "Editar" del contrato</li>
                <li>Modifica los campos necesarios</li>
                <li>Guarda los cambios</li>
              </ul>
              
              <h3>Campos Editables</h3>
              <ul>
                <li>Información del cliente</li>
                <li>Datos de la propiedad</li>
                <li>Condiciones económicas</li>
                <li>Fechas de vigencia</li>
                <li>Cláusulas especiales</li>
              </ul>
              
              <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                <h4 class="font-semibold text-blue-800">⚠️ Importante</h4>
                <p class="text-sm text-blue-700">Los cambios en contratos activos pueden requerir notificación al cliente.</p>
              </div>
            `
          },
          {
            id: 'contractTypes',
            title: 'Tipos de Contrato',
            content: `
              <h2>Tipos de Contrato Disponibles</h2>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="bg-blue-50 p-4 rounded-lg">
                  <h3 class="font-semibold text-blue-800">Contrato de Alquiler</h3>
                  <ul class="text-sm text-blue-700 mt-2">
                    <li>• Duración: 2 años (renovable)</li>
                    <li>• Depósito: 1 mes de alquiler</li>
                    <li>• Gastos: A cargo del inquilino</li>
                    <li>• Rescisión: 30 días de preaviso</li>
                  </ul>
                </div>
                
                <div class="bg-green-50 p-4 rounded-lg">
                  <h3 class="font-semibold text-green-800">Contrato de Venta</h3>
                  <ul class="text-sm text-green-700 mt-2">
                    <li>• Escrituración: 30 días</li>
                    <li>• Señado: 10% del valor</li>
                    <li>• Gastos: Según convenio</li>
                    <li>• Rescisión: Según cláusulas</li>
                  </ul>
                </div>
              </div>
            `
          }
        ]
      },
      receipts: {
        title: 'Recibos',
        icon: '🧾',
        sections: [
          {
            id: 'createReceipt',
            title: 'Crear Recibo',
            content: `
              <h2>Crear un Nuevo Recibo</h2>
              
              <h3>Tipos de Recibo</h3>
              <ul>
                <li><strong>Recibo de Alquiler:</strong> Para pagos mensuales de alquiler</li>
                <li><strong>Recibo de Servicios:</strong> Para gastos de servicios</li>
                <li><strong>Recibo de Mantenimiento:</strong> Para gastos de mantenimiento</li>
                <li><strong>Recibo Personalizado:</strong> Para otros conceptos</li>
              </ul>
              
              <h3>Proceso de Creación</h3>
              <ol>
                <li>Selecciona el tipo de recibo</li>
                <li>Completa los datos del cliente</li>
                <li>Ingresa el monto y concepto</li>
                <li>Selecciona la fecha de emisión</li>
                <li>Genera y descarga el PDF</li>
              </ol>
              
              <div class="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                <h4 class="font-semibold text-green-800">✅ Automatización</h4>
                <p class="text-sm text-green-700">Los recibos de alquiler se pueden generar automáticamente cada mes.</p>
              </div>
            `
          },
          {
            id: 'receiptTemplates',
            title: 'Plantillas de Recibo',
            content: `
              <h2>Plantillas Disponibles</h2>
              
              <div class="space-y-4">
                <div class="border rounded-lg p-4">
                  <h3 class="font-semibold">Plantilla Estándar</h3>
                  <p class="text-sm text-gray-600">Recibo básico con información esencial</p>
                  <ul class="text-xs text-gray-500 mt-2">
                    <li>• Datos del cliente</li>
                    <li>• Concepto y monto</li>
                    <li>• Fecha de emisión</li>
                  </ul>
                </div>
                
                <div class="border rounded-lg p-4">
                  <h3 class="font-semibold">Plantilla Detallada</h3>
                  <p class="text-sm text-gray-600">Recibo con información completa</p>
                  <ul class="text-xs text-gray-500 mt-2">
                    <li>• Datos completos del cliente</li>
                    <li>• Desglose de conceptos</li>
                    <li>• Información de la propiedad</li>
                    <li>• Términos y condiciones</li>
                  </ul>
                </div>
                
                <div class="border rounded-lg p-4">
                  <h3 class="font-semibold">Plantilla Personalizada</h3>
                  <p class="text-sm text-gray-600">Recibo con diseño personalizado</p>
                  <ul class="text-xs text-gray-500 mt-2">
                    <li>• Logo de la empresa</li>
                    <li>• Colores personalizados</li>
                    <li>• Información adicional</li>
                  </ul>
                </div>
              </div>
            `
          }
        ]
      },
      users: {
        title: 'Usuarios',
        icon: '👥',
        sections: [
          {
            id: 'userRoles',
            title: 'Roles de Usuario',
            content: `
              <h2>Roles y Permisos</h2>
              
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="bg-red-50 p-4 rounded-lg">
                  <h3 class="font-semibold text-red-800">Administrador</h3>
                  <ul class="text-sm text-red-700 mt-2">
                    <li>• Acceso completo al sistema</li>
                    <li>• Gestión de usuarios</li>
                    <li>• Configuración del sistema</li>
                    <li>• Reportes y analytics</li>
                  </ul>
                </div>
                
                <div class="bg-blue-50 p-4 rounded-lg">
                  <h3 class="font-semibold text-blue-800">Agente</h3>
                  <ul class="text-sm text-blue-700 mt-2">
                    <li>• Crear y editar contratos</li>
                    <li>• Generar recibos</li>
                    <li>• Ver reportes básicos</li>
                    <li>• Gestión de clientes</li>
                  </ul>
                </div>
                
                <div class="bg-green-50 p-4 rounded-lg">
                  <h3 class="font-semibold text-green-800">Vendedor</h3>
                  <ul class="text-sm text-green-700 mt-2">
                    <li>• Ver contratos asignados</li>
                    <li>• Generar recibos básicos</li>
                    <li>• Acceso limitado a reportes</li>
                  </ul>
                </div>
              </div>
            `
          },
          {
            id: 'userManagement',
            title: 'Gestión de Usuarios',
            content: `
              <h2>Gestionar Usuarios</h2>
              
              <h3>Crear Nuevo Usuario</h3>
              <ol>
                <li>Ve a la sección "Usuarios"</li>
                <li>Haz clic en "Nuevo Usuario"</li>
                <li>Completa los datos requeridos</li>
                <li>Asigna el rol correspondiente</li>
                <li>Guarda el usuario</li>
              </ol>
              
              <h3>Editar Usuario</h3>
              <ul>
                <li>Accede a la lista de usuarios</li>
                <li>Haz clic en "Editar"</li>
                <li>Modifica los datos necesarios</li>
                <li>Actualiza permisos si es necesario</li>
              </ul>
              
              <h3>Eliminar Usuario</h3>
              <div class="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
                <h4 class="font-semibold text-red-800">⚠️ Precaución</h4>
                <p class="text-sm text-red-700">La eliminación de usuarios es permanente y no se puede deshacer.</p>
              </div>
            `
          }
        ]
      },
      analytics: {
        title: 'Analytics',
        icon: '📊',
        sections: [
          {
            id: 'dashboard',
            title: 'Dashboard',
            content: `
              <h2>Dashboard Principal</h2>
              
              <h3>Métricas Principales</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="bg-blue-50 p-4 rounded-lg">
                  <h4 class="font-semibold text-blue-800">Contratos Activos</h4>
                  <p class="text-sm text-blue-600">Número total de contratos vigentes</p>
                </div>
                <div class="bg-green-50 p-4 rounded-lg">
                  <h4 class="font-semibold text-green-800">Recibos Generados</h4>
                  <p class="text-sm text-green-600">Total de recibos creados este mes</p>
                </div>
                <div class="bg-purple-50 p-4 rounded-lg">
                  <h4 class="font-semibold text-purple-800">Clientes Activos</h4>
                  <p class="text-sm text-purple-600">Usuarios únicos con actividad</p>
                </div>
                <div class="bg-orange-50 p-4 rounded-lg">
                  <h4 class="font-semibold text-orange-800">Ingresos Mensuales</h4>
                  <p class="text-sm text-orange-600">Total de ingresos del mes</p>
                </div>
              </div>
              
              <h3>Gráficos Interactivos</h3>
              <ul>
                <li><strong>Actividad Reciente:</strong> Últimas acciones del sistema</li>
                <li><strong>Distribución de Documentos:</strong> Porcentaje por tipo</li>
                <li><strong>Próximos Vencimientos:</strong> Alertas de fechas límite</li>
                <li><strong>Rendimiento del Sistema:</strong> Métricas técnicas</li>
              </ul>
            `
          },
          {
            id: 'reports',
            title: 'Reportes',
            content: `
              <h2>Generar Reportes</h2>
              
              <h3>Tipos de Reporte</h3>
              <ul>
                <li><strong>Reporte de Contratos:</strong> Lista detallada de contratos</li>
                <li><strong>Reporte de Recibos:</strong> Recibos por período</li>
                <li><strong>Reporte de Usuarios:</strong> Actividad de usuarios</li>
                <li><strong>Reporte Financiero:</strong> Ingresos y gastos</li>
              </ul>
              
              <h3>Filtros Disponibles</h3>
              <ul>
                <li>Por fecha (desde/hasta)</li>
                <li>Por tipo de documento</li>
                <li>Por usuario responsable</li>
                <li>Por estado (activo/inactivo)</li>
              </ul>
              
              <h3>Formatos de Exportación</h3>
              <div class="grid grid-cols-1 md:grid-cols-4 gap-2">
                <div class="text-center p-2 bg-blue-100 rounded">PDF</div>
                <div class="text-center p-2 bg-green-100 rounded">Excel</div>
                <div class="text-center p-2 bg-purple-100 rounded">CSV</div>
                <div class="text-center p-2 bg-orange-100 rounded">JSON</div>
              </div>
            `
          }
        ]
      },
      security: {
        title: 'Seguridad',
        icon: '🔒',
        sections: [
          {
            id: 'authentication',
            title: 'Autenticación',
            content: `
              <h2>Sistema de Autenticación</h2>
              
              <h3>Iniciar Sesión</h3>
              <ul>
                <li>Ingresa tu email y contraseña</li>
                <li>El sistema verifica tus credenciales</li>
                <li>Se crea una sesión segura</li>
                <li>Accedes a las funciones según tu rol</li>
              </ul>
              
              <h3>Seguridad de Contraseñas</h3>
              <ul>
                <li>Mínimo 8 caracteres</li>
                <li>Debe incluir mayúsculas y minúsculas</li>
                <li>Al menos un número</li>
                <li>Caracteres especiales recomendados</li>
              </ul>
              
              <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                <h4 class="font-semibold text-yellow-800">🔐 Consejo de Seguridad</h4>
                <p class="text-sm text-yellow-700">Cambia tu contraseña regularmente y no la compartas con nadie.</p>
              </div>
            `
          },
          {
            id: 'permissions',
            title: 'Permisos y Roles',
            content: `
              <h2>Sistema de Permisos</h2>
              
              <h3>Niveles de Acceso</h3>
              <div class="space-y-3">
                <div class="flex items-center space-x-3">
                  <div class="w-4 h-4 bg-red-500 rounded"></div>
                  <span class="font-semibold">Acceso Completo</span>
                  <span class="text-sm text-gray-600">Administradores</span>
                </div>
                <div class="flex items-center space-x-3">
                  <div class="w-4 h-4 bg-blue-500 rounded"></div>
                  <span class="font-semibold">Acceso Moderado</span>
                  <span class="text-sm text-gray-600">Agentes</span>
                </div>
                <div class="flex items-center space-x-3">
                  <div class="w-4 h-4 bg-green-500 rounded"></div>
                  <span class="font-semibold">Acceso Limitado</span>
                  <span class="text-sm text-gray-600">Vendedores</span>
                </div>
              </div>
              
              <h3>Auditoría</h3>
              <ul>
                <li>Todas las acciones se registran</li>
                <li>Se guarda información de usuario y fecha</li>
                <li>Los logs se pueden consultar</li>
                <li>Se mantiene trazabilidad completa</li>
              </ul>
            `
          }
        ]
      }
    };

    this.searchIndex = this.buildSearchIndex();
  }

  // Construir índice de búsqueda
  buildSearchIndex() {
    const index = [];
    
    Object.entries(this.documentation).forEach(([category, categoryData]) => {
      categoryData.sections.forEach(section => {
        index.push({
          category,
          categoryTitle: categoryData.title,
          categoryIcon: categoryData.icon,
          sectionId: section.id,
          sectionTitle: section.title,
          content: section.content,
          searchText: this.extractSearchText(section.content)
        });
      });
    });
    
    return index;
  }

  // Extraer texto para búsqueda
  extractSearchText(content) {
    // Remover HTML tags y extraer texto
    return content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').toLowerCase();
  }

  // Buscar en la documentación
  search(query) {
    const searchTerm = query.toLowerCase();
    const results = [];
    
    this.searchIndex.forEach(item => {
      const relevance = this.calculateRelevance(searchTerm, item.searchText);
      if (relevance > 0) {
        results.push({
          ...item,
          relevance
        });
      }
    });
    
    return results.sort((a, b) => b.relevance - a.relevance);
  }

  // Calcular relevancia de búsqueda
  calculateRelevance(searchTerm, text) {
    let relevance = 0;
    
    // Búsqueda exacta
    if (text.includes(searchTerm)) {
      relevance += 10;
    }
    
    // Búsqueda por palabras
    const searchWords = searchTerm.split(' ');
    searchWords.forEach(word => {
      if (text.includes(word)) {
        relevance += 2;
      }
    });
    
    return relevance;
  }

  // Obtener categorías
  getCategories() {
    return Object.entries(this.documentation).map(([key, data]) => ({
      id: key,
      title: data.title,
      icon: data.icon,
      sectionCount: data.sections.length
    }));
  }

  // Obtener sección específica
  getSection(categoryId, sectionId) {
    const category = this.documentation[categoryId];
    if (!category) return null;
    
    return category.sections.find(section => section.id === sectionId);
  }

  // Obtener categoría completa
  getCategory(categoryId) {
    return this.documentation[categoryId];
  }

  // Obtener secciones populares
  getPopularSections() {
    return [
      {
        category: 'gettingStarted',
        categoryTitle: 'Primeros Pasos',
        categoryIcon: '🚀',
        sectionId: 'welcome',
        sectionTitle: 'Bienvenido al Sistema'
      },
      {
        category: 'contracts',
        categoryTitle: 'Contratos',
        categoryIcon: '📄',
        sectionId: 'createContract',
        sectionTitle: 'Crear Contrato'
      },
      {
        category: 'receipts',
        categoryTitle: 'Recibos',
        categoryIcon: '🧾',
        sectionId: 'createReceipt',
        sectionTitle: 'Crear Recibo'
      },
      {
        category: 'users',
        categoryTitle: 'Usuarios',
        categoryIcon: '👥',
        sectionId: 'userRoles',
        sectionTitle: 'Roles de Usuario'
      }
    ];
  }

  // Generar tabla de contenidos
  generateTableOfContents() {
    const toc = [];
    
    Object.entries(this.documentation).forEach(([categoryId, category]) => {
      toc.push({
        id: categoryId,
        title: category.title,
        icon: category.icon,
        sections: category.sections.map(section => ({
          id: section.id,
          title: section.title
        }))
      });
    });
    
    return toc;
  }

  // Obtener sugerencias de búsqueda
  getSearchSuggestions(query) {
    if (!query || query.length < 2) return [];
    
    const suggestions = new Set();
    const searchTerm = query.toLowerCase();
    
    this.searchIndex.forEach(item => {
      if (item.searchText.includes(searchTerm)) {
        suggestions.add(item.sectionTitle);
      }
    });
    
    return Array.from(suggestions).slice(0, 5);
  }

  // Marcar contenido como leído
  markAsRead(categoryId, sectionId) {
    const key = `${categoryId}-${sectionId}`;
    const readSections = JSON.parse(localStorage.getItem('readSections') || '[]');
    
    if (!readSections.includes(key)) {
      readSections.push(key);
      localStorage.setItem('readSections', JSON.stringify(readSections));
    }
  }

  // Obtener secciones leídas
  getReadSections() {
    return JSON.parse(localStorage.getItem('readSections') || '[]');
  }

  // Obtener progreso de lectura
  getReadingProgress() {
    const readSections = this.getReadSections();
    const totalSections = this.searchIndex.length;
    const readCount = readSections.length;
    
    return {
      readCount,
      totalCount: totalSections,
      percentage: Math.round((readCount / totalCount) * 100)
    };
  }

  // Exportar documentación
  exportDocumentation(format = 'json') {
    switch (format) {
      case 'json':
        return JSON.stringify(this.documentation, null, 2);
      case 'html':
        return this.generateHTMLDocumentation();
      case 'pdf':
        return this.generatePDFDocumentation();
      default:
        return this.documentation;
    }
  }

  // Generar documentación HTML
  generateHTMLDocumentation() {
    let html = '<!DOCTYPE html><html><head><title>Documentación del Sistema</title></head><body>';
    
    Object.entries(this.documentation).forEach(([categoryId, category]) => {
      html += `<h1>${category.icon} ${category.title}</h1>`;
      
      category.sections.forEach(section => {
        html += `<h2>${section.title}</h2>`;
        html += section.content;
      });
    });
    
    html += '</body></html>';
    return html;
  }

  // Generar documentación PDF (simulado)
  generatePDFDocumentation() {
    // En una implementación real, aquí se generaría un PDF
    return 'PDF documentation would be generated here';
  }
}

// Instancia singleton
const documentationManager = new DocumentationManager();

export default documentationManager; 