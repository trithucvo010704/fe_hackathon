'use client';

import React, { useState, useEffect } from 'react';
import './Toast.css';
import { listeners, ToastMessage } from '@/lib/toast';

export default function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const listener = (toast: ToastMessage) => {
      setToasts(prev => [...prev, toast]);
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== toast.id));
      }, 5000);
    };

    listeners.push(listener);
    return () => {
      const index = listeners.indexOf(listener);
      if (index > -1) listeners.splice(index, 1);
    };
  }, []);

  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          <div className="toast-content">{t.message}</div>
          <button className="toast-close" onClick={() => setToasts(prev => prev.filter(item => item.id !== t.id))}>
            &times;
          </button>
        </div>
      ))}
    </div>
  );
}
