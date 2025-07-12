'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

export default function Breadcrumbs({ items = [] }) {
  if (items.length === 0) return null;

  return (
    <nav className="flex items-center space-x-2 text-sm text-neutral-400 mb-6">
      <Link 
        href="/" 
        className="flex items-center space-x-1 hover:text-white transition-colors"
      >
        <Home className="h-4 w-4" />
        <span>Inicio</span>
      </Link>
      
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="h-4 w-4 text-neutral-500" />
          {index === items.length - 1 ? (
            <span className="text-white font-medium">{item.label}</span>
          ) : (
            <Link 
              href={item.href} 
              className="hover:text-white transition-colors"
            >
              {item.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
} 