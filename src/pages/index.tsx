import { memo, useEffect } from 'react';
import { useColorMode } from '@chakra-ui/react';

import Timer from '../components/timer';

function App() {
  const { colorMode, toggleColorMode } = useColorMode();

  // Force dark mode
  useEffect(() => {
    if (colorMode === 'light') {
      toggleColorMode();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colorMode]);

  return <Timer />;
}

export default memo(App);
