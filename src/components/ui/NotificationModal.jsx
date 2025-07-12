'use client';

import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  X, 
  CheckCircle, 
  AlertCircle, 
  Info, 
  AlertTriangle,
  Trash2,
  Check
} from 'lucide-react';

/**
 * Modal de notificaciones del sistema
 */
export default function NotificationModal({ 
  isOpen, 
  onClose, 
  notifications = [], 
  onMarkAsRead, 
  onClearAll 
}) {
  const [activeTab, setActiveTab] = useState('all');

  const getTypeIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-success-400" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-error-400" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-warning-400" />;
      case 'info':
        return <Info className="h-4 w-4 text-info-400" />;
      default:
        return <Info className="h-4 w-4 text-neutral-400" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'success':
        return 'border-success-500/30 bg-success-500/10';
      case 'error':
        return 'border-error-500/30 bg-error-500/10';
      case 'warning':
        return 'border-warning-500/30 bg-warning-500/10';
      case 'info':
        return 'border-info-500/30 bg-info-500/10';
      default:
        return 'border-neutral-500/30 bg-neutral-500/10';
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return !notification.read;
    return notification.type === activeTab;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md bg-neutral-800 border border-neutral-700 rounded-xl shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-neutral-700">
            <div className="flex items-center space-x-3">
              <Bell className="h-5 w-5 text-primary-400" />
              <h3 className="text-lg font-semibold text-white">Notificaciones</h3>
              {unreadCount > 0 && (
                <span className="px-2 py-1 bg-error-500 text-white text-xs rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-neutral-700 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-neutral-400" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-neutral-700">
            <button
              onClick={() => setActiveTab('all')}
              className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'all'
                  ? 'text-primary-400 border-b-2 border-primary-400'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setActiveTab('unread')}
              className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'unread'
                  ? 'text-primary-400 border-b-2 border-primary-400'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              No leídas
            </button>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {filteredNotifications.length === 0 ? (
              <div className="p-6 text-center">
                <Bell className="h-12 w-12 text-neutral-400 mx-auto mb-3" />
                <p className="text-neutral-400">No hay notificaciones</p>
              </div>
            ) : (
              <div className="p-4 space-y-3">
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-lg border ${getTypeColor(notification.type)} ${
                      !notification.read ? 'ring-1 ring-primary-500/30' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {getTypeIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-white">
                            {notification.title}
                          </p>
                          {!notification.read && (
                            <button
                              onClick={() => onMarkAsRead(notification.id)}
                              className="p-1 hover:bg-neutral-700 rounded transition-colors"
                              title="Marcar como leída"
                            >
                              <Check className="h-3 w-3 text-neutral-400" />
                            </button>
                          )}
                        </div>
                        <p className="text-sm text-neutral-300 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-neutral-500 mt-2">
                          {new Date(notification.timestamp).toLocaleString('es-AR')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="flex items-center justify-between p-4 border-t border-neutral-700">
              <span className="text-sm text-neutral-400">
                {notifications.length} notificación{notifications.length !== 1 ? 'es' : ''}
              </span>
              <button
                onClick={onClearAll}
                className="text-sm text-error-400 hover:text-error-300 transition-colors flex items-center space-x-1"
              >
                <Trash2 className="h-4 w-4" />
                <span>Limpiar todas</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 