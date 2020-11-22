import { useCallback, useEffect, useState } from 'react';

export function useVibrate() {
  const [isSupported, setIsSupported] = useState(false);

  const vibrate = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    () => (isSupported ? window.navigator.vibrate(200) : () => {}),
    [isSupported],
  );

  useEffect(() => {
    // Check if 'vibrate' is supported
    setIsSupported(
      'vibrate' in window.navigator &&
        typeof window.navigator.vibrate === 'function',
    );
  }, []);

  return {
    isSupported,
    vibrate,
  };
}
