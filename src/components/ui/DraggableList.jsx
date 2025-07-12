'use client';

import React, { useState, useCallback } from 'react';
import { 
  GripVertical, 
  Move, 
  Check,
  X
} from 'lucide-react';

/**
 * Componente de lista con drag & drop
 */
export default function DraggableList({
  items = [],
  onReorder,
  renderItem,
  className = '',
  disabled = false
}) {
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = useCallback((e, index) => {
    if (disabled) return;
    
    setDraggedIndex(index);
    setIsDragging(true);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target.outerHTML);
  }, [disabled]);

  const handleDragOver = useCallback((e, index) => {
    if (disabled || draggedIndex === null) return;
    
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  }, [disabled, draggedIndex]);

  const handleDragEnter = useCallback((e, index) => {
    if (disabled || draggedIndex === null) return;
    
    e.preventDefault();
    setDragOverIndex(index);
  }, [disabled, draggedIndex]);

  const handleDragLeave = useCallback((e) => {
    if (disabled) return;
    
    e.preventDefault();
    setDragOverIndex(null);
  }, [disabled]);

  const handleDrop = useCallback((e, dropIndex) => {
    if (disabled || draggedIndex === null) return;
    
    e.preventDefault();
    
    if (draggedIndex !== dropIndex) {
      const newItems = [...items];
      const [draggedItem] = newItems.splice(draggedIndex, 1);
      newItems.splice(dropIndex, 0, draggedItem);
      
      onReorder(newItems);
    }
    
    setDraggedIndex(null);
    setDragOverIndex(null);
    setIsDragging(false);
  }, [disabled, draggedIndex, items, onReorder]);

  const handleDragEnd = useCallback(() => {
    setDraggedIndex(null);
    setDragOverIndex(null);
    setIsDragging(false);
  }, []);

  if (disabled) {
    return (
      <div className={`space-y-2 ${className}`}>
        {items.map((item, index) => (
          <div key={index} className="flex items-center space-x-3 p-3 bg-neutral-700 rounded-lg">
            <div className="flex-shrink-0">
              <GripVertical className="h-4 w-4 text-neutral-400" />
            </div>
            <div className="flex-1">
              {renderItem(item, index)}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {items.map((item, index) => (
        <div
          key={index}
          draggable={!disabled}
          onDragStart={(e) => handleDragStart(e, index)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDragEnter={(e) => handleDragEnter(e, index)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, index)}
          onDragEnd={handleDragEnd}
          className={`
            flex items-center space-x-3 p-3 rounded-lg transition-all cursor-move
            ${draggedIndex === index 
              ? 'opacity-50 bg-primary-500/20 border border-primary-500' 
              : 'bg-neutral-700 hover:bg-neutral-600'
            }
            ${dragOverIndex === index && draggedIndex !== index 
              ? 'border-2 border-dashed border-primary-400 bg-primary-500/10' 
              : ''
            }
            ${isDragging && draggedIndex !== index ? 'transform scale-105' : ''}
          `}
        >
          <div className="flex-shrink-0">
            <Move className="h-4 w-4 text-neutral-400" />
          </div>
          <div className="flex-1">
            {renderItem(item, index)}
          </div>
          {draggedIndex === index && (
            <div className="flex-shrink-0">
              <div className="p-1 bg-primary-500 rounded-full">
                <Check className="h-3 w-3 text-white" />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/**
 * Hook para manejar drag & drop
 */
export function useDragAndDrop(initialItems = []) {
  const [items, setItems] = useState(initialItems);

  const handleReorder = useCallback((newItems) => {
    setItems(newItems);
  }, []);

  const addItem = useCallback((item) => {
    setItems(prev => [...prev, item]);
  }, []);

  const removeItem = useCallback((index) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  }, []);

  const updateItem = useCallback((index, updatedItem) => {
    setItems(prev => prev.map((item, i) => i === index ? updatedItem : item));
  }, []);

  return {
    items,
    handleReorder,
    addItem,
    removeItem,
    updateItem,
    setItems
  };
} 