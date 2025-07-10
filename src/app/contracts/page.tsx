'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText, Building, Store, CheckCircle, AlertCircle } from 'lucide-react';
import { CONTRACT_TYPES } from '@/lib/config';
import { ContractType } from '@/types';
import PictoNSignature from '@/components/PictoNSignature';

export default function ContractsPage() {
  const [selectedType, setSelectedType] = useState<ContractType | ''>('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900">
      {/* Header */}
      <header className="glass-effect border-b border-neutral-700/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link href="/" className="p-2 hover:bg-neutral-700/50 rounded-lg transition-colors">
                <ArrowLeft className="h-5 w-5 text-neutral-400" />
              </Link>
              <FileText className="h-8 w-8 text-primary-400" />
              <div>
                <h1 className="text-xl font-bold text-white">Generador de Contratos</h1>
                <p className="text-sm text-neutral-400">Selecciona el tipo de contrato</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-neutral-400">KONRAD Inmobiliaria</p>
              <p className="text-xs text-neutral-500">Mat. 573</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Step Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">1</span>
                </div>
                <span className="text-white font-medium">Tipo de Contrato</span>
              </div>
              <div className="w-12 h-0.5 bg-neutral-600"></div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-neutral-600 rounded-full flex items-center justify-center">
                  <span className="text-neutral-400 text-sm font-medium">2</span>
                </div>
                <span className="text-neutral-400 font-medium">Datos</span>
              </div>
              <div className="w-12 h-0.5 bg-neutral-600"></div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-neutral-600 rounded-full flex items-center justify-center">
                  <span className="text-neutral-400 text-sm font-medium">3</span>
                </div>
                <span className="text-neutral-400 font-medium">Generar</span>
              </div>
            </div>
          </div>

          {/* Contract Type Selection */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              ¿Qué tipo de contrato necesitas?
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {Object.entries(CONTRACT_TYPES).map(([key, contract]) => (
                <button
                  key={key}
                  onClick={() => setSelectedType(key as ContractType)}
                  className={`card transition-all duration-300 hover:scale-105 ${
                    selectedType === key 
                      ? 'ring-2 ring-primary-500 bg-neutral-700/50' 
                      : 'hover:bg-neutral-700/50'
                  }`}
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <div className={`p-3 rounded-xl ${
                      key === 'locacion' 
                        ? 'bg-primary-500/20' 
                        : 'bg-secondary-500/20'
                    }`}>
                      {key === 'locacion' ? (
                        <Building className="h-8 w-8 text-primary-400" />
                      ) : (
                        <Store className="h-8 w-8 text-secondary-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">{contract.name}</h3>
                      <p className="text-neutral-400">{contract.description}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-success-400" />
                      <span className="text-sm text-neutral-300">Validación automática</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-success-400" />
                      <span className="text-sm text-neutral-300">Formato legal</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-success-400" />
                      <span className="text-sm text-neutral-300">Descarga inmediata</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Continue Button */}
          {selectedType && (
            <div className="text-center">
              <Link 
                href={`/contracts/${selectedType}`}
                className="btn-primary inline-flex items-center space-x-2"
              >
                <span>Continuar</span>
                <FileText className="h-4 w-4" />
              </Link>
            </div>
          )}

          {/* Info Section */}
          <div className="mt-12 p-6 glass-effect rounded-xl">
            <div className="flex items-start space-x-4">
              <AlertCircle className="h-6 w-6 text-primary-400 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Información Importante
                </h3>
                <div className="space-y-2 text-sm text-neutral-300">
                  <p>• Todos los campos marcados con * son obligatorios</p>
                  <p>• Los datos se validan automáticamente en tiempo real</p>
                  <p>• El contrato se genera con formato legal argentino</p>
                  <p>• Puedes descargar el contrato en formato de texto</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="glass-effect border-t border-neutral-700/50 mt-8">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
            <p className="text-xs sm:text-sm text-neutral-400">
              © 2024 KONRAD Inmobiliaria. Todos los derechos reservados.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
              <p className="text-[10px] sm:text-xs text-neutral-500">
                Sistema v1.0.0
              </p>
              <PictoNSignature />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 