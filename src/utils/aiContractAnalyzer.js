// Sistema de IA para análisis y comparación de contratos
export class AIContractAnalyzer {
  constructor() {
    this.templates = {
      comercial: {
        keywords: ['comercial', 'IPC', 'locación comercial', 'uso comercial'],
        requiredClauses: ['OBJETO', 'PLAZO', 'PRECIO', 'DEPÓSITO', 'GARANTES', 'GASTOS'],
        legalTerms: ['LOCADOR', 'LOCATARIO', 'locación', 'comercial']
      },
      casa: {
        keywords: ['vivienda familiar', 'ICL', 'familiar', 'hogar'],
        requiredClauses: ['OBJETO', 'PLAZO', 'PRECIO', 'DEPÓSITO', 'GARANTES', 'GASTOS'],
        legalTerms: ['LOCADOR', 'LOCATARIO', 'vivienda', 'familiar']
      },
      empresas: {
        keywords: ['empresas', 'empresarial', 'uso empresarial'],
        requiredClauses: ['OBJETO', 'PLAZO', 'PRECIO', 'DEPÓSITO', 'GARANTES', 'GASTOS'],
        legalTerms: ['LOCADOR', 'LOCATARIO', 'empresarial']
      }
    };
  }

  // Analizar contrato generado
  analyzeContract(generatedContract, contractType) {
    const template = this.templates[contractType];
    if (!template) {
      return { error: 'Tipo de contrato no soportado' };
    }

    const analysis = {
      score: 0,
      maxScore: 100,
      issues: [],
      suggestions: [],
      compliance: {
        legal: false,
        structure: false,
        completeness: false
      }
    };

    // Verificar estructura legal
    const structureScore = this.analyzeStructure(generatedContract, template);
    analysis.score += structureScore.score;
    analysis.issues.push(...structureScore.issues);

    // Verificar cláusulas requeridas
    const clausesScore = this.analyzeClauses(generatedContract, template);
    analysis.score += clausesScore.score;
    analysis.issues.push(...clausesScore.issues);

    // Verificar terminología legal
    const legalScore = this.analyzeLegalTerms(generatedContract, template);
    analysis.score += legalScore.score;
    analysis.suggestions.push(...legalScore.suggestions);

    // Verificar completitud
    const completenessScore = this.analyzeCompleteness(generatedContract);
    analysis.score += completenessScore.score;
    analysis.issues.push(...completenessScore.issues);

    // Determinar compliance
    analysis.compliance.legal = analysis.score >= 80;
    analysis.compliance.structure = structureScore.score >= 25;
    analysis.compliance.completeness = completenessScore.score >= 25;

    return analysis;
  }

  // Analizar estructura del contrato
  analyzeStructure(contract) {
    const issues = [];
    let score = 0;

    // Verificar encabezado
    if (contract.includes('CONTRATO DE LOCACIÓN')) {
      score += 10;
    } else {
      issues.push('Falta encabezado formal del contrato');
    }

    // Verificar secciones principales
    if (contract.includes('Entre los suscritos:')) {
      score += 10;
    } else {
      issues.push('Falta sección de partes contratantes');
    }

    if (contract.includes('CONSIDERANDO:')) {
      score += 5;
    } else {
      issues.push('Falta sección de considerandos');
    }

    if (contract.includes('CLÁUSULAS:')) {
      score += 10;
    } else {
      issues.push('Falta sección de cláusulas');
    }

    return { score, issues };
  }

  // Analizar cláusulas requeridas
  analyzeClauses(contract, template) {
    const issues = [];
    let score = 0;
    const requiredClauses = template.requiredClauses;

    for (const clause of requiredClauses) {
      if (contract.includes(clause)) {
        score += 8;
      } else {
        issues.push(`Falta cláusula: ${clause}`);
      }
    }

    return { score, issues };
  }

  // Analizar terminología legal
  analyzeLegalTerms(contract, template) {
    const suggestions = [];
    let score = 0;
    const legalTerms = template.legalTerms;

    for (const term of legalTerms) {
      if (contract.includes(term)) {
        score += 5;
      } else {
        suggestions.push(`Considerar incluir término legal: ${term}`);
      }
    }

    return { score, suggestions };
  }

  // Analizar completitud
  analyzeCompleteness(contract) {
    const issues = [];
    let score = 0;

    // Verificar datos básicos
    const requiredFields = [
      'LOCADOR', 'LOCATARIO', 'DNI', 'domiciliado',
      'precio mensual', 'depósito', 'firmas'
    ];

    for (const field of requiredFields) {
      if (contract.includes(field)) {
        score += 5;
      } else {
        issues.push(`Falta información: ${field}`);
      }
    }

    return { score, issues };
  }

  // Generar recomendaciones
  generateRecommendations(analysis) {
    const recommendations = [];

    if (analysis.score < 80) {
      recommendations.push('El contrato necesita mejoras para cumplir estándares legales');
    }

    if (analysis.issues.length > 0) {
      recommendations.push('Revisar y corregir los problemas identificados');
    }

    if (analysis.suggestions.length > 0) {
      recommendations.push('Considerar las sugerencias para mejorar el contrato');
    }

    return recommendations;
  }

  // Comparar con plantilla real
  async compareWithRealTemplate(generatedContract, contractType) {
    try {
      // Simular comparación con plantilla real
      const analysis = this.analyzeContract(generatedContract, contractType);
      const recommendations = this.generateRecommendations(analysis);

      return {
        analysis,
        recommendations,
        confidence: analysis.score / 100,
        status: analysis.score >= 80 ? 'APPROVED' : 'NEEDS_REVISION'
      };
    } catch (error) {
      // Error handling
      return {
        error: 'Error en el análisis',
        status: 'ERROR'
      };
    }
  }
}

// Instancia global del analizador
export const aiAnalyzer = new AIContractAnalyzer(); 