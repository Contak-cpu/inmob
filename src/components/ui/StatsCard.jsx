'use client';

import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

/**
 * Componente reutilizable para mostrar estadísticas
 * 
 * @param {Object} props - Props del componente
 * @param {string} props.title - Título de la estadística
 * @param {string|number} props.value - Valor de la estadística
 * @param {string} props.change - Cambio porcentual (ej: "+12%")
 * @param {string} props.changeType - Tipo de cambio ('positive', 'negative', 'neutral')
 * @param {React.Component} props.icon - Icono de la estadística
 * @param {string} props.color - Color del componente ('primary', 'success', 'warning', 'error', 'info')
 * @param {string} props.className - Clases CSS adicionales
 * @returns {JSX.Element} Componente de estadística
 */
export default function StatsCard({ 
  title, 
  value, 
  change, 
  changeType = 'neutral',
  icon: Icon,
  color = 'primary',
  className = '',
  onClick,
  loading = false
}) {
  const getColorClasses = (color) => {
    switch (color) {
      case 'primary':
        return 'bg-primary-500/20 text-primary-400 border-primary-500/30';
      case 'success':
        return 'bg-success-500/20 text-success-400 border-success-500/30';
      case 'warning':
        return 'bg-warning-500/20 text-warning-400 border-warning-500/30';
      case 'error':
        return 'bg-error-500/20 text-error-400 border-error-500/30';
      case 'info':
        return 'bg-info-500/20 text-info-400 border-info-500/30';
      default:
        return 'bg-neutral-500/20 text-neutral-400 border-neutral-500/30';
    }
  };

  const getChangeIcon = () => {
    if (changeType === 'positive') {
      return <TrendingUp className="h-4 w-4 text-success-400" />;
    } else if (changeType === 'negative') {
      return <TrendingDown className="h-4 w-4 text-error-400" />;
    }
    return null;
  };

  const getChangeColor = () => {
    switch (changeType) {
      case 'positive':
        return 'text-success-400';
      case 'negative':
        return 'text-error-400';
      default:
        return 'text-neutral-400';
    }
  };

  const cardClasses = `
    card 
    ${onClick ? 'cursor-pointer hover:scale-105 transition-transform' : ''}
    ${className}
  `.trim();

  return (
    <div className={cardClasses} onClick={onClick}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm text-neutral-400">{title}</p>
          {loading ? (
            <div className="animate-pulse">
              <div className="h-8 bg-neutral-700 rounded mt-1"></div>
            </div>
          ) : (
            <p className="text-2xl font-bold text-white">{value}</p>
          )}
          {change && (
            <div className="flex items-center space-x-1 mt-1">
              {getChangeIcon()}
              <span className={`text-xs ${getChangeColor()}`}>
                {change}
              </span>
            </div>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-xl ${getColorClasses(color)}`}>
            <Icon className="h-6 w-6" />
          </div>
        )}
      </div>
    </div>
  );
} 