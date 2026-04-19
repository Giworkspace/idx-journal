import React, { useEffect } from 'react';
import Button from './Button';

const ConfirmDialog = ({ 
  isOpen, 
  title, 
  message, 
  onConfirm, 
  onCancel, 
  confirmText = 'Delete', 
  cancelText = 'Cancel' 
}) => {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onCancel();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
    }
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-card shadow-medium p-6 max-w-sm w-full mx-4 animate-in fade-in zoom-in duration-200">
        <h3 className="text-lg font-bold text-ink">{title}</h3>
        <p className="text-sm text-slate-text mt-2">{message}</p>
        
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="secondary" onClick={onCancel}>
            {cancelText}
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
