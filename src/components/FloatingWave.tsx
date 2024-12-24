import React from 'react';
import { WaveIndicator } from './WaveIndicator';

export const FloatingWave: React.FC = () => {
  return (
    <div className="fixed top-0 right-0 p-4 z-50">
      <div className="relative">
        <WaveIndicator size={32} color="#3B82F6" />
        <div className="absolute inset-0 bg-gradient-radial from-blue-500/20 to-transparent animate-pulse" />
      </div>
    </div>
  );
};