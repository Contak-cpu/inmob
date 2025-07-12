'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  X, 
  FileText, 
  Receipt, 
  User, 
  Building,
  ArrowUp,
  ArrowDown,
  Enter,
  Command
} from 'lucide-react';
import { getAllContracts, getAllReceipts, getAllUsers } from '@/utils/database';

/**
 * Componente de búsqueda global
 */
export default function GlobalSearch({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);

  // Enfocar input cuando se abre
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Buscar resultados
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    
    // Simular búsqueda asíncrona
    const timeoutId = setTimeout(() => {
      const searchResults = performSearch(query);
      setResults(searchResults);
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const performSearch = (searchQuery) => {
    const query = searchQuery.toLowerCase();
    const results = [];

    // Buscar en contratos
    const contracts = getAllContracts();
    contracts.forEach(contract => {
      if (
        contract.tenantName?.toLowerCase().includes(query) ||
        contract.ownerName?.toLowerCase().includes(query) ||
        contract.propertyAddress?.toLowerCase().includes(query) ||
        contract.contractType?.toLowerCase().includes(query)
      ) {
        results.push({
          type: 'contract',
          id: contract.id,
          title: contract.tenantName || 'Contrato sin inquilino',
          subtitle: contract.propertyAddress || 'Sin dirección',
          description: `${contract.contractType || 'Contrato'} - $${contract.monthlyPrice || 0}`,
          url: `/contracts/${contract.id}`,
          icon: FileText
        });
      }
    });

    // Buscar en recibos
    const receipts = getAllReceipts();
    receipts.forEach(receipt => {
      if (
        receipt.tenantName?.toLowerCase().includes(query) ||
        receipt.clientName?.toLowerCase().includes(query) ||
        receipt.propertyAddress?.toLowerCase().includes(query) ||
        receipt.receiptType?.toLowerCase().includes(query)
      ) {
        results.push({
          type: 'receipt',
          id: receipt.id,
          title: receipt.tenantName || receipt.clientName || 'Recibo sin cliente',
          subtitle: receipt.propertyAddress || 'Sin dirección',
          description: `${receipt.receiptType || 'Recibo'} - $${receipt.totalAmount || 0}`,
          url: `/receipts/${receipt.id}`,
          icon: Receipt
        });
      }
    });

    // Buscar en usuarios
    const users = getAllUsers();
    users.forEach(user => {
      if (
        user.name?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query) ||
        user.username?.toLowerCase().includes(query)
      ) {
        results.push({
          type: 'user',
          id: user.id,
          title: user.name || 'Usuario sin nombre',
          subtitle: user.email || 'Sin email',
          description: `${user.role || 'Usuario'} - ${user.username || 'Sin usuario'}`,
          url: `/users/${user.id}`,
          icon: User
        });
      }
    });

    return results.slice(0, 10); // Limitar a 10 resultados
  };

  const handleKeyDown = (e) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < results.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : results.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (results[selectedIndex]) {
          handleResultClick(results[selectedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        onClose();
        break;
    }
  };

  const handleResultClick = (result) => {
    window.location.href = result.url;
    onClose();
  };

  const getResultIcon = (type) => {
    switch (type) {
      case 'contract':
        return FileText;
      case 'receipt':
        return Receipt;
      case 'user':
        return User;
      default:
        return Building;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="flex min-h-full items-start justify-center p-4 pt-20">
        <div className="relative w-full max-w-2xl bg-neutral-800 border border-neutral-700 rounded-xl shadow-xl">
          {/* Header */}
          <div className="flex items-center space-x-3 p-4 border-b border-neutral-700">
            <Search className="h-5 w-5 text-neutral-400" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Buscar contratos, recibos, usuarios..."
              className="flex-1 bg-transparent text-white placeholder-neutral-400 focus:outline-none text-lg"
              data-search-input
            />
            <div className="flex items-center space-x-2 text-xs text-neutral-400">
              <kbd className="px-2 py-1 bg-neutral-700 border border-neutral-600 rounded">
                ↑↓
              </kbd>
              <span>navegar</span>
              <kbd className="px-2 py-1 bg-neutral-700 border border-neutral-600 rounded">
                ↵
              </kbd>
              <span>seleccionar</span>
              <kbd className="px-2 py-1 bg-neutral-700 border border-neutral-600 rounded">
                esc
              </kbd>
              <span>cerrar</span>
            </div>
          </div>

          {/* Results */}
          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
                <p className="text-neutral-400 mt-2">Buscando...</p>
              </div>
            ) : results.length > 0 ? (
              <div className="p-2">
                {results.map((result, index) => {
                  const Icon = getResultIcon(result.type);
                  return (
                    <div
                      key={`${result.type}-${result.id}`}
                      onClick={() => handleResultClick(result)}
                      className={`
                        flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors
                        ${selectedIndex === index 
                          ? 'bg-primary-500/20 border border-primary-500' 
                          : 'hover:bg-neutral-700'
                        }
                      `}
                    >
                      <div className="flex-shrink-0">
                        <Icon className="h-5 w-5 text-neutral-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium truncate">{result.title}</p>
                        <p className="text-sm text-neutral-400 truncate">{result.subtitle}</p>
                        <p className="text-xs text-neutral-500 truncate">{result.description}</p>
                      </div>
                      <div className="flex-shrink-0">
                        <ArrowUp className="h-4 w-4 text-neutral-400" />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : query ? (
              <div className="p-8 text-center">
                <Search className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
                <p className="text-neutral-400">No se encontraron resultados para "{query}"</p>
                <p className="text-sm text-neutral-500 mt-2">Intenta con otros términos de búsqueda</p>
              </div>
            ) : (
              <div className="p-8 text-center">
                <div className="space-y-4">
                  <div className="flex items-center justify-center space-x-2 text-neutral-400">
                    <Command className="h-4 w-4" />
                    <span className="text-sm">+</span>
                    <kbd className="px-2 py-1 bg-neutral-700 border border-neutral-600 rounded text-xs">
                      K
                    </kbd>
                  </div>
                  <p className="text-neutral-400">Busca rápidamente en todo el sistema</p>
                  <div className="grid grid-cols-3 gap-4 mt-6">
                    <div className="text-center">
                      <FileText className="h-8 w-8 text-primary-400 mx-auto mb-2" />
                      <p className="text-xs text-neutral-400">Contratos</p>
                    </div>
                    <div className="text-center">
                      <Receipt className="h-8 w-8 text-warning-400 mx-auto mb-2" />
                      <p className="text-xs text-neutral-400">Recibos</p>
                    </div>
                    <div className="text-center">
                      <User className="h-8 w-8 text-success-400 mx-auto mb-2" />
                      <p className="text-xs text-neutral-400">Usuarios</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 