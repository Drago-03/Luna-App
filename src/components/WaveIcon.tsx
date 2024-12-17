import { useState } from 'react';
import { WaveIndicator } from './WaveIndicator';
import '../styles/wave.css';

interface WaveIconProps {
  position?: {
    bottom?: number;
    right?: number;
  };
  defaultSize?: number;
  hoverSize?: number;
  defaultColor?: string;
  hoverColor?: string;
}

export const WaveIcon = ({
  position = { bottom: 0, right: 16 },
  defaultSize = 32,
  hoverSize = 36,
  defaultColor = '#3B82F6',
  hoverColor = '#60A5FA'
}: WaveIconProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="fixed cursor-pointer transition-all duration-200 ease-in-out wave-icon"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <WaveIndicator 
        size={isHovered ? hoverSize : defaultSize}
        color={isHovered ? hoverColor : defaultColor} 
      />
      <style>
        {`
          :root {
            --wave-icon-bottom: ${position.bottom}px;
            --wave-icon-right: ${position.right}px;
          }
        `}
      </style>
    </div>
  );
};

export default WaveIcon;