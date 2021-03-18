import { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';

import { SettingsProvider } from '../context/settings';
import { TimerProvider } from '../context/timer';

import theme from '../styling/theme';

const MyApp = ({ Component, pageProps }: AppProps) => (
  <ChakraProvider resetCSS theme={theme}>
    <SettingsProvider>
      <TimerProvider>
        <Component {...pageProps} />
      </TimerProvider>
    </SettingsProvider>
  </ChakraProvider>
);

export default MyApp;
