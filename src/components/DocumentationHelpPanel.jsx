'use client';

import React, { useState, useEffect } from 'react';
import { Search, BookOpen, HelpCircle, FileText, Users, Settings, TrendingUp, Download, Eye } from 'lucide-react';
import documentationManager from '../utils/documentation';
import contextualHelpManager from '../utils/contextualHelp';

const DocumentationHelpPanel = () => {
  const [activeTab, setActiveTab] = useState('documentation');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('gettingStarted');
  const [selectedSection, setSelectedSection] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [helpContext, setHelpContext] = useState(null);

  useEffect(() => {
    // Cargar contexto de ayuda actual
    const currentHelp = contextualHelpManager.getCurrentHelp();
    setHelpContext(currentHelp);
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.length >= 2) {
      const results = documentationManager.search(query);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    setSelectedSection(null);
  };

  const handleSectionSelect = (sectionId) => {
    setSelectedSection(sectionId);
    documentationManager.markAsRead(selectedCategory, sectionId);
  };

  const getCurrentContent = () => {
    if (searchResults.length > 0) {
      return searchResults[0];
    }

    if (selectedSection) {
      return documentationManager.getSection(selectedCategory, selectedSection);
    }

    return null;
  };

  const tabs = [
    { id: 'documentation', label: '📚 Documentación', icon: BookOpen },
    { id: 'help', label: '❓ Ayuda Contextual', icon: HelpCircle },
    { id: 'search', label: '🔍 Búsqueda', icon: Search },
    { id: 'guides', label: '📖 Guías', icon: FileText }
  ];

  const categories = documentationManager.getCategories();
  const currentContent = getCurrentContent();
  const popularSections = documentationManager.getPopularSections();
  const readingProgress = documentationManager.getReadingProgress();

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Documentación y Ayuda
        </h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            title="Búsqueda rápida"
          >
            <Search className="h-5 w-5 text-gray-600" />
          </button>
          <button
            onClick={() => documentationManager.exportDocumentation('json')}
            className="p-2 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors"
            title="Exportar documentación"
          >
            <Download className="h-5 w-5 text-blue-600" />
          </button>
        </div>
      </div>

      {/* Búsqueda rápida */}
      {showSearch && (
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar en la documentación..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          {searchQuery.length >= 2 && (
            <div className="mt-2 text-sm text-gray-600">
              {searchResults.length} resultados encontrados
            </div>
          )}
        </div>
      )}

      {/* Pestañas */}
      <div className="flex border-b border-gray-200 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Contenido de pestañas */}
      <div className="min-h-[500px]">
        {activeTab === 'documentation' && (
          <DocumentationTab
            categories={categories}
            selectedCategory={selectedCategory}
            selectedSection={selectedSection}
            currentContent={currentContent}
            popularSections={popularSections}
            readingProgress={readingProgress}
            onCategorySelect={handleCategorySelect}
            onSectionSelect={handleSectionSelect}
            searchResults={searchResults}
          />
        )}

        {activeTab === 'help' && (
          <HelpTab
            helpContext={helpContext}
            contextualHelpManager={contextualHelpManager}
          />
        )}

        {activeTab === 'search' && (
          <SearchTab
            searchQuery={searchQuery}
            searchResults={searchResults}
            onSearch={handleSearch}
          />
        )}

        {activeTab === 'guides' && (
          <GuidesTab />
        )}
      </div>
    </div>
  );
};

