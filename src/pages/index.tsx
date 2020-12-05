import Head from 'next/head';
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

  return (
    <>
      <Head>
        <title>VapeTimer</title>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
      </Head>

      <DynamicTimer />
    </>
  );
}
