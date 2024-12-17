interface WaveConfig {
    amplitude: number;
    frequency: number;
    phase: number;
    speed: number;
  }
  
  const defaultConfig: WaveConfig = {
    amplitude: 4,
    frequency: 1,
    phase: 0,
    speed: 0.05
  };
  
  export const calculateWaveOffset = (
    time: number, 
    config: WaveConfig = defaultConfig
  ): number => {
    const { amplitude, frequency, phase, speed } = config;
    return amplitude * Math.sin(frequency * time * speed + phase);
  };
  
  export const createWaveAnimation = (
    callback: (offset: number) => void,
    config: WaveConfig = defaultConfig
  ) => {
    let animationFrame: number;
    let startTime: number;
  
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      
      const offset = calculateWaveOffset(elapsed, config);
      callback(offset);
      
      animationFrame = requestAnimationFrame(animate);
    };
  
    const start = () => {
      animationFrame = requestAnimationFrame(animate);
    };
  
    const stop = () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  
    return {
      start,
      stop
    };
  };
  
  export const interpolateWave = (
    min: number,
    max: number,
    value: number
  ): number => {
    return min + (max - min) * ((Math.sin(value) + 1) / 2);
  };
  
  export default {
    createWaveAnimation,
    calculateWaveOffset,
    interpolateWave
  };