import React from 'react';
import Link from 'next/link';
import { Store, Home, Building } from 'lucide-react';

const ContractTypeCard = ({ contractType, contract }) => {
  const getIcon = (iconName) => {
    switch (iconName) {
      case 'Store':
        return <Store className="h-8 w-8" />;
      case 'Home':
        return <Home className="h-8 w-8" />;
      case 'Building':
        return <Building className="h-8 w-8" />;
      default:
        return <Store className="h-8 w-8" />;
    }
  };

  const getColorClasses = (color) => {
    switch (color) {
      case 'primary':
        return {
          bg: 'bg-primary-500/20',
          icon: 'text-primary-400',
          border: 'border-primary-500/30',
          hover: 'hover:bg-primary-500/30',
          text: 'text-primary-400'
        };
      case 'secondary':
        return {
          bg: 'bg-secondary-500/20',
          icon: 'text-secondary-400',
          border: 'border-secondary-500/30',
          hover: 'hover:bg-secondary-500/30',
          text: 'text-secondary-400'
        };
      case 'success':
        return {
          bg: 'bg-success-500/20',
          icon: 'text-success-400',
          border: 'border-success-500/30',
          hover: 'hover:bg-success-500/30',
          text: 'text-success-400'
        };
      default:
        return {
          bg: 'bg-primary-500/20',
          icon: 'text-primary-400',
          border: 'border-primary-500/30',
          hover: 'hover:bg-primary-500/30',
          text: 'text-primary-400'
        };
    }
  };

  const colors = getColorClasses(contract.color);

  return (
    <Link href={`/contracts/${contractType}`} className="group">
      <div className={`card card-hover group-hover:scale-105 border ${colors.border} ${colors.hover}`}>
        <div className="flex items-center space-x-4 mb-4">
          <div className={`p-3 rounded-xl ${colors.bg}`}>
            <div className={colors.icon}>
              {getIcon(contract.icon)}
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">{contract.name}</h3>
            <p className="text-sm text-neutral-400">{contract.description}</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-400">Tipo de Ajuste:</span>
            <span className={`text-sm font-medium ${colors.text}`}>
              {contract.adjustmentType}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-400">Categoría:</span>
            <span className="text-sm text-neutral-300 capitalize">
              {contract.category}
            </span>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-neutral-700">
          <div className={`flex items-center ${colors.text} group-hover:translate-x-1 transition-transform`}>
            <span className="font-medium">Comenzar</span>
            <svg className="h-4 w-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ContractTypeCard; 