export interface WaveParameters {
    amplitude: number;
    frequency: number;
    phase: number;
    speed: number;
  }
  
  export interface WaveColors {
    default: string;
    hover: string;
    shadow: string;
  }
  
  export interface WaveSizes {
    default: number;
    hover: number;
    mobile: number;
  }
  
  export interface WaveTimings {
    transition: string;
    animation: string;
    hover: string;
  }
  
  export const WAVE_PARAMETERS: WaveParameters = {
    amplitude: 4,
    frequency: 1,
    phase: 0,
    speed: 0.05
  };
  
  export const WAVE_COLORS: WaveColors = {
    default: '#3B82F6', // Tailwind blue-500
    hover: '#60A5FA',   // Tailwind blue-400
    shadow: 'rgba(59, 130, 246, 0.5)'
  };
  
  export const WAVE_SIZES: WaveSizes = {
    default: 32,
    hover: 36,
    mobile: 28
  };
  
  export const WAVE_TIMINGS: WaveTimings = {
    transition: '0.2s ease',
    animation: '3s ease-in-out infinite',
    hover: '0.15s ease-out'
  };
  
  export const WAVE_VIEWPORT = {
    width: 32,
    height: 32
  };
  
  export const WAVE_POSITIONS = {
    taskbar: {
      bottom: 0,
      right: 16
    }
  };
  
  export default {
    WAVE_PARAMETERS,
    WAVE_COLORS,
    WAVE_SIZES,
    WAVE_TIMINGS,
    WAVE_VIEWPORT,
    WAVE_POSITIONS
  };