// Componente de Documentación
const DocumentationTab = ({
  categories,
  selectedCategory,
  selectedSection,
  currentContent,
  popularSections,
  readingProgress,
  onCategorySelect,
  onSectionSelect,
  searchResults
}) => {
  const category = documentationManager.getCategory(selectedCategory);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Sidebar con categorías */}
      <div className="lg:col-span-1">
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-800 mb-4">Categorías</h3>
          <div className="space-y-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onCategorySelect(cat.id)}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-blue-100 text-blue-800'
                    : 'hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{cat.icon}</span>
                  <div>
                    <div className="font-medium">{cat.title}</div>
                    <div className="text-sm text-gray-500">{cat.sectionCount} secciones</div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Progreso de lectura */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Progreso de Lectura</h4>
            <div className="flex items-center space-x-2 mb-2">
              <div className="flex-1 bg-blue-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${readingProgress.percentage}%` }}
                ></div>
              </div>
              <span className="text-sm text-blue-600">{readingProgress.percentage}%</span>
            </div>
            <div className="text-sm text-blue-600">
              {readingProgress.readCount} de {readingProgress.totalCount} secciones leídas
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="lg:col-span-3">
        {searchResults.length > 0 ? (
          <SearchResults results={searchResults} onSectionSelect={onSectionSelect} />
        ) : (
          <div className="space-y-6">
            {/* Secciones de la categoría */}
            {category && (
              <div className="bg-white border rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  {category.icon} {category.title}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {category.sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => onSectionSelect(section.id)}
                      className={`text-left p-4 rounded-lg border transition-colors ${
                        selectedSection === section.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <h4 className="font-semibold text-gray-800">{section.title}</h4>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Contenido de la sección */}
            {currentContent && (
              <div className="bg-white border rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  {currentContent.title}
                </h3>
                <div
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: currentContent.content }}
                />
              </div>
            )}

            {/* Secciones populares */}
            <div className="bg-white border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Secciones Populares</h3>
              <div className="space-y-3">
                {popularSections.map((section) => (
                  <button
                    key={`${section.category}-${section.sectionId}`}
                    onClick={() => {
                      onCategorySelect(section.category);
                      onSectionSelect(section.sectionId);
                    }}
                    className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{section.categoryIcon}</span>
                      <div>
                        <div className="font-medium text-gray-800">{section.sectionTitle}</div>
                        <div className="text-sm text-gray-500">{section.categoryTitle}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Componente de Ayuda Contextual
const HelpTab = ({ helpContext, contextualHelpManager }) => {
  const [showTooltips, setShowTooltips] = useState(false);

  const currentShortcuts = contextualHelpManager.getCurrentShortcuts();
  const currentTips = contextualHelpManager.getCurrentTips();
  const mostVisited = contextualHelpManager.getMostVisitedSections();

  return (
    <div className="space-y-6">
      {/* Ayuda actual */}
      <div className="bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-800 mb-4">
          {helpContext?.icon || '❓'} {helpContext?.title}
        </h3>
        <p className="text-blue-700 mb-4">{helpContext?.description}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Consejos */}
          <div>
            <h4 className="font-semibold text-blue-800 mb-3">💡 Consejos</h4>
            <ul className="space-y-2">
              {currentTips.map((tip, index) => (
                <li key={index} className="text-sm text-blue-700 flex items-start space-x-2">
                  <span className="text-blue-500">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Atajos de teclado */}
          <div>
            <h4 className="font-semibold text-blue-800 mb-3">⌨️ Atajos de Teclado</h4>
            <div className="space-y-2">
              {currentShortcuts.map((shortcut, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="text-blue-700">{shortcut.action}</span>
                  <kbd className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                    {shortcut.key}
                  </kbd>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Secciones más visitadas */}
      <div className="bg-white border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Secciones Más Visitadas</h3>
        <div className="space-y-3">
          {mostVisited.map((section, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="text-lg">{section.help?.icon || '📄'}</span>
                <div>
                  <div className="font-medium text-gray-800">{section.help?.title}</div>
                  <div className="text-sm text-gray-500">{section.count} visitas</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Configuración de ayuda */}
      <div className="bg-white border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Configuración de Ayuda</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-800">Mostrar tooltips</div>
              <div className="text-sm text-gray-500">Ayuda contextual al hacer hover</div>
            </div>
            <button
              onClick={() => setShowTooltips(!showTooltips)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                showTooltips
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {showTooltips ? 'Activado' : 'Desactivado'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente de Búsqueda
const SearchTab = ({ searchQuery, searchResults, onSearch }) => {
  return (
    <div className="space-y-6">
      {/* Barra de búsqueda */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar en toda la documentación..."
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Resultados */}
      {searchQuery.length >= 2 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {searchResults.length} resultados encontrados
          </h3>
          <div className="space-y-4">
            {searchResults.map((result, index) => (
              <div key={index} className="bg-white border rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <span className="text-lg">{result.categoryIcon}</span>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800">{result.sectionTitle}</h4>
                    <div className="text-sm text-gray-500">{result.categoryTitle}</div>
                    <div className="text-sm text-gray-600 mt-2">
                      {result.searchText.substring(0, 150)}...
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sugerencias de búsqueda */}
      {searchQuery.length < 2 && (
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Sugerencias de Búsqueda</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 bg-white rounded-lg border">
              <div className="font-medium text-gray-800">Crear contrato</div>
              <div className="text-sm text-gray-500">Cómo crear un nuevo contrato</div>
            </div>
            <div className="p-3 bg-white rounded-lg border">
              <div className="font-medium text-gray-800">Generar recibo</div>
              <div className="text-sm text-gray-500">Crear recibos de alquiler</div>
            </div>
            <div className="p-3 bg-white rounded-lg border">
              <div className="font-medium text-gray-800">Exportar datos</div>
              <div className="text-sm text-gray-500">Exportar en diferentes formatos</div>
            </div>
            <div className="p-3 bg-white rounded-lg border">
              <div className="font-medium text-gray-800">Gestión usuarios</div>
              <div className="text-sm text-gray-500">Administrar usuarios y roles</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Componente de Guías
const GuidesTab = () => {
  const guides = [
    {
      title: 'Guía de Primeros Pasos',
      description: 'Todo lo que necesitas saber para comenzar',
      icon: '🚀',
      sections: ['Bienvenida', 'Configuración inicial', 'Primer contrato']
    },
    {
      title: 'Guía de Contratos',
      description: 'Crear y gestionar contratos paso a paso',
      icon: '📄',
      sections: ['Tipos de contrato', 'Crear contrato', 'Editar contrato', 'Generar PDF']
    },
    {
      title: 'Guía de Recibos',
      description: 'Generar y gestionar recibos automáticamente',
      icon: '🧾',
      sections: ['Crear recibo', 'Plantillas', 'Envío por email', 'Automatización']
    },
    {
      title: 'Guía de Usuarios',
      description: 'Administrar usuarios y permisos del sistema',
      icon: '👥',
      sections: ['Crear usuario', 'Asignar roles', 'Gestionar permisos', 'Auditoría']
    },
    {
      title: 'Guía de Analytics',
      description: 'Analizar datos y generar reportes',
      icon: '📊',
      sections: ['Dashboard', 'Filtros', 'Exportación', 'Reportes personalizados']
    },
    {
      title: 'Guía de Seguridad',
      description: 'Configurar seguridad y auditoría',
      icon: '🔒',
      sections: ['Autenticación', 'Roles y permisos', 'Logs de auditoría', 'Alertas']
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {guides.map((guide, index) => (
          <div key={index} className="bg-white border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-3 mb-4">
              <span className="text-2xl">{guide.icon}</span>
              <h3 className="text-lg font-semibold text-gray-800">{guide.title}</h3>
            </div>
            <p className="text-gray-600 mb-4">{guide.description}</p>
            <div className="space-y-2">
              {guide.sections.map((section, sectionIndex) => (
                <div key={sectionIndex} className="flex items-center space-x-2 text-sm text-gray-500">
                  <span className="text-blue-500">•</span>
                  <span>{section}</span>
                </div>
              ))}
            </div>
            <button className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Ver Guía
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// Componente de Resultados de Búsqueda
const SearchResults = ({ results, onSectionSelect }) => {
  return (
    <div className="space-y-4">
      {results.map((result, index) => (
        <div key={index} className="bg-white border rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <span className="text-lg">{result.categoryIcon}</span>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-800">{result.sectionTitle}</h4>
              <div className="text-sm text-gray-500">{result.categoryTitle}</div>
              <div className="text-sm text-gray-600 mt-2">
                {result.searchText.substring(0, 200)}...
              </div>
            </div>
            <button
              onClick={() => onSectionSelect(result.sectionId)}
              className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
            >
              Ver
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DocumentationHelpPanel; 