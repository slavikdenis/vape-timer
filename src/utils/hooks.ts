import { useCallback, useEffect, useRef, useState } from 'react';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};

export const VIBRATE_PATTERNS: Record<
  'PHASE_CHANGE' | 'AUTO_STOP',
  number | number[]
> = {
  PHASE_CHANGE: 300,
  AUTO_STOP: [150, 10, 150],
};

export function useVibrate() {
  const [isSupported, setIsSupported] = useState(false);

  const vibrate = useCallback(
    (pattern: number | number[]) =>
      isSupported ? navigator.vibrate(pattern) : noop,
    [isSupported],
  );

  useEffect(() => {
    // Check if Vibration API is supported
    setIsSupported(
      'vibrate' in navigator && typeof navigator.vibrate === 'function',
    );
  }, []);

  return {
    isSupported,
    vibrate,
  };
}

export function useScreenWakeLock() {
  const wakeLock = useRef<WakeLockSentinel | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  const lock = useCallback(async () => {
    if (!isSupported) {
      noop();
    } else {
      try {
        wakeLock.current = await navigator.wakeLock.request('screen');
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        wakeLock.current.onrelease = function () {
          setIsLocked(false);
        };
        wakeLock.current?.addEventListener('release', () => {
          setIsLocked(false);
        });
      } catch (error) {
        console.error(error);
      }
      setIsLocked(true);
    }
  }, [isSupported]);

  const release = useCallback(() => {
    if (!isSupported) {
      noop();
    } else {
      // Releasing wave lock
      if (wakeLock.current) {
        wakeLock.current.release();
        wakeLock.current = null;
      }
      setIsLocked(false);
    }
  }, [isSupported]);

  useEffect(() => {
    // Check if 'Screen Wake Lock API is supported
    setIsSupported('wakeLock' in navigator);

    return () => {
      // Releasing wave lock
      if (wakeLock.current) {
        wakeLock.current.release();
        wakeLock.current = null;
      }
    };
  }, []);

  // Re-lock screen after visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (wakeLock.current !== null && document.visibilityState === 'visible') {
        lock();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    isSupported,
    isLocked,
    lock,
    release,
  };
}
