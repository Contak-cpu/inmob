import React from 'react';
import { Code, Heart } from 'lucide-react';

export default function PictoNSignature({ className = '' }) {
  return (
    <div className={`flex items-center justify-center space-x-1 text-xs text-neutral-500 ${className}`}>
      <span className="font-mono">pictoN</span>
      <Code className="h-3 w-3 text-neutral-600" />
      <span className="text-neutral-600">con</span>
      <Heart className="h-3 w-3 text-neutral-600" />
    </div>
  );
} 