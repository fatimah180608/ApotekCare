import { useEffect } from 'react';

export default function Toast({ message, type = 'success', onClose, duration = 2500 }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColor = type === 'success' ? 'bg-primary' : type === 'error' ? 'bg-red-500' : 'bg-gray-700';
  const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';

  return (
    <div className="fixed bottom-6 right-6 z-[9999] animate-slide-in">
      <div className={`${bgColor} text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 min-w-[250px] max-w-sm`}>
        <span className="text-xl">{icon}</span>
        <p className="text-sm font-medium flex-1">{message}</p>
        <button
          onClick={onClose}
          className="text-white/70 hover:text-white text-lg leading-none"
        >
          ×
        </button>
      </div>
    </div>
  );
}