import { useState, useCallback } from 'react';

export interface Toast {
  id: string;
  title: string;
  description?: string;
  type?: 'success' | 'error' | 'warning' | 'info';
}

interface ToastOptions {
  title: string;
  description?: string;
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback(({ title, description, type = 'info' }: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: Toast = { id, title, description, type };
    
    setToasts(prev => [...prev, newToast]);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  }, []);

  // Add convenience methods
  const toastSuccess = useCallback((title: string, description?: string) => {
    toast({ title, description, type: 'success' });
  }, [toast]);

  const toastError = useCallback((title: string, description?: string) => {
    toast({ title, description, type: 'error' });
  }, [toast]);

  const toastWarning = useCallback((title: string, description?: string) => {
    toast({ title, description, type: 'warning' });
  }, [toast]);

  const toastInfo = useCallback((title: string, description?: string) => {
    toast({ title, description, type: 'info' });
  }, [toast]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return { 
    toasts, 
    toast, 
    toastSuccess,
    toastError, 
    toastWarning,
    toastInfo,
    removeToast 
  };
}