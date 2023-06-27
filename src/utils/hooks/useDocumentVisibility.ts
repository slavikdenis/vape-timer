import { useEffect, useState } from 'react';

// Hook that tracks if the document is visible or not
export const useDocumentVisibility = () => {
  const [isVisible, setIsVisible] = useState(
    typeof document !== 'undefined' && document?.visibilityState === 'visible',
  );

  useEffect(() => {
    const onVisibilityChange = () => {
      setIsVisible(document.visibilityState === 'visible');
    };

    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);

  return isVisible;
};
