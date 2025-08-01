import fscreen from 'fscreen';
import { useCallback, useEffect, useRef, useState } from 'react';

export interface FullscreenHookReturnType {
  fullscreenRef: React.RefObject<Element>;
  fullscreenEnabled: boolean;
  fullscreenActive: boolean;
  enterFullscreen: () => Promise<void>;
  exitFullscreen: () => Promise<void | undefined>;
}

export function useFullscreen(): FullscreenHookReturnType {
  const fullscreenRef = useRef<HTMLDivElement | null>(null);
  const [fullscreenActive, setFullscreenActive] = useState<boolean>(false);

  useEffect(() => {
    const handleChange = () => {
      setFullscreenActive(!!fscreen.fullscreenElement && fscreen.fullscreenElement === fullscreenRef.current);
    };

    fscreen.addEventListener('fullscreenchange', handleChange);
    return () => fscreen.removeEventListener('fullscreenchange', handleChange);
  }, []);

  const enterFullscreen = useCallback(async () => {
    if (fscreen.fullscreenElement) {
      await fscreen.exitFullscreen();
    }
    return fscreen.requestFullscreen(fullscreenRef.current!);
  }, []);

  const exitFullscreen = useCallback(async () => {
    if (fscreen.fullscreenElement === fullscreenRef.current) {
      return fscreen.exitFullscreen();
    }
  }, []);

  return {
    fullscreenRef,
    fullscreenEnabled: fscreen.fullscreenEnabled,
    fullscreenActive,
    enterFullscreen,
    exitFullscreen,
  };
}
