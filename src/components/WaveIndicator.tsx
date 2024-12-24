import React from 'react';

interface WaveIndicatorProps {
  size: number;
  color: string;
}

export const WaveIndicator: React.FC<WaveIndicatorProps> = ({ size, color }) => {
  return (
    <div
      className="wave-indicator"
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        borderRadius: '50%',
        animation: 'wave 1.5s infinite'
      }}
    />
  );
};