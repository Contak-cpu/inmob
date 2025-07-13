'use client';

import { useState, useEffect, useRef } from 'react';
import { Wifi, WifiOff, RefreshCw, CheckCircle, AlertCircle, Clock } from 'lucide-react';

const ConnectionStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingActions, setPendingActions] = useState(0);
  const [lastSync, setLastSync] = useState(null);
  const [syncStatus, setSyncStatus] = useState('idle'); // idle, syncing, success, error
  const [showDetails, setShowDetails] = useState(false);
  const [popoverDirection, setPopoverDirection] = useState('down'); // 'down' o 'up'
  const buttonRef = useRef(null);

  useEffect(() => {
    // Escuchar cambios de estado de conexión
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    // Escuchar eventos de sincronización
    const handleStatusChange = (event) => {
      const { status } = event.detail;
      if (status === 'online') {
        setSyncStatus('syncing');
      }
    };

    const handleActionAdded = (event) => {
      const { pendingCount } = event.detail;
      setPendingActions(pendingCount);
    };

    const handleSyncComplete = (event) => {
      const { successful, failed, pendingCount } = event.detail;
      setPendingActions(pendingCount);
      setLastSync(Date.now());
      
      if (successful.length > 0 && failed.length === 0) {
        setSyncStatus('success');
        setTimeout(() => setSyncStatus('idle'), 3000);
      } else if (failed.length > 0) {
        setSyncStatus('error');
        setTimeout(() => setSyncStatus('idle'), 5000);
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('offlineStatusChange', handleStatusChange);
    window.addEventListener('offlineActionAdded', handleActionAdded);
    window.addEventListener('offlineSyncComplete', handleSyncComplete);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('offlineStatusChange', handleStatusChange);
      window.removeEventListener('offlineActionAdded', handleActionAdded);
      window.removeEventListener('offlineSyncComplete', handleSyncComplete);
    };
  }, []);

  // Detectar si hay espacio abajo o arriba para el popover
  useEffect(() => {
    if (showDetails && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const popoverHeight = 320; // Altura estimada del popover
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      if (spaceBelow < popoverHeight && spaceAbove > popoverHeight) {
        setPopoverDirection('up');
      } else {
        setPopoverDirection('down');
      }
    }
  }, [showDetails]);

  const getStatusIcon = () => {
    if (!isOnline) {
      return <WifiOff className="w-4 h-4 text-red-500" />;
    }

    switch (syncStatus) {
      case 'syncing':
        return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Wifi className="w-4 h-4 text-green-500" />;
    }
  };

  const getStatusText = () => {
    if (!isOnline) {
      return 'Sin conexión';
    }

    switch (syncStatus) {
      case 'syncing':
        return 'Sincronizando...';
      case 'success':
        return 'Sincronizado';
      case 'error':
        return 'Error de sincronización';
      default:
        return pendingActions > 0 ? `${pendingActions} pendiente(s)` : 'Conectado';
    }
  };

  const getStatusColor = () => {
    if (!isOnline) return 'text-red-500';
    if (syncStatus === 'error') return 'text-red-500';
    if (syncStatus === 'success') return 'text-green-500';
    if (pendingActions > 0) return 'text-yellow-500';
    return 'text-green-500';
  };

  const formatLastSync = () => {
    if (!lastSync) return 'Nunca';
    
    const now = Date.now();
    const diff = now - lastSync;
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Ahora mismo';
    if (minutes < 60) return `Hace ${minutes} min`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `Hace ${hours}h`;
    
    const days = Math.floor(hours / 24);
    return `Hace ${days}d`;
  };

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setShowDetails(!showDetails)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
      >
        {getStatusIcon()}
        <span className={`text-sm font-medium ${getStatusColor()}`}>
          {getStatusText()}
        </span>
        {pendingActions > 0 && (
          <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
            {pendingActions}
          </span>
        )}
      </button>

      {showDetails && (
        <div
          className={`absolute right-0 w-80 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50 animate-fade-in ${popoverDirection === 'up' ? 'bottom-full mb-2' : 'top-full mt-2'}`}
          style={{ minWidth: 260 }}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Estado de conexión</span>
              <div className="flex items-center gap-2">
                {getStatusIcon()}
                <span className={`text-sm ${getStatusColor()}`}>
                  {isOnline ? 'En línea' : 'Sin conexión'}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Acciones pendientes</span>
              <span className="text-sm text-gray-600">
                {pendingActions} {pendingActions === 1 ? 'acción' : 'acciones'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Última sincronización</span>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-gray-400" />
                <span className="text-sm text-gray-600">{formatLastSync()}</span>
              </div>
            </div>

            {pendingActions > 0 && (
              <div className="pt-3 border-t border-gray-200">
                <button
                  onClick={() => {
                    // Simular sincronización manual
                    setSyncStatus('syncing');
                    setTimeout(() => {
                      setSyncStatus('success');
                      setPendingActions(0);
                      setLastSync(Date.now());
                      setTimeout(() => setSyncStatus('idle'), 2000);
                    }, 2000);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Sincronizar ahora
                </button>
              </div>
            )}

            <div className="pt-3 border-t border-gray-200">
              <div className="text-xs text-gray-500 space-y-1">
                <p>• Los cambios se guardan localmente cuando no hay conexión</p>
                <p>• La sincronización automática ocurre cada 30 segundos</p>
                <p>• Puedes sincronizar manualmente en cualquier momento</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConnectionStatus; 