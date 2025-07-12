class AccessibilityManager {
  constructor() {
    this.focusableElements = [];
    this.currentFocusIndex = 0;
    this.skipLinks = [];
    this.announcements = [];
    this.isHighContrast = false;
    this.isReducedMotion = false;
    this.fontSize = 16;
    this.setupAccessibility();
  }

  // Configurar accesibilidad
  setupAccessibility() {
    if (typeof window !== 'undefined') {
      this.detectUserPreferences();
      this.setupKeyboardNavigation();
      this.setupSkipLinks();
      this.setupAnnouncements();
      this.setupFocusManagement();
      this.setupScreenReaderSupport();
    }
  }

  // Detectar preferencias del usuario
  detectUserPreferences() {
    // Detectar preferencia de contraste alto
    const highContrastQuery = window.matchMedia('(prefers-contrast: high)');
    this.isHighContrast = highContrastQuery.matches;
    highContrastQuery.addListener((e) => {
      this.isHighContrast = e.matches;
      this.applyHighContrast();
    });

    // Detectar preferencia de movimiento reducido
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.isReducedMotion = reducedMotionQuery.matches;
    reducedMotionQuery.addListener((e) => {
      this.isReducedMotion = e.matches;
      this.applyReducedMotion();
    });

    // Detectar tamaño de fuente del sistema
    const fontSizeQuery = window.matchMedia('(min-resolution: 2dppx)');
    if (fontSizeQuery.matches) {
      this.fontSize = 18;
    }
  }

  // Configurar navegación por teclado
  setupKeyboardNavigation() {
    document.addEventListener('keydown', (event) => {
      switch (event.key) {
        case 'Tab':
          this.handleTabNavigation(event);
          break;
        case 'Escape':
          this.handleEscapeKey(event);
          break;
        case 'Enter':
        case ' ':
          this.handleActivationKey(event);
          break;
        case 'ArrowUp':
        case 'ArrowDown':
          this.handleArrowNavigation(event);
          break;
      }
    });
  }

  // Manejar navegación con Tab
  handleTabNavigation(event) {
    const focusableElements = this.getFocusableElements();
    
    if (event.shiftKey) {
      // Navegación hacia atrás
      if (document.activeElement === focusableElements[0]) {
        event.preventDefault();
        focusableElements[focusableElements.length - 1].focus();
      }
    } else {
      // Navegación hacia adelante
      if (document.activeElement === focusableElements[focusableElements.length - 1]) {
        event.preventDefault();
        focusableElements[0].focus();
      }
    }
  }

  // Manejar tecla Escape
  handleEscapeKey(event) {
    // Cerrar modales abiertos
    const modals = document.querySelectorAll('[role="dialog"]');
    modals.forEach(modal => {
      if (modal.style.display !== 'none') {
        this.closeModal(modal);
      }
    });

    // Cerrar dropdowns
    const dropdowns = document.querySelectorAll('[aria-expanded="true"]');
    dropdowns.forEach(dropdown => {
      dropdown.setAttribute('aria-expanded', 'false');
    });
  }

  // Manejar teclas de activación
  handleActivationKey(event) {
    const target = event.target;
    
    if (target.tagName === 'BUTTON' || target.getAttribute('role') === 'button') {
      event.preventDefault();
      target.click();
    }
  }

  // Manejar navegación con flechas
  handleArrowNavigation(event) {
    const target = event.target;
    const isListbox = target.getAttribute('role') === 'listbox';
    const isMenu = target.getAttribute('role') === 'menu';
    
    if (isListbox || isMenu) {
      event.preventDefault();
      const items = target.querySelectorAll('[role="option"], [role="menuitem"]');
      const currentIndex = Array.from(items).findIndex(item => item === document.activeElement);
      
      let nextIndex;
      if (event.key === 'ArrowUp') {
        nextIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
      } else {
        nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
      }
      
      items[nextIndex]?.focus();
    }
  }

  // Configurar enlaces de salto
  setupSkipLinks() {
    const skipLinks = [
      { href: '#main-content', text: 'Saltar al contenido principal' },
      { href: '#navigation', text: 'Saltar a la navegación' },
      { href: '#search', text: 'Saltar a la búsqueda' }
    ];

    skipLinks.forEach(link => {
      const skipLink = document.createElement('a');
      skipLink.href = link.href;
      skipLink.textContent = link.text;
      skipLink.className = 'skip-link';
      skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: #000;
        color: #fff;
        padding: 8px;
        text-decoration: none;
        z-index: 1000;
        transition: top 0.3s;
      `;
      
      skipLink.addEventListener('focus', () => {
        skipLink.style.top = '6px';
      });
      
      skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
      });
      
      document.body.insertBefore(skipLink, document.body.firstChild);
    });
  }

  // Configurar anuncios para lectores de pantalla
  setupAnnouncements() {
    // Crear región de anuncios
    const announcementRegion = document.createElement('div');
    announcementRegion.setAttribute('aria-live', 'polite');
    announcementRegion.setAttribute('aria-atomic', 'true');
    announcementRegion.className = 'sr-only';
    announcementRegion.style.cssText = `
      position: absolute;
      left: -10000px;
      width: 1px;
      height: 1px;
      overflow: hidden;
    `;
    
    document.body.appendChild(announcementRegion);
  }

  // Anunciar mensaje a lectores de pantalla
  announce(message, priority = 'polite') {
    const announcementRegion = document.querySelector('[aria-live]');
    if (announcementRegion) {
      announcementRegion.setAttribute('aria-live', priority);
      announcementRegion.textContent = message;
      
      // Limpiar después de un momento
      setTimeout(() => {
        announcementRegion.textContent = '';
      }, 1000);
    }
  }

  // Configurar gestión de foco
  setupFocusManagement() {
    // Guardar último elemento con foco
    document.addEventListener('focusin', (event) => {
      this.lastFocusedElement = event.target;
    });

    // Restaurar foco después de cerrar modales
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        const modal = event.target.closest('[role="dialog"]');
        if (modal) {
          this.restoreFocus();
        }
      }
    });
  }

  // Restaurar foco
  restoreFocus() {
    if (this.lastFocusedElement) {
      this.lastFocusedElement.focus();
    }
  }

  // Configurar soporte para lectores de pantalla
  setupScreenReaderSupport() {
    // Agregar etiquetas ARIA faltantes
    this.addMissingAriaLabels();
    
    // Mejorar navegación por encabezados
    this.setupHeadingNavigation();
    
    // Configurar landmarks
    this.setupLandmarks();
  }

  // Agregar etiquetas ARIA faltantes
  addMissingAriaLabels() {
    // Botones sin texto
    const buttons = document.querySelectorAll('button:not([aria-label]):not([aria-labelledby])');
    buttons.forEach(button => {
      if (!button.textContent.trim()) {
        const icon = button.querySelector('svg, img');
        if (icon) {
          const alt = icon.getAttribute('alt') || icon.getAttribute('aria-label');
          if (alt) {
            button.setAttribute('aria-label', alt);
          }
        }
      }
    });

    // Imágenes sin alt
    const images = document.querySelectorAll('img:not([alt])');
    images.forEach(img => {
      if (!img.getAttribute('alt')) {
        img.setAttribute('alt', '');
        img.setAttribute('aria-hidden', 'true');
      }
    });
  }

  // Configurar navegación por encabezados
  setupHeadingNavigation() {
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headings.forEach((heading, index) => {
      if (!heading.id) {
        heading.id = `heading-${index}`;
      }
    });
  }

  // Configurar landmarks
  setupLandmarks() {
    // Agregar role="main" si no existe
    const main = document.querySelector('main');
    if (main && !main.getAttribute('role')) {
      main.setAttribute('role', 'main');
    }

    // Agregar role="navigation" a navs
    const navs = document.querySelectorAll('nav');
    navs.forEach(nav => {
      if (!nav.getAttribute('role')) {
        nav.setAttribute('role', 'navigation');
      }
    });

    // Agregar role="search" a formularios de búsqueda
    const searchForms = document.querySelectorAll('form[action*="search"], form input[type="search"]');
    searchForms.forEach(form => {
      if (!form.getAttribute('role')) {
        form.setAttribute('role', 'search');
      }
    });
  }

  // Aplicar contraste alto
  applyHighContrast() {
    if (this.isHighContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }

  // Aplicar movimiento reducido
  applyReducedMotion() {
    if (this.isReducedMotion) {
      document.documentElement.classList.add('reduced-motion');
    } else {
      document.documentElement.classList.remove('reduced-motion');
    }
  }

  // Obtener elementos enfocables
  getFocusableElements() {
    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]'
    ];

    return Array.from(document.querySelectorAll(focusableSelectors.join(', ')))
      .filter(element => {
        const style = window.getComputedStyle(element);
        return style.display !== 'none' && style.visibility !== 'hidden';
      });
  }

  // Mejorar accesibilidad de formularios
  enhanceFormAccessibility(form) {
    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
      // Agregar aria-describedby para errores
      const errorElement = input.parentNode.querySelector('.error-message');
      if (errorElement) {
        const errorId = `error-${input.id || input.name}`;
        errorElement.id = errorId;
        input.setAttribute('aria-describedby', errorId);
      }

      // Agregar aria-required para campos obligatorios
      if (input.hasAttribute('required')) {
        input.setAttribute('aria-required', 'true');
      }

      // Agregar aria-invalid para campos con errores
      if (input.classList.contains('error')) {
        input.setAttribute('aria-invalid', 'true');
      }
    });
  }

  // Mejorar accesibilidad de modales
  enhanceModalAccessibility(modal) {
    // Configurar foco inicial
    const focusableElements = modal.querySelectorAll(this.getFocusableElements().join(', '));
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }

    // Configurar escape del modal
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        this.closeModal(modal);
      }
    };

    modal.addEventListener('keydown', handleEscape);

    // Anunciar apertura del modal
    this.announce('Modal abierto', 'assertive');
  }

  // Cerrar modal
  closeModal(modal) {
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    this.restoreFocus();
    this.announce('Modal cerrado');
  }

  // Mejorar accesibilidad de tablas
  enhanceTableAccessibility(table) {
    // Agregar caption si no existe
    if (!table.querySelector('caption')) {
      const caption = document.createElement('caption');
      caption.textContent = 'Tabla de datos';
      table.insertBefore(caption, table.firstChild);
    }

    // Agregar scope a headers
    const headers = table.querySelectorAll('th');
    headers.forEach(header => {
      if (!header.getAttribute('scope')) {
        header.setAttribute('scope', 'col');
      }
    });
  }

  // Mejorar accesibilidad de listas
  enhanceListAccessibility(list) {
    // Agregar aria-label si es necesario
    if (!list.getAttribute('aria-label') && !list.querySelector('h1, h2, h3, h4, h5, h6')) {
      list.setAttribute('aria-label', 'Lista de elementos');
    }
  }

  // Verificar accesibilidad de la página
  checkPageAccessibility() {
    const issues = [];

    // Verificar imágenes sin alt
    const imagesWithoutAlt = document.querySelectorAll('img:not([alt])');
    if (imagesWithoutAlt.length > 0) {
      issues.push({
        type: 'error',
        message: `${imagesWithoutAlt.length} imágenes sin atributo alt`,
        elements: Array.from(imagesWithoutAlt)
      });
    }

    // Verificar enlaces sin texto
    const linksWithoutText = document.querySelectorAll('a:not([aria-label]):not([aria-labelledby])');
    const emptyLinks = Array.from(linksWithoutText).filter(link => !link.textContent.trim());
    if (emptyLinks.length > 0) {
      issues.push({
        type: 'error',
        message: `${emptyLinks.length} enlaces sin texto`,
        elements: emptyLinks
      });
    }

    // Verificar contraste de colores
    const lowContrastElements = this.checkColorContrast();
    if (lowContrastElements.length > 0) {
      issues.push({
        type: 'warning',
        message: `${lowContrastElements.length} elementos con bajo contraste`,
        elements: lowContrastElements
      });
    }

    return issues;
  }

  // Verificar contraste de colores
  checkColorContrast() {
    const elements = document.querySelectorAll('*');
    const lowContrastElements = [];

    elements.forEach(element => {
      const style = window.getComputedStyle(element);
      const backgroundColor = style.backgroundColor;
      const color = style.color;

      // Implementar verificación de contraste
      // Esta es una implementación simplificada
      if (backgroundColor === 'transparent' || color === 'transparent') {
        return;
      }

      // Aquí se implementaría la lógica real de verificación de contraste
      // Por ahora retornamos un array vacío
    });

    return lowContrastElements;
  }

  // Generar reporte de accesibilidad
  generateAccessibilityReport() {
    const issues = this.checkPageAccessibility();
    const focusableElements = this.getFocusableElements();
    
    return {
      timestamp: Date.now(),
      issues,
      focusableElements: focusableElements.length,
      landmarks: this.countLandmarks(),
      headings: this.countHeadings(),
      forms: this.countForms(),
      images: this.countImages(),
      recommendations: this.generateAccessibilityRecommendations(issues)
    };
  }

  // Contar landmarks
  countLandmarks() {
    const landmarks = {
      main: document.querySelectorAll('main, [role="main"]').length,
      navigation: document.querySelectorAll('nav, [role="navigation"]').length,
      search: document.querySelectorAll('[role="search"]').length,
      banner: document.querySelectorAll('header, [role="banner"]').length,
      contentinfo: document.querySelectorAll('footer, [role="contentinfo"]').length
    };

    return landmarks;
  }

  // Contar encabezados
  countHeadings() {
    const headings = {};
    for (let i = 1; i <= 6; i++) {
      headings[`h${i}`] = document.querySelectorAll(`h${i}`).length;
    }
    return headings;
  }

  // Contar formularios
  countForms() {
    return {
      total: document.querySelectorAll('form').length,
      withLabels: document.querySelectorAll('form label').length,
      withErrors: document.querySelectorAll('form .error').length
    };
  }

  // Contar imágenes
  countImages() {
    return {
      total: document.querySelectorAll('img').length,
      withAlt: document.querySelectorAll('img[alt]').length,
      withoutAlt: document.querySelectorAll('img:not([alt])').length
    };
  }

  // Generar recomendaciones de accesibilidad
  generateAccessibilityRecommendations(issues) {
    const recommendations = [];

    if (issues.some(issue => issue.type === 'error')) {
      recommendations.push({
        priority: 'high',
        message: 'Corregir errores de accesibilidad críticos',
        action: 'Revisar y corregir elementos sin alt, enlaces sin texto, etc.'
      });
    }

    if (issues.some(issue => issue.type === 'warning')) {
      recommendations.push({
        priority: 'medium',
        message: 'Mejorar contraste de colores',
        action: 'Revisar y ajustar colores para mejor contraste'
      });
    }

    return recommendations;
  }
}

// Instancia singleton
const accessibilityManager = new AccessibilityManager();

export default accessibilityManager; 