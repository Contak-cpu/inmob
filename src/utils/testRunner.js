class TestRunner {
  constructor() {
    this.tests = [];
    this.results = [];
    this.currentTest = null;
    this.mocks = new Map();
    this.spies = new Map();
  }

  // Registrar un test
  describe(name, testFunction) {
    console.log(`\n🧪 Ejecutando suite: ${name}`);
    this.currentTest = { name, tests: [] };
    testFunction();
    this.tests.push(this.currentTest);
  }

  // Registrar un test individual
  it(description, testFunction) {
    if (!this.currentTest) {
      throw new Error('it() debe estar dentro de describe()');
    }

    this.currentTest.tests.push({
      description,
      function: testFunction
    });
  }

  // Assertions
  expect(actual) {
    return {
      toBe: (expected) => {
        if (actual !== expected) {
          throw new Error(`Expected ${actual} to be ${expected}`);
        }
      },
      toEqual: (expected) => {
        if (JSON.stringify(actual) !== JSON.stringify(expected)) {
          throw new Error(`Expected ${JSON.stringify(actual)} to equal ${JSON.stringify(expected)}`);
        }
      },
      toContain: (expected) => {
        if (!actual.includes(expected)) {
          throw new Error(`Expected ${actual} to contain ${expected}`);
        }
      },
      toHaveLength: (expected) => {
        if (actual.length !== expected) {
          throw new Error(`Expected length ${actual.length} to be ${expected}`);
        }
      },
      toBeTruthy: () => {
        if (!actual) {
          throw new Error(`Expected ${actual} to be truthy`);
        }
      },
      toBeFalsy: () => {
        if (actual) {
          throw new Error(`Expected ${actual} to be falsy`);
        }
      },
      toThrow: () => {
        try {
          actual();
          throw new Error('Expected function to throw an error');
        } catch (error) {
          // Expected behavior
        }
      }
    };
  }

  // Mock de funciones
  mock(modulePath, mockImplementation) {
    this.mocks.set(modulePath, mockImplementation);
  }

  // Spy para funciones
  spyOn(object, method) {
    const original = object[method];
    const calls = [];
    
    object[method] = (...args) => {
      calls.push({ args, timestamp: Date.now() });
      return original.apply(object, args);
    };

    this.spies.set(`${object.constructor.name}.${method}`, {
      calls,
      original
    });

    return {
      calls,
      restore: () => {
        object[method] = original;
      }
    };
  }

  // Ejecutar todos los tests
  async run() {
    console.log('🚀 Iniciando Test Runner...\n');
    
    const startTime = Date.now();
    let totalTests = 0;
    let passedTests = 0;
    let failedTests = 0;

    for (const suite of this.tests) {
      console.log(`📋 Suite: ${suite.name}`);
      
      for (const test of suite.tests) {
        totalTests++;
        
        try {
          await test.function();
          console.log(`  ✅ ${test.description}`);
          passedTests++;
        } catch (error) {
          console.log(`  ❌ ${test.description}`);
          console.log(`     Error: ${error.message}`);
          failedTests++;
        }
      }
    }

    const endTime = Date.now();
    const duration = endTime - startTime;

    this.printSummary({
      totalTests,
      passedTests,
      failedTests,
      duration
    });

    return {
      totalTests,
      passedTests,
      failedTests,
      duration,
      success: failedTests === 0
    };
  }

  // Imprimir resumen
  printSummary(stats) {
    console.log('\n📊 Resumen de Tests:');
    console.log('='.repeat(50));
    console.log(`Total de tests: ${stats.totalTests}`);
    console.log(`✅ Exitosos: ${stats.passedTests}`);
    console.log(`❌ Fallidos: ${stats.failedTests}`);
    console.log(`⏱️  Duración: ${stats.duration}ms`);
    console.log(`📈 Tasa de éxito: ${((stats.passedTests / stats.totalTests) * 100).toFixed(1)}%`);
    
    if (stats.failedTests === 0) {
      console.log('\n🎉 ¡Todos los tests pasaron!');
    } else {
      console.log('\n⚠️  Algunos tests fallaron. Revisa los errores arriba.');
    }
  }

  // Limpiar mocks y spies
  cleanup() {
    this.mocks.clear();
    this.spies.forEach(spy => spy.restore());
    this.spies.clear();
  }
}

// Instancia global
const testRunner = new TestRunner();

// Exportar funciones de testing
export const describe = (name, fn) => testRunner.describe(name, fn);
export const it = (description, fn) => testRunner.it(description, fn);
export const expect = (actual) => testRunner.expect(actual);
export const mock = (modulePath, implementation) => testRunner.mock(modulePath, implementation);
export const spyOn = (object, method) => testRunner.spyOn(object, method);
export const runTests = () => testRunner.run();
export const cleanup = () => testRunner.cleanup();

export default testRunner; 