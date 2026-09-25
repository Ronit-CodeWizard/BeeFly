import React from 'react';

interface BeeLogoProps {
  className?: string;
  size?: number;
  withContainer?: boolean;
  animated?: boolean;
}

const LOGO_SRC = "https://i.supaimg.com/92f82b8e-0941-4720-9455-b7257d1262f2/e4397d58-f3bb-48ec-809a-ca866c64a071.png";

export const BeeLogo: React.FC<BeeLogoProps> = ({
  className = '',
  size = 28,
  withContainer = false,
  animated = false
}) => {
  const imageElement = (
    <img
      src={LOGO_SRC}
      alt="BEEFLY Logo"
      width={size}
      height={size}
      loading="eager"
      draggable={false}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }}
      onClick={(e) => {
        e.stopPropagation();
      }}
      className={`inline-block shrink-0 object-contain select-none pointer-events-none ${
        animated ? 'transition-transform duration-300' : ''
      } ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        userSelect: 'none',
        WebkitUserSelect: 'none',
        WebkitTouchCallout: 'none',
        pointerEvents: 'none',
      }}
    />
  );

  // Wrapper that shields clicks, right-clicks, dragging and selections
  return (
    <div
      className={`inline-flex items-center justify-center select-none cursor-default ${
        withContainer ? className : ''
      }`}
      draggable={false}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }}
      onClick={(e) => {
        e.stopPropagation();
      }}
      style={{
        userSelect: 'none',
        WebkitUserSelect: 'none',
        WebkitTouchCallout: 'none',
      }}
    >
      {imageElement}
    </div>
  );
};
