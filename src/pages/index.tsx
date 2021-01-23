import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import { useColorMode } from '@chakra-ui/react';

const DynamicTimer = dynamic(() => import('../components/timer'));

export default function App() {
  const { colorMode, toggleColorMode } = useColorMode();

  // Force dark mode
  useEffect(() => {
    if (colorMode === 'light') {
      toggleColorMode();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colorMode]);

  return <DynamicTimer />;
}
