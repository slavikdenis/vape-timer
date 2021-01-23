import { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import theme from '../styling/theme';
import { SettingsProvider } from '../context/settings';
import Head from 'next/head';

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
        <Component {...pageProps} />
      </SettingsProvider>
    </ChakraProvider>
  </>
);

export default MyApp;
