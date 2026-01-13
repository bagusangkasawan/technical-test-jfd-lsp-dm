import React, { useEffect } from 'react';
import { AlertCircle, CheckCircle, X } from 'lucide-react';

interface NotificationProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

// Toast notification component dengan auto-dismiss dan slide-in animation
const Notification: React.FC<NotificationProps> = ({ message, type, onClose }) => {
  // Auto-dismiss notification setelah 4 detik
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const isSuccess = type === 'success';
  
  return (
    <div 
      className={`fixed top-6 right-6 p-4 rounded-lg shadow-2xl flex items-center gap-3 text-white z-[9999]
      animate-slide-in-right backdrop-blur-sm border ${
        isSuccess
          ? 'bg-gradient-to-r from-green-600 to-green-500 border-green-400/30'
          : 'bg-gradient-to-r from-red-600 to-red-500 border-red-400/30'
      }`}
    >
      {isSuccess ? (
        <CheckCircle size={22} className="flex-shrink-0" />
      ) : (
        <AlertCircle size={22} className="flex-shrink-0" />
      )}
      <span className="font-medium flex-1">{message}</span>
      <button
        onClick={onClose}
        className="flex-shrink-0 opacity-90 hover:opacity-100 transition-opacity"
      >
        <X size={18} />
      </button>
    </div>
  );
};

export default Notification;
