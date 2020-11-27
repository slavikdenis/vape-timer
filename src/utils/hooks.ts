import { useCallback, useEffect, useRef, useState } from 'react';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};

export function useVibrate() {
  const [isSupported, setIsSupported] = useState(false);

  const vibrate = useCallback(
    () => (isSupported ? navigator.vibrate(300) : noop),
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const wakeLock = useRef<any | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  const lock = useCallback(async () => {
    if (isSupported) {
      noop();
    } else {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        wakeLock.current = await (navigator as any)['wakeLock'].request(
          'screen',
        );
        wakeLock.current.onrelease = function () {
          setIsLocked(false);
        };
        wakeLock.current.addEventListener('release', () => {
          setIsLocked(false);
        });
      } catch (error) {
        console.error(error);
      }
      setIsLocked(true);
    }
  }, [isSupported]);

  const release = useCallback(() => {
    if (isSupported) {
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
