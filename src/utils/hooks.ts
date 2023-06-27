import { useCallback, useEffect, useRef, useState } from 'react';
import { useDocumentVisibility } from './hooks/useDocumentVisibility';

const noop = () => {
  // noop
};

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

// NOTE: If your screen will become not visible, you have to re-lock the wake lock.
export function useScreenWakeLock() {
  const isDocumentVisible = useDocumentVisibility();
  const wakeLock = useRef<WakeLockSentinel | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  const lock = useCallback(async () => {
    if (!isSupported) {
      noop();
    } else {
      // Release previous wake lock
      await release();

      // Do nothing is the document is not visible
      if (!isDocumentVisible) {
        // eslint-disable-next-line no-console
        console.warn('Not locking screen because document is not visible');
        return;
      }

      try {
        // Requesting wake lock
        wakeLock.current = await navigator.wakeLock.request('screen');
        // Releasing wake lock
        wakeLock.current.onrelease = function () {
          setIsLocked(false);
        };
        wakeLock.current.addEventListener('release', () => {
          setIsLocked(false);
        });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
      setIsLocked(true);
    }
  }, [isSupported, isDocumentVisible]);

  const release = useCallback(async () => {
    if (!isSupported) {
      noop();
    } else {
      // Releasing wave lock
      if (wakeLock.current) {
        try {
          await wakeLock.current.release();
          wakeLock.current = null;
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(error);
        }
      }
      setIsLocked(false);
    }
  }, [isSupported]);

  useEffect(() => {
    // Check if 'Screen Wake Lock API is supported
    setIsSupported('wakeLock' in navigator);
  }, []);

  return {
    isSupported,
    isLocked,
    lock,
    release,
  };
}
