import { useState, useEffect } from 'react';

interface WaveIndicatorProps {
  size?: number;
  color?: string;
}

export const WaveIndicator = ({ 
  size = 32,
  color = '#3B82F6'
}: WaveIndicatorProps) => {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const animate = () => {
      setOffset(prev => (prev + 1) % 20);
      requestAnimationFrame(animate);
    };
    
    const animation = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animation);
  }, []);

  return (
    <div className="wave-container" data-size={size}>
      <div className="wave-indicator">
        <svg
          width={size}
          height={size}
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <path
              id="wave"
              d={`M0 16 Q8 ${12 + offset} 16 16 Q24 ${20 - offset} 32 16`}
              stroke={color}
              strokeWidth="2"
              fill="none"
            />
          </defs>
          <use href="#wave" y="0">
            <animate
              attributeName="opacity"
              values="0.3;0.8;0.3"
              dur="2s"
              repeatCount="indefinite"
            />
          </use>
          <use href="#wave" y="4">
            <animate
              attributeName="opacity"
              values="0.6;0.3;0.6"
              dur="2s"
              repeatCount="indefinite"
            />
          </use>
          <use href="#wave" y="8">
            <animate
              attributeName="opacity"
              values="0.8;0.6;0.8"
              dur="2s"
              repeatCount="indefinite"
            />
          </use>
        </svg>
      </div>
    </div>
  );
};

export default WaveIndicator;