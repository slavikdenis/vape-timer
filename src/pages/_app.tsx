import { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';

import { SettingsProvider } from '../context/settings';
import Head from 'next/head';
import theme from '../styling/theme';
import { TimerProvider } from '../context/timer';

const MyApp = ({ Component, pageProps }: AppProps) => (
  <>
    <Head>
      <title>VapeTimer</title>
      <meta charSet="utf-8" />

      <meta
        name="viewport"
        content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
      />
    </Head>
    <ChakraProvider resetCSS theme={theme}>
      <SettingsProvider>
        <TimerProvider>
          <Component {...pageProps} />
        </TimerProvider>
      </SettingsProvider>
    </ChakraProvider>
  </>
);

export default MyApp;
