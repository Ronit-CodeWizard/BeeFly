import React from 'react';

interface TapScrollProps {
  targetId?: string;
  onClick?: () => void;
  className?: string;
}

export const TapScroll: React.FC<TapScrollProps> = ({
  targetId = 'continue-action-section',
  onClick,
  className = ''
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
      return;
    }
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }
  };

  return (
    <div className={`w-full flex items-center justify-center my-1 ${className}`}>
      <button
        type="button"
        onClick={handleClick}
        className="inline-flex items-center justify-center min-w-[140px] px-6 py-2.5 rounded-full bg-yellow-400 hover:bg-yellow-500 active:scale-95 text-gray-950 text-xs sm:text-sm font-bold tracking-normal cursor-pointer select-none transition-colors shadow-none border-0"
        title="Tap to scroll down to continue"
        aria-label="Tap Scroll"
      >
        <span>Tap Scroll</span>
      </button>
    </div>
  );
};
