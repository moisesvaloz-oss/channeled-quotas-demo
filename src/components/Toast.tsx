import { useEffect, useState } from 'react';

const ICON_CHECK = 'http://localhost:3845/assets/0bb5dea20baa1d2c139db38b1253ccfd8efa179e.svg';

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, isVisible, onClose, duration = 5000 }: ToastProps) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsExiting(false);
      
      // Start fade out 800ms before closing
      const fadeOutTimer = setTimeout(() => {
        setIsExiting(true);
      }, duration - 800);

      // Close after full duration
      const closeTimer = setTimeout(() => {
        onClose();
      }, duration);

      return () => {
        clearTimeout(fadeOutTimer);
        clearTimeout(closeTimer);
      };
    }
  }, [isVisible, onClose, duration]);

  if (!isVisible) return null;

  return (
    <div className={`fixed top-20 right-6 z-50 transition-all duration-300 ${
      isExiting ? 'animate-fadeOut' : 'animate-slideInRight'
    }`}>
      <div className="bg-[#E8F8F0] rounded-lg overflow-hidden shadow-lg relative">
        {/* Green left bar */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#18824C]" />
        
        {/* Content */}
        <div className="flex items-center gap-1 px-3 py-2 pl-4">
          <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
            <img src={ICON_CHECK} alt="" className="w-[14px] h-[10px]" />
          </div>
          <p className="text-[#18824C] text-base font-normal leading-6">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}

